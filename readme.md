# react-scroll-lock-component
[![npm version](https://badge.fury.io/js/react-scroll-lock-component.svg)](https://badge.fury.io/js/react-scroll-lock-component)

A React component wrapper that restricts scrolling capabilities of everything except for its children

### Demo
Check out the demo [here](https://orteth01.github.io/react-scroll-lock-component-demo)!

### Installation
```
npm install react-scroll-lock-component
```

### Usage
```js
import React, { Component } from 'react';
import ScrollLock from 'react-scroll-lock-component';

export default class extends Component {
  render() {
    return (
      <div>
        <ScrollLock> // when scrolling this div nothing else will scroll
          <div> 
            ...
          </div>
        </ScrollLock>
        
        <div> // normal scrolling everywhere else
          ...
        </div>
      </div>
    );
  }
}

```

### Contributing
Please tag orteth01 as reviewer when you create a pull request

### Credits
Adapted from [this old mixin](http://codepen.io/somethingkindawierd/post/react-mixin-scroll-lock)

### License
MIT
