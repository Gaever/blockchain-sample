import loadBLS from '@chiamine/bls-signatures';
import BigNumber from 'bignumber.js';
import fs from 'fs';
import { address_to_puzzle_hash, puzzle_hash_to_address } from './puzzle-hash';

export function getRandomInt(min, max): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function getRandomUniqueInts(min: number, max: number, range: number): number[] {
  const arr = [];
  while (arr.length < range) {
    const r = getRandomInt(min, max);
    if (arr.indexOf(r) === -1) arr.push(r);
  }
  return arr;
}

export function puzzleHashToAddress(puzzleHash: string, prefix: string) {
  return puzzle_hash_to_address(puzzleHash, prefix);
}

export function addressToPuzzleHash(address: string) {
  return address_to_puzzle_hash(address);
}

let bls;
export async function BLS() {
  if (!bls) bls = await loadBLS();
  return bls;
}

export function moduloWithNeg(a: bigint, b: bigint): bigint {
  return ((a % b) + b) % b;
}

export function configBigNumber() {
  BigNumber.config({ EXPONENTIAL_AT: 1e9 });
}

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

export function range(size: number, startAt = 0) {
  return Array.from(Array(size).keys()).map((i) => i + startAt);
}

export function getMonday(d: Date) {
  const week1 = 7 * 24 * 60 * 60 * 1000;
  const startMonday = new Date('2021-01-04T00:00:00.000Z');

  return new Date(startMonday.getTime() + Math.floor((d.getTime() - startMonday.getTime()) / week1) * week1);
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
