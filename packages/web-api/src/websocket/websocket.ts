import mock from '@/mock/mock';
import { log } from '@ctocker/lib/build/main/src/log';
import { eventsDict, StockChartData } from '@ctocker/lib/build/main/src/types/stock';
import { Server } from 'http';
import schedule from 'node-schedule';
import { Server as WebsocketServer, Socket } from 'socket.io';
import fetchChartData from './chart-data/fetch-chart-data';
import fetchStockList from './fetch-stock-list';
import registerStockHandler from './stock-handler';
import registerStockListHandler from './stock-list-handler';
import { parseRoom } from './utils';

async function updateCharts(io: WebsocketServer) {
  for (const room of Array.from(io.sockets.adapter.rooms.keys())) {
    const [prefix, stockId, timeBucket, timezoneOffset, flip] = parseRoom(room);

    if (!stockId || !timeBucket || prefix !== 'chart') continue;

    if (process.env.MOCK) {
      const chartData: StockChartData = mock['ws:app-data'];

      io.to(room).emit(eventsDict['app-data'], chartData);
    } else {
      const chartData: StockChartData = await fetchChartData(stockId, timeBucket, timezoneOffset, flip);
      log.debug('room %s', room);

      io.to(room).emit(eventsDict['app-data'], chartData);
    }
  }
}

async function updateStockList(io: WebsocketServer) {
  for (const room of Array.from(io.sockets.adapter.rooms.keys())) {
    const [prefix] = parseRoom(room);

    if (prefix !== 'stock-list') continue;
    if (process.env.MOCK) {
      const stockList = mock['ws:stock-list'];

      io.to(room).emit(eventsDict['stock-list'], stockList);
    } else {
      const stockList = await fetchStockList();

      io.to(room).emit(eventsDict['stock-list'], stockList);
    }
  }
}

export default (server: Server) => {
  const io = new WebsocketServer(server, {
    cors: {
      origin: '*',
    },
  });

  const onConnection = (socket: Socket) => {
    log.debug('new ws connection');
    registerStockHandler(io, socket);
    registerStockListHandler(io, socket);
  };
  io.on('connection', onConnection);

  schedule
    .scheduleJob('*/5 * * * * *', async () => {
      try {
        await Promise.all([updateCharts(io), updateStockList(io)]);
      } catch (error) {
        console.error(error);
      }
    })
    .invoke();
};
