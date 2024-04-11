import { decompress, runLengthDecode } from "./compression.js";

export type Platform = "ps-vita" | "ps3" | "ps4" | "wii-u" | "xbox-360";

export const DEFINITION_LENGTH = 144;
export const NAME_LENGTH = 128;

export async function readGamedata(data: Uint8Array, platform: Platform): Promise<File[]> {
  if (platform === "ps-vita"){
    data = runLengthDecode(data.subarray(8));
    // await writeFile("./output2.bin", data);
  }

  if (platform === "ps4"){
    data = await decompress(data, "deflate");
  }

  if (platform === "wii-u"){
    // const view = new DataView(data.buffer, data.byteOffset, 8);
    // const a: number = view.getUint32(0);
    // const b: number = view.getUint32(4);
    // console.log(a, b);
    data = await decompress(data.subarray(8), "deflate");
    // console.log(data.byteLength);
  }

  if (platform === "xbox-360"){
    // needs to be reimplemented
  }

  const littleEndian: boolean = platform === "ps-vita" || platform === "ps4";
  const decoder = new TextDecoder(littleEndian ? "utf-16" : "utf-16be");
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);

  const byteOffset: number = view.getUint32(0, littleEndian);
  const byteLength: number = DEFINITION_LENGTH * view.getUint32(4, littleEndian);

  const files: File[] = [];

  for (let i = byteOffset; i < byteOffset + byteLength; i += DEFINITION_LENGTH){
    const name: string = decoder
      .decode(data.subarray(i, i + NAME_LENGTH))
      .split("\0")[0]!
      // Fixes the naming inconsistency for Nether files within the 'DIM-1' directory.
      .replace("DIM-1","DIM-1/");
    const byteLength: number = view.getUint32(i + NAME_LENGTH, littleEndian);
    const byteOffset: number = view.getUint32(i + NAME_LENGTH + 4, littleEndian);
    files.push(new File([data.subarray(byteOffset, byteOffset + byteLength)], name));
  }

  return files;
}

export async function writeGamedata(data: File[], platform: Platform): Promise<Uint8Array> {
  return new Uint8Array();
}