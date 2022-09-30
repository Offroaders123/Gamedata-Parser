export function chunkify(data: Uint8Array, length: number){
  const result = [];
  for (let i = 0; i < data.length; i += length){
    const size = i + length;
    const chunk = data.slice(i,size);
    result.push(chunk);
  }
  return result;
}