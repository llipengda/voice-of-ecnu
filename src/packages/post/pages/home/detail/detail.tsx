import Taro, { useLoad, useReachBottom } from '@tarojs/taro'
import { deletePost, getPostById } from '@/api/Post'
import { View, Image, Text, Textarea } from '@tarojs/components'
import { useRef, useState } from 'react'
import { AtAvatar, AtIcon, AtTabs } from 'taro-ui'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { removePost } from '@/redux/slice/postSlice'
import { checkLike, like, unlike } from '@/api/Like'
import { checkStar, starPost, unstarPost } from '@/api/Star'
import { disabledColor, primaryColor } from '@/common/constants'
import ListView from 'taro-listview'
import { Comment } from 'types/comment'
import CComment from '@/packages/post/components/Comment/Comment'
import { createComment, getCommentList } from '@/api/Comments'
import './detail.scss'
import { uploadImages } from '@/api/Image'
import FloatLayout from '@/components/FloatLayout/FloatLayout'
import CommentMenu from '@/packages/post/components/CommentMenu/CommentMenu'
import ReplyDetail from '@/packages/post/components/ReplyDetail/ReplyDetail'
import { createReply } from '@/api/Reply'
import { Reply } from 'types/reply'

export default function detail() {
  const params = Taro.getCurrentInstance().router?.params

  const [postId] = useState(Number(params?.postId))
  const [authorName] = useState(params?.authorName!)
  const [authorAvatar] = useState(params?.authorAvatar!)
  const [sendCommentFocus] = useState(
    params?.sendCommentFocus === 'true' || false
  )

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

  const [sendReplyMode, setSendReplyMode] = useState(false)
  const [sendReplyFocus, setSendReplyFocus] = useState(false)
  const [sendReplyContent, setSendReplyContent] = useState('')
  const [sendReplyDisabled, setSendReplyDisabled] = useState(false)

  const [replyCommentId, setReplyCommentId] = useState(-1)
  const [replyUserName, setReplyUserName] = useState('')
  const [replyContent, setReplyContent] = useState('')
  const [replyReplyId, setReplyReplyId] = useState(-1)

  const [reachBottomLoadingDisabled, setReachBottomLoadingDisabled] =
    useState(false)

  const [showCommentMenu, setShowCommentMenu] = useState(false)
  const [commentMenuProps, setCommentMenuProps] = useState({
    commentId: -1,
    commentUserId: '',
    likedComment: false,
    onLikeComment: () => {},
  })

  const [showReplyDetail, setShowReplyDetail] = useState(false)
  const [showDetailComment, setShowDetailComment] = useState<Comment>(
    {} as Comment
  )
  const [newReply, setNewReply] = useState<Reply | null>(null)

  const user = useAppSelector(state => state.user)
  const dispatch = useAppDispatch()

  const handleSendComment = async () => {
    if (sendCommentDisabled) {
      return
    }
    if (commentContent.trim() === '' && selectedImages.length === 0) {
      await Taro.showToast({
        title: '评论不能为空',
        icon: 'error',
      })
      return
    }
    setSendCommentDisabled(true)
    await Taro.showLoading({
      title: '上传图片中...',
    })
    const imgs = await uploadImages(selectedImages)
    await Taro.showLoading({
      title: '发送中...',
    })
    const data = await createComment({
      content: commentContent,
      image: imgs || [],
      postId,
    })
    setSendCommentDisabled(false)
    setSelectedImages([])
    setCommentContent('')
    Taro.hideLoading()
    await Taro.showToast({
      title: '发送成功',
      icon: 'success',
      duration: 1000,
    })
    setCommentsCnt(commentsCnt + 1)
    if (tabIndex === 1) {
      setComments([data, ...comments])
    } else if (!hasMore) {
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
      await unlike(postId)
    } else {
      setLikes(likes + 1)
      await like(postId)
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

  useReachBottom(async () => {
    if (!hasMore || reachBottomLoadingDisabled) {
      return
    }
    setReachBottomLoadingDisabled(true)
    await handleScrollToLower()
    setReachBottomLoadingDisabled(false)
  })

  const handleShowCommentMenu = (
    commentId: number,
    commentUserId: string,
    likedComment: boolean,
    onLikeComment: () => void
  ) => {
    setShowCommentMenu(true)
    setCommentMenuProps({
      commentId,
      commentUserId,
      likedComment,
      onLikeComment,
    })
  }

  const handleShowReplyDetail = (comment: Comment) => {
    setShowDetailComment(comment)
    setReplyCommentId(comment.id)
    setSendReplyMode(true)
    setShowReplyDetail(true)
  }

  const handleCloseReplyDetail = () => {
    setShowReplyDetail(false)
    setSendReplyMode(false)
    setReplyReplyId(-1)
    setReplyCommentId(-1)
    setReplyUserName('')
  }

  const handleClickReply = (
    replyId: number,
    replyUserName: string,
    replyContent: string
  ) => {
    setReplyReplyId(replyId)
    setReplyUserName(replyUserName)
    setReplyContent(replyContent)
    setSendReplyFocus(true)
  }
  
  const handleAddReply = (reply: Reply) => {
    const newComments = comments.map(c => {
      if (c.id === reply.commentId) {
        c.replies++
      }
      return c
    })
    setComments(newComments)
    setNewReply(reply)
  }

  const handleSendReply = async () => {
    if (sendReplyDisabled) {
      return
    }
    if (sendReplyContent.trim() === '') {
      await Taro.showToast({
        title: '回复不能为空',
        icon: 'error',
      })
      return
    }
    setSendReplyDisabled(true)
    await Taro.showLoading({
      title: '发送中...',
    })
    const data = await createReply({
      content: sendReplyContent,
      replyId: replyReplyId === -1 ? undefined : replyReplyId,
      commentId: replyCommentId,
    })
    handleAddReply(data)
    setSendReplyDisabled(false)
    setSendReplyContent('')
    Taro.hideLoading()
    await Taro.showToast({
      title: '发送成功',
      icon: 'success',
      duration: 1000,
    })
    setReplyReplyId(-1)
    setReplyUserName('')
  }

  return (
    <View className='post-detail'>
      <FloatLayout
        isOpened={showCommentMenu}
        onClose={() => setShowCommentMenu(false)}
        title='操作'
      >
        <CommentMenu
          onRemoveComment={handleRemoveComment}
          onClickReply={() => setShowReplyDetail(true)}
          onClose={() => setShowCommentMenu(false)}
          {...commentMenuProps}
        />
      </FloatLayout>
      <FloatLayout
        isOpened={showReplyDetail}
        onClose={handleCloseReplyDetail}
        title='评论详情'
      >
        <ReplyDetail
          comment={showDetailComment}
          isShow={showReplyDetail}
          onClickReply={handleClickReply}
          newReply={newReply}
        />
      </FloatLayout>
      <View className='post-detail__title'>{title || '加载中...'}</View>
      <View className='at-row'>
        <AtAvatar
          circle
          image={authorAvatar}
          className='post-detail__avatar'
          size='small'
        />
        <View className='at-col'>
          <View className='post-detail__author at-row'>
            {authorName || '加载中...'}
          </View>
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
            fadeIn
            lazyLoad
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
          style={{
            width: '100%',
            overflowX: 'hidden',
            marginBottom: '55px',
          }}
          onPullDownRefresh={handlePullDownRefresh}
          onScrollToLower={handleScrollToLower}
          needInit
          autoHeight
        >
          {comments.map(c => (
            <CComment
              comment={c}
              key={c.id}
              onShowMenu={handleShowCommentMenu}
              onshowReplyDetail={c => handleShowReplyDetail(c)}
            />
          ))}
          {isEmpty && <View className='tip2'>留下第一条评论吧~</View>}
          {!isEmpty && !hasMore && <View className='tip2'>没有更多内容</View>}
        </ListView>
      </View>
      <View
        className='post-detail__send'
        style={{
          bottom: `${keyboardHeight}Px`,
          zIndex: sendReplyMode ? 8080 : 3000,
        }}
      >
        {sendReplyMode && replyReplyId !== -1 && replyUserName.length > 0 && (
          <View className='post-detail__send__reply'>
            <Text>{`回复 ${replyUserName}：${replyContent}：`}</Text>
          </View>
        )}
        {!sendReplyMode && selectedImages.length > 0 && (
          <View className='post-detail__send__image-wrap'>
            {selectedImages.map(i => (
              <>
                <Image
                  src={i}
                  key={i}
                  fadeIn
                  lazyLoad
                  className='post-detail__send__image'
                  mode='aspectFill'
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
            className={`post-detail__send__input at-col at-col-${
              sendReplyMode ? 9 : 8
            }`}
            onKeyboardHeightChange={e => setKeyboardHeight(e.detail.height)}
            adjustPosition={false}
            autoHeight
            showConfirmBar={false}
            value={sendReplyMode ? sendReplyContent : commentContent}
            onInput={e =>
              sendReplyMode
                ? setSendReplyContent(e.detail.value)
                : setCommentContent(e.detail.value)
            }
            focus={sendReplyMode ? sendReplyFocus : sendCommentFocus}
            onBlur={sendReplyMode ? () => setSendReplyFocus(false) : () => {}}
          />
          {!sendReplyMode && (
            <AtIcon
              value='image'
              size='25'
              color={primaryColor}
              className='post-detail__send__icon at-col-1'
              onClick={handleSelectImage}
            />
          )}
          <View
            className='post-detail__send__button at-col at-col-1'
            style={{
              color: (sendReplyMode ? sendReplyDisabled : sendCommentDisabled)
                ? disabledColor
                : primaryColor,
            }}
            onClick={sendReplyMode ? handleSendReply : handleSendComment}
          >
            发送
          </View>
        </View>
      </View>
    </View>
  )
}
