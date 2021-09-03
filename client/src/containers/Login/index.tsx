import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { Form, Input, Button, Divider } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'

import { login } from '../../stores/authSlice'
import { hideLogin, showRegister } from '../../stores/commonSlice'
import { RootState } from '../../stores/rootReducer'

const LoginForm = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const user = useSelector((state: RootState) => state.auth.user)
  const [form] = Form.useForm()

  const onFinish = async (values: any) => {
    dispatch(login(values))
    form.resetFields()
  }

  useEffect(() => {
    if (user) {
      dispatch(hideLogin())
      history.push('/')
    }
  }, [dispatch, history, user])

  return (
    <Form
      form={form}
      name="login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item
        name="id"
        rules={[{ required: true, message: 'Please input your ID!' }]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Username or Email"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>

      <Divider />

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="w-full login-form-button"
        >
          Log in
        </Button>
        <Button
          type="link"
          className="w-full"
          onClick={() => dispatch(showRegister())}
        >
          Register
        </Button>
      </Form.Item>
    </Form>
  )
}

export default LoginForm
