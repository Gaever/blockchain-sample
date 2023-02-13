import { TimeBucket } from '@ctocker/lib/build/main/src/types/stock';
import { Socket } from 'socket.io';

export function emitError(socket: Socket, message: string) {
  socket.emit('error', new Error(message));
}

export const chartRoom = (stockId: string, timeBucket: TimeBucket, timezoneOffset: number = 0, flip: boolean = false) =>
  `chart:${stockId}:${timeBucket}:${timezoneOffset}${flip ? ':flip' : ''}`;

export const stockListRoom = () => `stock-list`;

export const parseRoom = (room: string): [string, string, TimeBucket, number, boolean] => {
  const [prefix, stockId, timeBucket, timezoneOffset, flip] = room.split(':');
  return [prefix, stockId, timeBucket as TimeBucket, +timezoneOffset, !!flip];
};
