import { Coin } from '@/types/blockchain';
import { Bytes } from 'clvm';
import * as clvmTools from 'clvm_tools';

export const ConditionOpcode = {
  AGG_SIG_UNSAFE: 49,
  AGG_SIG_ME: 50,
  CREATE_COIN: 51,
  RESERVE_FEE: 52,
  CREATE_COIN_ANNOUNCEMENT: 60,
  ASSERT_COIN_ANNOUNCEMENT: 61,
  CREATE_PUZZLE_ANNOUNCEMENT: 62,
  ASSERT_PUZZLE_ANNOUNCEMENT: 63,
  ASSERT_MY_COIN_ID: 70,
  ASSERT_MY_PARENT_ID: 71,
  ASSERT_MY_PUZZLEHASH: 72,
  ASSERT_MY_AMOUNT: 73,
  ASSERT_SECONDS_RELATIVE: 80,
  ASSERT_SECONDS_ABSOLUTE: 81,
  ASSERT_HEIGHT_RELATIVE: 82,
  ASSERT_HEIGHT_ABSOLUTE: 83,
};

export function makeCreateCoinCondition(puzzleHash: string, amount: bigint): [number, string, bigint] {
  return [ConditionOpcode.CREATE_COIN, puzzleHash, amount];
}

export function makeAssertAggsigCondition(pubkey: string): [number, string] {
  return [ConditionOpcode.AGG_SIG_UNSAFE, `0x${pubkey}`];
}

export function makeAssertMyCoinIdCondition(coin_name) {
  return [ConditionOpcode.ASSERT_MY_COIN_ID, coin_name];
}

export function makeAssertAbsoluteHeightExceedsCondition(blockIndex) {
  return [ConditionOpcode.ASSERT_HEIGHT_ABSOLUTE, blockIndex];
}

export function makeAssertRelativeHeightExceedsCondition(blockIndex) {
  return [ConditionOpcode.ASSERT_HEIGHT_RELATIVE, blockIndex];
}

export function makeAssertAbsoluteSecondsExceedsCondition(time) {
  return [ConditionOpcode.ASSERT_SECONDS_ABSOLUTE, time];
}

export function makeAssertRelativeSecondsExceedsCondition(time) {
  return [ConditionOpcode.ASSERT_SECONDS_RELATIVE, time];
}

export function makeReserveFeeCondition(fee: bigint): [number, bigint] {
  return [ConditionOpcode.RESERVE_FEE, fee];
}

export function makeAssertCoinAnnouncement(announcementHash) {
  return [ConditionOpcode.ASSERT_COIN_ANNOUNCEMENT, `0x${announcementHash}`];
}

export function makeAssertPuzzleAnnouncement(announcementHash: string): [number, string] {
  return [ConditionOpcode.ASSERT_PUZZLE_ANNOUNCEMENT, `0x${announcementHash}`];
}

export function makeCreateCoinAnnouncement(message: string): [number, string] {
  return [ConditionOpcode.CREATE_COIN_ANNOUNCEMENT, `0x${message}`];
}

export function makeCreatePuzzleAnnouncement(message) {
  return [ConditionOpcode.CREATE_PUZZLE_ANNOUNCEMENT, message];
}

export function makeAssertMyParentId(parentId) {
  return [ConditionOpcode.ASSERT_MY_PARENT_ID, parentId];
}

export function makeAssertMyPuzzlehash(puzzlehash) {
  return [ConditionOpcode.ASSERT_MY_PUZZLEHASH, puzzlehash];
}

export function makeAssertMyAmount(amount) {
  return [ConditionOpcode.ASSERT_MY_AMOUNT, amount];
}

export function bigintToBytes(amount: bigint): Uint8Array {
  const buffer = new ArrayBuffer(8);
  new DataView(buffer).setBigUint64(0, amount, false);
  let r = new Uint8Array(buffer);
  while (r.length > 1 && r[0] === (r[1] & 0x80 ? 0xff : 0)) {
    const _r = Array.from(r);
    const sliced = _r.slice(1, _r.length);
    r = new Uint8Array(sliced);
  }

  return r;
}

export function getCoinName(coin: Coin): Uint8Array {
  return Bytes.SHA256(
    new Uint8Array([...Bytes.from(coin.parent_coin_info, 'hex').raw(), ...Bytes.from(coin.puzzle_hash, 'hex').raw(), ...bigintToBytes(BigInt(coin.amount))])
  ).raw();
}

export function extractJsonFromSolution(solution: string): string {
  let url: string = '';

  clvmTools.setPrintFunction((...messages: any[]) => {
    const msg = messages?.[0] as string;
    const matches1 = msg?.match(/^\(\((.*)\)\s\((.*)\)\s\((.*)\)\s\((.*)\)\s\((.*)\)\s\((.*)\)\)$/);
    const matches2 = msg?.match(/^\(\((.*)\)\s\((.*)\)\s\((.*)\)\s\((.*)\)\)$/);
    const matchStr = matches1?.[matches1?.length - 1] || matches2?.[matches2?.length - 1] || '';
    url = matchStr.substring(1, matchStr.length - 1);
  });

  clvmTools.opd(['path_or_code', solution]);

  return url;
}
