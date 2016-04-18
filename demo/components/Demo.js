import React, { Component } from 'react';
import ScrollLock from '../..'
require('./demo.scss');

class Demo extends Component {
  render() {
    return (
      <div className="demo">
        <ScrollLock>
          <div className="aside">
            <h2>Scroll Here...</h2>
            <p>Only content within this box should scroll. When you scroll to the top or bottom of this container it has no effect on the other parts of the page</p>
            <hr />
            <p className="lorem-ipsum">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          </div>
        </ScrollLock>

        <div className="main">
          <h2>Scroll Here...</h2>
          <p>Should look normal! The page scrolls as expected!</p>
          <hr />
          <p className="lorem-ipsum">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          <p className="lorem-ipsum">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
      </div>
    );
  }
}

export default Demo;
