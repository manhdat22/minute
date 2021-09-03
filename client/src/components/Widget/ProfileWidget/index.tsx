import { useState } from 'react'
import { useSelector } from 'react-redux'

import { Card, Divider, Space, Button, Image, Modal } from 'antd'
import { CalendarOutlined, ProfileOutlined } from '@ant-design/icons'

import { RootState } from '../../../stores/rootReducer'
import EditProfileForm from '../../../containers/EditProfile'
import { formatDate } from '../../../utils/format'

function ProfileWidget({ profile, totalPosts }: any) {
  const user = useSelector((state: RootState) => state.auth.user)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }
  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const EditProfileModal = (
    <Modal
      title="Edit profile"
      visible={isModalVisible}
      footer={null}
      onCancel={() => handleCancel()}
    >
      <EditProfileForm />
    </Modal>
  )

  return !profile ? (
    <></>
  ) : (
    <>
      <Card bordered={false} className="cursor-default">
        <Space size={12}>
          <Image
            src={profile.avatar ? profile.avatar.url : '/default-avatar.png'}
            width={48}
            height={48}
            preview={false}
            alt={`u/${profile.username}`}
            className="rounded-full"
          />
          <b className="align-middle ">u/{profile.username}</b>
        </Space>
        <Divider />

        {profile.bio && (
          <>
            <p>{profile.bio}</p>
            <Divider />
          </>
        )}

        <Space direction="vertical" className="w-full">
          <b>
            <CalendarOutlined /> Joined since {formatDate(profile.createdAt)}
          </b>
          <b>
            <ProfileOutlined /> {totalPosts} Posts
          </b>
        </Space>

        {user.id === profile.id && (
          <>
            <Divider />
            <Space direction="vertical" className="w-full">
              <Button type="default" className="w-full" onClick={showModal}>
                Edit profile
              </Button>
            </Space>
            {EditProfileModal}
          </>
        )}
      </Card>
    </>
  )
}

export default ProfileWidget
