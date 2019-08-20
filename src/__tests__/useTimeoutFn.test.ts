import { act, renderHook } from '@testing-library/react-hooks';
import * as React from 'react';
import useTimeoutFn from '../useTimeoutFn';

describe('useTimeoutFn', () => {
  it('should be defined', () => {
    expect(useTimeoutFn).toBeDefined();
  });

  it('first returned element should be a function', () => {
    const spy = jest.fn();
    const hook = renderHook(() => useTimeoutFn(spy), { initialProps: false });
    expect(typeof hook.result.current[0]).toBe('function');
  });

  it('second returned element should be a function', () => {
    const spy = jest.fn();
    const hook = renderHook(() => useTimeoutFn(spy), { initialProps: false });
    expect(typeof hook.result.current[1]).toBe('function');
  });

  it('should trigger given function after delay', done => {
    const spy = jest.fn();
    renderHook(() => useTimeoutFn(spy, 10), { initialProps: false });

    setTimeout(() => {
      expect(spy.mock.calls.length).toBe(0);
      setTimeout(() => {
        expect(spy.mock.calls.length).toBe(1);
        done();
      }, 10);
    }, 5);
  });

  it('first function should represent current call state', done => {
    const spy = jest.fn();
    const hook = renderHook(() => useTimeoutFn(spy, 10), { initialProps: false });
    const [isReady] = hook.result.current;

    setTimeout(() => {
      expect(spy.mock.calls.length).toBe(0);
      expect(isReady()).toBe(false);
      setTimeout(() => {
        expect(spy.mock.calls.length).toBe(1);
        expect(isReady()).toBe(true);
        done();
      }, 10);
    }, 5);
  });

  it('second function should cancel the timeout', done => {
    const spy = jest.fn();
    const hook = renderHook(() => useTimeoutFn(spy, 10), { initialProps: false });
    const [isReady, cancel] = hook.result.current;

    setTimeout(() => {
      expect(spy.mock.calls.length).toBe(0);
      expect(isReady()).toBe(false);
      act(() => cancel());

      setTimeout(() => {
        expect(spy.mock.calls.length).toBe(0);
        expect(isReady()).toBe(null);
        done();
      }, 10);
    }, 5);
  });

  it('dependencies change should restart timeout', done => {
    const spy = jest.fn();
    const hook = renderHook(
      () => {
        const [state, setState] = React.useState(false);
        setTimeout(() => {
          act(() => setState(true));
        }, 8);

        return useTimeoutFn(spy, 10, [state]);
      },
      { initialProps: false }
    );
    const [isReady, cancel] = hook.result.current;

    setTimeout(() => {
      expect(spy.mock.calls.length).toBe(0);
      expect(isReady()).toBe(false);
      act(() => cancel());

      setTimeout(() => {
        expect(spy.mock.calls.length).toBe(0);
        expect(isReady()).toBe(false);

        setTimeout(() => {
          expect(spy.mock.calls.length).toBe(1);
          expect(isReady()).toBe(true);
          done();
        }, 10);
      }, 10);
    }, 5);
  });
});
