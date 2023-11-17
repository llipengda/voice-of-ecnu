import type { UserConfigExport } from '@tarojs/cli'

export default {
  logger: {
    quiet: false,
    stats: true
  },
  mini: {},
  h5: {},
  plugins: ['@tarojs/plugin-react-devtools']
} satisfies UserConfigExport
