import { NoticeMap, NoticeCnt } from '@/types/notice'

export const mapToNoticeCnt = (noticeMap: NoticeMap): NoticeCnt => {
  return {
    total: noticeMap['总消息数'],
    system: noticeMap['系统消息'],
    reply: {
      total:
        noticeMap['回复收到了回复'] +
        noticeMap['帖子收到了回复'] +
        noticeMap['评论收到了回复'],
      post: noticeMap['帖子收到了回复'],
      comment: noticeMap['评论收到了回复'],
      reply: noticeMap['回复收到了回复']
    },
    like: {
      total:
        noticeMap['回复收到了点赞'] +
        noticeMap['帖子收到了点赞'] +
        noticeMap['评论收到了点赞'],
      post: noticeMap['帖子收到了点赞'],
      comment: noticeMap['评论收到了点赞'],
      reply: noticeMap['回复收到了点赞']
    }
  }
}
