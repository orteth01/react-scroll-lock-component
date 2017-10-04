import React from 'react';
import { shallow } from 'enzyme';
import ScrollLock from '../src/ScrollLock';

const scrollLockInstance = (props = {}) =>
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
        let component;
        beforeEach(() => {
            component = scrollLockInstance();
        });
        describe('setScrollingElement', () => {
            it('should set the scrolling element to firstChild', () => {
                expect(component.scrollingElement).toBe(undefined);
                const firstChild = <div>BLAH BLAH TEST BLAH</div>;
                component.setScrollingElement({ firstChild });
                expect(component.scrollingElement).toBe(firstChild);
            });
            it('should set the scrolling element to undefined if no argument passed', () => {
                component.setScrollingElement();
                expect(component.scrollingElement).toBe(undefined);
            });
        });
        describe('handleEventDelta', () => {
            it('should cancel scroll event if delta breaks lower limit', () => {
                component.cancelScrollEvent = jest.fn();
                component.scrollingElement = {
                    scrollTop: 50,
                    scrollHeight: 450,
                    clientHeight: 400
                };
                component.handleEventDelta({}, -60);
                expect(component.scrollingElement.scrollTop).toBe(0);
                expect(component.cancelScrollEvent).toBeCalled();
            });
            it('should cancel scroll event if delta breaks upper limit', () => {
                const scrollHeight = 450;
                component.cancelScrollEvent = jest.fn();
                component.scrollingElement = {
                    scrollTop: 400,
                    scrollHeight,
                    clientHeight: 400
                };
                component.handleEventDelta({}, 60);
                expect(component.scrollingElement.scrollTop).toBe(scrollHeight);
                expect(component.cancelScrollEvent).toBeCalled();
            });
        });
        describe('onWheelHandler', () => {
            it('should call handleEventDelta with correct args', () => {
                const synthEvent = { deltaY: 60 };
                component.handleEventDelta = jest.fn();
                component.onWheelHandler(synthEvent);
                expect(component.handleEventDelta).toBeCalledWith(synthEvent, synthEvent.deltaY);
            });
        });
        describe('onTouchStartHandler', () => {
            it('should set this.touchStart', () => {
                const touchClientY = 50;
                component.onTouchStartHandler({
                    changedTouches: [{ clientY: touchClientY }]
                });
                expect(component.touchStart).toBe(touchClientY);
            });
        });
        describe('onTouchMoveHandler', () => {
            it('should call handleEventDelta with correct args', () => {
                const touchClientY = 70;
                const touchStart = 50;
                const synthEvent = {
                    changedTouches: [{ clientY: touchClientY }]
                };
                component.handleEventDelta = jest.fn();
                component.touchStart = touchStart;
                component.onTouchMoveHandler(synthEvent);
                expect(component.handleEventDelta)
                    .toBeCalledWith(synthEvent, touchStart - touchClientY);
            });
        });
        describe('onKeyDownHandler', () => {
            beforeEach(() => {
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
        describe('cancelScrollEvent', () => {
            it('should cancel scroll event', () => {
                const synthEvent = {
                    stopImmediatePropagation: jest.fn(),
                    preventDefault: jest.fn()
                };
                component.cancelScrollEvent(synthEvent);
                expect(synthEvent.stopImmediatePropagation).toBeCalled();
                expect(synthEvent.preventDefault).toBeCalled();
            });
        });
        describe('listenToScrollEvents', () => {
            it('should add the proper event listeners', () => {
                const scrollingElement = {
                    addEventListener: jest.fn()
                };
                component.listenToScrollEvents(scrollingElement);
                const expectedCalls = [
                    ['wheel', component.onWheelHandler, false],
                    ['touchstart', component.onTouchStartHandler, false],
                    ['touchmove', component.onTouchMoveHandler, false],
                    ['keydown', component.onKeyDownHandler, false]
                ];
                expect(scrollingElement.addEventListener.mock.calls).toEqual(expectedCalls);
            });
        });
        describe('stopListeningToScrollEvents', () => {
            it('should remove the proper event listeners', () => {
                const scrollingElement = {
                    removeEventListener: jest.fn()
                };
                component.stopListeningToScrollEvents(scrollingElement);
                const expectedCalls = [
                    ['wheel', component.onWheelHandler, false],
                    ['touchstart', component.onTouchStartHandler, false],
                    ['touchmove', component.onTouchMoveHandler, false],
                    ['keydown', component.onKeyDownHandler, false]
                ];
                expect(scrollingElement.removeEventListener.mock.calls).toEqual(expectedCalls);
            });
        });
    });
});
