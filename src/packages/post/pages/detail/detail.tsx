import Taro, { useLoad, useReachBottom } from '@tarojs/taro'
import { deletePost, getPostByIdWithUserInfo } from '@/api/Post'
import { View, Image, Text, Textarea, Picker } from '@tarojs/components'
import { useEffect, useRef, useState } from 'react'
import { AtAvatar, AtIcon, AtTabs } from 'taro-ui'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { removePost } from '@/redux/slice/postSlice'
import { like, unlike } from '@/api/Like'
import { starPost, unstarPost } from '@/api/Star'
import { commentPerPage, disabledColor, primaryColor } from '@/common/constants'
import { ListView } from 'taro-listview'
import { Comment } from '@/types/comment'
import CComment from '@/packages/post/components/Comment/Comment'
import {
  createComment,
  getCommentListWithUserInfoWithDeleted
} from '@/api/Comment'
import { uploadImages } from '@/api/Image'
import FloatLayout from '@/components/FloatLayout/FloatLayout'
import CommentMenu from '@/packages/post/components/CommentMenu/CommentMenu'
import ReplyDetail from '@/packages/post/components/ReplyDetail/ReplyDetail'
import { createReply } from '@/api/Reply'
import { Reply as OReply } from '@/types/reply'
import ReplyMenu from '@/packages/post/components/ReplyMenu/ReplyMenu'
import { banUser } from '@/api/User'
import { WithUserInfo } from '@/types/withUserInfo'
import { addUserInfo } from '@/utils/addUserInfo'
import { convertDate } from '@/utils/dateConvert'
import './detail.scss'
import CustomModal, {
  ICustomModalProps
} from '@/components/CustomModal/CustomModal'
import { sendNotice } from '@/api/Notice'
import { ErrorCode } from '@/types/commonErrorCode'
import { useVibrateCallback } from '@/utils/hooks/useVibrateCallback'

type Reply = WithUserInfo<OReply>

export default function Detail() {
  const params = Taro.getCurrentInstance().router?.params

  const [postId] = useState(Number(params?.postId))
  const [authorName, setAuthorName] = useState(params?.authorName!)
  const [authorAvatar, setAuthorAvatar] = useState(params?.authorAvatar!)
  const [highlightId] = useState(Number(params?.commentId))
  const [scrollTo] = useState(`#comment-${params?.commentId}` || null)
  const [initPage] = useState(Number(params?.page) || 1)
  const [sendCommentFocus, setSendCommentFocus] = useState(
    params?.sendCommentFocus === 'true' || false
  )

  const [authorId, setAuthorId] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState<string | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [createAt, setCreateAt] = useState('')
  const [updateAt, setUpdateAt] = useState('')
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
  const [isFirst, setIsFirst] = useState(true)

  const index = useRef(initPage)

  const [comments, setComments] = useState<WithUserInfo<Comment>[]>([])

  const [tabIndex, setTabIndex] = useState<0 | 1 | 2>(0)
  const tabList = [{ title: '正序' }, { title: '倒序' }, { title: '热门' }]

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
    onLikeComment: () => {}
  })

  const [showReplyDetail, setShowReplyDetail] = useState(false)
  const [showDetailComment, setShowDetailComment] = useState<
    WithUserInfo<Comment>
  >({} as WithUserInfo<Comment>)
  const [newReply, setNewReply] = useState<Reply | null>(null)

  const [showReplyMenu, setShowReplyMenu] = useState(false)
  const [replyMenuProps, setReplyMenuProps] = useState({
    replyId: -1,
    replyUserId: '',
    likedReply: false,
    replyContent: '',
    replyUserName: '',
    onLikeReply: () => {},
    onRemoveReply: (_: number) => {}
  })

  const user = useAppSelector(state => state.user)
  const dispatch = useAppDispatch()

  const showComponent = useAppSelector(state => state.review.showComponent)

  const [showModal, setShowModal] = useState(false)
  const [modalProps, setModalProps] = useState<ICustomModalProps>({
    isOpen: showModal,
    onCancle: () => setShowModal(false),
    onConfirm: () => setShowModal(false),
    title: '提示',
    children: <View />
  })

  const handleShowModal = useVibrateCallback(
    (props: Partial<ICustomModalProps>): Promise<boolean> => {
      return new Promise(resolve => {
        setShowModal(true)
        setModalProps({
          ...modalProps,
          ...props,
          onConfirm: () => {
            setShowModal(false)
            resolve(true)
          },
          onCancle: () => {
            setShowModal(false)
            resolve(false)
          }
        })
      })
    }
  )

  useEffect(() => {
    ;(async () => {
      try {
        if (!scrollTo || !isLoaded) {
          return
        }
        console.log('try scroll', scrollTo)
        await Taro.pageScrollTo({
          selector: scrollTo,
          offsetTop: -200,
          duration: 500
        })
      } catch (err) {
        console.log('scroll failed')
      }
    })()
  }, [scrollTo, isLoaded])

  const handleSendComment = useVibrateCallback(async () => {
    if (sendCommentDisabled) {
      return
    }
    if (commentContent.trim() === '' && selectedImages.length === 0) {
      await Taro.showToast({
        title: '评论不能为空',
        icon: 'error'
      })
      return
    }
    setSendCommentDisabled(true)
    await Taro.showLoading({
      title: '上传图片中...'
    })
    const imgs = await uploadImages(selectedImages)
    await Taro.showLoading({
      title: '发送中...'
    })
    const data = await createComment({
      content: commentContent,
      images: imgs || [],
      postId
    })
    setSendCommentDisabled(false)
    setSelectedImages([])
    setCommentContent('')
    if (!data) {
      return
    }
    Taro.hideLoading()
    await Taro.showToast({
      title: '发送成功',
      icon: 'success',
      duration: 1000
    })
    const dataWithUserInfo = addUserInfo(data)
    setCommentsCnt(commentsCnt + 1)
    if (tabIndex === 1) {
      setComments([dataWithUserInfo, ...comments])
    } else if (!hasMore) {
      setComments([...comments, dataWithUserInfo])
    }
  }, [
    sendCommentDisabled,
    commentContent,
    selectedImages,
    commentsCnt,
    tabIndex,
    hasMore
  ])

  const handleDeletePost = useVibrateCallback(async () => {
    const DelPost = ({ onChange }: { onChange: (e: string) => void }) => {
      const [selected, setSelected] = useState(0)
      const reasons = [
        '其他',
        '色情低俗',
        '垃圾广告',
        '辱骂攻击',
        '违法犯罪',
        '时政不实信息',
        '青少年不宜',
        '侵犯权益'
      ]
      return (
        <View>
          <View>确定要删除该帖子吗？</View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '5px'
            }}
          >
            <View>删除原因：</View>
            <Picker
              range={reasons}
              value={selected}
              onChange={e => {
                setSelected(e.detail.value as number)
                onChange(reasons[e.detail.value])
              }}
              style={{
                marginRight: '10px',
                color: primaryColor,
                fontWeight: 900,
                background: '#eee',
                borderRadius: '5px',
                padding: '5px'
              }}
            >
              {reasons[selected]}
            </Picker>
          </View>
        </View>
      )
    }

    let delReason = '其他'

    if (user.id === authorId) {
      const res = await Taro.showModal({
        title: '提示',
        content: '确定将帖子删除？'
      })
      if (res.confirm) {
        await Taro.navigateBack()
        await deletePost(postId)
        dispatch(removePost(postId))
        Taro.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 1000
        })
      }
    } else if (user.role <= 1) {
      const res = await handleShowModal({
        title: '警告',
        children: <DelPost onChange={e => (delReason = e)} />
      })
      if (res) {
        await Taro.navigateBack()
        await deletePost(postId)
        dispatch(removePost(postId))
        await sendNotice(
          `您于 ${createAt} 发布的帖子 \"${title.substring(
            0,
            10
          )}...\" 因「${delReason}」被管理员删除`,
          authorId
        )
        Taro.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 1000
        })
      }
    }
  }, [postId, authorId, title, createAt, user, handleShowModal, dispatch])

  useLoad(async () => {
    const data = await getPostByIdWithUserInfo(postId)
    setAuthorId(data.userId)
    setTitle(data.title)
    setContent(data.content)
    setImages(data.images)
    setCreateAt(data.createAt)
    setUpdateAt(data.updateAt)
    setViews(data.views)
    setCommentsCnt(data.comments)
    setLikes(data.likes)
    setStars(data.stars)
    setLiked(data.isLike)
    setStared(data.isStar)
    setAuthorName(data.userName)
    setAuthorAvatar(data.userAvatar)
  })

  const handleLikePost = useVibrateCallback(async () => {
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
  }, [likeDisabled, liked, likes])

  const handleStarPost = useVibrateCallback(async () => {
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
  }, [starDisabled, stared, stars])

  const showImages = useVibrateCallback(
    (image: string) => {
      Taro.previewImage({
        urls: images,
        current: image
      })
    },
    [images]
  )

  const handleRemoveComment = (commentId: number) => {
    setComments(comments.filter(c => c.id !== commentId))
  }

  const handleScrollToLower = async () => {
    const data = await getCommentListWithUserInfoWithDeleted(
      postId,
      ++index.current,
      commentPerPage,
      tabIndex
    )
    setComments([...comments, ...data])
    setHasMore(data.length === commentPerPage)
  }

  const getData = async () => {
    if (isFirst) {
      setIsFirst(false)
    } else {
      index.current = 1
    }
    const data = await getCommentListWithUserInfoWithDeleted(
      postId,
      index.current,
      commentPerPage,
      tabIndex
    )
    setComments(data || [])
    setIsLoaded(true)
    setHasMore(data.length === commentPerPage)
    setIsEmpty(data.length === 0)
  }

  const handlePullDownRefresh = useVibrateCallback(async () => {
    await getData()
  })

  const handleClickTab = useVibrateCallback(
    async (i: 0 | 1 | 2) => {
      setTabIndex(i)
      setComments([])
      setIsEmpty(false)
      index.current = 1
      const data = await getCommentListWithUserInfoWithDeleted(
        postId,
        index.current,
        commentPerPage,
        i
      )
      setComments(data || [])
      setHasMore(data.length === commentPerPage)
      setIsEmpty(data.length === 0)
    },
    [postId, commentPerPage]
  )

  const handleSelectImage = useVibrateCallback(async () => {
    const res = await Taro.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera']
    })
    if (res.errMsg === 'chooseImage:ok') {
      setSelectedImages(res.tempFilePaths)
    }
  })

  useReachBottom(async () => {
    if (!hasMore || reachBottomLoadingDisabled) {
      return
    }
    setReachBottomLoadingDisabled(true)
    await handleScrollToLower()
    setReachBottomLoadingDisabled(false)
  })

  const handleShowCommentMenu = useVibrateCallback(
    (
      comment: WithUserInfo<Comment>,
      likedComment: boolean,
      onLikeComment: () => void
    ) => {
      setShowCommentMenu(true)
      setShowDetailComment(comment)
      setCommentMenuProps({
        commentId: comment.id,
        commentUserId: comment.userId,
        likedComment,
        onLikeComment
      })
    }
  )

  const handleShowReplyDetail = (comment: WithUserInfo<Comment>) => {
    setShowDetailComment(comment)
    setReplyCommentId(comment.id)
    setSendReplyMode(true)
    setShowReplyDetail(true)
  }

  const handleCloseReplyDetail = useVibrateCallback(() => {
    setShowReplyDetail(false)
    setSendReplyMode(false)
    setReplyReplyId(-1)
    setReplyCommentId(-1)
    setReplyUserName('')
  })

  const handleClickReply = (
    replyId: number,
    _replyUserName: string,
    _replyContent: string
  ) => {
    setReplyReplyId(replyId)
    setReplyUserName(_replyUserName)
    setReplyContent(_replyContent)
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

  const handleSendReply = useVibrateCallback(async () => {
    if (sendReplyDisabled) {
      return
    }
    if (sendReplyContent.trim() === '') {
      await Taro.showToast({
        title: '回复不能为空',
        icon: 'error'
      })
      return
    }
    setSendReplyDisabled(true)
    await Taro.showLoading({
      title: '发送中...'
    })
    const data = await createReply({
      content: sendReplyContent,
      replyId: replyReplyId === -1 ? undefined : replyReplyId,
      commentId: replyCommentId
    })
    if (data) {
      const newData = addUserInfo(data)
      newData.replyUserName = replyUserName
      handleAddReply(newData)
    }
    setSendReplyDisabled(false)
    setSendReplyContent('')
    if (data) {
      Taro.hideLoading()
      await Taro.showToast({
        title: '发送成功',
        icon: 'success',
        duration: 1000
      })
    }
    setReplyReplyId(-1)
    setReplyUserName('')
  }, [
    sendReplyDisabled,
    sendReplyContent,
    replyReplyId,
    replyCommentId,
    replyUserName
  ])

  const handleDecreaseReplies = (removeReplyCommentId: number) => {
    const newComments = comments.map(c => {
      if (c.id === removeReplyCommentId) {
        c.replies--
      }
      return c
    })
    setComments(newComments)
  }

  const handleShowReplyMenu = useVibrateCallback(
    (
      replyId: number,
      replyUserId: string,
      _replyContent: string,
      _replyUserName: string,
      likedReply: boolean,
      onLikeReply: () => void,
      onRemoveReply: (replyId: number) => void
    ) => {
      setShowReplyMenu(true)
      setReplyMenuProps({
        replyId,
        replyUserId,
        likedReply,
        replyContent: _replyContent,
        replyUserName: _replyUserName,
        onLikeReply,
        onRemoveReply
      })
    }
  )

  const handleBanUser = useVibrateCallback(async () => {
    const BanUser = ({ onChange }: { onChange: (e: number) => void }) => {
      const [selected, setSelected] = useState(0)
      const days = [1, 3, 7, 30]
      return (
        <View>
          <View>确定要封禁该用户吗？</View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '5px'
            }}
          >
            <View>封禁时间：</View>
            <Picker
              range={days}
              value={selected}
              onChange={e => {
                setSelected(e.detail.value as number)
                onChange(days[e.detail.value])
              }}
              style={{
                marginRight: '10px',
                color: primaryColor,
                fontWeight: 900,
                background: '#eee',
                borderRadius: '5px',
                padding: '5px'
              }}
            >
              {days[selected]}
            </Picker>
            <View>天</View>
          </View>
        </View>
      )
    }

    let bannedDays = 1

    const res = await handleShowModal({
      title: '提示',
      children: <BanUser onChange={e => (bannedDays = e)} />
    })
    if (res) {
      const data = await banUser(bannedDays, user.id)
      if (!data) {
        return
      }
      Taro.showToast({
        title: '封禁成功',
        icon: 'success',
        duration: 1000
      })
    }
  }, [user, handleShowModal])

  const handleClickCommentReply = () => {
    handleShowReplyDetail(showDetailComment)
    handleClickReply(-1, '', '')
  }

  const handleNavigateToUserInfo = useVibrateCallback(async () => {
    if (!showComponent) {
      Taro.navigateTo({
        url: `/pages/error/error?errorCode=${ErrorCode.NO_MORE_CONTENT}&showErrorCode=false`
      })
      return
    }
    await Taro.navigateTo({
      url: `/packages/user/pages/detail/detail?userId=${authorId}`
    })
  }, [authorId, showComponent])

  const handleCloseCommentMenu = useVibrateCallback(() =>
    setShowCommentMenu(false)
  )

  const handleCloseReplyMenu = useVibrateCallback(() => setShowReplyMenu(false))

  const handleFocusSendComment = useVibrateCallback(() =>
    setSendCommentFocus(true)
  )

  if (!showComponent) {
    return <></>
  }

  return (
    <View className='post-detail'>
      <CustomModal {...modalProps} isOpen={showModal} />
      <FloatLayout
        isOpened={showCommentMenu}
        onClose={handleCloseCommentMenu}
        title='操作'
      >
        <CommentMenu
          onShowModal={handleShowModal}
          onRemoveComment={handleRemoveComment}
          onClickReply={handleClickCommentReply}
          onClose={handleCloseCommentMenu}
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
          onRemoveReply={handleDecreaseReplies}
          onShowMenu={handleShowReplyMenu}
        />
      </FloatLayout>
      <FloatLayout
        isOpened={showReplyMenu}
        onClose={handleCloseReplyMenu}
        title='操作'
        zIndex={9000}
      >
        <ReplyMenu
          onShowModal={handleShowModal}
          onClose={handleCloseReplyMenu}
          onClickReply={handleClickReply}
          {...replyMenuProps}
        />
      </FloatLayout>
      <View className='post-detail__title'>{title || '加载中...'}</View>
      <View className='at-row'>
        <View onClick={handleNavigateToUserInfo}>
          <AtAvatar
            circle
            image={authorAvatar}
            className='post-detail__avatar'
            size='small'
          />
        </View>
        <View className='at-col'>
          <View
            className='post-detail__author at-row'
            onClick={handleNavigateToUserInfo}
          >
            {authorName || '加载中...'}
          </View>
          <View className='post-detail__create-at at-row'>
            {`发布于${convertDate(createAt)} ${
              commentsCnt > 0 ? '回复于' + convertDate(updateAt) : ''
            }`}
          </View>
        </View>
        <View className='at-col post-detail__delete'>
          {user.role <= 1 && (
            <Text onClick={handleBanUser} className='post-detail__delete__ban'>
              封禁用户
            </Text>
          )}
          {(user.id === authorId || user.role <= 1) && (
            <Text onClick={handleDeletePost}>删除</Text>
          )}
        </View>
      </View>
      <View className='post-detail__content'>
        {content === null
          ? '努力加载中...'
          : content.split('\n').map(c => <View>{c}</View>)}
      </View>
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
        <View className='post-detail__actions__action'>
          <AtIcon value='eye' size='20' color={disabledColor} />
          <Text className='post-detail__actions__action__number'>{`浏览 ${views}`}</Text>
        </View>
        <View
          className='post-detail__actions__action'
          onClick={handleFocusSendComment}
        >
          <AtIcon value='message' size='20' color={disabledColor} />
          <Text className='post-detail__actions__action__number'>{`评论 ${commentsCnt}`}</Text>
        </View>
        <View className='post-detail__actions__action' onClick={handleLikePost}>
          <AtIcon
            value={liked ? 'heart-2' : 'heart'}
            size='20'
            color={disabledColor}
          />
          <Text className='post-detail__actions__action__number'>{`点赞 ${likes}`}</Text>
        </View>
        <View className='post-detail__actions__action' onClick={handleStarPost}>
          <AtIcon
            value={stared ? 'star-2' : 'star'}
            size='20'
            color={disabledColor}
          />
          <Text className='post-detail__actions__action__number'>{`收藏 ${stars}`}</Text>
        </View>
      </View>
      <View className='post-detail__divider' />
      <AtTabs
        current={tabIndex}
        tabList={tabList}
        onClick={i => handleClickTab(i as 0 | 1 | 2)}
        className='post-detail__tabs'
      />
      {!isLoaded && <View className='tip'>努力加载中...</View>}
      <View className='skeleton post-detail__list'>
        {/* @ts-ignore */}
        <ListView
          isLoaded={isLoaded}
          hasMore={hasMore}
          style={{
            width: '100%',
            overflowX: 'hidden',
            marginBottom: '55px'
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
              id={`comment-${c.id}`}
              highlight={c.id === highlightId}
              onShowMenu={handleShowCommentMenu}
              onshowReplyDetail={co => handleShowReplyDetail(co)}
            />
          ))}
          {isEmpty && <View className='tip2'>留下第一条评论吧~</View>}
          {!isEmpty && !hasMore && <View className='tip2'>没有更多内容</View>}
        </ListView>
      </View>
      {showComponent && (
        <View
          className='post-detail__send'
          style={{
            bottom: `${keyboardHeight}Px`,
            zIndex: sendReplyMode ? 8080 : 3000
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
                      value='close-circle'
                      size='20'
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
              onBlur={
                sendReplyMode
                  ? () => setSendReplyFocus(false)
                  : () => setSendCommentFocus(false)
              }
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
                  : primaryColor
              }}
              onClick={sendReplyMode ? handleSendReply : handleSendComment}
            >
              发送
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
