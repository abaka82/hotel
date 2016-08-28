(function () {
  'use strict';

  describe('Products Route Tests', function () {
    // Initialize global variables
    var $scope,
      ProductsService,
      CategoriesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ProductsService_, _CategoriesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ProductsService = _ProductsService_;
      CategoriesService = _CategoriesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('products');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/products');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('products.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have template', function () {
          expect(liststate.templateUrl).toBe('modules/products/client/views/list-products.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ProductsController,
          mockProduct,
          mockCategory;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('products.view');
          $templateCache.put('modules/products/client/views/view-product.client.view.html', '');

          // create mock product
          mockProduct = new ProductsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Product about MEAN',
            description: 'MEAN rocks!'
          });

          // create mock category
          mockCategory = new CategoriesService({
            _id: '525a8422f6d0f87f0e407a34',
            title: 'A Category about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          ProductsController = $controller('ProductsController as vm', {
            $scope: $scope,
            productResolve: mockProduct,
            categoriesResolve: mockCategory
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:productId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.productResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            productId: 1
          })).toEqual('/products/1');
        }));

        it('should attach an product to the controller scope', function () {
          expect($scope.vm.product._id).toBe(mockProduct._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/products/client/views/view-product.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ProductsController,
          mockProduct,
          mockCategory;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('products.create');
          $templateCache.put('modules/products/client/views/form-product.client.view.html', '');

          // create mock product and category
          mockProduct = new ProductsService();
          mockCategory = new CategoriesService();

          // Initialize Controller
          ProductsController = $controller('ProductsController as vm', {
            $scope: $scope,
            productResolve: mockProduct,
            categoriesResolve: mockCategory
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.productResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/products/create');
        }));

        it('should attach an product to the controller scope', function () {
          expect($scope.vm.product._id).toBe(mockProduct._id);
          expect($scope.vm.product._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/products/client/views/form-product.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ProductsController,
          mockProduct,
          mockCategory;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('products.edit');
          $templateCache.put('modules/products/client/views/form-product.client.view.html', '');

          // create mock product
          mockProduct = new ProductsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Product about MEAN',
            content: 'MEAN rocks!'
          });

          // create mock category
          mockCategory = new CategoriesService({
            _id: '525a8422f6d0f87f0e407a34',
            title: 'A Category about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          ProductsController = $controller('ProductsController as vm', {
            $scope: $scope,
            productResolve: mockProduct,
            categoriesResolve: mockCategory
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:productId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.productResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            productId: 1
          })).toEqual('/products/1/edit');
        }));

        it('should attach an product to the controller scope', function () {
          expect($scope.vm.product._id).toBe(mockProduct._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/products/client/views/form-product.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('products.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('products/');
          $rootScope.$digest();

          expect($location.path()).toBe('/products');
          expect($state.current.templateUrl).toBe('modules/products/client/views/list-products.client.view.html');
        }));
      });

    });
  });
}());
