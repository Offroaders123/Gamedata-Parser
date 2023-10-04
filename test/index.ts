import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { read } from "../src/index.js";

const GAMEDATA = new URL("./ps4/GAMEDATA",import.meta.url);

const data = await readFile(GAMEDATA);
const files = read(data,"ps4");

for (const file of files){
  console.log(file);
  const path = decodeURIComponent(new URL(join("./world_data",file.name),import.meta.url).pathname);

  await mkdir(dirname(path),{ recursive: true });
  writeFile(path,new Uint8Array(await file.arrayBuffer()));
}