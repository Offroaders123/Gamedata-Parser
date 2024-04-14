import { readdir } from "node:fs/promises";

const ps4Path = new URL("./ps4", import.meta.url);

const files: string[] = (await readdir(ps4Path)).filter(name => name.startsWith("GAMEDATA_"));
console.log(files);

const coordinateStrings: string[] = files.map(file => file.replace(/^GAMEDATA_/, ""));
console.log(coordinateStrings);

const coordinates: number[][] = coordinateStrings.map(string => [...new Int8Array(Buffer.from(string, "hex"))]);
console.log(coordinates);