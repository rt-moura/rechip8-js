import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './redux/store'
import Display from './sections/Display'
import Hexdump from './sections/Hexdump'
import Instructions from './sections/Instructions'
import './styles/main.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <main>
        <Display />
        <Instructions />
        <Hexdump />
      </main>
    </Provider>
    <footer className="sub1">2023 © All rights reserved</footer>
  </React.StrictMode>,
)
