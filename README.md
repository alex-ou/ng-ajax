# ng-ajax
Easily make ajax requests in AngularJS

ng-ajax provides straight-forward directives which enables you to perform AJAX calls without writing any javascript code, and with great controls.

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

