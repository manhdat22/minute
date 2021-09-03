import { Button, Form, Input } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { createComment } from '../../stores/commentSlice'
import { setReplyTo } from '../../stores/commonSlice'
import { fetchSinglePost } from '../../stores/postSlice'
import { RootState } from '../../stores/rootReducer'

const { TextArea } = Input

function CommentBox({ parentId, postId, parent }: any) {
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const user = useSelector((state: RootState) => state.auth.user)

  const { slug } = useParams<{ slug: string }>()
  const onFinish = async (values: any) => {
    const result = await dispatch(
      createComment({ postId, parentId, ...values }) as any,
    )

    if (!result.error) {
      dispatch(setReplyTo({}))
      dispatch(fetchSinglePost({ slug }))
    }

    form.resetFields()
  }

  const onCancel = () => {
    form.resetFields()
    if (parentId) dispatch(setReplyTo({}))
  }

  return (
    <Form
      // ref={innerRef}
      form={form}
      name="new-comment"
      className="comment-form"
      onFinish={onFinish}
    >
      <Form.Item name="content" className="mb-0">
        <TextArea rows={3} placeholder="What do you think ?" />
      </Form.Item>

      <div className="h-9">
        {parentId ? (
          <small className="m-2 mx-0 float-left">
            Reply to{' '}
            <Link to={`/u/${parent.user.username}`}>
              u/{parent.user.username}
            </Link>{' '}
            as <Link to={`/u/${user.username}`}>u/{user.username}</Link>
          </small>
        ) : (
          <small className="m-2 mx-0 float-left">
            Comment as <Link to={`/u/${user.username}`}>u/{user.username}</Link>
          </small>
        )}

        <Button
          type="primary"
          htmlType="submit"
          size="small"
          className="m-2 mr-0 float-right"
        >
          <small>Send</small>
        </Button>

        <Button
          type="text"
          htmlType="reset"
          size="small"
          className=" m-2 mr-0 float-right"
          onClick={onCancel}
        >
          <small>Cancel</small>
        </Button>
      </div>
    </Form>
  )
}

export default CommentBox
