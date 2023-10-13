import { inflateSync } from "node:zlib";
import { readDefinitions } from "./definition.js";

import type { Platform } from "./platform.js";

export function* readGamedata(data: Uint8Array, platform: Platform): Generator<File,void,void> {
  if (platform === "ps4"){
    data = inflateSync(data.subarray(8));
    console.log(data);
  }
  const littleEndian = platform === "ps4";
  for (const { name, byteLength, byteOffset } of readDefinitions(data,littleEndian)){
    const content = data.subarray(byteOffset,byteOffset + byteLength);
    yield new File([content],name);
  }
}

declare var argv: string[];
declare function fopen(path: string, permissions?: string): Uint8Array;
declare function fseek(pointer: Uint8Array, offset: number, position: number): number;
declare const SEEK_SET: number;
declare function fread(pointer: Uint8Array, size: number, nmemb: number, stream: Uint8Array): number;
declare class DataInputManager extends DataView {
  constructor(data_in: Uint8Array, size: number, shouldFreeIn: boolean);
  seekStart(): void;
  seek(byteLength: number): void;
}
declare function free(ptr: Uint8Array): void;
declare function fclose(stream: Uint8Array): number;

const platform = "360";
const infileStr: string = argv[2]!;
//const infileStr = "tests/Hunger games city of ruins.bin"; 
let f_in: Uint8Array | null = null;
f_in = fopen(infileStr, "rb");
if (f_in === null) {
    console.log("Cannot open infile %s\n", infileStr);//open input
    // return 0;
}
let decompressFileOutput: Uint8Array;
let sizeOfdecompressFileOutput: bigint;
let saveGameInfo: SavefileInfo;
const header = new Uint8Array(0xc);
fseek(f_in, 0, SEEK_SET);
fread(header, 1, 12, f_in);
const headerInput = new DataInputManager(header, 12, false);

headerInput.seekStart();
const sizeOfSrc: number = headerInput.getInt32(0) - 8;
sizeOfdecompressFileOutput = headerInput.getBigInt64(4);
const src = new Uint8Array(sizeOfSrc);
const dst = new Uint8Array(Number(sizeOfdecompressFileOutput));
decompressFileOutput = dst;
fread(src, 1, sizeOfSrc, f_in);
sizeOfdecompressFileOutput = XDecompress(src, dst, sizeOfSrc, sizeOfdecompressFileOutput);
free(src);
if (sizeOfdecompressFileOutput === 0n) {
    console.log("Not a Minecraft console savefile, exiting\n");
    fclose(f_in);
    free(dst);
    // return 0;
}
console.log("Detected Xbox360 .dat savefile, converting\n");

//1139 vs 1343
ConvertInit.initConverter(1, 0, 12.2);
const dataOfInputFile = new DataInputManager(decompressFileOutput, Number(sizeOfdecompressFileOutput), false);//we will free the data manually later
dataOfInputFile.seek(8);
const oldestVersion = dataOfInputFile.getInt16(0);
const currentVersion = dataOfInputFile.getInt16(2);
dataOfInputFile.seekStart();
const files: SaveFilesGroupListing = readSavefileFiles(dataOfInputFile, platform);