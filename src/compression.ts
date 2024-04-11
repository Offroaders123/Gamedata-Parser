export { compress, decompress } from "nbtify";

/**
 * Decompresses Uint8Array data using the Vita Run-Length Encoding format.
*/
export function runLengthDecode(data: Uint8Array): Uint8Array {
  const compressedLength = data.byteLength;
  const result: number[] = [];
  let readOffset = 0;
  let writeOffset = 0;

  while (readOffset < compressedLength){
    const suspectedTag: number = data[readOffset]!;
    readOffset++;

    if (suspectedTag !== 0){
      result[writeOffset] = suspectedTag;
      writeOffset++;
    } else {
      const length: number = data[readOffset]!;
      readOffset++;
      for (let i = 0; i < length; i++){
        result.push(0);
        writeOffset++;
      }
    }
  }

  return new Uint8Array(result);
}