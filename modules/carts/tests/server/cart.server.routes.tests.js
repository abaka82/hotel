'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Cart = mongoose.model('Cart'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  cart;

/**
 * Cart routes tests
 */
describe('Cart CRUD tests', function () {

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

    // Save a user to the test db and create new cart
    user.save(function () {
      cart = {
        qty: 100,
        user: user
      };

      done();
    });
  });

  it('should be able to save an cart if logged in', function (done) {
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

        // Save a new cart
        agent.post('/api/carts')
          .send(cart)
          .expect(200)
          .end(function (cartSaveErr, cartSaveRes) {
            // Handle cart save error
            if (cartSaveErr) {
              return done(cartSaveErr);
            }

            // Get a list of carts
            agent.get('/api/carts')
              .end(function (cartsGetErr, cartsGetRes) {
                // Handle cart save error
                if (cartsGetErr) {
                  return done(cartsGetErr);
                }

                // Get carts list
                var carts = cartsGetRes.body;

                // Set assertions
                (carts[0].user._id).should.equal(userId);
                (carts[0].qty).should.match(100);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an cart if not logged in', function (done) {
    agent.post('/api/carts')
      .send(cart)
      .expect(403)
      .end(function (cartSaveErr, cartSaveRes) {
        // Call the assertion callback
        done(cartSaveErr);
      });
  });

  it('should not be able to save an cart if no Qty is provided', function (done) {
    // Invalidate title field
    cart.qty = '';

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

        // Save a new cart
        agent.post('/api/carts')
          .send(cart)
          .expect(400)
          .end(function (cartSaveErr, cartSaveRes) {
            // Set message assertion
            (cartSaveRes.body.message).should.match('Qty cannot be blank');

            // Handle cart save error
            done(cartSaveErr);
          });
      });
  });

  it('should be able to update an cart if signed in', function (done) {
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

        // Save a new cart
        agent.post('/api/carts')
          .send(cart)
          .expect(200)
          .end(function (cartSaveErr, cartSaveRes) {
            // Handle cart save error
            if (cartSaveErr) {
              return done(cartSaveErr);
            }

            // Update cart qty
            cart.qty = '1234';

            // Update an existing cart
            agent.put('/api/carts/' + cartSaveRes.body._id)
              .send(cart)
              .expect(200)
              .end(function (cartUpdateErr, cartUpdateRes) {
                // Handle cart update error
                if (cartUpdateErr) {
                  return done(cartUpdateErr);
                }

                // Set assertions
                (cartUpdateRes.body._id).should.equal(cartSaveRes.body._id);
                (cartUpdateRes.body.qty).should.match(1234);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of carts if not signed in', function (done) {
    // Create new cart model instance
    var cartObj = new Cart(cart);

    // Save the cart
    cartObj.save(function () {
      // Request carts
      request(app).get('/api/carts')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single cart if not signed in', function (done) {
    // Create new cart model instance
    var cartObj = new Cart(cart);

    // Save the cart
    cartObj.save(function () {
      request(app).get('/api/carts/' + cartObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('qty', cart.qty);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single cart with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/carts/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Cart is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single cart which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent cart
    request(app).get('/api/carts/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No cart with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an cart if signed in', function (done) {
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

        // Save a new cart
        agent.post('/api/carts')
          .send(cart)
          .expect(200)
          .end(function (cartSaveErr, cartSaveRes) {
            // Handle cart save error
            if (cartSaveErr) {
              return done(cartSaveErr);
            }

            // Delete an existing cart
            agent.delete('/api/carts/' + cartSaveRes.body._id)
              .send(cart)
              .expect(200)
              .end(function (cartDeleteErr, cartDeleteRes) {
                // Handle cart error error
                if (cartDeleteErr) {
                  return done(cartDeleteErr);
                }

                // Set assertions
                (cartDeleteRes.body._id).should.equal(cartSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an cart if not signed in', function (done) {
    // Set cart user
    cart.user = user;

    // Create new cart model instance
    var cartObj = new Cart(cart);

    // Save the cart
    cartObj.save(function () {
      // Try deleting cart
      request(app).delete('/api/carts/' + cartObj._id)
        .expect(403)
        .end(function (cartDeleteErr, cartDeleteRes) {
          // Set message assertion
          (cartDeleteRes.body.message).should.match('User is not authorized');

          // Handle cart error error
          done(cartDeleteErr);
        });

    });
  });

  it('should be able to get a single cart that has an orphaned user reference', function (done) {
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

          // Save a new cart
          agent.post('/api/carts')
            .send(cart)
            .expect(200)
            .end(function (cartSaveErr, cartSaveRes) {
              // Handle cart save error
              if (cartSaveErr) {
                return done(cartSaveErr);
              }

              // Set assertions on new cart
              (cartSaveRes.body.qty).should.equal(cart.qty);
              should.exist(cartSaveRes.body.user);
              should.equal(cartSaveRes.body.user._id, orphanId);

              // force the cart to have an orphaned user reference
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

                    // Get the cart
                    agent.get('/api/carts/' + cartSaveRes.body._id)
                      .expect(200)
                      .end(function (cartInfoErr, cartInfoRes) {
                        // Handle cart error
                        if (cartInfoErr) {
                          return done(cartInfoErr);
                        }

                        // Set assertions
                        (cartInfoRes.body._id).should.equal(cartSaveRes.body._id);
                        (cartInfoRes.body.qty).should.equal(cart.qty);
                        should.equal(cartInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single cart if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new cart model instance
    cart.user = user;
    var cartObj = new Cart(cart);

    // Save the cart
    cartObj.save(function () {
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

          // Save a new cart
          agent.post('/api/carts')
            .send(cart)
            .expect(200)
            .end(function (cartSaveErr, cartSaveRes) {
              // Handle cart save error
              if (cartSaveErr) {
                return done(cartSaveErr);
              }

              // Get the cart
              agent.get('/api/carts/' + cartSaveRes.body._id)
                .expect(200)
                .end(function (cartInfoErr, cartInfoRes) {
                  // Handle cart error
                  if (cartInfoErr) {
                    return done(cartInfoErr);
                  }

                  // Set assertions
                  (cartInfoRes.body._id).should.equal(cartSaveRes.body._id);
                  (cartInfoRes.body.qty).should.equal(cart.qty);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (cartInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single cart if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new cart model instance
    var cartObj = new Cart(cart);

    // Save the cart
    cartObj.save(function () {
      request(app).get('/api/carts/' + cartObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('qty', cart.qty);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single cart, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
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

      // Sign in with the user that will create the Cart
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

          // Save a new cart
          agent.post('/api/carts')
            .send(cart)
            .expect(200)
            .end(function (cartSaveErr, cartSaveRes) {
              // Handle cart save error
              if (cartSaveErr) {
                return done(cartSaveErr);
              }

              // Set assertions on new cart
              (cartSaveRes.body.qty).should.equal(cart.qty);
              should.exist(cartSaveRes.body.user);
              should.equal(cartSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the cart
                  agent.get('/api/carts/' + cartSaveRes.body._id)
                    .expect(200)
                    .end(function (cartInfoErr, cartInfoRes) {
                      // Handle cart error
                      if (cartInfoErr) {
                        return done(cartInfoErr);
                      }

                      // Set assertions
                      (cartInfoRes.body._id).should.equal(cartSaveRes.body._id);
                      (cartInfoRes.body.qty).should.equal(cart.qty);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (cartInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Cart.remove().exec(done);
    });
  });
});
