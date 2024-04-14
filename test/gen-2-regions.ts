import { join } from "node:path";
import { type Region, readRegion } from "../../MCRegionJS/src/index.js";
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const ps4Path: string = fileURLToPath(new URL("./ps4", import.meta.url));

const filePaths: string[] = (await readdir(ps4Path)).filter(name => name.startsWith("GAMEDATA_"));
console.log(filePaths);

// const coordinateStrings: string[] = filePaths.map(file => file.replace(/^GAMEDATA_/, ""));
// console.log(coordinateStrings);

// const coordinates: number[][] = coordinateStrings.map(string => [...new Int8Array(Buffer.from(string, "hex"))]);
// console.log(coordinates);

const files: Buffer[] = await Promise.all(filePaths.map(path => readFile(join(ps4Path, path))));
console.log(files);

const regions: (Region | Error)[] = files.map(file => {
  try {
    return readRegion(file);
  } catch (error){
    return error as Error;
  }
});
console.log(regions);