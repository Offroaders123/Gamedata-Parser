import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { readGamedata } from "../src/index.js";

const GAMEDATA = new URL("./ps3/GAMEDATA",import.meta.url);

const data = await readFile(GAMEDATA);
const files = readGamedata(data,"ps3");

for (const file of files){
  console.log(file);
  // console.log(Array(8 - file.size.toString().length).fill(" ").join(""), file.size, file.name);
  const path = decodeURIComponent(new URL(join("./world_data",file.name),import.meta.url).pathname);

  await mkdir(dirname(path),{ recursive: true });
  writeFile(path,new Uint8Array(await file.arrayBuffer()));
}