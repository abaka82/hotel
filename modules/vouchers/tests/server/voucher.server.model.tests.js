'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Voucher = mongoose.model('Voucher');

/**
 * Globals
 */
var user,
  voucher;

/**
 * Unit tests
 */
describe('Voucher Model Unit Tests:', function () {

  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    });

    user.save(function () {
      voucher = new Voucher({
        voucherCode: 'Voucher Code',
        title: 'Voucher Title',
        discountPercent: 25,
        discountAmount: 150000,
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      return voucher.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without voucher code', function (done) {
      voucher.voucherCode = '';

      return voucher.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Voucher.remove().exec(function () {
      User.remove().exec(done);
    });
  });
});
