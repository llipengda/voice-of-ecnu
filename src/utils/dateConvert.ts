export const convertDate = (dateString: string) => {
  console.log(1, dateString)

  const now = new Date()
  let date = new Date(dateString)
  console.log(1, date)
  if (!date.getSeconds()) {
    dateString = dateString.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '').replace(/(-)/g, '/')
    console.log(2, dateString)
    date = new Date(dateString)
    console.log(2, date)
  }


  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  console.log(seconds)

  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toFixed().padStart(2, '0')
  const day = date.getDate().toFixed().padStart(2, '0')

  let interval = Math.floor(seconds / 31536000)
  if (interval >= 1) {
    return `${year}-${month}-${day}`
  }
  interval = Math.floor(seconds / 86400)
  if (interval >= 1) {
    return `${month}-${day}`
  }
  interval = Math.floor(seconds / 3600)
  if (interval >= 1) {
    return interval + '小时前'
  }
  interval = Math.floor(seconds / 60)
  if (interval >= 1) {
    return interval + '分钟前'
  }
  return '刚刚'
}

/**
 * 检查用户是否被封禁
 * @param {string?} dateString 时间
 * @returns {boolean} 用户是否被封禁
 */
export const checkBan = (dateString: string | null): boolean => {
  if (!dateString) {
    return false
  }
  dateString = dateString.replace(/-/g, '/') // fix iOS bug (https://stackoverflow.com/questions/4310953/invalid-date-in-safari
  const now = new Date()
  const date = new Date(dateString)
  return now.getTime() < date.getTime()
}
