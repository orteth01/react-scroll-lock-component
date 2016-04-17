# react-scroll-lock
A React component wrapper that restricts scrolling capabilities of everything except for its children. Check out this very simple [demo](https://orteth01.github.io/react-scroll-lock-component/demo)

### Installation
```
npm install react-scroll-lock-component
```

### Usage
```
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
        </div>s
      </div>
    );
  }
}

```

### Contributing
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

### Credits
Adapted from [this old mixin](http://codepen.io/somethingkindawierd/post/react-mixin-scroll-lock)

### License
MIT