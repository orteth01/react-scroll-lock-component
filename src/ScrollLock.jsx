import React, { Component } from 'react';

class ScrollLock extends Component {
  componentDidMount() {
    this.scrollingElement.addEventListener('wheel', this.onScrollHandler, false);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.enabled) {
      this.scrollingElement.addEventListener('wheel', this.onScrollHandler, false)
    } else {
      this.scrollingElement.removeEventListener('wheel', this.onScrollHandler, false)
    }
  }

  componentWillUnmount() {
    this.scrollingElement.removeEventListener('wheel', this.onScrollHandler, false);
  }

  setScrollingElement = (r) => {
    this.scrollingElement = r ? r.firstChild : r;
  };

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
    const { enabled } = this.props
    if (enabled) {
      e.stopImmediatePropagation();
      e.preventDefault();
      e.returnValue = false;
      return false;
    }
  };

  render() {
    return (
      <div ref={this.setScrollingElement}>
        {this.props.children}
      </div>
    );
  }
}

ScrollLock.defaultProps = {
  enabled: true
};

export default ScrollLock;
