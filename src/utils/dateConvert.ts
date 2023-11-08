export const convertDate = (dateString: string) => {
  dateString = dateString.replace(/-/g, '/') // fix iOS bug (https://stackoverflow.com/questions/4310953/invalid-date-in-safari

  const now = new Date()
  const date = new Date(dateString)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

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
