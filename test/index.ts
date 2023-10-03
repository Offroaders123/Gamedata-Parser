import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { inflateSync } from "node:zlib";
import { read } from "../src/index.js";

// const GAMEDATA = new URL("./world/GAMEDATA",import.meta.url);
const GAMEDATA = new URL("./ps4/GAMEDATA",import.meta.url);
const GAMEDATA2 = new URL("./ps4/GAMEDATA2",import.meta.url);

const data = await readFile(GAMEDATA);
// await writeFile(GAMEDATA2,new Uint8Array([...data.subarray(0,8),...inflateSync(data.subarray(8))]));
const files = read(data);

for (const file of files){
  console.log(file);
  const path = decodeURIComponent(new URL(join("./world_data",file.name),import.meta.url).pathname);

  await mkdir(dirname(path),{ recursive: true });
  writeFile(path,new Uint8Array(await file.arrayBuffer()));
}