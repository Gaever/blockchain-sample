import { chooseDisplayingLastDealRate } from '@/websocket/chart-data/choose-displaying-last-deal-rate';
import { assert } from 'chai';

describe('choose-displaying-last-deal-rate.test', function () {
  it('Have at least one deal (DOM is empty)', function () {
    assert.equal(chooseDisplayingLastDealRate(0, undefined, undefined, '10'), '10');
  });

  it('Have at least one deal (have sell orders)', function () {
    assert.equal(chooseDisplayingLastDealRate(5, '100', undefined, '10'), '10');
  });

  it('Have at least one deal (have buy orders)', function () {
    assert.equal(chooseDisplayingLastDealRate(5, undefined, '100', '10'), '10');
  });

  it('Have at least one deal (have buy and sell orders)', function () {
    assert.equal(chooseDisplayingLastDealRate(5, '100', '200', '10'), '10');
  });

  it('No deals was made and DOM is empty', function () {
    assert.equal(chooseDisplayingLastDealRate(0, undefined, undefined, undefined), '1');
  });

  it('No deals was made, have sell order(s)', function () {
    assert.equal(chooseDisplayingLastDealRate(1, '10', undefined, undefined), '10');
    assert.equal(chooseDisplayingLastDealRate(2, '10', undefined, undefined), '10');
  });

  it('No deals was made, have buy order(s)', function () {
    assert.equal(chooseDisplayingLastDealRate(1, undefined, '10', undefined), '10');
    assert.equal(chooseDisplayingLastDealRate(2, undefined, '10', undefined), '10');
  });

  it('No deals was made, have sell and order(s)', function () {
    assert.equal(chooseDisplayingLastDealRate(2, '20', '10', undefined), '20');
    assert.equal(chooseDisplayingLastDealRate(4, '20', '10', undefined), '20');
  });

  it('Throw error on wrong condition', function () {
    assert.throws(() => chooseDisplayingLastDealRate(undefined, undefined, undefined, undefined));
    assert.throws(() => chooseDisplayingLastDealRate(undefined, undefined, undefined, '0'));
  });
});
