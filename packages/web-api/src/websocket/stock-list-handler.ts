import mock from '@/mock/mock';
import { eventsDict } from '@ctocker/lib/build/main/src/types/stock';
import { Server, Socket } from 'socket.io';
import fetchStockList from './fetch-stock-list';
import { stockListRoom } from './utils';

export default function stockListHandler(_io: Server, socket: Socket) {
  async function subscribeStockList() {
    if (process.env.MOCK) {
      socket.emit(eventsDict['stock-list'], mock['ws:stock-list']);

      return;
    }

    socket.rooms.forEach(room => {
      if (room === stockListRoom()) socket.leave(room);
    });
    socket.join(stockListRoom());

    const stockList = await fetchStockList();
    socket.emit(eventsDict['stock-list'], stockList);
  }

  socket.on(eventsDict['subscribe-stock-list'], subscribeStockList);
}
