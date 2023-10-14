import UpdateUserForm from '@/components/UpdateUserForm/UpdateUserForm'

export default function update() {
  return (
    <UpdateUserForm
      user={{
        id: '11',
        role: 2,
        email: '',
        name: '张三',
        avatar: 'https://www.xiaowu.fun/static/1.jpg',
        status: '凡事都有偶然的凑巧，结果却又如宿命的必然。',
        createdAt: new Date(),
        major: '软件工程学院-软件工程'
      }}
    />
  )
}
