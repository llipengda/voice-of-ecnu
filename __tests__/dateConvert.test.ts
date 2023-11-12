import { convertDate } from '../src/utils/dateConvert'

describe('convertDate', () => {
  it('should return "刚刚" for current date', () => {
    const now = new Date()
    expect(convertDate(now.toISOString())).toBe('刚刚')
  })

  it('should return "x分钟前" for dates within the last hour', () => {
    const now = new Date()
    const past = new Date(now.getTime() - 30 * 60 * 1000) // 30 minutes ago
    expect(convertDate(past.toISOString())).toBe('30分钟前')
  })

  it('should return "x小时前" for dates within the last day', () => {
    const now = new Date()
    const past = new Date(now.getTime() - 5 * 60 * 60 * 1000) // 5 hours ago
    expect(convertDate(past.toISOString())).toBe('5小时前')
  })

  it('should return "MM-DD" for dates within the last year', () => {
    const now = new Date()
    const past = new Date(now.getTime() - 200 * 24 * 60 * 60 * 1000) // 200 days ago
    const month = (past.getMonth() + 1).toFixed().padStart(2, '0')
    const day = past.getDate().toFixed().padStart(2, '0')
    expect(convertDate(past.toISOString())).toBe(`${month}-${day}`)
  })

  it('should return "YYYY-MM-DD" for dates older than a year', () => {
    const past = new Date('2010-01-01')
    expect(convertDate(past.toISOString())).toBe('2010-01-01')
  })
})
