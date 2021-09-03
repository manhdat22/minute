import { Space, Button, Popconfirm, Modal } from 'antd'
import {
  LikeOutlined,
  LikeFilled,
  CommentOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { Link, useHistory, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { vote } from '../../../stores/voteSlice'
import { getProfile } from '../../../stores/profileSlice'
import { fetchPost } from '../../../stores/homeSlice'
import { fetchAllSub, fetchSub } from '../../../stores/subSlice'
import { deletePost, fetchSinglePost } from '../../../stores/postSlice'
import { useState } from 'react'
import NewPostForm from '../../../containers/NewPost'

function Action({ post, type, role, isAuthor }: any) {
  const dispatch = useDispatch()
  const history = useHistory()
  const [isPostModalVisible, setIsPostModalVisible] = useState(false)

  const handleOpenPostModal = () => {
    setIsPostModalVisible(true)
    dispatch(fetchAllSub())
  }
  const handleClosePostModal = () => {
    setIsPostModalVisible(false)
  }
  const { username } = useParams<{ username: string }>()
  const { slug } = useParams<{ slug: string }>()
  const isVoted = post && parseInt(post.voted, 10)
  const canDelete = role === 0 || isAuthor
  const canEdit = isAuthor

  const cssClass = isVoted
    ? 'text-primary focus:bg-transparent'
    : 'hover:bg-transparent focus:bg-transparent hover:text-primary'
  const icon = isVoted ? <LikeFilled /> : <LikeOutlined />

  const EditPostModal = () => {
    return (
      <Modal
        width={768}
        title="Create New Post"
        visible={isPostModalVisible}
        footer={null}
        onCancel={handleClosePostModal}
      >
        <NewPostForm subId={post.subId} post={post} />
      </Modal>
    )
  }

  const confirm = async (postId: number) => {
    const result = (await dispatch(deletePost({ id: postId }))) as any

    if (!result.errors) history.push('/')
  }

  const handleVote = async (postId: number) => {
    await dispatch(vote({ parentId: postId, parentType: 'post' }))

    switch (type) {
      case 'profile':
        dispatch(getProfile({ username }))
        break
      case 'home':
        dispatch(fetchPost({}))
        break
      case 'sub':
        dispatch(fetchSub({ slug }))
        break
      case 'single':
        dispatch(fetchSinglePost({ slug }))
        break
      default:
        history.go(0)
        break
    }
  }

  return (
    <div className="mt-4">
      <Space direction="horizontal" size="small">
        <Button
          type="text"
          size="small"
          icon={icon}
          className={cssClass}
          onClick={() => handleVote(post.id)}
        >
          {post?.voteCount} Likes
        </Button>
        <Link to={`/post/${post.slug}`}>
          <Button
            type="text"
            size="small"
            icon={<CommentOutlined />}
            className="hover:bg-transparent hover:text-primary"
          >
            {post?.commentCount} Comments
          </Button>
        </Link>
        {canEdit && (
          <>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={handleOpenPostModal}
              className="hover:bg-transparent hover:text-primary"
            >
              Edit
            </Button>
          </>
        )}

        {canDelete && (
          <Popconfirm
            title="Are you sure to delete this post?"
            onConfirm={() => confirm(post.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              className="hover:bg-transparent hover:text-danger"
            >
              Delete
            </Button>
          </Popconfirm>
        )}
      </Space>
      {EditPostModal()}
    </div>
  )
}

export default Action
