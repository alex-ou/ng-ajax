angular.module('ngAjax', []);

angular.module('ngAjax')

    .constant('ngAjaxFlow', {
        parallel: 'parallel',
        series: 'series'
    })

    .directive('ngAjax', function () {
            return {
                restrict: 'E',
                require: ['^ngAjaxControl', 'ngAjax'],
                controller: 'ngAjaxController',
                link: function (scope, element, attrs, ctrls) {
                    ctrls[1].init(ctrls[0]);
                }
            }
        }
    )

    .directive('ngAjaxControl', function () {
            return {
                restrict: 'E',
                controller: 'ngAjaxControlController',
                link: function (scope, element, attrs, ctrls) {
                }
            }
        }
    )

    .directive('ngAjaxEmit', ['$rootScope', function ($rootScope) {
        return {
            link: function (scope, elem, attrs, controller) {
                function onClick(){
                    $rootScope.$emit(attrs.ngAjaxEmit);
                }
                elem.on('click', onClick);
                scope.$on('$destroy', function () {
                    elem.off('click', onClick);
                });
            }
        }
    }])
    
    .controller('ngAjaxControlController', ['$scope', '$rootScope', '$attrs','$parse', '$q', 'ngAjaxDebounce', 'ngAjaxFlow', function (scope, $rootScope, attrs, $parse, $q, debounce, ngAjaxFlow) {
        var isAuto = attrs.auto !== undefined && scope.$eval(attrs.auto) !== false;
        //default debounce duration 10 milliseconds
        var debounceDuration = scope.$eval(attrs.debounceDuration);
        if (!debounceDuration && debounceDuration !== 0) {
            debounceDuration = 10;
        }

        var flow = attrs.flow || ngAjaxFlow.parallel;
        var isLoadingSetter = $parse(attrs.loading).assign || angular.noop;

        var ajaxControllers = [];
        this.register = function (ajaxController) {
            ajaxControllers.push(ajaxController);
        };

        function isReady(){
            var isReady = true;
            for (var i = 0; i < ajaxControllers.length; i++) {
                isReady = ajaxControllers[i].isReady();
                if(!isReady){
                    break;
                }
            }
            return isReady;

        }

        function  sendInParallel(){
            var allPromises = [];

            isLoadingSetter(scope, true);
            angular.forEach(ajaxControllers, function (ctrl) {
                allPromises.push(ctrl.ajax());
            });
            $q.all(allPromises).then(function () {
                isLoadingSetter(scope, false);
            });
        }

        function  sendInSeries(){
            var finished = function (error) {
                if(error){
                    console.log(error);
                }else{
                    isLoadingSetter(scope, false);
                }
            };

            var send = function (index) {
                if(index >= ajaxControllers.length){
                    finished();
                    return;
                }

                ajaxControllers[index].ajax()
                    .then(function () {
                        send(index + 1);
                    })
                    .catch(function (error) {
                        finished(error);
                    });
            };

            isLoadingSetter(scope, true);
            send(0);
        }

        function sendAll(){
            if(!isReady()){
                return;
            }

            if(flow === ngAjaxFlow.parallel){
                sendInParallel();
            }else if(flow === ngAjaxFlow.series){
                sendInSeries();
            }else{
                throw 'Not supported control flow: ' + flow;
            }
        }

        var debouncedSend = debounce(sendAll, debounceDuration);
        if(attrs.on){
            $rootScope.$on(attrs.on, debouncedSend);
        }

        this.notifyOptionChanges = function () {
            if(isAuto){
                debouncedSend();
            }
        };

    }])

    .controller('ngAjaxController', ['$rootScope', '$scope', '$attrs', '$http', '$parse', '$q', function ($rootScope, $scope, $attrs, $http, $parse, $q) {
        var GET_METHOD = 'GET';
        var method = $attrs.method || GET_METHOD;

        var ajaxControl;

        var isLoadingSetter = $parse($attrs.loading).assign || angular.noop;
        var ajaxSuccessSetter = $parse($attrs.ajaxSuccess).assign || angular.noop;
        var ajaxErrorSetter = $parse($attrs.ajaxError).assign || angular.noop;

        this.init = function (_ajaxControl) {
            ajaxControl = _ajaxControl;
            ajaxControl.register(this);
        };

        this.isReady = function () {
            return !!$scope.$eval($attrs.url);
        };

        var param = function(obj) {
            if ( ! angular.isObject( obj) ) {
                return( ( obj== null ) ? "" : obj.toString() );
            }
            var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

            for(name in obj) {

                value = obj[name];
                if(value instanceof Array) {
                    for(i in value) {

                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }

                } else if(value instanceof Object) {
                    for(subName in value) {

                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if(value !== undefined && value !== null)
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };

        this.ajax = function () {
            isLoadingSetter($scope, true);
            ajaxSuccessSetter($scope, null);
            ajaxErrorSetter($scope, null);

            var url = $scope.$eval($attrs.url);
            var headers = $scope.$eval($attrs.headers);
            var body = $scope.$eval($attrs.body);
            var config = {
                method: method,
                url: url,
                headers: headers,
                data: body,
                transformRequest: function(data, getHeaders){
                    var headers = getHeaders();
                    var contentType = headers[ "content-type" ];
                    if(contentType && contentType.indexOf('application/x-www-form-urlencoded') >= 0){
                        return param( data );
                    }
                    return JSON.stringify(data);
                }
            };
            console.log(config);

            if(method === GET_METHOD){
                config.params = $scope.$eval($attrs.params);
            }

            var defer = $q.defer();
            $http(config)
                .then(function (response) {
                    ajaxSuccessSetter($scope, response);
                    defer.resolve(response);
                }).catch(function (error) {
                    ajaxErrorSetter($scope, error);
                    defer.reject(error);
                }).finally(function () {
                    isLoadingSetter($scope, false);
                });
            return defer.promise;
        };

        function notify(){
            ajaxControl.notifyOptionChanges();
        }

        $scope.$watch($attrs.url, notify);

        $scope.$watch($attrs.body, notify);

        if(method === GET_METHOD){
            $scope.$watch($attrs.params, notify);
        }
    }])

    .service('ngAjaxDebounce', ['$timeout', function ($timeout) {
        return function (func, wait, immediate) {
            var timeout;

            function debounce() {
                var result,
                    context = this,
                    args = arguments;
                var later = function () {
                    timeout = null;
                    if (!immediate) {
                        result = func.apply(context, args);
                    }
                };
                var callNow = immediate && !timeout;
                if (timeout) {
                    $timeout.cancel(timeout);
                }
                timeout = $timeout(later, wait);
                if (callNow) {
                    result = func.apply(context, args);
                }
                return result;
            }

            debounce.cancel = function () {
                $timeout.cancel(timeout);
                timeout = null;
            };
            return debounce;
        };
    }])

;

