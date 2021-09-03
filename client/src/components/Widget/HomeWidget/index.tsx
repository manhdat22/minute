import { Card, Divider, Space, Button, Modal } from 'antd'
import { useState } from 'react'
import NewPostForm from '../../../containers/NewPost'
import NewSubForm from '../../../containers/NewSub'

function HomeWidget() {
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
  }

  const handleClosePostModal = () => {
    setIsPostModalVisible(false)
  }

  const CreateSubModal = () => {
    return (
      <Modal
        title="Create New Community"
        visible={isModalVisible}
        footer={null}
        onCancel={handleClose}
      >
        <NewSubForm />
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
        <NewPostForm />
      </Modal>
    )
  }

  return (
    <Card bordered={false} className="cursor-default">
      <b>Home</b>
      <Divider />
      <Space direction="vertical" className="w-full">
        <Button type="primary" className="w-full" onClick={handleOpenPostModal}>
          Create post
        </Button>
        <Button type="default" className="w-full" onClick={handleOpen}>
          Create community
        </Button>
      </Space>
      {CreateSubModal()}
      {CreatePostModal()}
    </Card>
  )
}

export default HomeWidget
