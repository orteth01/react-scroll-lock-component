import React, { Component } from 'react';

export default class extends Component {
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
            this.cancelScrollEvent(e);
        } else if (!isDeltaPositive && -wheelDelta > scrollTop) {
            elem.scrollTop = 0;
            this.cancelScrollEvent(e);
        }
    };

    setScrollingElement = (ref) => {
        this.scrollingElement = ref ? ref.firstChild : ref;
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
