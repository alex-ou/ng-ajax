describe('ng-ajax-control', function() {
    var $httpBackend, scope, element, $compile, $timeout;

    beforeEach(module('ngAjax'));

    beforeEach(inject(function($rootScope, $injector) {
        $compile = $injector.get('$compile');
        $httpBackend = $injector.get('$httpBackend');
        $timeout = $injector.get('$timeout');

        scope = $rootScope.$new();
        element =
            '<ng-ajax-control auto >' +
                '<ng-ajax method="GET" url="testUrl" loading="isLoading">' +
                '</ng-ajax>' +
            '</ng-ajax-control>';

    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should send the http request automatically if auto is set', function () {
        $httpBackend.expectGET('/test').respond('whatever');

        scope.testUrl = '/test';
        element = $compile(element)(scope);
        scope.$digest();

        $timeout.flush();
        $httpBackend.flush();
    });

    it('should send the http request automatically if auto is set and the url changes', function () {
        $httpBackend.expectGET('/test').respond('whatever');

        scope.testUrl = '/test';
        element = $compile(element)(scope);
        scope.$digest();

        $timeout.flush();
        $httpBackend.flush();

        $httpBackend.expectGET('/test1').respond('whatever');
        scope.testUrl ='/test1';
        scope.$digest();

        $timeout.flush();
        $httpBackend.flush();
    });

    it('sets loading to true when http is in progress', function () {
        $httpBackend.expectGET('/test').respond('whatever');
        scope.testUrl = '/test';
        element = $compile(element)(scope);
        scope.$digest();

        $timeout.flush();
        expect(scope.isLoading).toBeTruthy();

        $httpBackend.flush();
        expect(scope.isLoading).toBeFalsy();
    });

    it('starts http requests in parallel by default', function () {
        $httpBackend.expectGET('/url1').respond('whatever');
        $httpBackend.expectGET('/url2').respond('whatever');

        scope.url1 = '/url1';
        scope.url2 = '/url2';
        element =
            '<ng-ajax-control auto >' +
                '<ng-ajax method="GET" url="url1" loading="isLoading1">' +
                '</ng-ajax>' +
                '<ng-ajax method="GET" url="url2" loading="isLoading2">' +
                '</ng-ajax>' +
            '</ng-ajax-control>';

        $compile(element)(scope);
        scope.$digest();
        $timeout.flush();

        expect(scope.isLoading1).toBeTruthy();
        expect(scope.isLoading2).toBeTruthy();

        //expects to receive 2 requests
        $httpBackend.flush(2);

        expect(scope.isLoading1).toBeFalsy();
        expect(scope.isLoading2).toBeFalsy();
    });

    it('starts http requests in one by one if flow is series', function () {
        $httpBackend.expectGET('/url1').respond('whatever');
        $httpBackend.expectGET('/url2').respond('whatever');

        scope.url1 = '/url1';
        scope.url2 = '/url2';
        element =
            '<ng-ajax-control auto flow="series">' +
            '<ng-ajax method="GET" url="url1" loading="isLoading1">' +
            '</ng-ajax>' +
            '<ng-ajax method="GET" url="url2" loading="isLoading2">' +
            '</ng-ajax>' +
            '</ng-ajax-control>';

        $compile(element)(scope);
        scope.$digest();
        $timeout.flush();

        expect(scope.isLoading1).toBeTruthy();
        expect(scope.isLoading2).toBeFalsy();
        $httpBackend.flush(1);

        expect(scope.isLoading1).toBeFalsy();
        expect(scope.isLoading2).toBeTruthy();

        $httpBackend.flush(1);

        expect(scope.isLoading1).toBeFalsy();
        expect(scope.isLoading2).toBeFalsy();
    })
});