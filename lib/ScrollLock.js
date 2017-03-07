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

var ScrollLock = function (_Component) {
    _inherits(ScrollLock, _Component);

    function ScrollLock(props) {
        _classCallCheck(this, ScrollLock);

        var _this = _possibleConstructorReturn(this, (ScrollLock.__proto__ || Object.getPrototypeOf(ScrollLock)).call(this, props));

        _this.listenToWheelEvent = _this.listenToWheelEvent.bind(_this);
        _this.stopListeningToWheelEvent = _this.stopListeningToWheelEvent.bind(_this);
        _this.onScrollHandler = _this.onScrollHandler.bind(_this);
        _this.setScrollingElement = _this.setScrollingElement.bind(_this);
        _this.cancelScrollEvent = _this.cancelScrollEvent.bind(_this);
        return _this;
    }

    _createClass(ScrollLock, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            if (this.props.enabled) {
                this.listenToWheelEvent();
            }
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (this.props.enabled !== nextProps.enabled) {
                var fn = nextProps.enabled ? this.listenToWheelEvent : this.stopListeningToWheelEvent;
                fn();
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.stopListeningToWheelEvent();
        }
    }, {
        key: 'listenToWheelEvent',
        value: function listenToWheelEvent() {
            this.scrollingElement.addEventListener('wheel', this.onScrollHandler, false);
        }
    }, {
        key: 'stopListeningToWheelEvent',
        value: function stopListeningToWheelEvent() {
            this.scrollingElement.removeEventListener('wheel', this.onScrollHandler, false);
        }
    }, {
        key: 'onScrollHandler',
        value: function onScrollHandler(e) {
            var elem = this.scrollingElement;
            var scrollTop = elem.scrollTop,
                scrollHeight = elem.scrollHeight,
                clientHeight = elem.clientHeight;

            var wheelDelta = e.deltaY;
            var isDeltaPositive = wheelDelta > 0;

            var shouldCancelScroll = false;
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
        }
    }, {
        key: 'setScrollingElement',
        value: function setScrollingElement(r) {
            this.scrollingElement = r && r.firstChild;
        }
    }, {
        key: 'cancelScrollEvent',
        value: function cancelScrollEvent(e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            return false;
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { ref: this.setScrollingElement },
                this.props.children
            );
        }
    }]);

    return ScrollLock;
}(_react.Component);

ScrollLock.defaultProps = {
    enabled: true
};

exports.default = ScrollLock;
//# sourceMappingURL=ScrollLock.js.map