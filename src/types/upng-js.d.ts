declare module 'upng-js' {
  export interface UPNGImage {
    width: number;
    height: number;
    depth: number;
    ctype: number;
    frames: unknown[];
    tabs: Record<string, unknown>;
  }
  export function decode(buffer: ArrayBuffer): UPNGImage;
  export function encode(
    bufs: ArrayBuffer[] | ArrayBufferView[],
    w: number,
    h: number,
    ps: number,
    dels?: boolean,
    forbidPlte?: boolean
  ): ArrayBuffer;
  export function toRGBA8(img: UPNGImage): Uint8Array[];
  const UPNG: {
    decode: typeof decode;
    encode: typeof encode;
    toRGBA8: typeof toRGBA8;
  };
  export default UPNG;
}
