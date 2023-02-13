import { log } from '@ctocker/lib/build/main/src/log';
import stockConfigModel from '@ctocker/lib/build/main/src/models/stock-config.model';
import fullnodeEnviroment from '@ctocker/lib/build/main/src/services/blockchain/fullnode-enviroment';
import { currency, ExchangeConfig } from '@ctocker/lib/build/main/src/types/stock';
import BigNumber from 'bignumber.js';
import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import pdf from 'pdf-creator-node';

const html = fs.readFileSync(path.resolve(__dirname, 'pdf.template.html'), 'utf-8');

const options = {
  format: 'A4',
  orientation: 'portrait',
  border: '5mm',
  header: {
    height: '5mm',
  },
  footer: {
    height: '5mm',
  },
};
const stockPdfFileNameTemplate = 'stock-{{:id}}.pdf';

function mapFees(exchangeConfig: ExchangeConfig, cur: currency) {
  let takerFee;
  let makerFee;
  let refundFee;

  let takerFeeKind;
  let makerFeeKind;
  let refundFeeKind;

  if (exchangeConfig[cur].fees.takerFee.percent && exchangeConfig[cur].fees.takerFee.percent !== '0') {
    takerFee = +exchangeConfig[cur].fees.takerFee.percent * 100;
    takerFeeKind = '%';
  } else if (exchangeConfig[cur].fees.takerFee.fixed && exchangeConfig[cur].fees.takerFee.fixed !== '0') {
    takerFee = +exchangeConfig[cur].fees.takerFee.fixed;
    takerFeeKind = cur;
  }

  if (exchangeConfig[cur].fees.makerFee.percent && exchangeConfig[cur].fees.makerFee.percent !== '0') {
    makerFee = +exchangeConfig[cur].fees.makerFee.percent * 100;
    makerFeeKind = '%';
  } else if (exchangeConfig[cur].fees.makerFee.fixed && exchangeConfig[cur].fees.makerFee.fixed !== '0') {
    makerFee = exchangeConfig[cur].fees.makerFee.fixed;
    makerFeeKind = cur;
  }

  if (exchangeConfig[cur].fees.paybackFee.percent && exchangeConfig[cur].fees.paybackFee.percent !== '0') {
    refundFee = +exchangeConfig[cur].fees.paybackFee.percent * 100;
    refundFeeKind = '%';
  } else if (exchangeConfig[cur].fees.paybackFee.fixed && exchangeConfig[cur].fees.paybackFee.fixed !== '0') {
    refundFee = exchangeConfig[cur].fees.paybackFee.fixed;
    refundFeeKind = cur;
  }

  return {
    takerFeeKind,
    makerFeeKind,
    refundFeeKind,
    transactionFeeKind: cur?.toUpperCase?.(),
    takerFee,
    makerFee,
    refundFee,
    transactionFee: exchangeConfig[cur].fees.transactionFee || '0',
  };
}

export function useTermsPdf(staticDir) {
  return async (_req: Request, res: Response, _next: NextFunction) => {
    try {
      const fileName = 'ctocker-terms.pdf';
      const filePath = path.resolve(staticDir, fileName);
      if (fs.existsSync(filePath)) {
        res.status(200).sendFile(filePath);
      } else {
        const html = fs.readFileSync(path.resolve(__dirname, 'terms-pdf.template.html'), 'utf-8');
        const document = {
          html,
          data: {
            title: 'Ctoker',
          },
          path: path.resolve(process.cwd(), 'static', fileName),
        };
        await pdf.create(document, options);
        res.status(200).sendFile(filePath);
      }
    } catch (error) {
      console.error(error);
      res.status(500).end();
    }
  };
}

export default function usePdf(staticDir) {
  return async (req: Request, res: Response, _next: NextFunction) => {
    try {
      log.debug('usePdf:called');
      const stockId = req.params.id;
      log.debug('usePdf: stockId %s', stockId);
      if (!stockId) res.status(404).end();

      const fileName = stockPdfFileNameTemplate.replace('{{:id}}', stockId);
      const filePath = path.resolve(staticDir, fileName);

      log.debug('usePdf: filename %s, filepath %s', fileName, filePath);

      if (fs.existsSync(filePath)) {
        res.status(200).sendFile(filePath);
        log.debug('usePdf: responsed 200');
      } else {
        const stockConfigRecord = await stockConfigModel.getConfig(+stockId);
        const exchangeConfig = stockConfigRecord.config_json.exchangeConfig;
        const data = {
          title: stockConfigRecord.name,
          cur1: exchangeConfig.cur1.toUpperCase(),
          cur2: exchangeConfig.cur2.toUpperCase(),
          cur1OrderLifetimeMs: exchangeConfig[exchangeConfig.cur1].orderLifetimeMs,
          cur2OrderLifetimeMs: exchangeConfig[exchangeConfig.cur2].orderLifetimeMs,
          cur1Fees: mapFees(exchangeConfig, exchangeConfig.cur1),
          cur2Fees: mapFees(exchangeConfig, exchangeConfig.cur2),
          cur1Addresses: Object.entries(exchangeConfig[exchangeConfig.cur1].addresses).sort((a, b) => +b[1] - +a[1]),
          cur2Addresses: Object.entries(exchangeConfig[exchangeConfig.cur2].addresses).sort((a, b) => +b[1] - +a[1]),
          minOrderAmount1: new BigNumber(exchangeConfig[exchangeConfig.cur1].minInAmountFixed)
            .div(fullnodeEnviroment[exchangeConfig.cur1].MOJO_IN_COIN)
            .sd(String(fullnodeEnviroment[exchangeConfig.cur1].MOJO_IN_COIN).length - 1)
            .toFormat(),
          minOrderAmount2: new BigNumber(exchangeConfig[exchangeConfig.cur2].minInAmountFixed)
            .div(fullnodeEnviroment[exchangeConfig.cur2].MOJO_IN_COIN)
            .sd(String(fullnodeEnviroment[exchangeConfig.cur2].MOJO_IN_COIN).length - 1)
            .toFormat(),
        };
        log.debug('usePdf: data for pdf prepared');
        const document = {
          // phantomPath: path.resolve(process.cwd(), '..', '..', 'node_modules/phantomjs-prebuilt/bin/phantomjs'),
          html,
          data,
          path: path.resolve(process.cwd(), 'static', `stock-${stockId}.pdf`),
        };
        log.debug('usePdf: html template cretaed');
        await pdf.create(document, options);
        log.debug('usePdf: pdf created');
        res.status(200).sendFile(filePath);
        log.debug('usePdf: 200 responsed');
      }
    } catch (error) {
      log.debug('usePdf: error %O', error);
      console.error(error);
      res.status(500).end();
    }
  };
}
