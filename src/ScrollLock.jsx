import PropTypes from 'prop-types';
import React, { Component } from 'react';

const upKeys = [
    33, // pageUp
    38  // arrowUp
];
const downKeys = [
    32, // space
    34, // pageDown
    40  // arrowDown
];

export default class ScrollLock extends Component {
    static propTypes = {
        enabled: PropTypes.bool,
        className: PropTypes.string
    }

    static defaultProps = {
        enabled: true,
        className: ''
    }

    constructor(props) {
        super(props);
        [
            'listenToScrollEvents',
            'stopListeningToScrollEvents',
            'handleEventDelta',
            'onWheelHandler',
            'onTouchStartHandler',
            'onTouchMoveHandler',
            'onKeyDownHandler',
            'setScrollingElement',
            'cancelScrollEvent'
        ].forEach((func) => { this[func] = this[func].bind(this); });
    }

    componentDidMount() {
        if (this.props.enabled) {
            this.listenToScrollEvents(this.scrollingElement);
        }
    }
    componentWillUnmount() {
        this.stopListeningToScrollEvents(this.scrollingElement);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.enabled !== nextProps.enabled) {
            const fn = nextProps.enabled ?
                this.listenToScrollEvents :
                this.stopListeningToScrollEvents;

            fn(this.scrollingElement);
        }
    }

    setScrollingElement(r) {
        this.scrollingElement = r && r.firstChild;
    }

    handleEventDelta(e, delta) {
        const isDeltaPositive = delta > 0;
        const elem = this.scrollingElement;
        const { scrollTop, scrollHeight, clientHeight } = elem;

        let shouldCancelScroll = false;
        if (isDeltaPositive && delta > scrollHeight - clientHeight - scrollTop) {
            // bottom limit
            elem.scrollTop = scrollHeight;
            shouldCancelScroll = true;
        } else if (!isDeltaPositive && -delta > scrollTop) {
            // top limit
            elem.scrollTop = 0;
            shouldCancelScroll = true;
        }

        if (shouldCancelScroll) {
            this.cancelScrollEvent(e);
        }
    }

    onWheelHandler(e) {
        this.handleEventDelta(e, e.deltaY);
    }

    onTouchStartHandler(e) {
        // set touch start so we can calculate touchmove delta
        this.touchStart = e.changedTouches[0].clientY;
    }

    onTouchMoveHandler(e) {
        const delta = this.touchStart - e.changedTouches[0].clientY;
        this.handleEventDelta(e, delta);
    }

    onKeyDownHandler(e) {
        if (e.target !== this.scrollingElement) {
            return;
        }

        if (upKeys.indexOf(e.keyCode) >= 0) {
            this.handleEventDelta(e, -1);
        } else if (downKeys.indexOf(e.keyCode) >= 0) {
            this.handleEventDelta(e, 1);
        }
    }

    cancelScrollEvent(e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        return false;
    }

    listenToScrollEvents(el) {
        el.addEventListener('wheel', this.onWheelHandler, false);
        el.addEventListener('touchstart', this.onTouchStartHandler, false);
        el.addEventListener('touchmove', this.onTouchMoveHandler, false);
        el.addEventListener('keydown', this.onKeyDownHandler, false);
    }

    stopListeningToScrollEvents(el) {
        el.removeEventListener('wheel', this.onWheelHandler, false);
        el.removeEventListener('touchstart', this.onTouchStartHandler, false);
        el.removeEventListener('touchmove', this.onTouchMoveHandler, false);
        el.removeEventListener('keydown', this.onKeyDownHandler, false);
    }

    render() {
        return (
            <div className={this.props.className} ref={this.setScrollingElement}>
                {React.cloneElement(
                    this.props.children,
                    {
                        tabIndex: 0,
                        style: { outline: 'none' }
                    }
                )}
            </div>
        );
    }
}
