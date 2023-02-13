import { log } from '@/log';
import knex from '@/utils/knex';
import autoBind from 'auto-bind';
import { Knex } from 'knex';

abstract class Model<Entity> {
  public tableName: string;

  constructor(tableName) {
    autoBind(this);
    this.tableName = tableName;
  }

  public entityToUpdateRow(entity: Entity): any {
    const entries = {};
    const row = this.entityToRow(entity);
    Object.keys(row || {})
      .filter((key) => entity[key] !== undefined)
      .forEach((key) => {
        if (key !== 'id') entries[key] = row[key];
      });

    return entries;
  }

  public async add(entities: Entity[], trx: Knex.Transaction = null): Promise<Entity[]> {
    if ((entities?.length || 0) < 1) return [];

    const rows = await (trx || knex)(this.tableName).insert(entities.filter(Boolean).map(this.entityToUpdateRow)).returning('*');

    return rows.map(this.rowToEntity);
  }

  public async update(id: number, entity: Entity, trx: Knex.Transaction = null): Promise<number[]> {
    const fn = trx || knex;
    if (!id || !entity) {
      log.debug('[WARNING] Attempt to update entity without id. Not performed. Entity: %O; id: %s', entity, id);
      return null;
    }
    return fn(this.tableName).update(this.entityToUpdateRow(entity), 'id').where({ id });
  }

  public async getById(id: number): Promise<Entity> {
    return this.rowToEntity((await knex(this.tableName).where({ id }).limit(1))?.[0]);
  }

  abstract entityToRow(entity: Entity): any;
  abstract rowToEntity(row: any): Entity;

  public avoidUndefined(obj: any): any {
    const filteredObj = {};
    Object.keys(obj).forEach((key) => {
      if (obj[key] !== undefined) filteredObj[key] = obj[key];
    });
    return filteredObj;
  }
}

export default Model;
