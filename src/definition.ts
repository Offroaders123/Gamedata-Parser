import { readHeader } from "./header.js";

export const DEFINITION_LENGTH = 144;
export const NAME_LENGTH = 128;

export interface Definition {
  name: string;
  byteOffset: number;
  byteLength: number;
}

export function* readDefinitions(data: Uint8Array, littleEndian: boolean): Generator<Definition,void,void> {
  const decoder = new TextDecoder(littleEndian ? "utf-16" : "utf-16be");

  const { byteOffset, length } = readHeader(data,littleEndian);
  // console.log(byteOffset,length);
  const byteLength = DEFINITION_LENGTH * length;
  const view = new DataView(data.buffer,data.byteOffset,data.byteLength);

  for (let i = byteOffset; i < byteOffset + byteLength; i += DEFINITION_LENGTH){
    const name = decoder
      .decode(data.subarray(i,i + NAME_LENGTH))
      .replaceAll("\0","")
      // Fixes the naming inconsistency for Nether files within the 'DIM-1' directory.
      .replace("DIM-1","DIM-1/");
    const byteLength = view.getUint32(i + NAME_LENGTH,littleEndian);
    const byteOffset = view.getUint32(i + NAME_LENGTH + 4,littleEndian);

    yield { name, byteOffset, byteLength };
  }
}