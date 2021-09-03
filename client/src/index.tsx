import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Router } from 'react-router-dom'
import { Provider } from 'react-redux'

import App from './containers/App'
import history from './utils/history'
import store from './stores'

import 'antd/dist/antd.css'
import './index.css'

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Router history={history}>
        <App />
      </Router>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
)
