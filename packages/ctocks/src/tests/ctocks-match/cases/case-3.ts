import moment from 'moment';
import { createDeal, TestCase } from '../helpers';

export default {
  _in: {
    deals: [
      createDeal(moment('2021-12-24 20:05:30+0000').toDate(), '50', '200', '100'),
      createDeal(moment('2021-12-24 20:06:40+0000').toDate(), '60', '200', '100'),

      createDeal(moment('2021-12-24 21:06:40+0000').toDate(), '5', '200', '100'),

      createDeal(moment('2021-12-25 21:06:40+0000').toDate(), '60', '200', '100'),

      createDeal(moment('2021-12-28 21:06:40+0000').toDate(), '20', '200', '100'),
    ],
    lastElements: {
      minutes: [
        {
          time: moment('2021-12-24 20:05:00+0000').toDate(),
          opening_price: '10',
          closing_price: '10',
          highest_price: '10',
          lowest_price: '10',
          volume_1: '300',
          volume_2: '600',
        },
      ],
      hours: [
        {
          time: moment('2021-12-24 20:00:00+0000').toDate(),
          opening_price: '10',
          closing_price: '10',
          highest_price: '10',
          lowest_price: '10',
          volume_1: '300',
          volume_2: '600',
        },
      ],
      days: [
        {
          time: moment('2021-12-24 00:00:00+0000').toDate(),
          opening_price: '10',
          closing_price: '10',
          highest_price: '10',
          lowest_price: '10',
          volume_1: '300',
          volume_2: '600',
        },
      ],
      weeks: [
        {
          time: moment('2021-12-20 20:00:00+0000').toDate(),
          opening_price: '10',
          closing_price: '10',
          highest_price: '10',
          lowest_price: '10',
          volume_1: '300',
          volume_2: '600',
        },
      ],
    },
  },
  _out: {
    toAdd: {
      minutes: [
        {
          time: moment('2021-12-24 20:06:00+0000').toDate(),
          opening_price: '60',
          closing_price: '60',
          highest_price: '60',
          lowest_price: '60',
          volume_1: '100',
          volume_2: '200',
        },
        {
          time: moment('2021-12-24 21:06:00+0000').toDate(),
          opening_price: '5',
          closing_price: '5',
          highest_price: '5',
          lowest_price: '5',
          volume_1: '100',
          volume_2: '200',
        },
        {
          time: moment('2021-12-25 21:06:00+0000').toDate(),
          opening_price: '60',
          closing_price: '60',
          highest_price: '60',
          lowest_price: '60',
          volume_1: '100',
          volume_2: '200',
        },
        {
          time: moment('2021-12-28 21:06:00+0000').toDate(),
          opening_price: '20',
          closing_price: '20',
          highest_price: '20',
          lowest_price: '20',
          volume_1: '100',
          volume_2: '200',
        },
      ],
      hours: [
        {
          time: moment('2021-12-24 21:00:00+0000').toDate(),
          opening_price: '5',
          closing_price: '5',
          highest_price: '5',
          lowest_price: '5',
          volume_1: '100',
          volume_2: '200',
        },
        {
          time: moment('2021-12-25 21:00:00+0000').toDate(),
          opening_price: '60',
          closing_price: '60',
          highest_price: '60',
          lowest_price: '60',
          volume_1: '100',
          volume_2: '200',
        },
        {
          time: moment('2021-12-28 21:00:00+0000').toDate(),
          opening_price: '20',
          closing_price: '20',
          highest_price: '20',
          lowest_price: '20',
          volume_1: '100',
          volume_2: '200',
        },
      ],
      days: [
        {
          time: moment('2021-12-25 00:00:00+0000').toDate(),
          opening_price: '60',
          closing_price: '60',
          highest_price: '60',
          lowest_price: '60',
          volume_1: '100',
          volume_2: '200',
        },
        {
          time: moment('2021-12-28 00:00:00+0000').toDate(),
          opening_price: '20',
          closing_price: '20',
          highest_price: '20',
          lowest_price: '20',
          volume_1: '100',
          volume_2: '200',
        },
      ],
      weeks: [
        {
          time: moment('2021-12-27 00:00:00+0000').toDate(),
          opening_price: '20',
          closing_price: '20',
          highest_price: '20',
          lowest_price: '20',
          volume_1: '100',
          volume_2: '200',
        },
      ],
    },
    toUpdate: {
      minutes: [
        {
          time: moment('2021-12-24 20:05:00+0000').toDate(),
          opening_price: '10',
          closing_price: '50',
          highest_price: '50',
          lowest_price: '10',
          volume_1: '400',
          volume_2: '800',
        },
      ],
      hours: [
        {
          time: moment('2021-12-24 20:00:00+0000').toDate(),
          opening_price: '10',
          closing_price: '60',
          highest_price: '60',
          lowest_price: '10',
          volume_1: '500',
          volume_2: '1000',
        },
      ],
      days: [
        {
          time: moment('2021-12-24 00:00:00+0000').toDate(),
          opening_price: '10',
          closing_price: '5',
          highest_price: '60',
          lowest_price: '5',
          volume_1: '600',
          volume_2: '1200',
        },
      ],
      weeks: [
        {
          time: moment('2021-12-20 20:00:00+0000').toDate(),
          opening_price: '10',
          closing_price: '60',
          highest_price: '60',
          lowest_price: '5',
          volume_1: '700',
          volume_2: '1400',
        },
      ],
    },
  },
} as TestCase;
