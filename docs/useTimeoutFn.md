# `useTimeoutFn`

calls given function after specified number of milliseconds.  
**Note:** this hook does not re-render component by itself. 

## Usage

```jsx
import * as React from 'react';
import { useTimeoutFn } from 'react-use';

const Demo = () => {
  const [state, setState] = React.useState('Not called yet');
  const [timerStarter, startTimer] = React.useState(0);

  function fn() {
    setState(`called at ${Date.now()}`);
  }

  const [isReady, cancel] = useTimeoutFn(fn, 5000, [timerStarter]);

  return (
    <div>
      <div>{isReady() !== null ? 'Function will be called in 5 seconds' : 'Timer cancelled'}</div>
      <button
        onClick={() => {
          isReady() === false ? cancel() : startTimer(timerStarter + 1);
        }}
      >
        {isReady() === false ? 'cancel' : 'restart'} timeout
      </button>
      <br />
      <div>Function called: {isReady() ? 'Yes' : 'No'}</div>
      <div>{state}</div>
    </div>
  );
};
```

## Reference

```ts 
const [
    isReady: ()=>boolean|null,
    cancel: ()=>void
] = useTimeoutFn(fn: Function, ms: number = 0, deps: DependencyList = []);
```

- **`fn`**_` :Function`_ - function that will be called;
- **`ms`**_` :number`_ - delay in milliseconds;
- **`ms`**_` :DependencyList`_ - dependencies that will restart the timeout. Previous timeout will be cancelled;
- **`isReady`**_` :()=>boolean|null`_ - function returning current timeout state:
    - `false` - pending function call
    - `true` - function been called
    - `null` - timeout been cancelled
- **`cancel`**_` :()=>boolean|null`_ - cancel the timeout

