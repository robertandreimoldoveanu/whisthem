import { DPN } from '@roanm/debug';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import App from './app/app';

DPN.setDebugMode(true);

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
);
