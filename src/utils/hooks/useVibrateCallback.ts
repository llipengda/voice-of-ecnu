import { useCallback } from 'react'
import { useVibrate } from './useVibrate'

/**
 * 返回提供的回调函数的记忆化版本，在执行回调之前触发设备振动。
 * @template T 提供的回调函数的类型。
 * @param {T} callback 在设备振动后要执行的回调函数。
 * @param {readonly unknown[]} [deps=[]] 用于记忆化的可选依赖项数组。
 * @param {...any[]} args 要传递给记忆化函数的可选参数列表。
 * @returns 记忆化的回调函数。
 */

export const useVibrateCallback = <T extends Function>(
  callback: T,
  deps: readonly unknown[] = [],
  ...args: any[]
) => {
  const vibrate = useVibrate()
  return useCallback(
    async (...args: any[]) => {
      await vibrate()
      return await callback(...args)
    },
    [...deps, ...args, vibrate]
  )
}
