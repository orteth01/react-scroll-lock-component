import React from 'react';
import assert from 'assert';
import ScrollLock from '../src/ScrollLock';
import {mount, shallow} from 'enzyme';

describe('ScrollLock', () => {
    describe('cancelScrollEvent component method', () => {
        it('should cancel scroll event', () => {
            const synthEvent = {
                stopImmediatePropagation: jest.fn(),
                preventDefault: jest.fn()
            };
            const containerInstance = shallow(
                <ScrollLock>
                    <div/>
                </ScrollLock>
            ).instance();

            containerInstance.cancelScrollEvent(synthEvent);

            expect(synthEvent.stopImmediatePropagation).toBeCalled();
            expect(synthEvent.preventDefault).toBeCalled();
        });
    });
    describe('setScrollingElement component method', () => {
        it('should set the scrolling element to firstChild', () => {
            const containerInstance = shallow(
                <ScrollLock>
                    <div/>
                </ScrollLock>
            ).instance();

            assert.equal(containerInstance.scrollingElement, undefined);

            const firstChild = <div>BLAH BLAH TEST BLAH</div>;
            containerInstance.setScrollingElement({firstChild});

            assert.equal(containerInstance.scrollingElement, firstChild);
        });
        it('should set the scrolling element to undefined if no argument passed', () => {
            const containerInstance = shallow(
                <ScrollLock>
                    <div/>
                </ScrollLock>
            ).instance();

            containerInstance.setScrollingElement();

            assert.equal(containerInstance.scrollingElement, undefined);
        });
    });
    describe('onScrollHandler component method', () => {
        beforeEach(() => {
            ScrollLock.prototype.cancelScrollEvent = jest.fn();
        });
        it('should cancel scroll event if attempting to scroll up past top of scroll lock', () => {
            const containerInstance = shallow(
                <ScrollLock>
                    <div/>
                </ScrollLock>
            ).instance();
            containerInstance.scrollingElement = {
                scrollTop: 50,
                scrollHeight: 450,
                clientHeight: 400
            };
            containerInstance.onScrollHandler({deltaY: -60});

            // scroll top should be 0
            assert.equal(containerInstance.scrollingElement.scrollTop, 0);
            expect(ScrollLock.prototype.cancelScrollEvent).toBeCalled();
        });
        it('should cancel scroll event if attempting to scroll down past bottom of scroll lock', () => {
            const scrollHeight = 450;
            const containerInstance = shallow(
                <ScrollLock>
                    <div/>
                </ScrollLock>
            ).instance();
            containerInstance.scrollingElement = {
                scrollTop: 400,
                scrollHeight,
                clientHeight: 400
            };
            containerInstance.onScrollHandler({deltaY: 60});

            // scroll top should be scrollHeight of scrollingElement
            assert.equal(containerInstance.scrollingElement.scrollTop, scrollHeight);
            expect(ScrollLock.prototype.cancelScrollEvent).toBeCalled();
        });
    });
    describe('component lifecycle methods', () => {
        beforeEach(() => {
            ScrollLock.prototype.listenToWheelEvent = jest.fn();
            ScrollLock.prototype.stopListeningToWheelEvent = jest.fn();
        });
        it('should add wheel event listener to child component on mount', () => {
            const container = mount(
                <ScrollLock>
                    <div/>
                </ScrollLock>
            );
            expect(ScrollLock.prototype.listenToWheelEvent).toBeCalled();
        });
        it('should not add wheel event listener to child component on mount if enabled=false', () => {
            const container = mount(
                <ScrollLock enabled={false}>
                    <div/>
                </ScrollLock>
            );
            expect(ScrollLock.prototype.listenToWheelEvent).toHaveBeenCalledTimes(0);
        });
        it('should remove child component wheel event listener on unmount', () => {
            const container = mount(
                <ScrollLock>
                    <div/>
                </ScrollLock>
            );
            container.unmount();
            expect(ScrollLock.prototype.stopListeningToWheelEvent).toBeCalled();
        });
        it('should add or remove wheel event listener when enabled prop changes', () => {
            const container = mount(
                <ScrollLock>
                    <div/>
                </ScrollLock>
            );
            // disable
            container.setProps({enabled: false});
            // enable
            container.setProps({enabled: true});

            // called on mount and when re enabled
            expect(ScrollLock.prototype.listenToWheelEvent).toHaveBeenCalledTimes(2);

            // called when disabled
            expect(ScrollLock.prototype.stopListeningToWheelEvent).toHaveBeenCalledTimes(1);
        });
    });

    // TODO: figure out how to test listenToWheelEvent and stopListeningToWheelEvent
});
