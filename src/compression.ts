export { compress, decompress } from "nbtify";

/**
 * Decompresses Uint8Array data using the Vita Run-Length Encoding format.
*/
export function runLengthDecode(data: Uint8Array, decompressedLength: number): Uint8Array {
  const compressedLength = data.byteLength;
  const result = new Uint8Array(decompressedLength);
  let readOffset = 0;
  let writeOffset = 0;

  while (readOffset < compressedLength){
    const suspectedTag: number = data[readOffset]!;
    readOffset++;

    if (suspectedTag !== 0){
      result[writeOffset] = suspectedTag;
      writeOffset++;
    } else {
      try {
      const length: number = data[readOffset]!;
      readOffset++;
      result.set(Array(length).fill(0), writeOffset);
      writeOffset += length;
      } catch {
        return result;
      }
    }
  }

  return result;
}