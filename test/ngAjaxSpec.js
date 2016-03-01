describe('ng-ajax', function() {
    var $httpBackend, scope, element, $compile, $timeout;

    beforeEach(module('ngAjax'));

    beforeEach(inject(function($rootScope, $injector) {
        $compile = $injector.get('$compile');
        $httpBackend = $injector.get('$httpBackend');
        $timeout = $injector.get('$timeout');

        scope = $rootScope.$new();

    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should send the http request with the right http method', function () {
        $httpBackend.expectPOST('/test').respond('whatever');

        scope.testUrl = '/test';
        element =
            '<ng-ajax-control auto >' +
            '<ng-ajax method="POST" url="testUrl" loading="isLoading">' +
            '</ng-ajax>' +
            '</ng-ajax-control>';
        $compile(element)(scope);
        scope.$digest();

        $timeout.flush();
        $httpBackend.flush();
    });

    it('should send the http request with the right params', function () {
        $httpBackend.expectGET('/test?a=1&foo=bar').respond('whatever');

        scope.testUrl = '/test';
        scope.params = {a: 1, foo: 'bar'};
        element =
            '<ng-ajax-control auto >' +
            '<ng-ajax method="GET" url="testUrl" params="params">' +
            '</ng-ajax>' +
            '</ng-ajax-control>';
        $compile(element)(scope);
        scope.$digest();

        $timeout.flush();
        $httpBackend.flush();


        $httpBackend.expectGET('/test?a=1&foo=foo').respond('whatever');
        //changes the params should automatically triggers another GET request
        scope.params = {a: 1, foo: 'foo'};
        scope.$digest();
        $timeout.flush();
        $httpBackend.flush();
    });


    it('should post the right body when the content-type header is application/json', function () {
        $httpBackend.expectPOST('/test', {a: 1, foo: 'bar'}).respond('whatever');

        scope.testUrl = '/test';
        scope.body = {a: 1, foo: 'bar'};
        element =
            '<ng-ajax-control auto >' +
                '<ng-ajax method="POST" url="testUrl" body="body">' +
                '</ng-ajax>' +
            '</ng-ajax-control>';
        $compile(element)(scope);
        scope.$digest();

        $timeout.flush();
        $httpBackend.flush();

        $httpBackend.expectPOST('/test', {a: 1, foo: 'foo'}).respond('whatever');
        scope.body = {a: 1, foo: 'foo'};
        scope.$digest();
        $timeout.flush();
        $httpBackend.flush();
    });

    it('should post the right body when the content-type header is application/x-www-form-urlencoded', function () {
        $httpBackend.expectPOST('/test', 'a=1&foo=bar').respond('whatever');

        scope.testUrl = '/test';
        scope.body = {a: 1, foo: 'bar'};
        scope.headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        element =
            '<ng-ajax-control auto >' +
            '<ng-ajax method="POST" url="testUrl" body="body" headers="headers">' +
            '</ng-ajax>' +
            '</ng-ajax-control>';
        $compile(element)(scope);
        scope.$digest();

        $timeout.flush();
        $httpBackend.flush();

        $httpBackend.expectPOST('/test', 'a=2&foo=foo').respond('whatever');
        scope.body = {a: 2, foo: 'foo'};
        scope.$digest();
        $timeout.flush();
        $httpBackend.flush();
    });

    it('should correctly set the response object whe the http request is successful', function () {
        $httpBackend.expectPOST('/test').respond('whatever');

        scope.testUrl = '/test';
        element =
            '<ng-ajax-control auto >' +
            '<ng-ajax method="POST" url="testUrl" ajax-success="response">' +
            '</ng-ajax>' +
            '</ng-ajax-control>';
        $compile(element)(scope);
        scope.$digest();

        $timeout.flush();
        $httpBackend.flush();

        expect(scope.response.data).toBe('whatever');

    });

    it('should correctly set the response object whe the http request is failed', function () {
        $httpBackend.expectPOST('/test').respond(500, 'whatever');

        scope.testUrl = '/test';
        element =
            '<ng-ajax-control auto >' +
            '<ng-ajax method="POST" url="testUrl" ajax-error="response">' +
            '</ng-ajax>' +
            '</ng-ajax-control>';
        $compile(element)(scope);
        scope.$digest();

        $timeout.flush();
        $httpBackend.flush();

        expect(scope.response.data).toBe('whatever');

    });
});