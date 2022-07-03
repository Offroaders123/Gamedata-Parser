import { promises as fs } from "fs";
import path from "path";
import GD from "../src/index.js";

const data = await fs.readFile("./test/world/GAMEDATA");

const files = GD.read(data);

for (const [name,data] of files){
  const pathname = path.join("./test/world_data",name);
  console.log(name);
  await fs.mkdir(path.dirname(pathname),{ recursive: true });
  await fs.writeFile(pathname,data);
}