export { compress, decompress } from "nbtify";

/**
 * Decompresses Uint8Array data using the Run-Length Encoding format.
 * 
 * This variant is specific to PS Vita Edition.
*/
export function runLengthDecode(data: Uint8Array, decompressedLength: number): Uint8Array {
  const compressedLength = data.byteLength;
  const result = new Uint8Array(decompressedLength);
  let readOffset = 0;
  let writeOffset = 0;

  while (readOffset < compressedLength){
    const suspectedTag: number = data[readOffset++]!;

    if (suspectedTag !== 0){
      result[writeOffset++] = suspectedTag;
    } else {
      const length: number = data[readOffset++]!;
      result.fill(0, writeOffset, length);
      writeOffset += length;
    }
  }

  return result;
}