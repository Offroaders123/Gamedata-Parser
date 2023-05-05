import { readHeader } from "./header.js";

export const DEFINITION_LENGTH = 144;
export const NAME_LENGTH = 128;

const decoder = new TextDecoder("utf-16be");

export interface Definition {
  name: string;
  byteLength: number;
  byteOffset: number;
}

export function* readDefinitions(data: Uint8Array): Generator<Definition,void,void> {
  for (const definition of getDefinitions(data)){
    const view = new DataView(definition.buffer,definition.byteOffset,definition.byteLength);

    const name = decoder.decode(definition.subarray(0,NAME_LENGTH)).replaceAll("\0","");
    const byteLength = view.getUint32(NAME_LENGTH + 0);
    const byteOffset = view.getUint32(NAME_LENGTH + 4);

    yield { name, byteLength, byteOffset };
  }
}

export function* getDefinitions(data: Uint8Array): Generator<Uint8Array,void,void> {
  const { byteOffset, byteLength } = readHeader(data);

  for (let i = byteOffset; i < byteOffset + byteLength; i += DEFINITION_LENGTH){
    yield data.subarray(i,i + DEFINITION_LENGTH);
  }
}