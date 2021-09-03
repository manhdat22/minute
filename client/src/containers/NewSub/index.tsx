import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { Form, Input, Button, Image, Divider, Upload, message } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'

import { RootState } from '../../stores/rootReducer'
import { getToken } from '../../utils/credential'
import { clearError, createSub, updateSub } from '../../stores/subSlice'

const NewSubForm = ({ sub }: any) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const validation = useSelector((state: RootState) => state.sub.error)
  const [src, setSrc] = useState('')
  const [iconId, setIconId] = useState('')
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const defaultAvatar = '/default-avatar.png'
  const uploadEndpoint = 'http://localhost:8080/api/v1/sub/upload-icon'

  const asyncValidation = (field: string): any => {
    const errorMessages = validation?.errors
    if (errorMessages && errorMessages[field])
      return {
        help: errorMessages[field],
        validateStatus: 'error',
      }
  }

  useEffect(() => {
    form.setFieldsValue(sub)

    if (sub?.icon) {
      setSrc(sub.icon.url)
    }
  }, [])

  const onFinish = async (values: any) => {
    let result

    dispatch(clearError())

    if (sub) {
      result = (await dispatch(
        updateSub({
          id: sub.id,
          ...values,
        }),
      )) as any

      if (!result.error) history.go(0)
    } else {
      result = (await dispatch(createSub(values))) as any

      if (!result.error) history.push(`/sub/${result.payload.sub.slug}`)
    }
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
      setIconId(info.file.response.id)

      form.setFieldsValue({ iconId: info.file.response.id })
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
      form={form}
      name="new-sub"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <b>Icon</b>
      <br />
      <small className="text-gray-500">
        Images must be .png or .jpg format and smaller than 2MB.
      </small>
      <Upload
        name="icon"
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

      <Form.Item hidden name="iconId">
        <Input hidden value={iconId} />
      </Form.Item>

      {!sub && (
        <>
          <div>
            <b>Name</b>
            <br />
            <small className="text-gray-500">
              A unique community name that cannot be changed.
            </small>
          </div>
          <Form.Item
            name="name"
            rules={[
              { required: true, message: 'Please input your community name!' },
            ]}
            {...asyncValidation('name')}
          >
            <Input placeholder="eg. Cat pics " />
          </Form.Item>
        </>
      )}

      <div>
        <b>Description</b>
        <br />
        <small className="text-gray-500">
          A brief description of your community.
        </small>
      </div>

      <Form.Item
        name="description"
        rules={[
          { required: true, message: 'Please input your community name!' },
        ]}
        {...asyncValidation('description')}
      >
        <Input.TextArea
          rows={5}
          maxLength={255}
          placeholder="eg. This is a cats lover community."
        />
      </Form.Item>

      <Divider />

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="w-full login-form-button"
        >
          {sub ? 'Update' : 'Create'} Community
        </Button>
      </Form.Item>
    </Form>
  )
}

export default NewSubForm
