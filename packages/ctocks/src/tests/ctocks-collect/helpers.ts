import _omit from 'lodash/omit';

export function omitFields(data) {
  return data.map(item =>
    _omit(item, [
      'id',
      'created_at',
      'updated_at',
      'expires_at',
      'income_id',
      'stock_id',
      'order1_id',
      'order2_id',
      'order_id',
      'deal_id',
      'time',
      'diff',
      'diff_percent',
    ]),
  );
}

export function ids(rows: any[]) {
  return rows.map(item => item.id);
}
