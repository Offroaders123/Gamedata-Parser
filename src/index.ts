export interface Definition {
  name: string;
  offset: number;
  length: number;
}

export function read(data: Uint8Array){
  const definitions = readDefinitions(data);

  const result: File[] = [];

  for (const { name, offset, length } of definitions){
    const content = data.subarray(offset,offset + length);
    const file = new File([content],name);
    result.push(file);
  }

  return result;
}

export function getDefinitions(data: Uint8Array){
  const view = new DataView(data.buffer,data.byteOffset,data.byteLength);
  const offset = view.getUint32(0);
  const definitions = data.subarray(offset);
  return definitions;
}

export function readDefinitions(data: Uint8Array){
  const definitions = getDefinitions(data);
  const result: Definition[] = [];

  for (let i = 0; i < definitions.byteLength; i += 144){
    const definition = definitions.subarray(i,i + 144);
    const name = new TextDecoder("utf-16be").decode(definition).split("\0")[0].replace("-1r.","-1/r.");
    // Replace call fixes a naming inconsistency for Nether region files.

    const header = definition.subarray(128);
    const view = new DataView(header.buffer,header.byteOffset,header.byteLength);

    const length = view.getUint32(0);
    const offset = view.getUint32(4);

    result.push({ name, offset, length });
  }

  return result;
}