describe('ng-ajax', function() {
    var $httpBackend, scope, element, $compile, $timeout;

    beforeEach(module('ngAjax'));

    beforeEach(inject(function ($rootScope, $injector) {
        $compile = $injector.get('$compile');
        $httpBackend = $injector.get('$httpBackend');
        $timeout = $injector.get('$timeout');

        scope = $rootScope.$new();

    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('trigger the ng-ajax-control to send requests', function () {
        $httpBackend.expectPOST('/test').respond('whatever');

        scope.testUrl = '/test';
        element =
            '<div>' +
                '<button ng-ajax-emit="testEvent"></button>' +
                '<ng-ajax-control on="testEvent" >' +
                    '<ng-ajax method="POST" url="testUrl" loading="isLoading">' +
                    '</ng-ajax>' +
                '</ng-ajax-control>' +
            '</div>';

        element = $compile(element)(scope);
        scope.$digest();
        element.find('button').triggerHandler('click');
        scope.$digest();

        $timeout.flush();
        $httpBackend.flush();
    });
});
