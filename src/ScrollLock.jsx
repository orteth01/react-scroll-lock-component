import React, { Component } from 'react';

class ScrollLock extends Component {
  componentDidMount() {
    this.scrollingElement.addEventListener('wheel', this.onScrollHandler, false);
  }

  componentWillUnmount() {
    this.scrollingElement.removeEventListener('wheel', this.onScrollHandler, false);
  }

  onScrollHandler = (e) => {
    const elem = this.scrollingElement;
    const { scrollTop, scrollHeight, clientHeight } = elem;
    const wheelDelta = e.deltaY;
    const isDeltaPositive = wheelDelta > 0;

    if (isDeltaPositive && wheelDelta > scrollHeight - clientHeight - scrollTop) {
      elem.scrollTop = scrollHeight;
      return this.cancelScrollEvent(e);
    }
    else if (!isDeltaPositive && -wheelDelta > scrollTop) {
      elem.scrollTop = 0;
      return this.cancelScrollEvent(e);
    }
  };

  cancelScrollEvent = (e) => {
    e.stopImmediatePropagation();
    e.preventDefault();
    e.returnValue = false;
    return false;
  };

  render() {
    return (
      <div ref={r => this.scrollingElement = r.firstChild}>
        {this.props.children}
      </div>
    );
  }
}

export default ScrollLock;
