import { Avatar, List } from 'antd'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { RootState } from '../../../stores/rootReducer'
import { formatDate } from '../../../utils/format'

function UserResults() {
  const users = useSelector((state: RootState) => state.search.users)

  return (
    <List
      itemLayout="horizontal"
      size="small"
      dataSource={users}
      renderItem={(user) => (
        <List.Item key={user.id}>
          <List.Item.Meta
            avatar={
              <Avatar
                src={user.avatar ? user.avatar.url : '/default-avatar.png'}
              />
            }
            title={
              <b>
                <Link to={`/u/${user.username}`}>u/{user.username}</Link>
              </b>
            }
            description={<small>Joined {formatDate(user.createdAt)}</small>}
          />
        </List.Item>
      )}
    />
  )
}

export default UserResults
