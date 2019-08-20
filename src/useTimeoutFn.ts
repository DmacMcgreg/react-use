import * as React from 'react';
import { DependencyList } from 'react';

export default function useTimeoutFn(
  fn: Function,
  ms: number = 0,
  deps: DependencyList = []
): [() => boolean | null, () => void] {
  const timer = React.useRef(0);
  const ready = React.useRef<boolean | null>(false);

  const isReady = React.useCallback(() => ready.current, []);
  const clearTimer = React.useCallback(() => {
    !ready.current && (ready.current = null);
    window.clearTimeout(timer.current);
  }, []);

  React.useEffect(() => {
    ready.current = false;

    timer.current = window.setTimeout(() => {
      ready.current = true;
      fn();
    }, ms);

    return clearTimer;
  }, [ms, ...deps]);

  return [isReady, clearTimer];
}
