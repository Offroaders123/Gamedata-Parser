import { inflateSync } from "node:zlib";
import { readDefinitions } from "./definition.js";

export function* read(data: Uint8Array): Generator<File,void,void> {
  data = inflateSync(data.subarray(8));
  console.log(data);
  for (const { name, byteLength, byteOffset } of readDefinitions(data)){
    const content = data.subarray(byteOffset,byteOffset + byteLength);
    yield new File([content],name);
  }
}