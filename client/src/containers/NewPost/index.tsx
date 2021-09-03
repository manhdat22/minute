import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  Form,
  Input,
  Image,
  Button,
  Select,
  Divider,
  Upload,
  message,
} from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import ReactQuill from 'react-quill'

import { RootState } from '../../stores/rootReducer'
import { getToken } from '../../utils/credential'
import { clearError, fetchAllSub } from '../../stores/subSlice'
import { createPost, updatePost } from '../../stores/postSlice'

import 'react-quill/dist/quill.snow.css'

const { Option } = Select
const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  ['code-block', 'link'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['clean'],
]

const NewPostForm = ({ post, sub, subId }: any) => {
  const dispatch = useDispatch()

  const validation = useSelector((state: RootState) => state.sub.error)
  const subs = useSelector((state: RootState) => state.sub.subs)

  const [src, setSrc] = useState('')
  const [value, setValue] = useState('')
  const [fileType, setFileType] = useState('')
  const [mediaId, setMediaId] = useState('')
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const uploadEndpoint = 'http://localhost:8080/api/v1/post/upload-media'

  const asyncValidation = (field: string): any => {
    const errorMessages = validation?.errors

    if (errorMessages && errorMessages[field])
      return {
        help: errorMessages[field],
        validateStatus: 'error',
      }
  }

  useEffect(() => {
    dispatch(fetchAllSub())

    if (sub) {
      form.setFieldsValue({ subId: sub.id })
    }
    if (subId) {
      form.setFieldsValue({ subId })
    }
    if (post) {
      form.setFieldsValue(post)
    }
  }, [])

  const onFinish = async (values: any) => {
    let result

    dispatch(clearError())

    if (post) {
      result = (await dispatch(
        updatePost({
          id: post.id,
          ...values,
        }),
      )) as any

      if (!result.error)
        window.location.href = `/post/${result.payload.post.slug}`
    } else {
      result = (await dispatch(createPost(values))) as any

      if (!result.error)
        window.location.href = `/post/${result.payload.post.slug}`
    }
  }

  const beforeUpload = (file: any) => {
    const isLt25M = file.size / 1024 / 1024 < 25
    if (!isLt25M) {
      message.error('Media must smaller than 25MB!')
    }
    return isLt25M
  }

  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      setLoading(false)

      setSrc(info.file.response.url)
      setMediaId(info.file.response.id)
      setFileType(info.file.type)

      form.setFieldsValue({ mediaId: info.file.response.id })
    }
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  const PreviewMedia = ({ source }: any) => {
    if (fileType.includes('image')) {
      return <Image className="max-h-24" preview={false} src={source} />
    }
    return <video src={source} className="max-h-24"></video>
  }

  return (
    <Form form={form} name="new-sub" className="login-form" onFinish={onFinish}>
      <div>
        <div>
          <b>Community</b>
          <br />
          <small className="text-gray-500">
            Choose a community to submit new post.
          </small>
        </div>
        <Form.Item
          initialValue=""
          name="subId"
          rules={[
            {
              required: true,
              message: 'Please choose a community to submit new post!',
            },
          ]}
        >
          <Select
            showSearch
            disabled={post}
            optionFilterProp="children"
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value="">Choose a community</Option>
            {subs &&
              subs.map((sub) => (
                <Option key={sub.id} value={sub.id}>
                  {sub.name}
                </Option>
              ))}
          </Select>
        </Form.Item>
      </div>

      <div>
        <div>
          <b>Title</b>
          <br />
          <small className="text-gray-500">Title of your cool new post.</small>
        </div>
        <Form.Item
          name="title"
          rules={[{ required: true, message: 'Please input your post title!' }]}
          {...asyncValidation('title')}
        >
          <Input placeholder="eg. Cat pics " />
        </Form.Item>
      </div>

      <div>
        <b>Media</b>
        <br />
        <small className="text-gray-500">
          Videos or images of your choice.
        </small>
        <Upload
          name="media"
          accept=".png,.jpg,.jpeg,.mp4"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action={uploadEndpoint}
          headers={{ 'x-access-token': getToken() }}
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {src ? <PreviewMedia source={src} /> : uploadButton}
        </Upload>
        <Form.Item hidden name="mediaId">
          <Input hidden value={mediaId} />
        </Form.Item>
      </div>

      <div>
        <div>
          <b>Content</b>
        </div>
        <small className="text-gray-500">What is on your mind?</small>
        <Form.Item
          name="content"
          initialValue=""
          rules={[
            { required: true, message: 'Please input your post content!' },
          ]}
          {...asyncValidation('content')}
        >
          <ReactQuill
            theme="snow"
            modules={{
              toolbar: toolbarOptions,
            }}
            value={value || ''}
          />
        </Form.Item>
      </div>

      <Divider />

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="w-full login-form-button"
        >
          {post ? 'Update' : 'Create'} Post
        </Button>
      </Form.Item>
    </Form>
  )
}

export default NewPostForm
