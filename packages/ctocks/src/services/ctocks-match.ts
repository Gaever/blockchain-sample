import { log } from '@ctocker/lib/build/main/src/log';
import curSeriesModel, { floorDate, timeBucketToNumber } from '@ctocker/lib/build/main/src/models/cur-series.model';
import BrokerMatch from '@ctocker/lib/build/main/src/services/broker/broker-match';
import { CurSeriesElements, CurSeriesRecord, Deal, Match, Order, TimeBucket } from '@ctocker/lib/build/main/src/types/stock';
import BigNumber from 'bignumber.js';
import { Knex } from 'knex';
import _first from 'lodash/first';
import _last from 'lodash/last';

class CtocksMatch extends BrokerMatch {
  protected async saveOneNewOrderMatch(newOrder: Order, trx: Knex.Transaction): Promise<Match> {
    log.debug('saveOneNewOrderMatch call');
    const match = await super.saveOneNewOrderMatch(newOrder, trx);

    const lastSeriesElements = await this.fetchLastSeriesElements(String(this.stock.id), trx);
    await this.saveDealsPriceHistory(this.stock.id, match.newDeals, lastSeriesElements, trx);

    return match;
  }

  public async saveDealsPriceHistory(stockId: number, newDeals: Deal[], lastSeriesElements: CurSeriesElements, trx: Knex.Transaction) {
    log.debug('saveDealsPriceHistory call');

    const series = CtocksMatch.dealsToSeries(newDeals, lastSeriesElements);
    await Promise.all([
      curSeriesModel.add(stockId, '1min', series.toAdd.minutes, trx),
      curSeriesModel.add(stockId, '1h', series.toAdd.hours, trx),
      curSeriesModel.add(stockId, '1d', series.toAdd.days, trx),
      curSeriesModel.add(stockId, '1w', series.toAdd.weeks, trx),
    ]);

    log.debug('series to add and to update %O', series);

    for (const record of series.toUpdate.minutes) {
      await curSeriesModel.update(stockId, '1min', record, trx);
    }
    for (const record of series.toUpdate.hours) {
      await curSeriesModel.update(stockId, '1h', record, trx);
    }
    for (const record of series.toUpdate.days) {
      await curSeriesModel.update(stockId, '1d', record, trx);
    }
    for (const record of series.toUpdate.weeks) {
      await curSeriesModel.update(stockId, '1w', record, trx);
    }
  }

  private async fetchLastSeriesElements(stockId: string, trx: Knex.Transaction): Promise<CurSeriesElements> {
    log.debug('fetchLastSeriesElements call');

    const lastMinute = await curSeriesModel.getLastRow(stockId, '1min', trx);
    const lastHour = await curSeriesModel.getLastRow(stockId, '1h', trx);
    const lastDay = await curSeriesModel.getLastRow(stockId, '1d', trx);
    const lastWeek = await curSeriesModel.getLastRow(stockId, '1w', trx);

    return {
      minutes: lastMinute ? [lastMinute] : [],
      hours: lastHour ? [lastHour] : [],
      days: lastDay ? [lastDay] : [],
      weeks: lastWeek ? [lastWeek] : [],
    };
  }

  public static dealsToSeries(deals: Deal[], lastElements: CurSeriesElements): { toAdd: CurSeriesElements; toUpdate: CurSeriesElements } {
    log.debug('dealsToSeries call');

    const { byMinutes, byHours, byDays, byWeeks } = CtocksMatch.dealsToTimeArrays(deals);

    const curSeriesMinutes = CtocksMatch.timeArrayToCurSeriesRecords(byMinutes, '1min', lastElements.minutes?.[0]);
    const curSeriesHours = CtocksMatch.timeArrayToCurSeriesRecords(byHours, '1h', lastElements.hours?.[0]);
    const curSeriesDays = CtocksMatch.timeArrayToCurSeriesRecords(byDays, '1d', lastElements.days?.[0]);
    const curSeriesWeeks = CtocksMatch.timeArrayToCurSeriesRecords(byWeeks, '1w', lastElements.weeks?.[0]);

    return {
      toAdd: {
        minutes: curSeriesMinutes.toAdd,
        hours: curSeriesHours.toAdd,
        days: curSeriesDays.toAdd,
        weeks: curSeriesWeeks.toAdd,
      },
      toUpdate: {
        minutes: curSeriesMinutes.toUpdate,
        hours: curSeriesHours.toUpdate,
        days: curSeriesDays.toUpdate,
        weeks: curSeriesWeeks.toUpdate,
      },
    };
  }

  public static timeArrayToCurSeriesRecords(
    timeArray: Deal[][],
    interval: TimeBucket,
    lastElement?: CurSeriesRecord,
  ): { toAdd: CurSeriesRecord[]; toUpdate: CurSeriesRecord[] } {
    log.debug('timeArrayToCurSeriesRecords call');

    const toAdd: CurSeriesRecord[] = [];
    let toUpdate: CurSeriesRecord;

    timeArray.forEach(deals => {
      const openingDeal = deals[0];
      const closingDeal = _last(deals);
      const time = floorDate(openingDeal.created_at, interval);

      let cur1Amounts: BigNumber[] = [];
      let cur2Amounts: BigNumber[] = [];
      let rates: BigNumber[] = [];

      deals.forEach(deal => {
        cur1Amounts.push(deal.buyer_amount_in_cur1);
        cur2Amounts.push(deal.seller_amount_in_cur2);
        rates.push(deal.rate);
      });

      const item: CurSeriesRecord = {
        time,
        opening_price: openingDeal.rate.toString(),
        highest_price: BigNumber.max.apply(null, rates).toString(),
        lowest_price: BigNumber.min.apply(null, rates).toString(),
        closing_price: closingDeal.rate.toString(),
        volume_1: BigNumber.sum.apply(null, cur1Amounts).toString(),
        volume_2: BigNumber.sum.apply(null, cur2Amounts).toString(),
      };

      if (lastElement?.time?.getTime?.() >= item.time.getTime()) {
        const newToUpdate = toUpdate || lastElement;

        newToUpdate.highest_price = new BigNumber(item.highest_price).gt(newToUpdate.highest_price) ? item.highest_price : newToUpdate.highest_price;
        newToUpdate.lowest_price = new BigNumber(item.lowest_price).lt(newToUpdate.lowest_price) ? item.lowest_price : newToUpdate.lowest_price;
        newToUpdate.closing_price = item.closing_price;
        newToUpdate.volume_1 = new BigNumber(newToUpdate.volume_1).plus(new BigNumber(item.volume_1)).toString();
        newToUpdate.volume_2 = new BigNumber(newToUpdate.volume_2).plus(new BigNumber(item.volume_2)).toString();
        toUpdate = { ...newToUpdate };
      } else {
        toAdd.push(item);
      }
    });

    return { toAdd, toUpdate: toUpdate ? [toUpdate] : [] };
  }

  public static addToTimeArray(timeArray: Deal[][], element: Deal, interval: TimeBucket) {
    log.debug('addToTimeArray call');

    const t1 = element?.created_at?.getTime?.();
    const first = new Date(_first(_last(timeArray))?.created_at?.getTime() || 0);
    const t2 = first ? floorDate(first, interval).getTime() : null;
    const dt = t1 - t2;

    if (!timeArray.length || dt >= timeBucketToNumber[interval]) {
      timeArray.push([element]);
    } else {
      _last(timeArray).push(element);
    }
  }

  public static dealsToTimeArrays(elements: Deal[]): { byMinutes: Deal[][]; byHours: Deal[][]; byDays: Deal[][]; byWeeks: Deal[][] } {
    log.debug('dealsToTimeArrays call');

    const byMinutes: Deal[][] = [];
    const byHours: Deal[][] = [];
    const byDays: Deal[][] = [];
    const byWeeks: Deal[][] = [];

    elements
      .sort((a, b) => a.id - b.id)
      .forEach(element => {
        CtocksMatch.addToTimeArray(byMinutes, element, '1min');
        CtocksMatch.addToTimeArray(byHours, element, '1h');
        CtocksMatch.addToTimeArray(byDays, element, '1d');
        CtocksMatch.addToTimeArray(byWeeks, element, '1w');
      });

    return {
      byMinutes,
      byHours,
      byDays,
      byWeeks,
    };
  }
}

export default CtocksMatch;
