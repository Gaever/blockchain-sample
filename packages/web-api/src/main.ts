// organize-imports-ignore
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

import cors from 'cors';
import express from 'express';
import fs from 'fs';
import { createServer } from 'http';
import morgan from 'morgan';
import path from 'path';
import addressController from './controller/addresses';
import rateController from './controller/rate';
import stockController from './controller/stock';
import usePdf, { useTermsPdf } from './controller/use-pdf';
import validateEnv from './utils/validate-env';
import websocket from './websocket/websocket';
import { log } from '@ctocker/lib/build/main/src/log';
import { configBigNumber } from '@ctocker/lib/build/main/src/utils';

log.debug('Start with DEBUG LOGS');

validateEnv();
configBigNumber();

const app = express();
app.use(morgan('tiny'));
app.use(cors());

const httpServer = createServer(app);
const websocketServer = createServer();

const staticDir = process.env.STATIC_PATH || path.resolve(process.cwd(), 'static');
if (!fs.existsSync(staticDir)) fs.mkdirSync(staticDir);

const httpPort = parseInt(process.env.HTTP_PORT || '4000');
const httpHostname = process.env.HOST || 'localhost';
const wsPort = parseInt(process.env.WEBSOCKET_PORT || '4050');
const wsHostname = process.env.HOST || 'localhost';

app.get('/api/rate', rateController);
// deprecated
app.get('/api/addresses', addressController);
app.get('/api/stock/list', stockController);
app.get('/api/stock/:id/pdf', usePdf(staticDir));
app.get('/api/pdf/ctocker-terms.pdf', useTermsPdf(staticDir));
app.get('*', (_req, res) => {
  res.json({ error: 'not_found' });
});

async function main() {
  try {
    websocket(websocketServer);
    httpServer.listen(httpPort, httpHostname, () => {
      console.log(`http listening at http://${httpHostname}:${httpPort}`);
    });
    websocketServer.listen(wsPort, wsHostname, () => {
      console.log(`ws listening at ws://${wsHostname}:${wsPort}`);
    });
  } catch (error) {
    console.error(error);
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});

process.on('unhandledRejection', error => {
  console.error('unhandledRejection', error);
  console.log('exit now');
  process.exit(1);
});

process.on('exit', () => {
  // pm2 бесконечно перезапускает процесс он завершился без exit code или с exit code = 0.
  process.exit(1);
});
