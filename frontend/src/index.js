import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


// import { Provider } from 'react-redux';
// import store from './app/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <Provider store = {store}> */}
    <BrowserRouter>
      <Routes>
        <Route path = "/*" element = {<App />} /> 
      </Routes>
    </BrowserRouter>
    {/* </Provider> */}
  </React.StrictMode>
);