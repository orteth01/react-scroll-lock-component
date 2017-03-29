import React from 'react';
import assert from 'assert';
import ScrollLock from '../src/ScrollLock';
import {shallow} from 'enzyme';

describe('ScrollLock', () => {
    describe('component lifecycle methods', () => {
        afterEach(() => {
            jest.resetAllMocks();
        });
        it('componentDidMount - enabled', () => {
            const component = shallow(
                <ScrollLock>
                    <div/>
                </ScrollLock>
            ).instance();
            component.listenToScrollEvents = jest.fn();

            component.componentDidMount();

            expect(component.listenToScrollEvents).toBeCalled();
        });
        it('componentDidMount - enabled=false', () => {
            const component = shallow(
                <ScrollLock enabled={false}>
                    <div/>
                </ScrollLock>
            ).instance();
            component.listenToScrollEvents = jest.fn();

            component.componentDidMount();

            expect(component.listenToScrollEvents).toHaveBeenCalledTimes(0);
        });
        it('componentWillUnmount', () => {
            const component = shallow(
                <ScrollLock enabled={false}>
                    <div/>
                </ScrollLock>
            ).instance();
            component.stopListeningToScrollEvents = jest.fn();

            component.componentWillUnmount();

            expect(component.stopListeningToScrollEvents).toBeCalled();
        });
        it('componentWillReceiveProps - disabled to enabled', () => {
            const component = shallow(
                <ScrollLock enabled={false}>
                    <div/>
                </ScrollLock>
            ).instance();
            component.listenToScrollEvents = jest.fn();

            component.componentWillReceiveProps({enabled: true});

            expect(component.listenToScrollEvents).toBeCalled();
        });
        it('componentWillReceiveProps - enabled to disabled', () => {
            const component = shallow(
                <ScrollLock>
                    <div/>
                </ScrollLock>
            ).instance();
            component.stopListeningToScrollEvents = jest.fn();

            component.componentWillReceiveProps({enabled: false});

            expect(component.stopListeningToScrollEvents).toBeCalled();
        });
    });

    describe('component methods', () => {
        describe('setScrollingElement', () => {
            it('should set the scrolling element to firstChild', () => {
                const component = shallow(
                    <ScrollLock>
                        <div/>
                    </ScrollLock>
                ).instance();

                assert.equal(component.scrollingElement, undefined);

                const firstChild = <div>BLAH BLAH TEST BLAH</div>;
                component.setScrollingElement({firstChild});

                assert.equal(component.scrollingElement, firstChild);
            });
            it('should set the scrolling element to undefined if no argument passed', () => {
                const component = shallow(
                    <ScrollLock>
                        <div/>
                    </ScrollLock>
                ).instance();

                component.setScrollingElement();

                assert.equal(component.scrollingElement, undefined);
            });
        });

        describe('handleEventDelta', () => {
            afterEach(() => {
                jest.resetAllMocks();
            });
            it('should cancel scroll event if delta beaks lower limit', () => {
                const component = shallow(
                    <ScrollLock>
                        <div/>
                    </ScrollLock>
                ).instance();
                component.cancelScrollEvent = jest.fn();
                component.scrollingElement = {
                    scrollTop: 50,
                    scrollHeight: 450,
                    clientHeight: 400
                };

                component.handleEventDelta({}, -60);

                // scroll top should be 0
                assert.equal(component.scrollingElement.scrollTop, 0);
                expect(component.cancelScrollEvent).toBeCalled();
            });
            it('should cancel scroll event if delta breaks upper limit', () => {
                const scrollHeight = 450;
                const component = shallow(
                    <ScrollLock>
                        <div/>
                    </ScrollLock>
                ).instance();
                component.cancelScrollEvent = jest.fn();
                component.scrollingElement = {
                    scrollTop: 400,
                    scrollHeight,
                    clientHeight: 400
                };

                component.handleEventDelta({}, 60);

                // scroll top should be scrollHeight of scrollingElement
                assert.equal(component.scrollingElement.scrollTop, scrollHeight);
                expect(component.cancelScrollEvent).toBeCalled();
            });
        });

        describe('onWheelHandler', () => {
            it('should call handleEventDelta with correct args', () => {
                const synthEvent = {
                    deltaY: 60
                };
                const component = shallow(
                    <ScrollLock>
                        <div/>
                    </ScrollLock>
                ).instance();
                component.handleEventDelta = jest.fn();

                component.onWheelHandler(synthEvent);

                expect(component.handleEventDelta).toBeCalledWith(synthEvent, synthEvent.deltaY);
                jest.resetAllMocks();
            });
        });

        describe('onTouchStartHandler', () => {
            it('should set this.touchStart', () => {
                const touchClientY = 50;
                const component = shallow(
                    <ScrollLock>
                        <div/>
                    </ScrollLock>
                ).instance();
                component.onTouchStartHandler({
                    changedTouches:[{clientY: touchClientY}]
                });
                assert.equal(component.touchStart, touchClientY);
            });
        });

        describe('onTouchMoveHandler', () => {
            it('should call handleEventDelta with correct args', () => {
                const touchClientY = 70;
                const touchStart = 50;
                const synthEvent = {
                    changedTouches:[{clientY: touchClientY}]
                };
                const component = shallow(
                    <ScrollLock>
                        <div/>
                    </ScrollLock>
                ).instance();
                component.handleEventDelta = jest.fn();
                component.touchStart = touchStart;

                component.onTouchMoveHandler(synthEvent);

                expect(component.handleEventDelta).toBeCalledWith(synthEvent, touchStart - touchClientY);
            });
        });

        describe('cancelScrollEvent component method', () => {
            it('should cancel scroll event', () => {
                const synthEvent = {
                    stopImmediatePropagation: jest.fn(),
                    preventDefault: jest.fn()
                };
                const component = shallow(
                    <ScrollLock>
                        <div/>
                    </ScrollLock>
                ).instance();

                component.cancelScrollEvent(synthEvent);

                expect(synthEvent.stopImmediatePropagation).toBeCalled();
                expect(synthEvent.preventDefault).toBeCalled();

                jest.resetAllMocks();
            });
        });

        describe('listenToScrollEvents component method', () => {
            afterEach(() => {
                jest.resetAllMocks();
            });
            it('should add the proper event listeners', () => {
                const scrollingElement = {
                    addEventListener: jest.fn()
                };
                const component = shallow(
                    <ScrollLock>
                        <div/>
                    </ScrollLock>
                ).instance();

                component.listenToScrollEvents(scrollingElement);

                const expectedCalls = [
                    [ 'wheel', component.onWheelHandler, false ],
                    [ 'touchstart', component.onTouchStartHandler, false ],
                    [ 'touchmove', component.onTouchMoveHandler, false ]
                ];
                assert.deepEqual(scrollingElement.addEventListener.mock.calls, expectedCalls)

                jest.resetAllMocks();
            });
        });
        describe('stopListeningToScrollEvents component method', () => {
            afterEach(() => {
                jest.resetAllMocks();
            });
            it('should remove the proper event listeners', () => {
                const scrollingElement = {
                    removeEventListener: jest.fn()
                };
                const component = shallow(
                    <ScrollLock>
                        <div/>
                    </ScrollLock>
                ).instance();

                component.stopListeningToScrollEvents(scrollingElement);
                const expectedCalls = [
                    [ 'wheel', component.onWheelHandler, false ],
                    [ 'touchstart', component.onTouchStartHandler, false ],
                    [ 'touchmove', component.onTouchMoveHandler, false ]
                ];
                assert.deepEqual(scrollingElement.removeEventListener.mock.calls, expectedCalls)
                jest.resetAllMocks();
            });
        });
    })
});
