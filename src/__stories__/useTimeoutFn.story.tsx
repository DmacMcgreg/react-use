import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { useTimeoutFn } from '../index';
import ShowDocs from './util/ShowDocs';

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

storiesOf('Animation|useTimeoutFn', module)
  .add('Docs', () => <ShowDocs md={require('../../docs/useTimeoutFn.md')} />)
  .add('Demo', () => <Demo />);
