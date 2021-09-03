import { Divider } from 'antd'
import { Link } from 'react-router-dom'
import { formatTimeAgo } from '../../../utils/format'

function Title({ post }: any) {
  const sub = post.sub
  const author = post.author

  if (!(sub && author)) return <></>

  return (
    <div>
      <small>
        <Link to={`/sub/${sub.slug}`}>{sub.name}</Link>
        <Divider type="vertical" />
        Posted by <Link to={`/u/${author.username}`}>
          u/{author.username}
        </Link>{' '}
        {formatTimeAgo(post.createdAt)}
      </small>
      <br />
      <Link to={`/post/${post.slug}`}>
        <b>{post.title}</b>
      </Link>
    </div>
  )
}

export default Title
