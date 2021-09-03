import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../stores/rootReducer'
import { getToken } from '../../utils/credential'
import { getCurrentUser } from '../../stores/authSlice'

import { Form, Button, message, Upload, Image, Space } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import TextArea from 'antd/lib/input/TextArea'
import { getProfile, updateProfile } from '../../stores/profileSlice'
import { useParams } from 'react-router'

const defaultAvatar = '/default-avatar.png'
const uploadEndpoint = 'http://localhost:8080/api/v1/profile/upload-avatar'

const EditProfileForm = () => {
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  const [src, setSrc] = useState('')
  const [loading, setLoading] = useState(false)
  const profile = useSelector((state: RootState) => state.profile.profile)
  const { username } = useParams<{ username: string }>()

  useEffect(() => {
    if (profile) {
      profile.avatar ? setSrc(profile.avatar.url) : setSrc(defaultAvatar)
      form.setFieldsValue(profile)
    }
  }, [form, profile])

  const onFinish = async (values: any) => {
    await dispatch(updateProfile(values))
    dispatch(getProfile({ username }))
  }

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!')
    }
    return isJpgOrPng && isLt2M
  }

  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      setLoading(false)
      setSrc(info.file.response.url)
      dispatch(getCurrentUser())

      message.success('Your profile image has been updated.')
    }
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  return (
    <Form
      name="edit-profile"
      form={form}
      className="login-form"
      onFinish={onFinish}
    >
      <Space size="small" direction="vertical">
        <b>Avatar</b>
        <small className="text-gray-500">
          Images must be .png or .jpg format and smaller than 2MB.
        </small>
        <Upload
          name="avatar"
          accept=".png,.jpg,.jpeg"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action={uploadEndpoint}
          headers={{ 'x-access-token': getToken() }}
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {src ? (
            <Image
              className="max-h-24"
              preview={false}
              src={src}
              fallback={defaultAvatar}
            />
          ) : (
            uploadButton
          )}
        </Upload>
        <b>Bio (optional)</b>
        <small className="text-gray-500">
          A brief description of yourself shown on your profile.
        </small>
      </Space>
      <Form.Item name="bio">
        <TextArea
          rows={4}
          className="mt-2"
          placeholder="Bio (optional)"
          maxLength={255}
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="w-full login-form-button"
        >
          Update bio
        </Button>
      </Form.Item>
    </Form>
  )
}

export default EditProfileForm
