import { promises as fs } from "fs";
import path from "path";
// import zlib from "zlib";

await CreatePS3UWorkingFile("./world/GAMEDATA");

async function CreatePS3UWorkingFile(inputFilePath){
  const filenameBytes = await LoadFilenames(inputFilePath);
  const bytes = await fs.readFile(inputFilePath);

  for (const data of filenameBytes){
    const data1 = decode(data,"utf-16be").split("\0")[0];
    console.log(`"${data1}"`);
    
    // console.log(data);

    // const source = path.join("./world_extracted",data1);
    // console.log(source);

    // await fs.mkdir(path.dirname(source),{ recursive: true });
    // await fs.writeFile(source,"placeholder hehe");
  }
}

async function LoadFilenames(inputFilePath){
  const data = await fs.readFile(inputFilePath);
  const slice = data.slice(0,4);
  const view = new DataView(slice.buffer);
  const offset = view.getInt32();

  const names = data.slice(offset);
  const chunks = chunk(names,144);

  return chunks;
}

function endianReverseUnicode(buffer){
  const result = Buffer.alloc(buffer.length);
  for (let i = 0; i < buffer.length; i += 2){
    result[i] = buffer[i + 1];
    result[i + 1] = buffer[i];
  }
  return result;
}

function chunk(array,size){
  const result = [];
  for (let i = 0; i < array.length; i += size){
    result.push(array.slice(i,i + size));
  }
  return result;
}

function encode(string){
  return new TextEncoder().encode(string);
}

function decode(buffer,encoding){
  return new TextDecoder(encoding).decode(buffer);
}