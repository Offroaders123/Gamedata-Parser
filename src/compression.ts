export { compress, decompress } from "nbtify";

export { RLEVITA_DECOMPRESS as runLengthDecode };

let inByteIndex: number = 0;

/**
 * Fills a portion of an array with a specified value.
 */
function memset(array: number[] | Uint8Array, value: number, start: number, length: number): void {
  for (let i = start; i < start + length; i++) {
    array[i] = value;
  }
}

// function seek(dataIn: Uint8Array, offset: number): Uint8Array {
//   return dataIn.slice(offset);
// }

/**
 * @param dataIn The data
 * @returns The byte.
 */
function readByte(dataIn: Uint8Array): number {
  return dataIn[inByteIndex++]!;
}

/**
 * @param dataIn The compressed data
 * @param sizeIn Size of the compressed data
 * @param dataOut The decompressed data that will be outputted in an array
 * @returns The size of the decompressed data.
 */
/*
 * This is Zugebot (jerrinth3glitch)'s code ported to JS (mostly complete but not working!!!)
 * https://github.com/zugebot/LegacyEditor
 */
function RLEVITA_DECOMPRESS(dataIn: Uint8Array, sizeIn: number = dataIn.byteLength, dataOut: number[] | Uint8Array): number {
  let outByteIndex: number = 0;

  while (inByteIndex < sizeIn) {
    let byte: number = readByte(dataIn);

    if (byte !== 0x00) {
      dataOut[outByteIndex++] = byte;
    } else {
      const numZeros = readByte(dataIn);
      memset(dataOut, 0, outByteIndex, numZeros);
      outByteIndex += numZeros;
    }
  }

  return outByteIndex;
}