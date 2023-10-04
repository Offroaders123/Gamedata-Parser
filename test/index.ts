import { readFile, writeFile, readdir, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { read } from "../src/index.js";

const GAMEDATA = new URL("./ps4/GAMEDATA",import.meta.url);
const REGIONS = await (
  readdir(new URL("./ps4",import.meta.url),{ withFileTypes: true })
    .then(entries => entries
      .filter(entry => entry.isFile() && /^GAMEDATA_/.test(entry.name))
      .map(entry => new URL(entry.name,import.meta.url))
    )
)
console.log(REGIONS);

const data = await readFile(GAMEDATA);
const files = read(data,"ps4");

// for (const file of files){
//   console.log(file);
//   const path = decodeURIComponent(new URL(join("./world_data",file.name),import.meta.url).pathname);

//   await mkdir(dirname(path),{ recursive: true });
//   writeFile(path,new Uint8Array(await file.arrayBuffer()));
// }