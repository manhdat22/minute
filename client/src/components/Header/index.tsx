import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import {
  Layout,
  Menu,
  Input,
  Dropdown,
  Row,
  Col,
  Avatar,
  Modal,
  Form,
} from 'antd'
import {
  SearchOutlined,
  UserOutlined,
  DownOutlined,
  LogoutOutlined,
  LoginOutlined,
} from '@ant-design/icons'
import { RootState } from '../../stores/rootReducer'
import { getToken } from '../../utils/credential'
import { getCurrentUser, logout } from '../../stores/authSlice'
import { hideLogin, setFlashMessage, showLogin } from '../../stores/commonSlice'

import LoginForm from '../../containers/Login'
import RegisterForm from '../../containers/Register'
import { useForm } from 'antd/lib/form/Form'

const { Header } = Layout

function DefaultHeader() {
  const dispatch = useDispatch()
  const history = useHistory()
  const [form] = useForm()
  const user = useSelector((state: RootState) => state.auth.user)

  if (!user && getToken()) {
    dispatch(getCurrentUser())
  }

  const onSearch = (value: any) => {
    if (!value) return

    history.push(`/search/${value}`)
    form.resetFields()
  }

  const isLoginVisible = useSelector(
    (state: RootState) => state.common.isLoginVisible,
  )
  const isRegisterVisible = useSelector(
    (state: RootState) => state.common.isRegisterVisible,
  )

  const logoutUser = () => {
    dispatch(logout())
    dispatch(setFlashMessage({ message: 'Goodbye !', messageType: 'success' }))

    window.location.href = '/'
  }

  const menu = (
    <Menu>
      <Menu.Item key={0}>
        <Link to={`/u/${user?.username}`}>
          <UserOutlined className="mr-2" />
          Profile
        </Link>
      </Menu.Item>
      <Menu.Item key={1}>
        <Link
          to="/"
          onClick={(e) => {
            e.preventDefault()
            logoutUser()
          }}
        >
          <LogoutOutlined className="mr-2" />
          Logout
        </Link>
      </Menu.Item>
    </Menu>
  )

  const UserMenu = user && (
    <Dropdown overlay={menu} trigger={['click']}>
      <a
        href={`/u/${user.username}`}
        className="float-right ant-dropdown-link font-bold text-white px-5 leading-header"
        onClick={(e) => e.preventDefault()}
      >
        <Avatar src={user.avatar ? user.avatar.url : '/default-avatar.png'} />
        <span className="mx-1">u/{user.username}</span>
        <DownOutlined />
      </a>
    </Dropdown>
  )

  const LoginLink = (
    <Link
      className="float-right ant-dropdown-link font-bold text-white px-5 leading-header"
      onClick={(e) => {
        e.preventDefault()
        dispatch(showLogin())
      }}
      to="/"
    >
      <LoginOutlined className="mr-2" />
      Login
    </Link>
  )

  const loginModal = (
    <Modal
      title={isRegisterVisible ? 'Register' : 'Login'}
      visible={isLoginVisible}
      footer={null}
      onCancel={() => dispatch(hideLogin())}
    >
      {isRegisterVisible ? <RegisterForm /> : <LoginForm />}
    </Modal>
  )

  return (
    <Header>
      <Row>
        <Col span={3}>
          <div className="">
            <Link
              to="/"
              className="float-left text-white logo px-5 font-bold text-lg leading-header"
            >
              minuté
            </Link>
          </div>
        </Col>
        <Col span={18}>
          <div className="max-w-page mx-auto">
            <Form form={form}>
              <Input.Search
                name="q"
                size="large"
                placeholder="Search anything"
                className="py-3 w-full"
                onSearch={onSearch}
                prefix={<SearchOutlined />}
              />
            </Form>
          </div>
        </Col>
        <Col span={3}>{user ? UserMenu : LoginLink}</Col>
      </Row>
      {loginModal}
    </Header>
  )
}

export default DefaultHeader
