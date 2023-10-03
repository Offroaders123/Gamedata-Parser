export const HEADER_LENGTH = 8;

export interface Header {
  byteOffset: number;
  length: number;
}

export function readHeader(data: Uint8Array, littleEndian: boolean): Header {
  const view = new DataView(data.buffer,data.byteOffset,HEADER_LENGTH);
  const byteOffset = view.getUint32(0,littleEndian);
  const length = view.getUint32(4,littleEndian);
  return { byteOffset, length };
}