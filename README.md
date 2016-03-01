[![Build Status](https://travis-ci.org/alex-ou/ng-ajax.svg?branch=master)](https://travis-ci.org/alex-ou/ng-ajax)

# ng-ajax

Easily make ajax requests in AngularJS.
[Plunker Demo](https://plnkr.co/edit/CEYu834PVNh4FoNBTGy2?p=preview)

ng-ajax provides straight-forward directives which enable you to perform AJAX calls without writing any javascript code, and with great controls.

### Links
- [Quick Examples](#quick-examples)
- [Installations](#installations)
- [Documentation](#documentation)

# Quick Examples
```html
 <input type="text" ng-model="postNum">
 <ng-ajax-control auto debounce-duration="1000">
	<ng-ajax method="GET"
             url="'http://jsonplaceholder.typicode.com/posts/' + postNum"
             ajax-error="error"
             ajax-success="response">
    </ng-ajax>
</ng-ajax-control>
```

With `auto` setting to `true`, the directive performs a GET request to retrieve the post whenever the url is changed. Automatically generated requests will be debounced so that the GET request is only performed once every 1 second.

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
When the button is clicked, it'll emit a 'post-and-get' event, thus triggers the directive to perform two AJAX requests in series — first the POST request and then the GET request. Note that, the second POST request is able to perform the AJAX call by using the data from the response of the first GET request.

# Installations
Installation is easy as ng-ajax has minimal dependencies — only the AngularJS (v1.3 and upper versions) is required.
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
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.2/angular.js""></script>
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
<ng-ajax-control auto debounce-duration="1000">
      <ng-ajax
        method="GET"
        url="'data.json'"
        loading="isLoading"
        ajax-error="error"
        ajax-success="response"></ng-ajax>
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

|Property Name| Type |Default| Description |
| --- | ---| ---| --- |
|**auto**| Boolean |`false`|If `true`, automatically performs the Ajax request when either `url` or `params` changes.|
|**debounce-duration**|Number| |Length of time in milliseconds to debounce multiple automatically generated requests.|
|**on**|String||Specify the event name to listen, once the event is received, run all the AJAX requests. See `ng-ajax-emit`.|
|**loading**|String|angular.noop|Binding to a variable that indicates if any of the enclosed AJAX calls is being performed asynchronously. |
|**flow**| String|`parallel`|`parallel` or `series`. <br> If `parallel`, runs the all the AJAX requests in parallel, without waiting until the previous function has completed. As soon as the flow kicks off, the `loading` is set to true, once all the AJAX requests have completed, `loading` is set to false.  <br> If `series`, run the AJAX requests in series, each one running once the previous one has completed. If any AJAX requests in the series pass fail, no more requests are run.|

## \<ng-ajax\> directive
ng-ajax exposes $http functionality, supported properties:

|Property Name| Type |Default| Description |
| --- | ---| ---| --- |
|**url**|String||The URL target of the request.|
|**method**|String|'GET'|The HTTP method to use such as 'GET', 'POST', 'PUT', or 'DELETE'.|
|**params**|Object||An object that contains query parameters to be appended to the specified url when generating a request. If you wish to set the body content when making a POST request, you should use the body property instead.|
|**headers**|Object||HTTP request headers to send. Example: <br> headers='{"Content-Type": "application/x-www-form-urlencoded"}'|
|**body**|Object||Body content to send with the request, typically used with "POST" requests. <br> If Content-Type in the header is set to a value listed below, then the body will be encoded accordingly. <br> **content-type="application/json"** body is encoded like {"foo":"bar baz","x":1} <br> ***content-type="application/x-www-form-urlencoded"*** body is encoded like foo=bar+baz&x=1|
|**loading**||angular.noop|Binding to a variable that indicates if the AJAX call is being performed asynchronously.|
|**ajax-response**||angular.noop|Binding to a variable that will be set to the response object when the AJAX call is successful (a response status code between 200 and 299)|
|**ajax-error**||angular.noop|Binding to a variable that will be set to the response object when the AJAX call is not successful|


## \<ng-ajax-emit\> directive
Listens to the **click** event of the attached element, and dispatches an event `eventName` through the $rootScope to notify the ng-ajax-control to run all the AJAX requests.
Can only be used as an attribute, e.g.
```html
<button ng-ajax-emit='eventName'></button>
```


`

