import { Link, useParams } from 'react-router-dom'
import { Comment as AntdComment, Avatar, Divider, Popconfirm } from 'antd'
import { formatTimeAgo } from '../../utils/format'
import { useRef } from 'react'
import CommentBox from '../CommentBox'
import { useDispatch, useSelector } from 'react-redux'
import { setReplyTo } from '../../stores/commonSlice'
import { RootState } from '../../stores/rootReducer'
import { vote } from '../../stores/voteSlice'
import { fetchSinglePost } from '../../stores/postSlice'
import { deleteComment } from '../../stores/commentSlice'

function Comment({ comment, role, children }: any) {
  const dispatch = useDispatch()
  const { slug } = useParams<{ slug: string }>()
  const commentBox = useRef(null) as any
  const replyTo = useSelector((state: RootState) => state.common.replyTo) as any
  const currentUser = useSelector((state: RootState) => state.auth.user)
  const isVoted = comment && parseInt(comment.voted, 10)
  const cssClass = isVoted && 'text-primary'

  const executeScroll = (ref: any) => {
    ref.current?.scrollIntoView()
  }

  const openReply = async (parent: any) => {
    await dispatch(setReplyTo(parent))
    if (commentBox) executeScroll(commentBox)
  }

  const isReplyTo = (comment: any): boolean => {
    return Object.keys(replyTo).length !== 0 && replyTo.id === comment.id
  }

  const handleLike = async () => {
    const result = (await dispatch(
      vote({ parentId: comment.id, parentType: 'comment' }),
    )) as any

    if (!result.error) dispatch(fetchSinglePost({ slug }))
  }

  const confirmDelete = async (commentId: number) => {
    const result = (await dispatch(deleteComment({ id: commentId }))) as any
    if (!result.errors) dispatch(fetchSinglePost({ slug }))
  }

  const canDelete = () => {
    return role === 0 || comment.userId === currentUser.id
  }

  return (
    <>
      <AntdComment
        actions={
          !comment.isDeleted
            ? [
                <span
                  key="comment-nested-like"
                  className={cssClass}
                  onClick={() => handleLike()}
                >
                  {comment.voteCount || 0} Likes
                </span>,
                <span
                  key="comment-nested-reply"
                  onClick={() => openReply(comment)}
                >
                  Reply
                </span>,
                canDelete() && (
                  <Popconfirm
                    title="Are you sure to delete this comment?"
                    onConfirm={() => confirmDelete(comment.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <span key="comment-nested-reply">Delete</span>
                  </Popconfirm>
                ),
              ]
            : []
        }
        author={
          <>
            <Link to={`/u/${comment.user.username}`}>
              <strong>u/{comment.user.username}</strong>
            </Link>
            <Divider type="vertical" />
            {formatTimeAgo(comment.createdAt)}
          </>
        }
        avatar={
          <Avatar
            src={
              comment.user.avatar
                ? comment.user.avatar.url
                : '/default-avatar.png'
            }
            alt={`u/${comment.user.username}`}
          />
        }
        content={
          comment.isDeleted ? (
            <p className="text-gray-400">{comment.content}</p>
          ) : (
            <p>{comment.content}</p>
          )
        }
      >
        {children}
      </AntdComment>
      {isReplyTo(comment) && (
        <div ref={commentBox}>
          <CommentBox
            postId={comment.postId}
            parent={replyTo}
            parentId={replyTo.id}
          />
        </div>
      )}
    </>
  )
}

export default Comment
