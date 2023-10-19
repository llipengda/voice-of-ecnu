import { useEffect, useState } from 'react'
import { View, Image, Input, Textarea, Picker } from '@tarojs/components'
import { AtButton, AtIcon } from 'taro-ui'
import Taro from '@tarojs/taro'
import { uploadImage } from '@/api/Image'
import { useAppSelector } from '@/redux/hooks'
import { updateUser } from '@/api/User'
import { useDispatch } from 'react-redux'
import {
  genderRange,
  gradeRange,
  majorRange,
  primaryColor,
} from '@/common/constants'
import '../../custom-theme.scss'
import './UpdateUserForm.scss'
import { setUser } from '@/redux/slice/userSlice'

export default function UpdateUserForm() {
  const user = useAppSelector(state => state.user)

  const dispatch = useDispatch()

  const [userState, setUserState] = useState(user)

  const [submitButtonLoading, setSubmitButtonLoading] = useState(false)

  const handleChangeAvatar = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        Taro.cropImage({
          src: res.tempFilePaths[0],
          cropScale: '1:1',
          success: async res => {
            const newPath = await uploadImage(res.tempFilePath)
            setUserState({ ...userState, avatar: newPath as string })
          },
        })
      },
    })
  }

  const [detailMajorRange, setDetailMajorRange] = useState<String[]>([])
  const [selectedMajor, setSelectedMajor] = useState<number[]>([0, 0])

  const initMajor = () => {
    if (userState.major && userState.major !== '不显示') {
      const [major, detailMajor] = userState.major.split('-')
      const majorIndex = Object.keys(majorRange).indexOf(major)
      const detailMajorIndex =
        Object.keys(majorRange)[majorIndex].indexOf(detailMajor)
      setDetailMajorRange(majorRange[major])
      setSelectedMajor([majorIndex, detailMajorIndex])
      console.log('init')
    }
  }

  useEffect(() => {
    initMajor()
  }, [])

  const handleSubmit = async () => {
    setSubmitButtonLoading(true)
    const data = await updateUser(userState)
    setUserState(data!)
    dispatch(setUser(data!))
    setTimeout(() => {
      setSubmitButtonLoading(false)
      Taro.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 1000,
      })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1000)
    }, 1000)
    console.log(userState)
  }

  const handleReset = () => {
    setUserState(user)
    initMajor()
  }

  return (
    <View className='update-user-form'>
      <View className='avatar-container'>
        <Image className='avatar' src={userState.avatar} />
        <AtIcon
          value='camera'
          size='30'
          color={primaryColor}
          className='camera-icon'
          onClick={handleChangeAvatar}
        />
      </View>
      <View className='form-container'>
        <View className='form-item'>
          <View className='form-label'>用户名</View>
          <Input
            className='form-input'
            value={userState.name}
            onInput={e => setUserState({ ...userState, name: e.detail.value })}
          />
        </View>
        <View className='form-item'>
          <View className='form-label'>邮箱</View>
          <View className='form-constant'>
            {userState.email || '未认证邮箱'}
          </View>
        </View>
        <View className='form-item'>
          <View className='form-label'>个性签名</View>
          <Textarea
            className='form-input'
            value={userState.status}
            placeholder='添加'
            maxlength={40}
            autoHeight
            onInput={e =>
              setUserState({ ...userState, status: e.detail.value })
            }
          />
        </View>
      </View>
      <View className='form-container'>
        <View className='form-item'>
          <View className='form-label'>性别</View>
          <Picker
            className='form-constant'
            mode='selector'
            range={genderRange}
            value={userState.gender || 0}
            onChange={e =>
              setUserState({
                ...userState,
                gender: e.detail.value as 0 | 1 | 2 | 3,
              })
            }
          >
            {genderRange[userState.gender || 0]}
          </Picker>
        </View>
        <View className='form-item'>
          <View className='form-label'>年级</View>
          <Picker
            className='form-constant'
            mode='selector'
            range={gradeRange}
            onChange={e =>
              setUserState({ ...userState, grade: gradeRange[e.detail.value] })
            }
            value={userState.grade ? gradeRange.indexOf(userState.grade) : 0}
          >
            <View>{userState.grade || '不显示'}</View>
          </Picker>
        </View>
        <View className='form-item'>
          <View className='form-label'>专业</View>
          <Picker
            className='form-constant'
            mode='multiSelector'
            range={[Object.keys(majorRange), detailMajorRange]}
            value={selectedMajor}
            onChange={e => {
              if (e.detail.value[0] === 0) {
                setUserState({ ...userState, major: '不显示' })
              } else {
                setUserState({
                  ...userState,
                  major: `${Object.keys(majorRange)[e.detail.value[0]]}-${
                    detailMajorRange[e.detail.value[1]]
                  }`,
                })
              }
              setSelectedMajor(e.detail.value)
            }}
            onColumnChange={e => {
              if (e.detail.column === 0) {
                setDetailMajorRange(
                  majorRange[Object.keys(majorRange)[e.detail.value]]
                )
                setSelectedMajor([e.detail.value, 0])
              }
            }}
          >
            <View>{userState.major || '不显示'}</View>
          </Picker>
        </View>
      </View>
      <View className='action-container'>
        <AtButton type='secondary' className='button' onClick={handleReset}>
          重置
        </AtButton>
        <AtButton
          type='primary'
          className='button'
          onClick={handleSubmit}
          loading={submitButtonLoading}
        >
          提交
        </AtButton>
      </View>
    </View>
  )
}
