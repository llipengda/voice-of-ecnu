import { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import store from './redux/store'
import './custom-theme.scss'

function App({ children }: PropsWithChildren<any>) {
  return <Provider store={store}>{children}</Provider>
}

export default App
