import type {
  LamaInpaintRequest,
  LamaInpaintResponse,
} from '../../workers/lama-inpaint-worker';

export type BackgroundFillMethod = 'color' | 'ai';
export type BackgroundFillMode = 'auto' | BackgroundFillMethod;

export type BackgroundAnalysis = {
  recommendedMethod: BackgroundFillMethod;
  rmsVariation: number;
  p90Difference: number;
  sampleCount: number;
};

export type BackgroundProgress = {
  stage: 'download' | 'initialize' | 'inference';
  loaded?: number;
  total?: number;
};

export type BackgroundResult = {
  imageData: ImageData;
  removalMask: Uint8Array;
  analysis: BackgroundAnalysis;
  methodUsed: BackgroundFillMethod;
};

export type CreateBackgroundOptions = {
  mode?: BackgroundFillMode;
  onProgress?: (progress: BackgroundProgress) => void;
};

export type CreateExportBackgroundOptions = CreateBackgroundOptions & {
  maxWorkingDimension?: number;
};

let lamaWorker: Worker | null = null;

export function terminateBackgroundRepairWorker() {
  lamaWorker?.terminate();
  lamaWorker = null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function resizeMaskBilinear(
  mask: Float32Array,
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
): Float32Array {
  if (sourceWidth === targetWidth && sourceHeight === targetHeight) return mask.slice();

  const output = new Float32Array(targetWidth * targetHeight);
  const xRatio = sourceWidth / targetWidth;
  const yRatio = sourceHeight / targetHeight;

  for (let y = 0; y < targetHeight; y++) {
    const sourceY = Math.max(0, (y + 0.5) * yRatio - 0.5);
    const y0 = Math.min(sourceHeight - 1, Math.floor(sourceY));
    const y1 = Math.min(sourceHeight - 1, y0 + 1);
    const yWeight = sourceY - y0;

    for (let x = 0; x < targetWidth; x++) {
      const sourceX = Math.max(0, (x + 0.5) * xRatio - 0.5);
      const x0 = Math.min(sourceWidth - 1, Math.floor(sourceX));
      const x1 = Math.min(sourceWidth - 1, x0 + 1);
      const xWeight = sourceX - x0;
      const top = mask[y0 * sourceWidth + x0] * (1 - xWeight) + mask[y0 * sourceWidth + x1] * xWeight;
      const bottom = mask[y1 * sourceWidth + x0] * (1 - xWeight) + mask[y1 * sourceWidth + x1] * xWeight;
      output[y * targetWidth + x] = top * (1 - yWeight) + bottom * yWeight;
    }
  }

  return output;
}

function binaryDilate(source: Uint8Array, width: number, height: number, radius: number): Uint8Array {
  if (radius <= 0) return source.slice();

  const horizontal = new Uint8Array(source.length);
  const output = new Uint8Array(source.length);

  for (let y = 0; y < height; y++) {
    const row = y * width;
    let active = 0;
    for (let x = 0; x <= Math.min(width - 1, radius); x++) active += source[row + x] ? 1 : 0;
    for (let x = 0; x < width; x++) {
      horizontal[row + x] = active > 0 ? 255 : 0;
      const removeX = x - radius;
      const addX = x + radius + 1;
      if (removeX >= 0) active -= source[row + removeX] ? 1 : 0;
      if (addX < width) active += source[row + addX] ? 1 : 0;
    }
  }

  for (let x = 0; x < width; x++) {
    let active = 0;
    for (let y = 0; y <= Math.min(height - 1, radius); y++) active += horizontal[y * width + x] ? 1 : 0;
    for (let y = 0; y < height; y++) {
      output[y * width + x] = active > 0 ? 255 : 0;
      const removeY = y - radius;
      const addY = y + radius + 1;
      if (removeY >= 0) active -= horizontal[removeY * width + x] ? 1 : 0;
      if (addY < height) active += horizontal[addY * width + x] ? 1 : 0;
    }
  }

  return output;
}

function binaryErode(source: Uint8Array, width: number, height: number, radius: number): Uint8Array {
  const inverted = new Uint8Array(source.length);
  for (let i = 0; i < source.length; i++) inverted[i] = source[i] ? 0 : 255;
  const dilated = binaryDilate(inverted, width, height, radius);
  for (let i = 0; i < dilated.length; i++) dilated[i] = dilated[i] ? 0 : 255;
  return dilated;
}

function removeMaskNoise(source: Uint8Array, width: number, height: number): Uint8Array {
  const output = new Uint8Array(source.length);
  const visited = new Uint8Array(source.length);
  const queue = new Int32Array(source.length);
  const minArea = Math.max(24, Math.round(source.length * 0.00012));

  for (let start = 0; start < source.length; start++) {
    if (!source[start] || visited[start]) continue;

    let head = 0;
    let tail = 0;
    let minX = width;
    let maxX = 0;
    let minY = height;
    let maxY = 0;
    queue[tail++] = start;
    visited[start] = 1;

    while (head < tail) {
      const index = queue[head++];
      const x = index % width;
      const y = Math.floor(index / width);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);

      for (let dy = -1; dy <= 1; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= height) continue;
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          if (nx < 0 || nx >= width) continue;
          const next = ny * width + nx;
          if (source[next] && !visited[next]) {
            visited[next] = 1;
            queue[tail++] = next;
          }
        }
      }
    }

    const boxWidth = maxX - minX + 1;
    const boxHeight = maxY - minY + 1;
    const density = tail / (boxWidth * boxHeight);
    const isLargeSparseArtifact =
      density < 0.03 && boxWidth > width * 0.25 && boxHeight > height * 0.25;
    if (tail >= minArea && !isLargeSparseArtifact) {
      for (let i = 0; i < tail; i++) output[queue[i]] = 255;
    }
  }

  return output;
}

function fillSmallHoles(source: Uint8Array, width: number, height: number): Uint8Array {
  const output = source.slice();
  const visited = new Uint8Array(source.length);
  const queue = new Int32Array(source.length);
  const maxHoleArea = Math.max(64, Math.round(source.length * 0.012));

  for (let start = 0; start < source.length; start++) {
    if (source[start] || visited[start]) continue;

    let head = 0;
    let tail = 0;
    let touchesEdge = false;
    queue[tail++] = start;
    visited[start] = 1;

    while (head < tail) {
      const index = queue[head++];
      const x = index % width;
      const y = Math.floor(index / width);
      if (x === 0 || y === 0 || x === width - 1 || y === height - 1) touchesEdge = true;

      const neighbors = [index - 1, index + 1, index - width, index + width];
      for (let i = 0; i < neighbors.length; i++) {
        if ((i === 0 && x === 0) || (i === 1 && x === width - 1)) continue;
        const next = neighbors[i];
        if (next < 0 || next >= source.length || source[next] || visited[next]) continue;
        visited[next] = 1;
        queue[tail++] = next;
      }
    }

    if (!touchesEdge && tail <= maxHoleArea) {
      for (let i = 0; i < tail; i++) output[queue[i]] = 255;
    }
  }

  return output;
}

export function createRemovalMask(alphaMask: Float32Array, width: number, height: number): Uint8Array {
  const thresholded = new Uint8Array(alphaMask.length);
  for (let i = 0; i < alphaMask.length; i++) thresholded[i] = alphaMask[i] >= 32 ? 255 : 0;

  const cleaned = removeMaskNoise(thresholded, width, height);
  const withHolesFilled = fillSmallHoles(cleaned, width, height);
  const closeRadius = clamp(Math.round(Math.max(width, height) * 0.002), 1, 4);
  const expansionRadius = clamp(Math.round(Math.max(width, height) * 0.05), 14, 72);
  const closed = binaryErode(
    binaryDilate(withHolesFilled, width, height, closeRadius),
    width,
    height,
    closeRadius,
  );
  return binaryDilate(closed, width, height, expansionRadius);
}

function analyzeRemovalMask(
  original: ImageData,
  removalMask: Uint8Array,
): BackgroundAnalysis {
  const { width, height } = original;
  const ringRadius = clamp(Math.round(Math.max(width, height) * 0.018), 8, 28);
  const outerMask = binaryDilate(removalMask, width, height, ringRadius);
  const step = Math.max(1, Math.floor(removalMask.length / 180_000));
  let red = 0;
  let green = 0;
  let blue = 0;
  let sampleCount = 0;

  for (let i = 0; i < removalMask.length; i += step) {
    if (!outerMask[i] || removalMask[i]) continue;
    red += original.data[i * 4];
    green += original.data[i * 4 + 1];
    blue += original.data[i * 4 + 2];
    sampleCount++;
  }

  if (!sampleCount) {
    return { recommendedMethod: 'ai', rmsVariation: 255, p90Difference: 255, sampleCount: 0 };
  }

  const meanRed = red / sampleCount;
  const meanGreen = green / sampleCount;
  const meanBlue = blue / sampleCount;
  const histogram = new Uint32Array(256);
  let squaredDifference = 0;

  for (let i = 0; i < removalMask.length; i += step) {
    if (!outerMask[i] || removalMask[i]) continue;
    const dr = original.data[i * 4] - meanRed;
    const dg = original.data[i * 4 + 1] - meanGreen;
    const db = original.data[i * 4 + 2] - meanBlue;
    const difference = Math.sqrt((dr * dr + dg * dg + db * db) / 3);
    squaredDifference += difference * difference;
    histogram[Math.min(255, Math.round(difference))]++;
  }

  const rmsVariation = Math.sqrt(squaredDifference / sampleCount);
  const percentileTarget = Math.ceil(sampleCount * 0.9);
  let cumulative = 0;
  let p90Difference = 255;
  for (let i = 0; i < histogram.length; i++) {
    cumulative += histogram[i];
    if (cumulative >= percentileTarget) {
      p90Difference = i;
      break;
    }
  }

  const recommendedMethod =
    sampleCount >= 64 && rmsVariation <= 18 && p90Difference <= 28 ? 'color' : 'ai';
  return { recommendedMethod, rmsVariation, p90Difference, sampleCount };
}

export function analyzeBackgroundFill(
  original: ImageData,
  alphaMask: Float32Array,
): BackgroundAnalysis {
  return analyzeRemovalMask(
    original,
    createRemovalMask(alphaMask, original.width, original.height),
  );
}

function softenMask(source: Uint8Array, width: number, height: number, radius: number): Uint8Array {
  if (radius <= 0) return source.slice();
  const horizontal = new Float32Array(source.length);
  const output = new Uint8Array(source.length);

  for (let y = 0; y < height; y++) {
    const row = y * width;
    let sum = 0;
    let count = 0;
    for (let x = 0; x <= Math.min(width - 1, radius); x++) {
      sum += source[row + x];
      count++;
    }
    for (let x = 0; x < width; x++) {
      horizontal[row + x] = sum / count;
      const removeX = x - radius;
      const addX = x + radius + 1;
      if (removeX >= 0) {
        sum -= source[row + removeX];
        count--;
      }
      if (addX < width) {
        sum += source[row + addX];
        count++;
      }
    }
  }

  for (let x = 0; x < width; x++) {
    let sum = 0;
    let count = 0;
    for (let y = 0; y <= Math.min(height - 1, radius); y++) {
      sum += horizontal[y * width + x];
      count++;
    }
    for (let y = 0; y < height; y++) {
      output[y * width + x] = Math.round(sum / count);
      const removeY = y - radius;
      const addY = y + radius + 1;
      if (removeY >= 0) {
        sum -= horizontal[removeY * width + x];
        count--;
      }
      if (addY < height) {
        sum += horizontal[addY * width + x];
        count++;
      }
    }
  }

  return output;
}

function fillFromSurroundingColors(
  original: ImageData,
  removalMask: Uint8Array,
): Uint8ClampedArray {
  const { width, height } = original;
  const output = new Uint8ClampedArray(original.data);
  const pending = removalMask.slice();
  const queued = new Uint8Array(removalMask.length);
  const queue = new Int32Array(removalMask.length);
  let head = 0;
  let tail = 0;

  const enqueueBoundary = (index: number, x: number, y: number) => {
    if (!pending[index] || queued[index]) return;
    const hasKnownNeighbor =
      (x > 0 && !pending[index - 1]) ||
      (x < width - 1 && !pending[index + 1]) ||
      (y > 0 && !pending[index - width]) ||
      (y < height - 1 && !pending[index + width]);
    if (hasKnownNeighbor) {
      queued[index] = 1;
      queue[tail++] = index;
    }
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) enqueueBoundary(y * width + x, x, y);
  }

  while (head < tail) {
    const index = queue[head++];
    if (!pending[index]) continue;
    const x = index % width;
    const y = Math.floor(index / width);
    let red = 0;
    let green = 0;
    let blue = 0;
    let count = 0;

    for (let dy = -1; dy <= 1; dy++) {
      const ny = y + dy;
      if (ny < 0 || ny >= height) continue;
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx;
        if ((dx === 0 && dy === 0) || nx < 0 || nx >= width) continue;
        const next = ny * width + nx;
        if (pending[next]) continue;
        red += output[next * 4];
        green += output[next * 4 + 1];
        blue += output[next * 4 + 2];
        count++;
      }
    }

    if (!count) continue;
    output[index * 4] = Math.round(red / count);
    output[index * 4 + 1] = Math.round(green / count);
    output[index * 4 + 2] = Math.round(blue / count);
    output[index * 4 + 3] = 255;
    pending[index] = 0;

    for (let dy = -1; dy <= 1; dy++) {
      const ny = y + dy;
      if (ny < 0 || ny >= height) continue;
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx;
        if ((dx === 0 && dy === 0) || nx < 0 || nx >= width) continue;
        const next = ny * width + nx;
        if (pending[next] && !queued[next]) {
          queued[next] = 1;
          queue[tail++] = next;
        }
      }
    }
  }

  return output;
}

function getLamaWorker(): Worker {
  if (!lamaWorker) {
    lamaWorker = new Worker(new URL('../../workers/lama-inpaint-worker.ts', import.meta.url), {
      type: 'module',
    });
  }
  return lamaWorker;
}

function fillWithLama(
  original: ImageData,
  removalMask: Uint8Array,
  onProgress?: (progress: BackgroundProgress) => void,
): Promise<Uint8ClampedArray> {
  const worker = getLamaWorker();
  const id = typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;
  const image = new Uint8ClampedArray(original.data);
  const mask = removalMask.slice();
  const request: LamaInpaintRequest = {
    id,
    type: 'inpaint',
    imageBuffer: image.buffer,
    maskBuffer: mask.buffer,
    width: original.width,
    height: original.height,
  };

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      worker.removeEventListener('message', handleMessage);
      worker.removeEventListener('error', handleError);
    };
    const handleMessage = (event: MessageEvent<LamaInpaintResponse>) => {
      const response = event.data;
      if (response.id !== id) return;
      if (response.type === 'progress') {
        onProgress?.({
          stage: response.stage,
          loaded: response.loaded,
          total: response.total,
        });
        return;
      }
      cleanup();
      if (response.type === 'error') {
        reject(new Error(response.message));
      } else {
        resolve(new Uint8ClampedArray(response.imageBuffer));
      }
    };
    const handleError = (event: ErrorEvent) => {
      cleanup();
      lamaWorker?.terminate();
      lamaWorker = null;
      reject(new Error(event.message || 'The LaMa repair worker stopped unexpectedly'));
    };
    worker.addEventListener('message', handleMessage);
    worker.addEventListener('error', handleError);
    worker.postMessage(request, [request.imageBuffer, request.maskBuffer]);
  });
}

export async function createInpaintedBackground(
  original: ImageData,
  alphaMask: Float32Array,
  options: CreateBackgroundOptions = {},
): Promise<BackgroundResult> {
  const { width, height } = original;
  const removalMask = createRemovalMask(alphaMask, width, height);
  const analysis = analyzeRemovalMask(original, removalMask);
  const methodUsed = options.mode === 'color' || options.mode === 'ai'
    ? options.mode
    : analysis.recommendedMethod;
  const featherRadius = clamp(Math.round(Math.max(width, height) * 0.0015), 1, 3);
  const blendMask = softenMask(removalMask, width, height, featherRadius);
  const filledPixels = methodUsed === 'ai'
    ? await fillWithLama(original, removalMask, options.onProgress)
    : fillFromSurroundingColors(original, removalMask);

  const output = new Uint8ClampedArray(original.data);
  for (let i = 0; i < removalMask.length; i++) {
    const weight = blendMask[i] / 255;
    if (weight <= 0) {
      output[i * 4 + 3] = 255;
      continue;
    }
    output[i * 4] = Math.round(original.data[i * 4] * (1 - weight) + filledPixels[i * 4] * weight);
    output[i * 4 + 1] = Math.round(
      original.data[i * 4 + 1] * (1 - weight) + filledPixels[i * 4 + 1] * weight,
    );
    output[i * 4 + 2] = Math.round(
      original.data[i * 4 + 2] * (1 - weight) + filledPixels[i * 4 + 2] * weight,
    );
    output[i * 4 + 3] = 255;
  }

  return {
    imageData: new ImageData(output, width, height),
    removalMask,
    analysis,
    methodUsed,
  };
}

export async function createExportBackground(
  original: ImageData,
  alphaMask: Float32Array,
  options: CreateExportBackgroundOptions = {},
): Promise<ImageData> {
  const { width, height } = original;
  const maxWorkingDimension = options.maxWorkingDimension ?? 1800;
  if (Math.max(width, height) <= maxWorkingDimension) {
    return (await createInpaintedBackground(original, alphaMask, options)).imageData;
  }

  const scale = maxWorkingDimension / Math.max(width, height);
  const workingWidth = Math.max(1, Math.round(width * scale));
  const workingHeight = Math.max(1, Math.round(height * scale));
  const sourceCanvas = document.createElement('canvas');
  sourceCanvas.width = width;
  sourceCanvas.height = height;
  const sourceContext = sourceCanvas.getContext('2d');
  if (!sourceContext) throw new Error('Canvas not available');
  sourceContext.putImageData(original, 0, 0);

  const workingCanvas = document.createElement('canvas');
  workingCanvas.width = workingWidth;
  workingCanvas.height = workingHeight;
  const workingContext = workingCanvas.getContext('2d');
  if (!workingContext) throw new Error('Canvas not available');
  workingContext.imageSmoothingEnabled = true;
  workingContext.imageSmoothingQuality = 'high';
  workingContext.drawImage(sourceCanvas, 0, 0, workingWidth, workingHeight);
  const workingImage = workingContext.getImageData(0, 0, workingWidth, workingHeight);
  const workingMask = resizeMaskBilinear(alphaMask, width, height, workingWidth, workingHeight);
  const workingResult = await createInpaintedBackground(workingImage, workingMask, options);

  const resultCanvas = document.createElement('canvas');
  resultCanvas.width = workingWidth;
  resultCanvas.height = workingHeight;
  const resultContext = resultCanvas.getContext('2d');
  if (!resultContext) throw new Error('Canvas not available');
  resultContext.putImageData(workingResult.imageData, 0, 0);

  const scaledResultCanvas = document.createElement('canvas');
  scaledResultCanvas.width = width;
  scaledResultCanvas.height = height;
  const scaledResultContext = scaledResultCanvas.getContext('2d');
  if (!scaledResultContext) throw new Error('Canvas not available');
  scaledResultContext.imageSmoothingEnabled = true;
  scaledResultContext.imageSmoothingQuality = 'high';
  scaledResultContext.drawImage(resultCanvas, 0, 0, width, height);
  const scaledResult = scaledResultContext.getImageData(0, 0, width, height);

  const maskImage = new ImageData(workingWidth, workingHeight);
  for (let i = 0; i < workingResult.removalMask.length; i++) {
    const value = workingResult.removalMask[i];
    maskImage.data[i * 4] = value;
    maskImage.data[i * 4 + 1] = value;
    maskImage.data[i * 4 + 2] = value;
    maskImage.data[i * 4 + 3] = 255;
  }
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = workingWidth;
  maskCanvas.height = workingHeight;
  const maskContext = maskCanvas.getContext('2d');
  if (!maskContext) throw new Error('Canvas not available');
  maskContext.putImageData(maskImage, 0, 0);

  const scaledMaskCanvas = document.createElement('canvas');
  scaledMaskCanvas.width = width;
  scaledMaskCanvas.height = height;
  const scaledMaskContext = scaledMaskCanvas.getContext('2d');
  if (!scaledMaskContext) throw new Error('Canvas not available');
  scaledMaskContext.imageSmoothingEnabled = true;
  scaledMaskContext.imageSmoothingQuality = 'high';
  scaledMaskContext.drawImage(maskCanvas, 0, 0, width, height);
  const scaledMask = scaledMaskContext.getImageData(0, 0, width, height).data;

  const output = new Uint8ClampedArray(original.data);
  for (let i = 0; i < alphaMask.length; i++) {
    const weight = scaledMask[i * 4] / 255;
    if (weight <= 0) {
      output[i * 4 + 3] = 255;
      continue;
    }
    output[i * 4] = Math.round(original.data[i * 4] * (1 - weight) + scaledResult.data[i * 4] * weight);
    output[i * 4 + 1] = Math.round(
      original.data[i * 4 + 1] * (1 - weight) + scaledResult.data[i * 4 + 1] * weight,
    );
    output[i * 4 + 2] = Math.round(
      original.data[i * 4 + 2] * (1 - weight) + scaledResult.data[i * 4 + 2] * weight,
    );
    output[i * 4 + 3] = 255;
  }

  return new ImageData(output, width, height);
}
