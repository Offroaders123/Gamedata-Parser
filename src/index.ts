export interface GamedataDefinition {
  name: string;
  offset: number;
  length: number;
}

export function readGamedata(data: Uint8Array){
  const definitions = readGamedataDefinitions(data);
  const files = definitions.map(definition => getFile(data,definition));
  return files;
}

export function getGamedataDefinitions(data: Uint8Array){
  const view = new DataView(data.buffer,data.byteOffset,data.byteLength);
  const offset = view.getUint32(0);
  const definitions = data.subarray(offset);
  return definitions;
}

export function readGamedataDefinitions(data: Uint8Array){
  const definitionsBlock = getGamedataDefinitions(data);
  const definitions = [...readGamedataDefinition(definitionsBlock)];
  return definitions;
}

export function* readGamedataDefinition(data: Uint8Array): Generator<GamedataDefinition,void,void> {
  for (let i = 0; i < data.byteLength; i += 144){
    const definition = data.subarray(i,i + 144);
    /** Replace call fixes a naming inconsistency for Nether region files. */
    const name = new TextDecoder("utf-16be").decode(definition).split("\0")[0].replace("-1r.","-1/r.");

    const header = definition.subarray(128);
    const view = new DataView(header.buffer,header.byteOffset,header.byteLength);

    const length = view.getUint32(0);
    const offset = view.getUint32(4);

    yield { name, offset, length };
  }
}

export function getFile(data: Uint8Array, { name, offset, length }: GamedataDefinition){
  const content = data.subarray(offset,offset + length);
  const file = new File([content],name);
  return file;
}