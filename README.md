# ng-ajax
Easily make ajax requests in AngularJS

ng-ajax provides straight-forward directives which enables you to perform AJAX calls without writing any javascript code, and with great controls.

### Links
- [Quick Examples](#quick-examples)
- [Installations](#installations)
- [Documentation](#documentation)

# Quick Examples
```html
 <ng-ajax-control auto debounce-duration="1000">
	<ng-ajax method="GET"
             url="'http://jsonplaceholder.typicode.com/posts/' + postNum"
             params="{'q': postNum}"
             headers="{'Content-Type': application/x-www-form-urlencoded}"
             ajax-error="error"
             ajax-success="response">
    </ng-ajax>
</ng-ajax-control>
```
[JsFiddle](https://jsfiddle.net/alex_ou/dq8oy6rd/3/)

With `auto` set to `true`, the directive performs a request whenever its url, params or body properties are changed. Automatically generated requests will be debounced in the case that multiple attributes are changed sequentially.

```html
 <button ng-ajax-emit="post-and-get">Post And Get</button>
 <ng-ajax-control auto="false"
                  on="post-and-get"
                  loading="isAnyLoading"
                  flow="series">
     <ng-ajax method="POST"
              url="'http://jsonplaceholder.typicode.com/posts'"
              body="{title:'foo', id: 2}"
              loading="isLoading1"
              ajax-error="error1"
              ajax-success="response1">
     </ng-ajax>

     <ng-ajax method="GET"
              url="'http://jsonplaceholder.typicode.com/posts/' + (response1.data.id)"
              loading="isLoading2"
              ajax-error="error2"
              ajax-success="response2">
     </ng-ajax>
 </ng-ajax-control>
```
When the button is clicked, it'll emit a 'post-and-get' event, thus triggers the directive to perform two AJAX requests in series — first the POST request and then the GET request. Note here, the second POST request is able to perform the AJAX call by using the data from the response of the first GET request.

# Installations
Installation is easy as ng-ajax has minimal dependencies — only the AngularJS is required.
#### Install with npm
```sh
$ npm install ng-ajax
```
#### Install with bowser
```sh
$ bower install ng-ajax
```

# Getting started

1. Add references to AngularJS, e.g.:
```html
<script src="http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.2/angular.js""></script>
```

2. Add references to ng-ajax's javascript:

```html
<script src="https://cdn.rawgit.com/alex-ou/ng-ajax/master/dist/ng-ajax.min.js"></script>
```

3. Where you declare your app module, add ngAjax:

```js
angular.module("myApp", ["ngAjax"]);
```

4. In your html file within the controller, add:

```html
<input type="text" ng-model="postNum" ng-init="postNum = 1">
<ng-ajax-control auto
                 debounce-duration="1000"
                 loading="isLoading">
    <ng-ajax method="GET"
             url="'http://jsonplaceholder.typicode.com/posts/' + postNum"
             params="{'q': postNum}"
             headers="{'Content-Type': application/x-www-form-urlencoded}"
             ajax-error="error"
             ajax-success="response">
    </ng-ajax>
</ng-ajax-control>
```
# Documentation
Basic usage is as below, ng-ajax-control can have multiple ng-ajax children. ng-ajax can ran in `parallel` or `series` depending on the `flow` property.

```html
<ng-ajax-control flow="parallel|series">
	<ng-ajax></ng-ajax>
	<ng-ajax></ng-ajax>
</ng-ajax-control>
```

## \<ng-ajax-control\> directive
Controls the behaviors of the ng-ajax children, supported properties:
#### auto : Boolean
If `true`, automatically performs the Ajax request when either `url` or `params` changes.
Default: `false`.

#### debounce-duration : Number
Length of time in milliseconds to debounce multiple automatically generated requests.

#### on: String
Specify the event name to listen, once the event is received, run all the AJAX requests. See `ng-ajax-emit`.

#### loading
Binding to a variable that indicates if any of the enclosed AJAX calls is being performed asynchronously.
Default: angular.noop

#### flow
`parallel` or `series`, default is `parallel`.
If `parallel`, runs the all the AJAX requests in parallel, without waiting until the previous function has completed. As soon as the flow kicks off, the `loading` is set to true, once all the AJAX requests have completed, `loading` is set to false.
If `series`, run the AJAX requests in series, each one running once the previous one has completed. If any AJAX requests in the series pass fail, no more requests are run.


## \<ng-ajax\> directive
ng-ajax exposes $http functionality, supported properties:

#### url : String
The URL target of the request.

#### method : String
The HTTP method to use such as 'GET', 'POST', 'PUT', or 'DELETE'.
Default: 'GET'.

#### params : Object
An object that contains query parameters to be appended to the specified url when generating a request. If you wish to set the body content when making a POST request, you should use the body property instead.

#### headers: Object
HTTP request headers to send.
Example: headers='{"Content-Type": "application/x-www-form-urlencoded"}'

#### body: Object
Body content to send with the request, typically used with "POST" requests.

If Content-Type is set to a value listed below, then the body will be encoded accordingly.

content-type="application/json"
body is encoded like {"foo":"bar baz","x":1}
content-type="application/x-www-form-urlencoded"
body is encoded like foo=bar+baz&x=1

#### loading
Binding to a variable that indicates if the AJAX call is being performed asynchronously.
Default: angular.noop

#### ajax-response
Binding to a variable that will be set to the response object when the AJAX call is successful (a response status code between 200 and 299)
Default: angular.noop

#### ajax-error
Binding to a variable that will be set to the response object when the AJAX call is not successful
Default: angular.noop

## \<ng-ajax-emit\> directive
Can only be used as an attribute, e.g.
```html
<button ng-ajax-emit='eventName'></button>
```
Listens to the click event of the attached element, and dispatches an event `eventName` through the $rootScope notifying the ng-ajax-control to run all the AJAX requests.





