import { join } from "node:path";
import { type Region, readRegion } from "../../MCRegionJS/src/index.js";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { inflate } from "node:zlib";
import { promisify } from "node:util";

const ps4Path: string = fileURLToPath(new URL("./ps4", import.meta.url));

const filePaths: string[] = (await readdir(ps4Path)).filter(name => name.startsWith("GAMEDATA_"));
console.log(filePaths);

// const coordinateStrings: string[] = filePaths.map(file => file.replace(/^GAMEDATA_/, ""));
// console.log(coordinateStrings);

// const coordinates: number[][] = coordinateStrings.map(string => [...new Int8Array(Buffer.from(string, "hex"))]);
// console.log(coordinates);

const files: [string, Buffer][] = await Promise.all(filePaths.map(async path => [join(ps4Path, path), await readFile(join(ps4Path, path))]));
console.log(files);

// const regions: (Region | Error)[] = files.map(file => {
//   try {
//     return readRegion(file);
//   } catch (error){
//     return error as Error;
//   }
// });
// console.log(regions);

const regions2: [string, Buffer | null][] = await Promise.all(files.map(async ([name, file]) => {
  let i = 0;
  while (i < file.byteLength){
    try {
      return [name, await promisify(inflate)(file.subarray(i))];
    } catch {
      i++;
    }
  }
  console.log(name, i);
  return [name, null];
}));
console.log(regions2);

for (const [name, file] of regions2){
  await writeFile(`${name}.two`, file ?? []);
}