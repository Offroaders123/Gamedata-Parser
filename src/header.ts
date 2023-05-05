import { DEFINITION_LENGTH } from "./definition.js";

export const HEADER_LENGTH = 8;

export interface Header {
  byteOffset: number;
  byteLength: number;
  length: number;
}

export function readHeader(data: Uint8Array): Header {
  const view = new DataView(data.buffer,data.byteOffset,data.byteLength);

  const byteOffset = view.getUint32(0);
  const length = view.getUint32(4);
  const byteLength = DEFINITION_LENGTH * length;

  return { byteOffset, byteLength, length };
}