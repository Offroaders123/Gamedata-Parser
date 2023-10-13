import { inflateSync } from "node:zlib";
import { readDefinitions } from "./definition.js";
import { XDecompress } from "./compression.js";

import type { Platform } from "./platform.js";

export function* readGamedata(data: Uint8Array, platform: Platform): Generator<File,void,void> {
  if (platform === "ps4"){
    data = inflateSync(data.subarray(8));
    console.log(data);
  }
  if (platform === "360"){
    let decompressFileOutput: Uint8Array;
    let sizeOfdecompressFileOutput: bigint;
    let header = new Uint8Array(0xc);
    data = new Uint8Array(data.buffer,0,data.byteLength);
    header = data.subarray(0,12);
    console.log(header);
    const headerInput = new DataInputManager(header, 12, false);
    
    // headerInput.seekStart();
    const sizeOfSrc: number = headerInput.getInt32(0) - 8;
    sizeOfdecompressFileOutput = headerInput.getBigInt64(4);
    let src = new Uint8Array(sizeOfSrc);
    const dst = new Uint8Array(Number(sizeOfdecompressFileOutput));
    decompressFileOutput = dst;
    src = data.subarray(0,sizeOfSrc);
    sizeOfdecompressFileOutput = BigInt(XDecompress(src, dst, BigInt(sizeOfSrc), sizeOfdecompressFileOutput));
    // free(src);
    if (sizeOfdecompressFileOutput === 0n) {
        throw new Error("Not a Minecraft console savefile, exiting\n");
        // fclose(data);
        // free(dst);
        // return 0;
    }
    console.log("Detected Xbox360 .dat savefile, converting\n");
    
    //1139 vs 1343
    let dataOfInputFile = new DataInputManager(decompressFileOutput, Number(sizeOfdecompressFileOutput), false);//we will free the data manually later
    dataOfInputFile = DataInputManager.seek(dataOfInputFile,8);
    const oldestVersion = dataOfInputFile.getInt16(0);
    const currentVersion = dataOfInputFile.getInt16(2);
    dataOfInputFile = DataInputManager.seekStart(dataOfInputFile);
  }
  const littleEndian = platform === "ps4";
  for (const { name, byteLength, byteOffset } of readDefinitions(data,littleEndian)){
    const content = data.subarray(byteOffset,byteOffset + byteLength);
    yield new File([content],name);
  }
}

class DataInputManager extends DataView {
  static seekStart(dataInput: DataInputManager): DataInputManager {
    return new this(dataInput.buffer,dataInput.byteLength,dataInput.shouldFreeIn,dataInput.byteOffset);
  }
  static seek(dataInput: DataInputManager, byteOffset: number): DataInputManager {
    return new this(dataInput.buffer,dataInput.byteLength - byteOffset,dataInput.shouldFreeIn,dataInput.byteOffset + byteOffset);
  }

  constructor(data_in: Uint8Array | ArrayBuffer, size: number, public shouldFreeIn: boolean, byteOffset: number = "byteOffset" in data_in ? data_in.byteOffset : 0) {
    super("buffer" in data_in ? data_in.buffer : data_in,byteOffset,size);
  }
}