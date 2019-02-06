import React from 'react';
import { shallow, mount } from 'enzyme';
import ScrollLock from '../src/ScrollLock';

const mountScrollLock = (props = {}) =>
    mount(<ScrollLock {...props}><div /></ScrollLock>);
const shallowScrollLock = (props = {}) =>
    shallow(<ScrollLock {...props}><div /></ScrollLock>);

describe('ScrollLock', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });
    describe('component lifecycle methods', () => {
        it('componentDidMount - enabled', () => {
            const componentInstance = mountScrollLock().instance();
            componentInstance.listenToScrollEvents = jest.fn();
            componentInstance.componentDidMount();
            expect(componentInstance.listenToScrollEvents).toBeCalled();
        });
        it('componentDidMount - enabled=false', () => {
            const componentInstance = mountScrollLock({ enabled: false }).instance();
            componentInstance.listenToScrollEvents = jest.fn();
            componentInstance.componentDidMount();
            expect(componentInstance.listenToScrollEvents).toHaveBeenCalledTimes(0);
        });
        it('componentWillUnmount', () => {
            const componentInstance = mountScrollLock().instance();
            componentInstance.stopListeningToScrollEvents = jest.fn();
            componentInstance.componentWillUnmount();
            expect(componentInstance.stopListeningToScrollEvents).toBeCalled();
        });
        it('componentDidUpdate - disabled to enabled', () => {
            const component = mountScrollLock({ enabled: false });
            const componentInstance = component.instance();
            componentInstance.listenToScrollEvents = jest.fn();
            component.setProps({ enabled: true });
            expect(componentInstance.listenToScrollEvents).toBeCalled();
        });
        it('componentDidUpdate - enabled to disabled', () => {
            const component = mountScrollLock();
            const componentInstance = component.instance();
            componentInstance.stopListeningToScrollEvents = jest.fn();
            component.setProps({ enabled: false });
            expect(componentInstance.stopListeningToScrollEvents).toBeCalled();
        });
    });
    describe('component methods', () => {
        let instance;
        beforeEach(() => {
            instance = shallowScrollLock().instance();
        });
        describe('setScrollingElement', () => {
            it('should set the scrolling element to firstChild', () => {
                expect(instance.scrollingElement).toBe(undefined);
                const firstChild = <div>BLAH BLAH TEST BLAH</div>;
                instance.setScrollingElement({ firstChild });
                expect(instance.scrollingElement).toBe(firstChild);
            });
            it('should set the scrolling element to undefined if no argument passed', () => {
                instance.setScrollingElement();
                expect(instance.scrollingElement).toBe(undefined);
            });
        });
        describe('handleEventDelta', () => {
            it('should cancel scroll event if delta breaks lower limit', () => {
                instance.cancelScrollEvent = jest.fn();
                instance.scrollingElement = {
                    scrollTop: 50,
                    scrollHeight: 450,
                    clientHeight: 400
                };
                instance.handleEventDelta({}, -60);
                expect(instance.scrollingElement.scrollTop).toBe(0);
                expect(instance.cancelScrollEvent).toBeCalled();
            });
            it('should cancel scroll event if delta breaks upper limit', () => {
                const scrollHeight = 450;
                instance.cancelScrollEvent = jest.fn();
                instance.scrollingElement = {
                    scrollTop: 400,
                    scrollHeight,
                    clientHeight: 400
                };
                instance.handleEventDelta({}, 60);
                expect(instance.scrollingElement.scrollTop).toBe(scrollHeight);
                expect(instance.cancelScrollEvent).toBeCalled();
            });
        });
        describe('onWheelHandler', () => {
            it('should call handleEventDelta with correct args', () => {
                const synthEvent = { deltaY: 60 };
                instance.handleEventDelta = jest.fn();
                instance.onWheelHandler(synthEvent);
                expect(instance.handleEventDelta).toBeCalledWith(synthEvent, synthEvent.deltaY);
            });
        });
        describe('onTouchStartHandler', () => {
            it('should set this.touchStart', () => {
                const touchClientY = 50;
                instance.onTouchStartHandler({
                    changedTouches: [{ clientY: touchClientY }]
                });
                expect(instance.touchStart).toBe(touchClientY);
            });
        });
        describe('onTouchMoveHandler', () => {
            it('should call handleEventDelta with correct args', () => {
                const touchClientY = 70;
                const touchStart = 50;
                const synthEvent = {
                    changedTouches: [{ clientY: touchClientY }]
                };
                instance.handleEventDelta = jest.fn();
                instance.touchStart = touchStart;
                instance.onTouchMoveHandler(synthEvent);
                expect(instance.handleEventDelta)
                    .toBeCalledWith(synthEvent, touchStart - touchClientY);
            });
        });
        describe('onKeyDownHandler', () => {
            beforeEach(() => {
                instance.handleEventDelta = jest.fn();
            });
            it('should not call handleEventDelta if keydown target is not the scrolling element', () => {
                instance.onKeyDownHandler({ keyCode: 32, target: <input /> });
                expect(instance.handleEventDelta).toHaveBeenCalledTimes(0);
            });
            it('should call handleEventDelta with delta of 1 for space bar', () => {
                const synthEvent = { keyCode: 32 };
                instance.onKeyDownHandler(synthEvent);
                expect(instance.handleEventDelta).toBeCalledWith(synthEvent, 1);
            });
            it('should call handleEventDelta with delta of 1 for pageDown', () => {
                const synthEvent = { keyCode: 34 };
                instance.onKeyDownHandler(synthEvent);
                expect(instance.handleEventDelta).toBeCalledWith(synthEvent, 1);
            });
            it('should call handleEventDelta with delta of 1 for downArrow', () => {
                const synthEvent = { keyCode: 40 };
                instance.onKeyDownHandler(synthEvent);
                expect(instance.handleEventDelta).toBeCalledWith(synthEvent, 1);
            });
            it('should call handleEventDelta with delta of -1 for pageUp', () => {
                const synthEvent = { keyCode: 33 };
                instance.onKeyDownHandler(synthEvent);
                expect(instance.handleEventDelta).toBeCalledWith(synthEvent, -1);
            });
            it('should call handleEventDelta with delta of -1 for arrowUp', () => {
                const synthEvent = { keyCode: 38 };
                instance.onKeyDownHandler(synthEvent);
                expect(instance.handleEventDelta).toBeCalledWith(synthEvent, -1);
            });
        });
        describe('cancelScrollEvent', () => {
            it('should cancel scroll event', () => {
                const synthEvent = {
                    stopImmediatePropagation: jest.fn(),
                    preventDefault: jest.fn()
                };
                instance.cancelScrollEvent(synthEvent);
                expect(synthEvent.stopImmediatePropagation).toBeCalled();
                expect(synthEvent.preventDefault).toBeCalled();
            });
        });
        describe('listenToScrollEvents', () => {
            it('should add the proper event listeners', () => {
                const scrollingElement = {
                    addEventListener: jest.fn()
                };
                instance.listenToScrollEvents(scrollingElement);
                const expectedCalls = [
                    ['wheel', instance.onWheelHandler, false],
                    ['touchstart', instance.onTouchStartHandler, false],
                    ['touchmove', instance.onTouchMoveHandler, false],
                    ['keydown', instance.onKeyDownHandler, false]
                ];
                expect(scrollingElement.addEventListener.mock.calls).toEqual(expectedCalls);
            });
        });
        describe('stopListeningToScrollEvents', () => {
            it('should remove the proper event listeners', () => {
                const scrollingElement = {
                    removeEventListener: jest.fn()
                };
                instance.stopListeningToScrollEvents(scrollingElement);
                const expectedCalls = [
                    ['wheel', instance.onWheelHandler, false],
                    ['touchstart', instance.onTouchStartHandler, false],
                    ['touchmove', instance.onTouchMoveHandler, false],
                    ['keydown', instance.onKeyDownHandler, false]
                ];
                expect(scrollingElement.removeEventListener.mock.calls).toEqual(expectedCalls);
            });
        });
    });
});
