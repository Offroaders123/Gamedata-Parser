// @ts-check

import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as GD from "../src/index.js";

const data = await fs.readFile(new URL("./world/GAMEDATA",import.meta.url));

const files = GD.read(data);

for (const [name,data] of files){
  const pathname = decodeURIComponent(new URL(path.join("./world_data",name),import.meta.url).pathname);
  console.log(name);
  await fs.mkdir(path.dirname(pathname),{ recursive: true });
  await fs.writeFile(pathname,data);
}