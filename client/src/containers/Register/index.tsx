import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons'
import { Form, Input, Divider, Button } from 'antd'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { register } from '../../stores/authSlice'

import { hideLogin, hideRegister } from '../../stores/commonSlice'
import { RootState } from '../../stores/rootReducer'

const passwordPattern =
  /(?=.*[a-z])(?=.*[A-Z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9!"#$%&'()\-^@;:,.\\/=~|{+*}<>?_[\]]{8,64}/
const usernamePattern = /^[a-z0-9_]{4,32}$/

const RegisterForm = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const user = useSelector((state: RootState) => state.auth.user)
  const validation = useSelector((state: RootState) => state.auth.error)

  const asyncValidation = (field: string): any => {
    const errorMessages = validation?.errors
    if (errorMessages && errorMessages[field])
      return {
        help: errorMessages[field],
        validateStatus: 'error',
      }
  }

  useEffect(() => {
    if (user) {
      dispatch(hideLogin())
      dispatch(hideRegister())

      history.push('/')
    }
  }, [dispatch, history, user])

  const onFinish = (values: any) => {
    dispatch(register(values))
  }

  return (
    <Form
      name="register"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Please input your Email.' },
          {
            type: 'email',
            message: 'Please input your Email correctly.',
          },
        ]}
        {...asyncValidation('email')}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" maxLength={255} />
      </Form.Item>
      <Form.Item
        name="username"
        rules={[
          { required: true, message: 'Please input your Username.' },
          { min: 4, message: 'Username must contain at least 4 character.' },
          {
            pattern: usernamePattern,
            message:
              'Username can only contain lowercase letters, number, and underscored.',
          },
        ]}
        {...asyncValidation('username')}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="Username"
          maxLength={32}
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { min: 8, message: 'Password must contain at least 8 character.' },
          { required: true, message: 'Please input your Password.' },
          {
            pattern: passwordPattern,
            message:
              'Password must contain a combination of uppercase letters, lowercase letters, and numbers.',
          },
        ]}
        {...asyncValidation('password')}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
      </Form.Item>

      <Form.Item
        name="confirm"
        dependencies={['password']}
        rules={[
          {
            required: true,
            message: 'Please confirm your Password.',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve()
              }
              return Promise.reject(new Error('Password do not match.'))
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Confirm password"
        />
      </Form.Item>

      <Divider />

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="w-full login-form-button"
        >
          Join us
        </Button>
        Already a member?
        <Button type="link" onClick={() => dispatch(hideRegister())}>
          Login
        </Button>
      </Form.Item>
    </Form>
  )
}

export default RegisterForm
