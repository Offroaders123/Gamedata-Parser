// @ts-check

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import * as Gamedata from "../dist/index.js";

const data = await readFile(new URL("./world/GAMEDATA",import.meta.url));

const files = Gamedata.read(data);

for (const file of files){
  console.log(file);
  const path = decodeURIComponent(new URL(join("./world_data",file.name),import.meta.url).pathname);

  await mkdir(dirname(path),{ recursive: true });
  writeFile(path,new Uint8Array(await file.arrayBuffer()));
}