import React, { Component } from 'react';

class ScrollLock extends Component {
    componentDidMount() {
        if (this.props.enabled) {
            this.scrollingElement.addEventListener('wheel', this.onScrollHandler, false);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.enabled) {
            this.scrollingElement.addEventListener('wheel', this.onScrollHandler, false);
        } else {
            this.scrollingElement.removeEventListener('wheel', this.onScrollHandler, false);
        }
    }

    componentWillUnmount() {
        this.scrollingElement.removeEventListener('wheel', this.onScrollHandler, false);
    }

    onScrollHandler = (e) => {
        const elem = this.scrollingElement;
        const { scrollTop, scrollHeight, clientHeight } = elem;
        const wheelDelta = e.deltaY;
        const isDeltaPositive = wheelDelta > 0;
        let shouldCancelScroll = false;

        if (isDeltaPositive && wheelDelta > scrollHeight - clientHeight - scrollTop) {
            elem.scrollTop = scrollHeight;
            shouldCancelScroll = true;
        } else if (!isDeltaPositive && -wheelDelta > scrollTop) {
            elem.scrollTop = 0;
            shouldCancelScroll = true;
        }

        if (shouldCancelScroll) {
            this.cancelScrollEvent(e);
        }
    };

    setScrollingElement = (r) => {
        this.scrollingElement = r ? r.firstChild : r;
    };

    cancelScrollEvent = (e) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        return false;
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
