declare module 'gif.js' {
  export interface GIFOptions {
    workers?: number;
    quality?: number;
    workerScript?: string;
    width?: number;
    height?: number;
    repeat?: number;
    background?: string;
    transparent?: number | null;
    dither?: boolean | string;
  }

  export default class GIF {
    constructor(options?: GIFOptions);
    addFrame(
      image: CanvasImageSource | ImageData | Uint8ClampedArray,
      options?: { delay?: number; copy?: boolean; dispose?: number },
    ): void;
    on(event: 'finished', callback: (blob: Blob) => void): void;
    on(event: 'progress', callback: (percent: number) => void): void;
    on(event: 'abort', callback: () => void): void;
    on(event: string, callback: (...args: any[]) => void): void;
    render(): void;
    abort(): void;
  }
}
