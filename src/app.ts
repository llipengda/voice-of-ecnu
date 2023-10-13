import { PropsWithChildren } from 'react'
import Taro, { useLaunch } from '@tarojs/taro'
import './custom-theme.scss'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    Taro.login({
      success: (res: { code: string }) => {
        if (res.code) {
          console.log(res.code)
        }
      },
    })
  })

  return children
}

export default App
