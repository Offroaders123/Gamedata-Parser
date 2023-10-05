import { readFile, writeFile, readdir, mkdir, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readGamedata, readRegion } from "../src/index.js";

const WORLD = new URL("./ps4",import.meta.url);

async function walk(dir: string | URL): Promise<File[]> {
  const root = fileURLToPath(dir);
  const entries = await readdir(dir,{ recursive: true });
  const files = await Promise.all((await Promise.all(entries
      .map(async entry => [await stat(join(root,entry)),entry] as const)))
    .filter(([stats]) => stats.isFile())
    .map(async ([stats,entry]) => new File([await readFile(join(root,entry))],entry,{ lastModified: stats.mtimeMs })));
  return files;
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