import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Parse from 'parse/dist/parse.min.js';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ttp.css';
import './index.css';

// Initialize Parse
const PARSE_APPLICATION_ID = 'd2Cx6V53NN5dCDKWo8gb8mI5mb0KVaVWArRaNcKX';
const PARSE_HOST_URL = 'https://parseapi.back4app.com/';
const PARSE_JAVASCRIPT_KEY = 'TytQ9h5M3RmZrOteGC1lW1nhAz8g3dFTEJ1NRS1H';
Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
Parse.serverURL = PARSE_HOST_URL;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);