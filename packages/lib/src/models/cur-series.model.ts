import { log } from '@/log';
import { CurSeriesRecord, TimeBucket } from '@/types/stock';
import { getMonday } from '@/utils';
import knex from '@/utils/knex';
import autoBind from 'auto-bind';
import { Knex } from 'knex';

const min1 = 1000 * 60;
const h1 = min1 * 60;
const d1 = h1 * 24;
const w1 = d1 * 7;
const y1 = d1 * 365;

export const timeBucketToNumber: { [P in TimeBucket]: number } = {
  '1min': min1,
  '1h': h1,
  '1d': d1,
  '1w': w1,
};

export const timeBucketToPeriod: { [P in TimeBucket]: number } = {
  '1min': d1,
  '1h': 6 * w1,
  '1d': 5 * y1,
  '1w': 5 * y1,
};

const timeBucketToPeriodString: { [P in TimeBucket]: string } = {
  '1min': '1 days',
  '1h': '6 week',
  '1d': '5 year',
  '1w': '5 year',
};

const timeBucketToValue = {
  '1min': '1 minutes',
  '1h': '1 hour',
  '1d': '1 day',
  '1w': '1 week',
};

export function floorDate(date: Date, interval: TimeBucket): Date {
  const d = new Date(date);

  switch (interval) {
    case '1min': {
      d.setUTCMilliseconds(0);
      d.setUTCSeconds(0);
      return d;
    }

    case '1h': {
      d.setUTCMilliseconds(0);
      d.setUTCSeconds(0);
      d.setUTCMinutes(0);
      return d;
    }

    case '1d': {
      d.setUTCMilliseconds(0);
      d.setUTCSeconds(0);
      d.setUTCMinutes(0);
      d.setUTCHours(0);
      return d;
    }

    case '1w': {
      const monday = getMonday(d);
      monday.setUTCMilliseconds(0);
      monday.setUTCSeconds(0);
      monday.setUTCMinutes(0);
      monday.setUTCHours(0);
      return monday;
    }

    default:
      throw new Error(`given interval '${interval}' unsupported in floorDate`);
  }
}

class CurSeriesModel {
  constructor() {
    autoBind(this);
  }

  public async getLastRecordLaterDate(stockId: string, date: Date, timeBucket: TimeBucket): Promise<CurSeriesRecord> {
    const tableName = this.tableName(stockId, timeBucket);

    if (!date) return null;

    const sql = `
      SELECT
        time,
        opening_price,
        closing_price,
        highest_price,
        lowest_price,
        volume_1,
        volume_2
      FROM ${tableName}
      WHERE time < '${date.toISOString()}'
      ORDER BY time
      LIMIT 1
    `;
    const response = await knex.raw(sql);
    return (response.rows?.map?.(this.rowToEntity) || [])?.[0];
  }

  public async getLastDealPrice(stockId: string): Promise<string> {
    return (await knex(this.tableName(stockId, '1w')).select('closing_price').limit(1).orderBy('time', 'desc'))?.[0]?.['closing_price'];
  }

  public async getLastRow(stockId: string, timeBucket: TimeBucket, trx: Knex.Transaction): Promise<CurSeriesRecord> {
    const timeBucketValue = timeBucketToValue[timeBucket];

    if (!timeBucketValue) throw new Error(`timeBucket is incorrect. Recieved value: ${timeBucket}. Must be one of ${Object.keys(timeBucketToValue)}`);

    const tableName = this.tableName(stockId, timeBucket);

    let sql = `
      SELECT
        time,
        opening_price,
        closing_price,
        highest_price,
        lowest_price,
        volume_1,
        volume_2
      FROM ${tableName}
      ORDER BY time DESC
      LIMIT 1
    `;

    const response = await knex.raw(sql).transacting(trx);
    return (response.rows?.map?.(this.rowToEntity) || [])?.[0];
  }

  public async getSeries(stockId: string, timeBucket: TimeBucket, trx: Knex.Transaction = null): Promise<CurSeriesRecord[]> {
    const timeBucketValue = timeBucketToValue[timeBucket];
    const period = timeBucketToPeriodString[timeBucket];

    if (!timeBucketValue) throw new Error(`timeBucket is incorrect. Recieved value: ${timeBucket}. Must be one of ${Object.keys(timeBucketToValue)}`);

    const tableName = this.tableName(stockId, timeBucket);

    let sql = `
      SELECT
        time,
        opening_price,
        closing_price,
        highest_price,
        lowest_price,
        volume_1,
        volume_2
      FROM ${tableName}
      WHERE now() - time < INTERVAL '${period}'
      ORDER BY time
    `;

    const response = await (trx || knex).raw(sql);
    return response.rows?.map?.(this.rowToEntity) || [];
  }

  public async getLastDayRow(stockId: string): Promise<CurSeriesRecord> {
    const tableName = this.tableName(stockId, '1d');

    const response = await knex.raw(
      `SELECT
        time,
        opening_price,
        closing_price,
        highest_price,
        lowest_price,
        volume_1,
        volume_2,
        closing_price - opening_price  as diff,
        (closing_price / opening_price) / 100 as diff_percent
      FROM ${tableName}
      WHERE now() - time < INTERVAL '1 day'
      ORDER BY time DESC
      LIMIT 1`
    );
    const row = response?.rows?.[0];
    return (row && this.rowToEntity(row)) || null;
  }

  public async getLastDayChart(stockId: string): Promise<CurSeriesRecord[]> {
    const tableName = this.tableName(stockId, '1min');
    const period = '1 day';

    const response = await knex.raw(
      `SELECT time,
        opening_price,
        closing_price,
        highest_price,
        lowest_price,
        volume_1,
        volume_2,
        closing_price - opening_price  as diff,
        (closing_price / opening_price) / 100 as diff_percent
      FROM ${tableName}
      WHERE now() - time < INTERVAL '${period}'
      ORDER BY time`
    );
    return response?.rows?.map?.(this.rowToEntity);
  }

  public rowToEntity(row: any): CurSeriesRecord {
    return this.avoidUndefinedFlat({
      time: row.time ? new Date(row.time) : undefined,
      opening_price: String(row?.opening_price),
      highest_price: String(row?.highest_price),
      lowest_price: String(row?.lowest_price),
      closing_price: String(row?.closing_price),
      volume_1: String(row?.volume_1),
      volume_2: String(row?.volume_2),
      diff: String(row?.diff),
      diff_percent: String(row?.diff_percent),
    });
  }

  public entityToRow(entry: CurSeriesRecord): any {
    return this.avoidUndefinedFlat({
      time: entry.time,
      opening_price: entry?.opening_price,
      highest_price: entry?.highest_price,
      lowest_price: entry?.lowest_price,
      closing_price: entry?.closing_price,
      volume_1: entry?.volume_1,
      volume_2: entry?.volume_2,
    });
  }

  public async add(stockId: number, timeBucket: TimeBucket, records: CurSeriesRecord[], trx: Knex.Transaction = null): Promise<void> {
    if (process.env.LOG_LEVEL === 'debug') {
      records.forEach((record) => {
        log.debug('add new %s series record for stockId %s: %O', timeBucket, stockId, record);
      });
    }
    if (records.length < 1) return;
    await (trx || knex)(this.tableName(`${stockId}`, timeBucket)).insert(records);
  }

  public async update(stockId: number, timeBucket: TimeBucket, record: CurSeriesRecord, trx: Knex.Transaction = null): Promise<void> {
    log.debug('%s series updated for stockId %s with record %O', timeBucket, stockId, record);
    if (!record || !record.time) throw new Error(`CurSeriesRecord.time is not complete: ${JSON.stringify(record)}`);
    await (trx || knex)(this.tableName(`${stockId}`, timeBucket))
      .update(this.entityToRow(record))
      .where({ time: record.time });
  }

  public tableName(stockId: string, timeBucket: TimeBucket) {
    if (!stockId) throw new Error('stockId can not be empty');
    if (!timeBucket) throw new Error(`timeBucket is incorrect. Recieved value: ${timeBucket}. Must be one of ${Object.keys(timeBucketToValue)}`);

    return `timescale_stock_${stockId}_${timeBucket}`;
  }

  public async timescaleExists(stockId: string, timeBucket: TimeBucket): Promise<boolean> {
    const tableName = this.tableName(stockId, timeBucket);
    const response = await knex.raw(`SELECT id FROM _timescaledb_catalog.hypertable WHERE table_name = '${tableName}';`);
    return response.rows?.length > 0;
  }

  public avoidUndefinedFlat(obj: any): any {
    const filteredObj = {};
    Object.keys(obj).forEach((key) => {
      if (obj[key] !== undefined) filteredObj[key] = obj[key];
    });
    return filteredObj;
  }
}

export default new CurSeriesModel();
