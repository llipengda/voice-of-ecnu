import {
  $$4srfsfsdc5,
  $$fddnj5se7S,
  $cdsfsufsuf,
  $dfjhFDASF55,
  $fGdfhs45df88d2,
  $vfhudSs9f8se4E
} from './fgskjn'

export const primaryColor = '#b70031'
export const backgroundColor = '#f6f6f6'
export const disabledColor = '#7f7f7f'

const gradeRange = Array.from({ length: 6 }, (_, i) => i + 1).map(
  i => `${i + (new Date().getFullYear() % 100) - 6}级`
)
gradeRange.push('其他')
gradeRange.unshift('不显示')
export { gradeRange }

export const genderRange = ['不显示', '男', '女', '其他']

export const majorRange: Record<string, string[]> = {
  不显示: ['不显示'],
  音乐学院: [
    '音乐表演（管弦乐）',
    '音乐学（音乐教育）',
    '音乐表演（声乐）',
    '音乐表演（钢琴）'
  ],
  政治学系: ['政治学与行政学'],
  哲学系: ['哲学（强基计划）', '哲学'],
  历史学系: ['历史学'],
  中国语言文学系: ['汉语言文学', '汉语言文学（古文字学方向，强基计划）'],
  通信与电子工程学院: ['微电子科学与工程', '通信工程'],
  数据科学与工程学院: ['数据科学与大数据技术'],
  软件工程学院: ['软件工程'],
  计算机科学与技术学院: ['计算机科学与技术'],
  生命科学学院: [
    '生物科学（强基计划）',
    '生物科学',
    '生物技术',
    '生物科学（公费师范、非师范）'
  ],
  化学与分子工程学院: ['化学（公费师范）', '化学'],
  物理与电子科学学院: [
    '物理学',
    '电子信息科学与技术',
    '材料科学与工程',
    '光电信息科学与工程',
    '物理学（公费师范）',
    '物理学（强基计划）'
  ],
  数学科学学院: [
    '数学与应用数学（公费师范）',
    '数学与应用数学（强基计划）',
    '数学与应用数学',
    '信息与计算科学'
  ],
  设计学院: ['视觉传达设计', '环境设计', '公共艺术', '产品设计'],
  美术学院: ['美术学（美术教育）', '绘画', '雕塑'],
  传播学院: ['广播电视编导', '播音与主持艺术', '编辑出版学', '新闻学'],
  体育与健康学院: [
    '体育教育',
    '运动训练',
    '体育教育（公费师范）',
    '社会体育指导与管理'
  ],
  心理与认知科学学院: ['心理学', '应用心理学'],
  国际汉语文化学院: ['汉语国际教育'],
  外语学院: ['日语', '西班牙语', '英语', '德语', '俄语', '翻译', '法语'],
  社会发展学院: ['社会工作', '社会学'],
  法学院: ['法学'],
  马克思主义学院: ['思想政治教育'],
  统计学院: ['金融工程', '保险学', '统计学'],
  公共管理学院: ['行政管理', '人力资源管理'],
  工商管理学院: ['会计学', '工商管理', '信息管理与信息系统', '旅游管理'],
  经济学院: ['金融学', '经济学'],
  亚欧商学院: ['工商管理（中法创新实验班）'],
  教育学部: [
    '特殊教育',
    '艺术教育',
    '教育康复学',
    '教育技术学（公费师范）',
    '教育技术学',
    '特殊教育（公费师范）',
    '学前教育',
    '听力与言语康复学',
    '学前教育（公费师范）',
    '公共事业管理'
  ],
  城市与区域科学学院: ['人文地理与城乡规划'],
  生态与环境科学学院: ['环境生态工程', '环境科学', '生态学'],
  地理科学学院: ['地理科学（公费师范）', '地理信息科学', '地理科学']
}

export const serverUrl = 'https://www.xiaowu.fun'
// for local test
// export const serverUrl = 'http://localhost:8080'

export const defaultAvatar = 'https://www.xiaowu.fun/static/voecnu.png'

export const postPerPage = 10
export const commentPerPage = 15
export const replyPerPage = 15

export const $fGdfhs45df88d2$ = $fGdfhs45df88d2
export const $vfhudSs9f8se4E$ = $vfhudSs9f8se4E
export const $$fddnj5se7S$ = $$fddnj5se7S
export const $$4srfsfsdc5$$ = $$4srfsfsdc5
export const $cdsfsufsuf$ = $cdsfsufsuf
export const $dfjhFDASF55$ = $dfjhFDASF55

export const expectedReviewDate = new Date('2023-11-17T22:00:00+08:00')
