import { readFile, writeFile, readdir, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { readGamedata, readRegion } from "../src/index.js";

// const GAMEDATA = new URL("./ps4/GAMEDATA",import.meta.url);

const REGIONS = (await readdir(new URL("./ps4",import.meta.url),{ withFileTypes: true }))
  .filter(entry => entry.isFile() && /^GAMEDATA_/.test(entry.name))
  .map(entry => new URL(join("./ps4",entry.name),import.meta.url));

// const data = await readFile(GAMEDATA);
// const files = readGamedata(data,"ps4");

// for (const file of files){
//   console.log(file);
//   const path = decodeURIComponent(new URL(join("./world_data",file.name),import.meta.url).pathname);

//   await mkdir(dirname(path),{ recursive: true });
//   writeFile(path,new Uint8Array(await file.arrayBuffer()));
// }

const regionData = await Promise.all(REGIONS.map(entry => readFile(entry)));
const regionFiles = regionData.map(readRegion);

for (const region of regionFiles){
  // console.log(region);
}