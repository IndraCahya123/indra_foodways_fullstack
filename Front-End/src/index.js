import React from 'react';
import ReactDOM from 'react-dom';

import { UserContextProvider } from './contexts/userContext';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <UserContextProvider>
      <App />
    </UserContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
