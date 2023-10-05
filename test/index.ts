import { getOriginPrivateDirectory, support } from "file-system-access";
import { readGamedata, readRegion } from "../src/index.js";

const WORLD = new URL("./ps4",import.meta.url);

console.log(support);

const world = await getOriginPrivateDirectory(import("file-system-access/lib/adapters/node.js"),decodeURIComponent(WORLD.pathname));

for await (const [,file] of world){
  console.log(file);
}