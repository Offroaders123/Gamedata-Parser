// @ts-check

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { readGamedata } from "../dist/index.js";

const data = await readFile(new URL("./world/GAMEDATA",import.meta.url));

const files = readGamedata(data);

for (const file of files){
  console.log(file);
  const path = decodeURIComponent(new URL(join("./world_data",file.name),import.meta.url).pathname);

  await mkdir(dirname(path),{ recursive: true });
  writeFile(path,new Uint8Array(await file.arrayBuffer()));
}