import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import memoryUtils from './utils/memoryUtils'
import storageUtils from './utils/storageUtils'

//read user in local into memory
memoryUtils.user = storageUtils.getUser()

ReactDOM.render(<App />, document.getElementById('root'))