import { BarData, HistogramData, Time } from 'lightweight-charts';

export function emptyCandles(startTs: number, endTs: number, interval: number, rate: number) {
  const rows: BarData[] = [];
  for (let i = 0; i <= Math.floor((endTs - startTs) / interval); i++) {
    const time = Math.floor(new Date(startTs + interval * i).getTime() / 1000);
    rows.push({
      close: rate,
      high: rate,
      low: rate,
      open: rate,
      time: time as Time,
    });
  }

  // console.log('synth candles start\t', new Date(+rows[0].time * 1000));
  // console.log('synth candles end\t', new Date(+rows[rows.length - 1].time * 1000));
  // console.log('synth candles length\t', rows.length);
  // console.log('');

  return rows;
}

export function emptyVolumes(startTs: number, endTs: number, interval: number) {
  const rows: HistogramData[] = [];
  for (let i = 0; i <= Math.floor((endTs - startTs) / interval); i++) {
    const time = Math.floor(new Date(startTs + interval * i).getTime() / 1000);
    rows.push({
      time: time as Time,
      value: 0,
      color: 'rgba(88, 189, 125, 0.5)',
    });
  }
  // console.log('synth vol start\t', new Date(+rows[0].time * 1000));
  // console.log('synth vol end\t', new Date(+rows[rows.length - 1].time * 1000));
  // console.log('synth vol length\t', rows.length);
  // console.log('');

  return rows;
}
