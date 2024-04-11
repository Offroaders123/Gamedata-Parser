import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { readGamedata } from "../src/index.js";

const GAMEDATA = new URL("./ps-vita/GAMEDATA-2.bin",import.meta.url);

const data = await readFile(GAMEDATA);
const files = await readGamedata(data,"ps-vita");

for (const file of files){
  console.log(file);
  // console.log(Array(8 - file.size.toString().length).fill(" ").join(""), file.size, file.name);
  const path = decodeURIComponent(new URL(join("./world_data",file.name),import.meta.url).pathname);

  await mkdir(dirname(path),{ recursive: true });
  writeFile(path,new Uint8Array(await file.arrayBuffer()));
}