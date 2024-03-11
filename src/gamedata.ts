import { inflateSync } from "node:zlib";
import { readDefinitions } from "./definition.js";

import type { Platform } from "./platform.js";

export function* readGamedata(data: Uint8Array, platform: Platform): Generator<File,void,void> {
  if (platform === "ps4"){
    data = inflateSync(data.subarray(8));
    // console.log(data);
  }
  if (platform === "360"){
  }
  const littleEndian = platform === "ps4";
  for (const { name, byteLength, byteOffset } of readDefinitions(data,littleEndian)){
    const content = data.subarray(byteOffset,byteOffset + byteLength);
    yield new File([content],name);
  }
}