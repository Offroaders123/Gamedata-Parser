import { readFile, writeFile, readdir, mkdir, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { readGamedata, readRegion } from "../src/index.js";

const WORLD = decodeURIComponent(new URL("./ps4",import.meta.url).pathname);

const oldFilter = Array.prototype.filter;

declare global {
  interface Array<T> {
    asyncFilter(...args: Parameters<typeof Array.prototype.filter>): Promise<T[]>;
  }
}

Array.prototype.asyncFilter = async function(...args: Parameters<typeof Array.prototype.filter>){
  const result = oldFilter.call(this,...args);
  await Promise.all(result);
  return result;
};

async function walk(dir: string) {
  const entries = (await readdir(dir,{ recursive: true })).asyncFilter(async entry => {
    const path = join(dir,entry);
    const stats = await stat(path);
    console.log(stats.isDirectory());
    return stats.isFile();
  });
  return entries;
}

const files = await walk(WORLD);
console.log(files);

// const files = await readdir(WORLD,{ recursive: true })
//   .then(entries => 
//     Promise.all(entries
//       .filter(entry => entry.isFile())
//       .map(async ({ name, path }) => {
//         const pathname = join(path,name);
//         const buffer = await readFile(pathname);
//         return new File([buffer],pathname.split("ps4/").pop()!);
//       })
//   ));
// console.log(files);

// const GAMEDATA = new URL("./ps4/GAMEDATA",import.meta.url);

// const REGIONS = (await readdir(new URL("./ps4",import.meta.url),{ withFileTypes: true }))
//   .filter(entry => entry.isFile() && /^GAMEDATA_/.test(entry.name))
//   .map(entry => new URL(join("./ps4",entry.name),import.meta.url));

// const data = await readFile(GAMEDATA);
// const files = readGamedata(data,"ps4");

// for (const file of files){
//   console.log(file);
//   const path = decodeURIComponent(new URL(join("./world_data",file.name),import.meta.url).pathname);

//   await mkdir(dirname(path),{ recursive: true });
//   writeFile(path,new Uint8Array(await file.arrayBuffer()));
// }

// const regionData = await Promise.all(REGIONS.map(entry => readFile(entry)));
// const regionFiles = regionData.map(readRegion);

// for (const region of regionFiles){
//   // console.log(region);
// }