import { Card, Divider, Space, Button, Modal, Avatar } from 'antd'
import { CalendarOutlined } from '@ant-design/icons'
import { formatDate } from '../../../utils/format'
import { useDispatch } from 'react-redux'
import { fetchAllSub, subscribe, unsubscribe } from '../../../stores/subSlice'
import { useHistory } from 'react-router'
import NewSubForm from '../../../containers/NewSub'
import { useState } from 'react'
import NewPostForm from '../../../containers/NewPost'
import { Link } from 'react-router-dom'

function CommunityWidget({
  sub,
  role,
  totalPosts,
  totalSubscribers,
  subId,
}: any) {
  const dispatch = useDispatch()
  const history = useHistory()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isPostModalVisible, setIsPostModalVisible] = useState(false)

  const handleOpen = () => {
    setIsModalVisible(true)
  }

  const handleClose = () => {
    setIsModalVisible(false)
  }

  const handleOpenPostModal = () => {
    setIsPostModalVisible(true)
    dispatch(fetchAllSub())
  }

  const handleClosePostModal = () => {
    setIsPostModalVisible(false)
  }

  const handleSubscribe = async () => {
    dispatch(subscribe({ id: sub.id }))
    history.go(0)
  }

  const handleUnsubscribe = () => {
    dispatch(unsubscribe({ id: sub.id }))
    history.go(0)
  }

  const CreateSubModal = () => {
    return (
      <Modal
        title="Edit your Community"
        visible={isModalVisible}
        footer={null}
        onCancel={handleClose}
      >
        <NewSubForm sub={sub} />
      </Modal>
    )
  }

  const CreatePostModal = () => {
    return (
      <Modal
        width={768}
        title="Create New Post"
        visible={isPostModalVisible}
        footer={null}
        onCancel={handleClosePostModal}
      >
        <NewPostForm sub={sub} />
      </Modal>
    )
  }

  const SubscribeButton = () => {
    const editBtn = (
      <Button
        type="default"
        className="w-full"
        onClick={(e) => {
          e.preventDefault()
          handleOpen()
        }}
      >
        Edit Community
      </Button>
    )
    const subscribeBtn = (
      <Button type="default" className="w-full" onClick={handleUnsubscribe}>
        Unsubscribe
      </Button>
    )
    const unsubscribeBtn = (
      <Button type="primary" className="w-full" onClick={handleSubscribe}>
        Subscribe
      </Button>
    )

    switch (role) {
      case 0:
        return editBtn
      case 2:
        return subscribeBtn
      case null:
        return unsubscribeBtn
    }
  }

  if (!sub) return null

  return (
    <Card bordered={false} className="cursor-default">
      <Space size={12}>
        <Avatar
          src={sub.icon ? sub.icon.url : '/default-icon.png'}
          alt={sub.name}
          className="rounded-full w-12 h-12"
        />
        <Link to={`/sub/${sub.slug}`}>
          <b className="align-middle ">{sub.name}</b>
        </Link>
      </Space>

      <Divider />

      {sub.description && (
        <>
          <p>{sub.description}</p> <Divider />{' '}
        </>
      )}

      <b>
        <CalendarOutlined /> Created {formatDate(sub.createdAt)}
      </b>

      <Space size={12} className="w-full">
        <small>{totalPosts} Posts</small>
        <small>{totalSubscribers} Subscribers</small>
      </Space>

      <Divider />

      <Space direction="vertical" className="w-full">
        {SubscribeButton()}
        <Button
          type="default"
          className="w-full"
          onClick={(e) => {
            e.preventDefault()
            handleOpenPostModal()
          }}
        >
          Create post
        </Button>
      </Space>

      {CreateSubModal()}
      {CreatePostModal()}
    </Card>
  )
}

export default CommunityWidget
