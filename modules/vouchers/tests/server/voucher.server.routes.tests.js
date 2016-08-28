'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Voucher = mongoose.model('Voucher'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  voucher;

/**
 * Voucher routes tests
 */
describe('Voucher CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new voucher
    user.save(function () {
      voucher = {
        voucherCode: 'Voucher Code',
        title: 'Voucher Title',
        discountPercent: 25,
        discountAmount: 150000,
        user: user
      };

      done();
    });
  });

  it('should be able to save an voucher if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new voucher
        agent.post('/api/vouchers')
          .send(voucher)
          .expect(200)
          .end(function (voucherSaveErr, voucherSaveRes) {
            // Handle voucher save error
            if (voucherSaveErr) {
              return done(voucherSaveErr);
            }

            // Get a list of vouchers
            agent.get('/api/vouchers')
              .end(function (vouchersGetErr, vouchersGetRes) {
                // Handle voucher save error
                if (vouchersGetErr) {
                  return done(vouchersGetErr);
                }

                // Get vouchers list
                var vouchers = vouchersGetRes.body;

                // Set assertions
                (vouchers[0].user._id).should.equal(userId);
                (vouchers[0].voucherCode).should.match('Voucher Code');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an voucher if not logged in', function (done) {
    agent.post('/api/vouchers')
      .send(voucher)
      .expect(403)
      .end(function (voucherSaveErr, voucherSaveRes) {
        // Call the assertion callback
        done(voucherSaveErr);
      });
  });

  it('should not be able to save an voucher if no title is provided', function (done) {
    // Invalidate title field
    voucher.voucherCode = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new voucher
        agent.post('/api/vouchers')
          .send(voucher)
          .expect(400)
          .end(function (voucherSaveErr, voucherSaveRes) {
            // Set message assertion
            (voucherSaveRes.body.message).should.match('Voucher Code cannot be blank');

            // Handle voucher save error
            done(voucherSaveErr);
          });
      });
  });

  it('should be able to update an voucher if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new voucher
        agent.post('/api/vouchers')
          .send(voucher)
          .expect(200)
          .end(function (voucherSaveErr, voucherSaveRes) {
            // Handle voucher save error
            if (voucherSaveErr) {
              return done(voucherSaveErr);
            }

            // Update voucher title
            voucher.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing voucher
            agent.put('/api/vouchers/' + voucherSaveRes.body._id)
              .send(voucher)
              .expect(200)
              .end(function (voucherUpdateErr, voucherUpdateRes) {
                // Handle voucher update error
                if (voucherUpdateErr) {
                  return done(voucherUpdateErr);
                }

                // Set assertions
                (voucherUpdateRes.body._id).should.equal(voucherSaveRes.body._id);
                (voucherUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of vouchers if not signed in', function (done) {
    // Create new voucher model instance
    var voucherObj = new Voucher(voucher);

    // Save the voucher
    voucherObj.save(function () {
      // Request vouchers
      request(app).get('/api/vouchers')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single voucher if not signed in', function (done) {
    // Create new voucher model instance
    var voucherObj = new Voucher(voucher);

    // Save the voucher
    voucherObj.save(function () {
      request(app).get('/api/vouchers/' + voucherObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', voucher.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single voucher with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/vouchers/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Voucher is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single voucher which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent voucher
    request(app).get('/api/vouchers/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No voucher with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an voucher if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new voucher
        agent.post('/api/vouchers')
          .send(voucher)
          .expect(200)
          .end(function (voucherSaveErr, voucherSaveRes) {
            // Handle voucher save error
            if (voucherSaveErr) {
              return done(voucherSaveErr);
            }

            // Delete an existing voucher
            agent.delete('/api/vouchers/' + voucherSaveRes.body._id)
              .send(voucher)
              .expect(200)
              .end(function (voucherDeleteErr, voucherDeleteRes) {
                // Handle voucher error error
                if (voucherDeleteErr) {
                  return done(voucherDeleteErr);
                }

                // Set assertions
                (voucherDeleteRes.body._id).should.equal(voucherSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an voucher if not signed in', function (done) {
    // Set voucher user
    voucher.user = user;

    // Create new voucher model instance
    var voucherObj = new Voucher(voucher);

    // Save the voucher
    voucherObj.save(function () {
      // Try deleting voucher
      request(app).delete('/api/vouchers/' + voucherObj._id)
        .expect(403)
        .end(function (voucherDeleteErr, voucherDeleteRes) {
          // Set message assertion
          (voucherDeleteRes.body.message).should.match('User is not authorized');

          // Handle voucher error error
          done(voucherDeleteErr);
        });

    });
  });

  it('should be able to get a single voucher that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new voucher
          agent.post('/api/vouchers')
            .send(voucher)
            .expect(200)
            .end(function (voucherSaveErr, voucherSaveRes) {
              // Handle voucher save error
              if (voucherSaveErr) {
                return done(voucherSaveErr);
              }

              // Set assertions on new voucher
              (voucherSaveRes.body.title).should.equal(voucher.title);
              should.exist(voucherSaveRes.body.user);
              should.equal(voucherSaveRes.body.user._id, orphanId);

              // force the voucher to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the voucher
                    agent.get('/api/vouchers/' + voucherSaveRes.body._id)
                      .expect(200)
                      .end(function (voucherInfoErr, voucherInfoRes) {
                        // Handle voucher error
                        if (voucherInfoErr) {
                          return done(voucherInfoErr);
                        }

                        // Set assertions
                        (voucherInfoRes.body._id).should.equal(voucherSaveRes.body._id);
                        (voucherInfoRes.body.title).should.equal(voucher.title);
                        should.equal(voucherInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single voucher if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new voucher model instance
    voucher.user = user;
    var voucherObj = new Voucher(voucher);

    // Save the voucher
    voucherObj.save(function () {
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = user.id;

          // Save a new voucher
          agent.post('/api/vouchers')
            .send(voucher)
            .expect(200)
            .end(function (voucherSaveErr, voucherSaveRes) {
              // Handle voucher save error
              if (voucherSaveErr) {
                return done(voucherSaveErr);
              }

              // Get the voucher
              agent.get('/api/vouchers/' + voucherSaveRes.body._id)
                .expect(200)
                .end(function (voucherInfoErr, voucherInfoRes) {
                  // Handle voucher error
                  if (voucherInfoErr) {
                    return done(voucherInfoErr);
                  }

                  // Set assertions
                  (voucherInfoRes.body._id).should.equal(voucherSaveRes.body._id);
                  (voucherInfoRes.body.title).should.equal(voucher.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (voucherInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single voucher if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new voucher model instance
    var voucherObj = new Voucher(voucher);

    // Save the voucher
    voucherObj.save(function () {
      request(app).get('/api/vouchers/' + voucherObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', voucher.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single voucher, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      username: 'temp',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create temporary user
    var _user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _user.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Voucher
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = user._id;

          // Save a new voucher
          agent.post('/api/vouchers')
            .send(voucher)
            .expect(200)
            .end(function (voucherSaveErr, voucherSaveRes) {
              // Handle voucher save error
              if (voucherSaveErr) {
                return done(voucherSaveErr);
              }

              // Set assertions on new voucher
              (voucherSaveRes.body.title).should.equal(voucher.title);
              should.exist(voucherSaveRes.body.user);
              should.equal(voucherSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the voucher
                  agent.get('/api/vouchers/' + voucherSaveRes.body._id)
                    .expect(200)
                    .end(function (voucherInfoErr, voucherInfoRes) {
                      // Handle voucher error
                      if (voucherInfoErr) {
                        return done(voucherInfoErr);
                      }

                      // Set assertions
                      (voucherInfoRes.body._id).should.equal(voucherSaveRes.body._id);
                      (voucherInfoRes.body.title).should.equal(voucher.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (voucherInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Voucher.remove().exec(done);
    });
  });
});
