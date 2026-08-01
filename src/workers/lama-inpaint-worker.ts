import * as ort from 'onnxruntime-web';

export type LamaInpaintRequest = {
  id: string;
  type: 'inpaint';
  imageBuffer: ArrayBuffer;
  maskBuffer: ArrayBuffer;
  width: number;
  height: number;
};

export type LamaInpaintResponse =
  | {
      id: string;
      type: 'progress';
      stage: 'download' | 'initialize' | 'inference';
      loaded?: number;
      total?: number;
    }
  | { id: string; type: 'done'; imageBuffer: ArrayBuffer }
  | { id: string; type: 'error'; message: string };

const MODEL_SIZE = 512;
const MODEL_BYTES = 62_074_990;
const MODEL_CACHE_NAME = 'toolhub-lama-model-v1';
const MODEL_CACHE_URL = '/__toolhub_model_cache/lama_512_int8.onnx';
const MODEL_URLS = [
  'https://hf-mirror.com/g-ronimo/lama/resolve/main/lama_512_int8.onnx',
  'https://huggingface.co/g-ronimo/lama/resolve/main/lama_512_int8.onnx',
];

let sessionPromise: Promise<ort.InferenceSession> | null = null;
let taskQueue = Promise.resolve();

function post(message: LamaInpaintResponse, transfer: Transferable[] = []) {
  self.postMessage(message, { transfer });
}

async function responseToBuffer(response: Response, id: string): Promise<ArrayBuffer> {
  const total = Number(response.headers.get('content-length')) || MODEL_BYTES;
  if (!response.body) {
    const buffer = await response.arrayBuffer();
    post({ id, type: 'progress', stage: 'download', loaded: buffer.byteLength, total });
    return buffer;
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let loaded = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    chunks.push(value);
    loaded += value.byteLength;
    post({ id, type: 'progress', stage: 'download', loaded, total });
  }

  const bytes = new Uint8Array(loaded);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes.buffer;
}

async function loadModel(id: string): Promise<ArrayBuffer> {
  post({ id, type: 'progress', stage: 'download', loaded: 0, total: MODEL_BYTES });
  const cacheUrl = new URL(MODEL_CACHE_URL, self.location.origin).toString();
  try {
    const cache = await caches.open(MODEL_CACHE_NAME);
    const cached = await cache.match(cacheUrl);
    if (cached) {
      const buffer = await cached.arrayBuffer();
      post({ id, type: 'progress', stage: 'download', loaded: MODEL_BYTES, total: MODEL_BYTES });
      return buffer;
    }
  } catch {
    // Cache Storage is optional; inference can still continue without it.
  }

  let lastError: unknown = null;
  for (const url of MODEL_URLS) {
    try {
      const response = await fetch(url, { mode: 'cors' });
      if (!response.ok) throw new Error(`Model download failed: HTTP ${response.status}`);
      const buffer = await responseToBuffer(response, id);
      try {
        const cache = await caches.open(MODEL_CACHE_NAME);
        await cache.put(
          cacheUrl,
          new Response(buffer.slice(0), {
            headers: { 'content-type': 'application/octet-stream' },
          }),
        );
      } catch {
        // A full browser cache must not prevent the current repair from completing.
      }
      return buffer;
    } catch (cause) {
      lastError = cause;
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Unable to download the LaMa model');
}

function getSession(id: string): Promise<ort.InferenceSession> {
  if (!sessionPromise) {
    sessionPromise = (async () => {
      ort.env.wasm.numThreads = 1;
      const model = await loadModel(id);
      post({ id, type: 'progress', stage: 'initialize' });
      return ort.InferenceSession.create(model, {
        executionProviders: ['wasm'],
        graphOptimizationLevel: 'all',
      });
    })().catch((cause) => {
      sessionPromise = null;
      throw cause;
    });
  }
  return sessionPromise;
}

function findMaskBounds(mask: Uint8Array, width: number, height: number) {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!mask[y * width + x]) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  if (maxX < minX || maxY < minY) throw new Error('The repair mask is empty');
  const maskWidth = maxX - minX + 1;
  const maskHeight = maxY - minY + 1;
  const margin = Math.max(32, Math.round(Math.max(maskWidth, maskHeight) * 0.28));
  const x = Math.max(0, minX - margin);
  const y = Math.max(0, minY - margin);
  const right = Math.min(width, maxX + margin + 1);
  const bottom = Math.min(height, maxY + margin + 1);
  return { x, y, width: right - x, height: bottom - y };
}

function samplePaddingColor(
  image: Uint8ClampedArray,
  mask: Uint8Array,
  imageWidth: number,
  bounds: { x: number; y: number; width: number; height: number },
) {
  const step = Math.max(1, Math.floor(Math.max(bounds.width, bounds.height) / 160));
  let red = 0;
  let green = 0;
  let blue = 0;
  let count = 0;

  for (let y = bounds.y; y < bounds.y + bounds.height; y += step) {
    for (let x = bounds.x; x < bounds.x + bounds.width; x += step) {
      const pixel = y * imageWidth + x;
      if (mask[pixel]) continue;
      red += image[pixel * 4];
      green += image[pixel * 4 + 1];
      blue += image[pixel * 4 + 2];
      count++;
    }
  }

  if (!count) return { red: 127, green: 127, blue: 127 };
  return {
    red: Math.round(red / count),
    green: Math.round(green / count),
    blue: Math.round(blue / count),
  };
}

async function inpaint(request: LamaInpaintRequest): Promise<ArrayBuffer> {
  const { id, width, height } = request;
  const image = new Uint8ClampedArray(request.imageBuffer);
  const mask = new Uint8Array(request.maskBuffer);
  const bounds = findMaskBounds(mask, width, height);
  const padding = samplePaddingColor(image, mask, width, bounds);

  const sourceCanvas = new OffscreenCanvas(width, height);
  const sourceContext = sourceCanvas.getContext('2d');
  if (!sourceContext) throw new Error('OffscreenCanvas is unavailable');
  sourceContext.putImageData(new ImageData(image, width, height), 0, 0);

  const inputCanvas = new OffscreenCanvas(MODEL_SIZE, MODEL_SIZE);
  const inputContext = inputCanvas.getContext('2d');
  if (!inputContext) throw new Error('OffscreenCanvas is unavailable');
  inputContext.fillStyle = `rgb(${padding.red}, ${padding.green}, ${padding.blue})`;
  inputContext.fillRect(0, 0, MODEL_SIZE, MODEL_SIZE);
  inputContext.imageSmoothingEnabled = true;
  inputContext.imageSmoothingQuality = 'high';

  const scale = Math.min(MODEL_SIZE / bounds.width, MODEL_SIZE / bounds.height);
  const drawWidth = Math.max(1, Math.round(bounds.width * scale));
  const drawHeight = Math.max(1, Math.round(bounds.height * scale));
  const offsetX = Math.floor((MODEL_SIZE - drawWidth) / 2);
  const offsetY = Math.floor((MODEL_SIZE - drawHeight) / 2);
  inputContext.drawImage(
    sourceCanvas,
    bounds.x,
    bounds.y,
    bounds.width,
    bounds.height,
    offsetX,
    offsetY,
    drawWidth,
    drawHeight,
  );

  const inputPixels = inputContext.getImageData(0, 0, MODEL_SIZE, MODEL_SIZE).data;
  const plane = MODEL_SIZE * MODEL_SIZE;
  const tensorData = new Float32Array(4 * plane);

  for (let y = 0; y < MODEL_SIZE; y++) {
    for (let x = 0; x < MODEL_SIZE; x++) {
      const modelPixel = y * MODEL_SIZE + x;
      let masked = 0;
      if (
        x >= offsetX &&
        x < offsetX + drawWidth &&
        y >= offsetY &&
        y < offsetY + drawHeight
      ) {
        const sourceX = Math.min(
          bounds.x + bounds.width - 1,
          bounds.x + Math.floor(((x - offsetX) / drawWidth) * bounds.width),
        );
        const sourceY = Math.min(
          bounds.y + bounds.height - 1,
          bounds.y + Math.floor(((y - offsetY) / drawHeight) * bounds.height),
        );
        masked = mask[sourceY * width + sourceX] ? 1 : 0;
      }

      const keep = 1 - masked;
      tensorData[modelPixel] = (inputPixels[modelPixel * 4] / 255) * keep;
      tensorData[plane + modelPixel] = (inputPixels[modelPixel * 4 + 1] / 255) * keep;
      tensorData[plane * 2 + modelPixel] = (inputPixels[modelPixel * 4 + 2] / 255) * keep;
      tensorData[plane * 3 + modelPixel] = masked;
    }
  }

  const session = await getSession(id);
  post({ id, type: 'progress', stage: 'inference' });
  const inputName = session.inputNames[0];
  const results = await session.run({
    [inputName]: new ort.Tensor('float32', tensorData, [1, 4, MODEL_SIZE, MODEL_SIZE]),
  });
  const output = results[session.outputNames[0]];
  const outputData = output.data as Float32Array;

  let maxValue = 0;
  for (let i = 0; i < outputData.length; i += 97) {
    maxValue = Math.max(maxValue, Math.abs(outputData[i]));
  }
  const outputScale = maxValue <= 2.5 ? 255 : 1;
  const outputCanvas = new OffscreenCanvas(MODEL_SIZE, MODEL_SIZE);
  const outputContext = outputCanvas.getContext('2d');
  if (!outputContext) throw new Error('OffscreenCanvas is unavailable');
  const outputImage = outputContext.createImageData(MODEL_SIZE, MODEL_SIZE);
  for (let i = 0; i < plane; i++) {
    outputImage.data[i * 4] = Math.max(0, Math.min(255, Math.round(outputData[i] * outputScale)));
    outputImage.data[i * 4 + 1] = Math.max(
      0,
      Math.min(255, Math.round(outputData[plane + i] * outputScale)),
    );
    outputImage.data[i * 4 + 2] = Math.max(
      0,
      Math.min(255, Math.round(outputData[plane * 2 + i] * outputScale)),
    );
    outputImage.data[i * 4 + 3] = 255;
  }
  outputContext.putImageData(outputImage, 0, 0);

  const patchCanvas = new OffscreenCanvas(bounds.width, bounds.height);
  const patchContext = patchCanvas.getContext('2d');
  if (!patchContext) throw new Error('OffscreenCanvas is unavailable');
  patchContext.imageSmoothingEnabled = true;
  patchContext.imageSmoothingQuality = 'high';
  patchContext.drawImage(
    outputCanvas,
    offsetX,
    offsetY,
    drawWidth,
    drawHeight,
    0,
    0,
    bounds.width,
    bounds.height,
  );
  const patch = patchContext.getImageData(0, 0, bounds.width, bounds.height).data;

  for (let y = 0; y < bounds.height; y++) {
    for (let x = 0; x < bounds.width; x++) {
      const targetPixel = (bounds.y + y) * width + bounds.x + x;
      if (!mask[targetPixel]) continue;
      const patchPixel = y * bounds.width + x;
      image[targetPixel * 4] = patch[patchPixel * 4];
      image[targetPixel * 4 + 1] = patch[patchPixel * 4 + 1];
      image[targetPixel * 4 + 2] = patch[patchPixel * 4 + 2];
      image[targetPixel * 4 + 3] = 255;
    }
  }

  return image.buffer;
}

async function handleRequest(request: LamaInpaintRequest) {
  try {
    const imageBuffer = await inpaint(request);
    post({ id: request.id, type: 'done', imageBuffer }, [imageBuffer]);
  } catch (cause) {
    post({
      id: request.id,
      type: 'error',
      message: cause instanceof Error ? cause.message : String(cause),
    });
  }
}

self.onmessage = (event: MessageEvent<LamaInpaintRequest>) => {
  const request = event.data;
  taskQueue = taskQueue.then(() => handleRequest(request));
};
