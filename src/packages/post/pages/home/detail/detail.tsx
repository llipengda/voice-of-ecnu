import Taro, { useLoad } from '@tarojs/taro'
import { deletePost, getPostById } from '@/api/Post'
import { View, Image, Text, Textarea } from '@tarojs/components'
import { useRef, useState } from 'react'
import { AtAvatar, AtIcon, AtTabs } from 'taro-ui'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { removePost } from '@/redux/slice/postSlice'
import { checkLike, likePost, unlikePost } from '@/api/Like'
import { checkStar, starPost, unstarPost } from '@/api/Star'
import { disabledColor, primaryColor } from '@/common/constants'
import ListView from 'taro-listview'
import { Comment } from 'types/comment'
import CComment from '@/packages/post/components/Comment/Comment'
import { createComment, getCommentList } from '@/api/Comments'
import './detail.scss'
import { uploadImages } from '@/api/Image'

export default function detail() {
  const params = Taro.getCurrentInstance().router?.params

  const postId = Number(params?.postId!)
  const authorName = params?.authorName!
  const authorAvatar = params?.authorAvatar!

  const [authorId, setAuthorId] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [createAt, setCreateAt] = useState('')
  const [views, setViews] = useState(0)
  const [commentsCnt, setCommentsCnt] = useState(0)
  const [likes, setLikes] = useState(0)
  const [stars, setStars] = useState(0)

  const [liked, setLiked] = useState(false)
  const [stared, setStared] = useState(false)

  const [likeDisabled, setLikeDisabled] = useState(false)
  const [starDisabled, setStarDisabled] = useState(false)

  const [isLoaded, setIsLoaded] = useState(false)
  const [isEmpty, setIsEmpty] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const index = useRef(1)

  const [comments, setComments] = useState<Comment[]>([])

  const [tabIndex, setTabIndex] = useState(0)
  const tabList = [{ title: '正序' }, { title: '倒序' }]

  const [selectedImages, setSelectedImages] = useState<string[]>([])

  const [keyboardHeight, setKeyboardHeight] = useState(0)

  const [commentContent, setCommentContent] = useState('')

  const [sendCommentDisabled, setSendCommentDisabled] = useState(false)

  const user = useAppSelector(state => state.user)
  const dispatch = useAppDispatch()

  const handleSendComment = async () => {
    if (sendCommentDisabled) {
      return
    }
    if (commentContent.trim() === '' && selectedImages.length === 0) {
      Taro.showToast({
        title: '评论不能为空',
        icon: 'error',
      })
      return
    }
    setSendCommentDisabled(true)
    Taro.showLoading({
      title: '上传图片中...',
    })
    const imgs = await uploadImages(selectedImages)
    Taro.hideLoading()
    Taro.showLoading({
      title: '发送中...',
    })
    const data = await createComment({
      content: commentContent,
      image: imgs || [],
      postId: postId,
    })
    setSendCommentDisabled(false)
    setSelectedImages([])
    setCommentContent('')
    Taro.hideLoading()
    setCommentsCnt(commentsCnt + 1)
    if (tabIndex === 1) {
      setComments([data, ...comments])
    } else {
      setComments([...comments, data])
    }
  }

  const handleDeletePost = async () => {
    const res = await Taro.showModal({
      title: '提示',
      content: '确定要删除该帖子吗？',
    })
    if (res.confirm) {
      await deletePost(postId)
      dispatch(removePost(postId))
      Taro.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 1000,
      })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1000)
    }
  }

  useLoad(async () => {
    const data = await getPostById(postId)
    setAuthorId(data.userId)
    setTitle(data.title)
    setContent(data.content)
    setImages(data.images)
    setCreateAt(data.createAt)
    setViews(data.views)
    setCommentsCnt(data.comments)
    setLikes(data.likes)
    setStars(data.stars)
    const liked = await checkLike(postId)
    setLiked(liked)
    const stared = await checkStar(postId)
    setStared(stared)
  })

  const handleLikePost = async () => {
    if (likeDisabled) {
      return
    }
    setLiked(!liked)
    setLikeDisabled(true)
    if (liked) {
      setLikes(likes - 1)
      await unlikePost(postId)
    } else {
      setLikes(likes + 1)
      await likePost(postId)
    }
    setLikeDisabled(false)
  }

  const handleStarPost = async () => {
    if (starDisabled) {
      return
    }
    setStared(!stared)
    setStarDisabled(true)
    if (stared) {
      setStars(stars - 1)
      await unstarPost(postId)
    } else {
      setStars(stars + 1)
      await starPost(postId)
    }
    setStarDisabled(false)
  }

  const showImages = (image: string) => {
    Taro.previewImage({
      urls: images,
      current: image,
    })
  }

  const handleRemoveComment = (commentId: number) => {
    setComments(comments.filter(c => c.id !== commentId))
  }

  const handleScrollToLower = async () => {
    const data = await getCommentList(
      postId,
      ++index.current,
      10,
      tabIndex === 1
    )
    setComments([...comments, ...data])
    setHasMore(data.length === 10)
    setIsEmpty(data.length === 0)
  }

  const getData = async () => {
    index.current = 1
    const data = await getCommentList(postId, index.current, 10, tabIndex === 1)
    setComments(data || [])
    setIsLoaded(true)
    setHasMore(data.length === 10)
    setIsEmpty(data.length === 0)
  }

  const handlePullDownRefresh = async () => {
    await getData()
  }

  const handleClickTab = async (i: number) => {
    setTabIndex(i)
    setComments([])
    setIsEmpty(false)
    index.current = 1
    const data = await getCommentList(postId, index.current, 10, i === 1)
    setComments(data || [])
    setHasMore(data.length === 10)
    setIsEmpty(data.length === 0)
  }

  const handleSelectImage = async () => {
    const res = await Taro.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
    })
    if (res.errMsg === 'chooseImage:ok') {
      setSelectedImages(res.tempFilePaths)
    }
  }

  const showSelectedImages = (url: string) => {
    Taro.previewImage({
      current: url,
      urls: selectedImages,
    })
  }

  return (
    <View className='post-detail'>
      <View className='post-detail__title'>{title || '加载中...'}</View>
      <View className='at-row'>
        <AtAvatar
          circle
          image={authorAvatar}
          className='post-detail__avatar'
          size='small'
        />
        <View className='at-col'>
          <View className='post-detail__author at-row'>{authorName}</View>
          <View className='post-detail__create-at at-row'>{createAt}</View>
        </View>
        <View className='at-col post-detail__delete'>
          {(user.id === authorId || user.role <= 1) && (
            <Text onClick={handleDeletePost}>删除</Text>
          )}
        </View>
      </View>
      <View className='post-detail__content'>{content || '努力加载中...'}</View>
      <View className='post-detail__images'>
        {images.map(image => (
          <Image
            src={image}
            key={image}
            mode='widthFix'
            className='post-detail__image'
            onClick={() => showImages(image)}
          />
        ))}
      </View>
      <View className='post-detail__actions at-row'>
        <View className='at-col-3 post-detail__actions__action'>
          <AtIcon
            value='eye'
            size='20'
            color={disabledColor}
            className='at-row'
          />
          <Text className='post-detail__actions__action__number at-row'>{`浏览 ${views}`}</Text>
        </View>
        <View className='at-col-3 post-detail__actions__action'>
          <AtIcon value='message' size='20' color={disabledColor} />
          <Text className='post-detail__actions__action__number at-row'>{`评论 ${commentsCnt}`}</Text>
        </View>
        <View
          className='at-col-3 post-detail__actions__action'
          onClick={handleLikePost}
        >
          <AtIcon
            value={liked ? 'heart-2' : 'heart'}
            size='20'
            color={disabledColor}
          />
          <Text className='post-detail__actions__action__number at-row'>{`点赞 ${likes}`}</Text>
        </View>
        <View
          className='at-col-3 post-detail__actions__action'
          onClick={handleStarPost}
        >
          <AtIcon
            value={stared ? 'star-2' : 'star'}
            size='20'
            color={disabledColor}
          />
          <Text className='post-detail__actions__action__number at-row'>{`收藏 ${stars}`}</Text>
        </View>
      </View>
      <View className='post-detail__divider' />
      <AtTabs
        current={tabIndex}
        tabList={tabList}
        onClick={i => handleClickTab(i)}
        className='post-detail__tabs'
      />
      {!isLoaded && <View className='tip'>努力加载中...</View>}
      <View className='skeleton'>
        {/* @ts-ignore */}
        <ListView
          isLoaded={isLoaded}
          hasMore={hasMore}
          style={{ height: '100vh', width: '100%', overflowX: 'hidden' }}
          onPullDownRefresh={handlePullDownRefresh}
          onScrollToLower={handleScrollToLower}
          needInit
        >
          {comments.map(c => (
            <CComment
              comment={c}
              key={c.id}
              onRemoveComment={handleRemoveComment}
            />
          ))}
          {isEmpty && <View className='tip2'>留下第一条评论吧~</View>}
        </ListView>
      </View>
      <View
        className='post-detail__send'
        style={{ bottom: `${keyboardHeight}Px` }}
      >
        {selectedImages.length > 0 && (
          <View className='post-detail__send__image-wrap'>
            {selectedImages.map(i => (
              <>
                <Image
                  src={i}
                  key={i}
                  className='post-detail__send__image'
                  mode='aspectFill'
                  onClick={() => showSelectedImages(i)}
                >
                  <AtIcon
                    value='close'
                    size='15'
                    color={primaryColor}
                    className='post-detail__send__image__close'
                    onClick={() =>
                      setSelectedImages(selectedImages.filter(j => j !== i))
                    }
                  />
                </Image>
              </>
            ))}
          </View>
        )}
        <View className='at-row'>
          <Textarea
            placeholder='说点什么吧...'
            className='post-detail__send__input at-col at-col-8'
            onKeyboardHeightChange={e => setKeyboardHeight(e.detail.height)}
            adjustPosition={false}
            autoHeight
            showConfirmBar={false}
            value={commentContent}
            onInput={e => setCommentContent(e.detail.value)}
          />
          <AtIcon
            value='image'
            size='25'
            color={primaryColor}
            className='post-detail__send__icon at-col-1'
            onClick={handleSelectImage}
          />
          <View
            className='post-detail__send__button at-col at-col-1'
            style={{
              color: sendCommentDisabled ? disabledColor : primaryColor,
            }}
            onClick={handleSendComment}
          >
            发送
          </View>
        </View>
      </View>
    </View>
  )
}
