'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Category = mongoose.model('Category'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  category;

/**
 * Category routes tests
 */
describe('Category CRUD tests', function () {

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

    // Save a user to the test db and create new category
    user.save(function () {
      category = {
        title: 'Category Title',
        content: 'Category Content'
      };

      done();
    });
  });

  it('should be able to save an category if logged in', function (done) {
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

        // Save a new category
        agent.post('/api/categories')
          .send(category)
          .expect(200)
          .end(function (categorySaveErr, categorySaveRes) {
            // Handle category save error
            if (categorySaveErr) {
              return done(categorySaveErr);
            }

            // Get a list of categories
            agent.get('/api/categories')
              .end(function (categoriesGetErr, categoriesGetRes) {
                // Handle category save error
                if (categoriesGetErr) {
                  return done(categoriesGetErr);
                }

                // Get categories list
                var categories = categoriesGetRes.body;

                // Set assertions
                (categories[0].user._id).should.equal(userId);
                (categories[0].title).should.match('Category Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an category if not logged in', function (done) {
    agent.post('/api/categories')
      .send(category)
      .expect(403)
      .end(function (categorySaveErr, categorySaveRes) {
        // Call the assertion callback
        done(categorySaveErr);
      });
  });

  it('should not be able to save an category if no title is provided', function (done) {
    // Invalidate title field
    category.title = '';

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

        // Save a new category
        agent.post('/api/categories')
          .send(category)
          .expect(400)
          .end(function (categorySaveErr, categorySaveRes) {
            // Set message assertion
            (categorySaveRes.body.message).should.match('Title cannot be blank');

            // Handle category save error
            done(categorySaveErr);
          });
      });
  });

  it('should be able to update an category if signed in', function (done) {
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

        // Save a new category
        agent.post('/api/categories')
          .send(category)
          .expect(200)
          .end(function (categorySaveErr, categorySaveRes) {
            // Handle category save error
            if (categorySaveErr) {
              return done(categorySaveErr);
            }

            // Update category title
            category.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing category
            agent.put('/api/categories/' + categorySaveRes.body._id)
              .send(category)
              .expect(200)
              .end(function (categoryUpdateErr, categoryUpdateRes) {
                // Handle category update error
                if (categoryUpdateErr) {
                  return done(categoryUpdateErr);
                }

                // Set assertions
                (categoryUpdateRes.body._id).should.equal(categorySaveRes.body._id);
                (categoryUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of categories if not signed in', function (done) {
    // Create new category model instance
    var categoryObj = new Category(category);

    // Save the category
    categoryObj.save(function () {
      // Request categories
      request(app).get('/api/categories')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single category if not signed in', function (done) {
    // Create new category model instance
    var categoryObj = new Category(category);

    // Save the category
    categoryObj.save(function () {
      request(app).get('/api/categories/' + categoryObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', category.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single category with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/categories/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Category is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single category which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent category
    request(app).get('/api/categories/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No category with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an category if signed in', function (done) {
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

        // Save a new category
        agent.post('/api/categories')
          .send(category)
          .expect(200)
          .end(function (categorySaveErr, categorySaveRes) {
            // Handle category save error
            if (categorySaveErr) {
              return done(categorySaveErr);
            }

            // Delete an existing category
            agent.delete('/api/categories/' + categorySaveRes.body._id)
              .send(category)
              .expect(200)
              .end(function (categoryDeleteErr, categoryDeleteRes) {
                // Handle category error error
                if (categoryDeleteErr) {
                  return done(categoryDeleteErr);
                }

                // Set assertions
                (categoryDeleteRes.body._id).should.equal(categorySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an category if not signed in', function (done) {
    // Set category user
    category.user = user;

    // Create new category model instance
    var categoryObj = new Category(category);

    // Save the category
    categoryObj.save(function () {
      // Try deleting category
      request(app).delete('/api/categories/' + categoryObj._id)
        .expect(403)
        .end(function (categoryDeleteErr, categoryDeleteRes) {
          // Set message assertion
          (categoryDeleteRes.body.message).should.match('User is not authorized');

          // Handle category error error
          done(categoryDeleteErr);
        });

    });
  });

  it('should be able to get a single category that has an orphaned user reference', function (done) {
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

          // Save a new category
          agent.post('/api/categories')
            .send(category)
            .expect(200)
            .end(function (categorySaveErr, categorySaveRes) {
              // Handle category save error
              if (categorySaveErr) {
                return done(categorySaveErr);
              }

              // Set assertions on new category
              (categorySaveRes.body.title).should.equal(category.title);
              should.exist(categorySaveRes.body.user);
              should.equal(categorySaveRes.body.user._id, orphanId);

              // force the category to have an orphaned user reference
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

                    // Get the category
                    agent.get('/api/categories/' + categorySaveRes.body._id)
                      .expect(200)
                      .end(function (categoryInfoErr, categoryInfoRes) {
                        // Handle category error
                        if (categoryInfoErr) {
                          return done(categoryInfoErr);
                        }

                        // Set assertions
                        (categoryInfoRes.body._id).should.equal(categorySaveRes.body._id);
                        (categoryInfoRes.body.title).should.equal(category.title);
                        should.equal(categoryInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single category if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new category model instance
    category.user = user;
    var categoryObj = new Category(category);

    // Save the category
    categoryObj.save(function () {
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

          // Save a new category
          agent.post('/api/categories')
            .send(category)
            .expect(200)
            .end(function (categorySaveErr, categorySaveRes) {
              // Handle category save error
              if (categorySaveErr) {
                return done(categorySaveErr);
              }

              // Get the category
              agent.get('/api/categories/' + categorySaveRes.body._id)
                .expect(200)
                .end(function (categoryInfoErr, categoryInfoRes) {
                  // Handle category error
                  if (categoryInfoErr) {
                    return done(categoryInfoErr);
                  }

                  // Set assertions
                  (categoryInfoRes.body._id).should.equal(categorySaveRes.body._id);
                  (categoryInfoRes.body.title).should.equal(category.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (categoryInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single category if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new category model instance
    var categoryObj = new Category(category);

    // Save the category
    categoryObj.save(function () {
      request(app).get('/api/categories/' + categoryObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', category.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single category, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
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

      // Sign in with the user that will create the Category
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

          // Save a new category
          agent.post('/api/categories')
            .send(category)
            .expect(200)
            .end(function (categorySaveErr, categorySaveRes) {
              // Handle category save error
              if (categorySaveErr) {
                return done(categorySaveErr);
              }

              // Set assertions on new category
              (categorySaveRes.body.title).should.equal(category.title);
              should.exist(categorySaveRes.body.user);
              should.equal(categorySaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the category
                  agent.get('/api/categories/' + categorySaveRes.body._id)
                    .expect(200)
                    .end(function (categoryInfoErr, categoryInfoRes) {
                      // Handle category error
                      if (categoryInfoErr) {
                        return done(categoryInfoErr);
                      }

                      // Set assertions
                      (categoryInfoRes.body._id).should.equal(categorySaveRes.body._id);
                      (categoryInfoRes.body.title).should.equal(category.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (categoryInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Category.remove().exec(done);
    });
  });
});
