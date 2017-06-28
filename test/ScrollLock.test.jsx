import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';

import ScrollLock from '../src/ScrollLock';

const scrollLockInstance = props =>
    shallow(<ScrollLock {...props}><div /></ScrollLock>).instance();

describe('ScrollLock', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });
    describe('component lifecycle methods', () => {
        it('componentDidMount - enabled', () => {
            const component = scrollLockInstance();
            component.listenToScrollEvents = jest.fn();
            component.componentDidMount();
            expect(component.listenToScrollEvents).toBeCalled();
        });
        it('componentDidMount - enabled=false', () => {
            const component = scrollLockInstance({ enabled: false });
            component.listenToScrollEvents = jest.fn();
            component.componentDidMount();
            expect(component.listenToScrollEvents).toHaveBeenCalledTimes(0);
        });
        it('componentWillUnmount', () => {
            const component = scrollLockInstance();
            component.stopListeningToScrollEvents = jest.fn();
            component.componentWillUnmount();
            expect(component.stopListeningToScrollEvents).toBeCalled();
        });
        it('componentWillReceiveProps - disabled to enabled', () => {
            const component = scrollLockInstance({ enabled: false });
            component.listenToScrollEvents = jest.fn();
            component.componentWillReceiveProps({ enabled: true });
            expect(component.listenToScrollEvents).toBeCalled();
        });
        it('componentWillReceiveProps - enabled to disabled', () => {
            const component = scrollLockInstance();
            component.stopListeningToScrollEvents = jest.fn();
            component.componentWillReceiveProps({ enabled: false });
            expect(component.stopListeningToScrollEvents).toBeCalled();
        });
    });
    describe('component methods', () => {
        describe('setScrollingElement', () => {
            it('should set the scrolling element to firstChild', () => {
                const component = scrollLockInstance();
                assert.equal(component.scrollingElement, undefined);
                const firstChild = <div>BLAH BLAH TEST BLAH</div>;
                component.setScrollingElement({ firstChild });
                assert.equal(component.scrollingElement, firstChild);
            });
            it('should set the scrolling element to undefined if no argument passed', () => {
                const component = scrollLockInstance();
                component.setScrollingElement();
                assert.equal(component.scrollingElement, undefined);
            });
        });
        describe('handleEventDelta', () => {
            it('should cancel scroll event if delta beaks lower limit', () => {
                const component = scrollLockInstance();
                component.cancelScrollEvent = jest.fn();
                component.scrollingElement = {
                    scrollTop: 50,
                    scrollHeight: 450,
                    clientHeight: 400
                };
                component.handleEventDelta({}, -60);
                assert.equal(component.scrollingElement.scrollTop, 0);
                expect(component.cancelScrollEvent).toBeCalled();
            });
            it('should cancel scroll event if delta breaks upper limit', () => {
                const scrollHeight = 450;
                const component = scrollLockInstance();
                component.cancelScrollEvent = jest.fn();
                component.scrollingElement = {
                    scrollTop: 400,
                    scrollHeight,
                    clientHeight: 400
                };
                component.handleEventDelta({}, 60);
                assert.equal(component.scrollingElement.scrollTop, scrollHeight);
                expect(component.cancelScrollEvent).toBeCalled();
            });
        });
        describe('onWheelHandler', () => {
            it('should call handleEventDelta with correct args', () => {
                const synthEvent = {
                    deltaY: 60
                };
                const component = scrollLockInstance();
                component.handleEventDelta = jest.fn();
                component.onWheelHandler(synthEvent);
                expect(component.handleEventDelta).toBeCalledWith(synthEvent, synthEvent.deltaY);
                jest.resetAllMocks();
            });
        });
        describe('onTouchStartHandler', () => {
            it('should set this.touchStart', () => {
                const touchClientY = 50;
                const component = scrollLockInstance();
                component.onTouchStartHandler({
                    changedTouches: [{ clientY: touchClientY }]
                });
                assert.equal(component.touchStart, touchClientY);
            });
        });
        describe('onTouchMoveHandler', () => {
            it('should call handleEventDelta with correct args', () => {
                const touchClientY = 70;
                const touchStart = 50;
                const synthEvent = {
                    changedTouches: [{ clientY: touchClientY }]
                };
                const component = scrollLockInstance();
                component.handleEventDelta = jest.fn();
                component.touchStart = touchStart;
                component.onTouchMoveHandler(synthEvent);
                expect(component.handleEventDelta)
                    .toBeCalledWith(synthEvent, touchStart - touchClientY);
            });
        });
        describe('onKeyDownHandler', () => {
            let component;
            beforeEach(() => {
                component = scrollLockInstance();
                component.handleEventDelta = jest.fn();
            });
            it('should not call handleEventDelta if keydown target is not the scrolling element', () => {
                component.onKeyDownHandler({ keyCode: 32, target: <input /> });
                expect(component.handleEventDelta).toHaveBeenCalledTimes(0);
            });
            it('should call handleEventDelta with delta of 1 for space bar', () => {
                const synthEvent = { keyCode: 32 };
                component.onKeyDownHandler(synthEvent);
                expect(component.handleEventDelta).toBeCalledWith(synthEvent, 1);
            });
            it('should call handleEventDelta with delta of 1 for pageDown', () => {
                const synthEvent = { keyCode: 34 };
                component.onKeyDownHandler(synthEvent);
                expect(component.handleEventDelta).toBeCalledWith(synthEvent, 1);
            });
            it('should call handleEventDelta with delta of 1 for downArrow', () => {
                const synthEvent = { keyCode: 40 };
                component.onKeyDownHandler(synthEvent);
                expect(component.handleEventDelta).toBeCalledWith(synthEvent, 1);
            });
            it('should call handleEventDelta with delta of -1 for pageUp', () => {
                const synthEvent = { keyCode: 33 };
                component.onKeyDownHandler(synthEvent);
                expect(component.handleEventDelta).toBeCalledWith(synthEvent, -1);
            });
            it('should call handleEventDelta with delta of -1 for arrowUp', () => {
                const synthEvent = { keyCode: 38 };
                component.onKeyDownHandler(synthEvent);
                expect(component.handleEventDelta).toBeCalledWith(synthEvent, -1);
            });
        });
        describe('cancelScrollEvent component method', () => {
            it('should cancel scroll event', () => {
                const synthEvent = {
                    stopImmediatePropagation: jest.fn(),
                    preventDefault: jest.fn()
                };
                const component = scrollLockInstance();
                component.cancelScrollEvent(synthEvent);
                expect(synthEvent.stopImmediatePropagation).toBeCalled();
                expect(synthEvent.preventDefault).toBeCalled();
            });
        });
        describe('listenToScrollEvents component method', () => {
            it('should add the proper event listeners', () => {
                const scrollingElement = {
                    addEventListener: jest.fn()
                };
                const component = scrollLockInstance();
                component.listenToScrollEvents(scrollingElement);
                const expectedCalls = [
                    ['wheel', component.onWheelHandler, false],
                    ['touchstart', component.onTouchStartHandler, false],
                    ['touchmove', component.onTouchMoveHandler, false],
                    ['keydown', component.onKeyDownHandler, false]
                ];
                assert.deepEqual(scrollingElement.addEventListener.mock.calls, expectedCalls);
            });
        });
        describe('stopListeningToScrollEvents component method', () => {
            it('should remove the proper event listeners', () => {
                const scrollingElement = {
                    removeEventListener: jest.fn()
                };
                const component = scrollLockInstance();
                component.stopListeningToScrollEvents(scrollingElement);
                const expectedCalls = [
                    ['wheel', component.onWheelHandler, false],
                    ['touchstart', component.onTouchStartHandler, false],
                    ['touchmove', component.onTouchMoveHandler, false],
                    ['keydown', component.onKeyDownHandler, false]
                ];
                assert.deepEqual(scrollingElement.removeEventListener.mock.calls, expectedCalls);
            });
        });
    });
});
