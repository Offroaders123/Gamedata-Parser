import { describe, it } from "node:test";
// import { strictEqual } from "node:assert";
import { readFile } from "node:fs/promises";
import { readGamedata } from "../src/index.js";

import type { Platform } from "../src/index.js";

const paths: [Platform, string][] = [
  // ["xbox-360", "./xbox-360/savegame-decompressed.dat"],
  ["ps3", "./ps3/GAMEDATA"],
  // ["wii-u", "./wii-u/savegame-decompressed.wii"],
  // ["ps4", "./ps4/GAMEDATA"]
];

const files: [Platform, File][] = await Promise.all(
  paths.map(async ([platform, path]) =>
    [platform, new File([await readFile(new URL(path, import.meta.url))], path)]
  )
);

describe("Parse Gamedata", () => {
  for (const [platform, gamedata] of files){
    it(platform, async () => {
      const data = new Uint8Array(await gamedata.arrayBuffer());
      const files = await readGamedata(data, platform);

      for (const file of files){
        console.log(Array(8 - file.size.toString().length).fill(" ").join(""), file.size, file.name);
      }

      // const recompile = await writeGamedata(files, platform);

      // const compare = Buffer.compare(data, recompile);
      // strictEqual(compare, 0, `'${gamedata.name}' does not symmetrically recompile`);
    });
  }
});