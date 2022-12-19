import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { Amplify } from 'aws-amplify';
import AwsConfig from './aws-exports.js';

Amplify.configure(AwsConfig);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
