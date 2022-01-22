import { DPN } from '@roanm/debug';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import App from './app/app';
import { environment } from './environments/environment';

DPN.setDebugMode(!environment.production);

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
);
