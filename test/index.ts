import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { readGamedata } from "../src/index.js";

const GAMEDATA = new URL("./360/savegame.dat",import.meta.url);

const data = await readFile(GAMEDATA);
const files = readGamedata(data,"360");

for (const file of files){
  console.log(file);
  const path = decodeURIComponent(new URL(join("./world_data",file.name),import.meta.url).pathname);

  await mkdir(dirname(path),{ recursive: true });
  writeFile(path,new Uint8Array(await file.arrayBuffer()));
}