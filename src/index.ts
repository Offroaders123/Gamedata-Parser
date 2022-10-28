export interface Definition {
  name: string;
  offset: number;
  length: number;
}

export class Gamedata {
  static read(data: Uint8Array){
    const definitions = this.readDefinitions(data);

    const result: Gamedata[] = [];

    for (const { name, offset, length } of definitions){
      const content = new Uint8Array(data.slice(offset,offset + length));
      const file = new Gamedata(name,content);
      result.push(file);
    }

    return result;
  }

  static getDefinitions(data: Uint8Array){
    const view = new DataView(data.buffer);
    const offset = view.getUint32(0);

    return new Uint8Array(data.slice(offset));
  }

  static readDefinitions(data: Uint8Array){
    const definitions = this.getDefinitions(data);
    const result: Definition[] = [];

    for (let i = 0; i < definitions.byteLength; i += 144){
      const definition = new Uint8Array(definitions.slice(i,i + 144));
      const name = new TextDecoder("utf-16be").decode(definition).split("\0")[0].replace("-1r.","-1/r.");
      // Replace call fixes a naming inconsistency for Nether region files.

      const header = new Uint8Array(definition.slice(128));
      const view = new DataView(header.buffer);

      const length = view.getUint32(0);
      const offset = view.getUint32(4);

      result.push({ name, offset, length });
    }

    return result;
  }

  constructor(public name: string, public data: Uint8Array) {}
}

export default Gamedata;