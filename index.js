import { promises as fs } from "fs";
import path from "path";

const gamedata = await fs.readFile("./world/GAMEDATA");

const files = parseGameData(gamedata);

for (const [name,data] of files){
  const pathname = path.join("./world_data",name);
  await fs.mkdir(path.dirname(pathname),{ recursive: true });
  await fs.writeFile(pathname,data);
}

function parseGameData(data){
  const chunks = parseFileChunks(data);
  const files = [];

  for (const chunk of chunks){
    const name = new TextDecoder("utf-16be").decode(chunk).split("\0")[0];
    // const name = new TextDecoder("utf-16be").decode(chunk).split("\0")[0].replace("-1r.","-1/r.");
    // Second option fixes a naming bug for the naming of Nether region files.

    const metadata = new Uint8Array(chunk.slice(128));
    const size = new DataView(metadata.buffer).getInt32(0);
    const offset = new DataView(metadata.buffer).getInt32(4);

    const file = data.slice(offset,offset + size);
    files.push([name,file]);
  }

  return files;
}

function parseFileChunks(data){
  const offset = new DataView(data.buffer).getInt32();
  const names = data.slice(offset);

  const chunks = chunkify(names,144);
  return chunks;
}

function chunkify(data,size){
  const results = [];
  for (let i = 0; i < data.length; i += size){
    const chunk = data.slice(i,i + size);
    results.push(chunk);
  }
  return results;
}