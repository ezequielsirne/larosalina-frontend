import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

//Context
import AppSettingsProvider from "./config/app-settings";
import AuthContextProvider from "./contexts/AuthContext"

// css
import 'bootstrap/dist/css/bootstrap.css'; //npm i bootstrap
import '@fortawesome/fontawesome-free/css/all.min.css'; //npm i @fortawesome/fontawesome-free
import 'react-quill/dist/quill.snow.css'; //npm i react-quill
import 'simple-line-icons/css/simple-line-icons.css'; //npm i simple-line-icons
import 'flag-icon-css/css/flag-icons.min.css'; //npm i flag-icon-css
import 'react-perfect-scrollbar/dist/css/styles.css'; //npm i react-perfect-scrollbar
import './index.css';
import 'bootstrap-social/bootstrap-social.css'; //npm i bootstrap-social
import 'bootstrap-daterangepicker/daterangepicker.css'; //npm i bootstrap-daterangepicker

//Theme
import './scss/styles.scss'; //npm i sass

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
    <AppSettingsProvider> 
      <App />
    </AppSettingsProvider> 
  </AuthContextProvider>
);

