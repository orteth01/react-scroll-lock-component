'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var upKeys = [33, // pageUp
38 // arrowUp
];
var downKeys = [32, // space
34, // pageDown
40 // arrowDown
];

var ScrollLock = function (_Component) {
    _inherits(ScrollLock, _Component);

    function ScrollLock(props) {
        _classCallCheck(this, ScrollLock);

        var _this = _possibleConstructorReturn(this, (ScrollLock.__proto__ || Object.getPrototypeOf(ScrollLock)).call(this, props));

        ['listenToScrollEvents', 'stopListeningToScrollEvents', 'handleEventDelta', 'onWheelHandler', 'onTouchStartHandler', 'onTouchMoveHandler', 'onKeyDownHandler', 'setScrollingElement', 'cancelScrollEvent'].forEach(function (func) {
            _this[func] = _this[func].bind(_this);
        });
        return _this;
    }

    _createClass(ScrollLock, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            if (this.props.enabled) {
                this.listenToScrollEvents(this.scrollingElement);
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.stopListeningToScrollEvents(this.scrollingElement);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (this.props.enabled !== nextProps.enabled) {
                var fn = nextProps.enabled ? this.listenToScrollEvents : this.stopListeningToScrollEvents;

                fn(this.scrollingElement);
            }
        }
    }, {
        key: 'setScrollingElement',
        value: function setScrollingElement(r) {
            this.scrollingElement = r && r.firstChild;
        }
    }, {
        key: 'handleEventDelta',
        value: function handleEventDelta(e, delta) {
            var isDeltaPositive = delta > 0;
            var elem = this.scrollingElement;
            var scrollTop = elem.scrollTop,
                scrollHeight = elem.scrollHeight,
                clientHeight = elem.clientHeight;


            var shouldCancelScroll = false;
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
    }, {
        key: 'onWheelHandler',
        value: function onWheelHandler(e) {
            this.handleEventDelta(e, e.deltaY);
        }
    }, {
        key: 'onTouchStartHandler',
        value: function onTouchStartHandler(e) {
            // set touch start so we can calculate touchmove delta
            this.touchStart = e.changedTouches[0].clientY;
        }
    }, {
        key: 'onTouchMoveHandler',
        value: function onTouchMoveHandler(e) {
            var delta = this.touchStart - e.changedTouches[0].clientY;
            this.handleEventDelta(e, delta);
        }
    }, {
        key: 'onKeyDownHandler',
        value: function onKeyDownHandler(e) {
            if (e.target !== this.scrollingElement) {
                return;
            }

            if (upKeys.indexOf(e.keyCode) >= 0) {
                this.handleEventDelta(e, -1);
            } else if (downKeys.indexOf(e.keyCode) >= 0) {
                this.handleEventDelta(e, 1);
            }
        }
    }, {
        key: 'cancelScrollEvent',
        value: function cancelScrollEvent(e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            return false;
        }
    }, {
        key: 'listenToScrollEvents',
        value: function listenToScrollEvents(el) {
            el.addEventListener('wheel', this.onWheelHandler, false);
            el.addEventListener('touchstart', this.onTouchStartHandler, false);
            el.addEventListener('touchmove', this.onTouchMoveHandler, false);
            el.addEventListener('keydown', this.onKeyDownHandler, false);
        }
    }, {
        key: 'stopListeningToScrollEvents',
        value: function stopListeningToScrollEvents(el) {
            el.removeEventListener('wheel', this.onWheelHandler, false);
            el.removeEventListener('touchstart', this.onTouchStartHandler, false);
            el.removeEventListener('touchmove', this.onTouchMoveHandler, false);
            el.removeEventListener('keydown', this.onKeyDownHandler, false);
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: this.props.className, ref: this.setScrollingElement },
                _react2.default.cloneElement(this.props.children, {
                    tabIndex: 0,
                    style: { outline: 'none' }
                })
            );
        }
    }]);

    return ScrollLock;
}(_react.Component);

ScrollLock.propTypes = {
    enabled: _react.PropTypes.bool,
    className: _react.PropTypes.string
};
ScrollLock.defaultProps = {
    enabled: true,
    className: ''
};
exports.default = ScrollLock;