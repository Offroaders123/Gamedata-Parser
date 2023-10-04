export function readRegion(data: Uint8Array): Uint8Array {
  console.log(data.subarray(0,16));
  const view = new DataView(data.buffer,data.byteOffset,16);
  console.log(view.getUint16(0,false),view.getUint16(2,false));
  return data;
}