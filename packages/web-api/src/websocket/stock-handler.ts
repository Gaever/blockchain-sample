import { fetchStockList } from '@/controller/stock';
import mock from '@/mock/mock';
import { log } from '@ctocker/lib/build/main/src/log';
import { eventsDict, ListenStockReq, TimeBucket } from '@ctocker/lib/build/main/src/types/stock';
import { Server, Socket } from 'socket.io';
import fetchChartData from './chart-data/fetch-chart-data';
import { chartRoom, emitError, parseRoom } from './utils';

function isValidTimeBucket(timeBucket: TimeBucket) {
  return ['1min', '1h', '1d', '1w'].includes(timeBucket);
}

export default function stockHandler(_io: Server, socket: Socket) {
  async function subscribeStock({ stockId, timeBucket, timezoneOffset, flip }: ListenStockReq) {
    if (process.env.MOCK) {
      socket.emit(eventsDict['app-data'], mock['ws:app-data']);

      return;
    }

    log.debug('subscribeStock call stock id: %s, time bucket: %s, timezone offset: %s, flip: %s', stockId, timeBucket, timezoneOffset, flip);
    const existStocks = await fetchStockList();
    if (!existStocks.find(existStock => String(existStock.id) === stockId)) {
      emitError(socket, 'wrong pair');
    } else if (!isValidTimeBucket(timeBucket)) {
      emitError(socket, 'wrong time bucket');
    } else {
      socket.rooms.forEach(room => {
        const [prefix] = parseRoom(room);
        if (prefix === 'chart') socket.leave(room);
      });
      socket.join(chartRoom(stockId, timeBucket, timezoneOffset, flip));

      const chartData = await fetchChartData(stockId, timeBucket, timezoneOffset, flip);

      log.debug('emit app-data event');
      socket.emit(eventsDict['app-data'], chartData);
    }
  }

  socket.on(eventsDict['subscribe-stock'], subscribeStock);
}
