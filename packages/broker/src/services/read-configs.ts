import { KeyStorage } from '@ctocker/lib/build/main/src/types/blockchain';
import fs from 'fs';

export function readJson<T>(src): Promise<T> {
  return new Promise((resolve, reject) => {
    fs.readFile(src, 'utf8', async function (err, json) {
      try {
        if (err) throw err;
        resolve(JSON.parse(json) as T);
      } catch (error) {
        reject(error);
      }
    });
  });
}

export async function readKeyStorage(filePath: string): Promise<KeyStorage> {
  if (!filePath) throw new Error('key_storage path');
  try {
    return readJson<KeyStorage>(filePath);
  } catch (error) {
    console.error(error);
    process.exit();
  }
}
