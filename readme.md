# ⚠️ DEPRECATED

CSS is awesome and handles this
https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior

# react-scroll-lock-component
[![npm version](https://badge.fury.io/js/react-scroll-lock-component.svg)](https://badge.fury.io/js/react-scroll-lock-component)
[![Build Status](https://travis-ci.org/orteth01/react-scroll-lock-component.svg?branch=master)](https://travis-ci.org/orteth01/react-scroll-lock-component)

A React component wrapper that restricts scrolling capabilities of everything except for its children. 

Wheel events, touchmove events, and key press events that affect page location (e.g. directional arrows, pageup/pagedown/spacebar) are all locked.

## Demo
Check out the demo [here](https://orteth01.github.io/react-scroll-lock-component-demo)!

## Installation
```
npm install react-scroll-lock-component
```
or 
```
yarn add react-scroll-lock-component
```

## Usage

```js
import React from 'react';
import ScrollLock from 'react-scroll-lock-component';

export default () => (
    <div>
        <ScrollLock>
            <div> 
                {/*
                    unlike normal scroll functionality, when the user scrolls this
                    div and reaches the beginning or end nothing else on the page will scroll
                */}
            </div>
        </ScrollLock>
        <div>
            {/* scrolling outside of the scroll lock will remain normal */}
        </div>
    </div>
);
```

### optional props

|Prop|description|default value|
|:-:|:-:|:-:|
| enabled|programatically enable or disable the scroll lock|`true`|
|className|apply custom styles to the scroll lock component|`''`|

## Credits
Adapted from [this old mixin](http://codepen.io/somethingkindawierd/post/react-mixin-scroll-lock)

## License
MIT
