'use strict';

describe('Vouchers E2E Tests:', function () {
  describe('Test vouchers page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/vouchers');
      expect(element.all(by.repeater('voucher in vouchers')).count()).toEqual(0);
    });
  });
});
