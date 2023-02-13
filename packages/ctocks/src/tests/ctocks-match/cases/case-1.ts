import { TestCase } from '../helpers';

export default {
  _in: {
    deals: [],
    lastElements: {
      minutes: null,
      hours: null,
      days: null,
      weeks: null,
    },
  },
  _out: {
    toAdd: {
      minutes: [],
      hours: [],
      days: [],
      weeks: [],
    },
    toUpdate: {
      minutes: [],
      hours: [],
      days: [],
      weeks: [],
    },
  },
} as TestCase;
