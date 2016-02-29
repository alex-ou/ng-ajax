describe('ng-ajax-control', function() {
    var $httpBackend, scope, element, $compile, $timeout;

    beforeEach(module('ngAjax'));

    beforeEach(inject(function($rootScope, $injector) {
        $compile = $injector.get('$compile');
        $httpBackend = $injector.get('$httpBackend');
        $timeout = $injector.get('$timeout');

        scope = $rootScope.$new();
        element =
            '<ng-ajax-control auto>' +
                '<ng-ajax method="GET" url="testUrl">' +
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
});