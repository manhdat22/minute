import { Avatar, List, Image, Divider } from 'antd'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Content from '../../../components/Card/Content'
import { RootState } from '../../../stores/rootReducer'
import { formatTimeAgo, trimContent } from '../../../utils/format'

function PostResults() {
  const posts = useSelector((state: RootState) => state.search.posts)

  const isVideo = (src: string) => {
    if (!src) return

    const ext = src.split('.').pop() || ''
    return ['mp4'].includes(ext)
  }

  return (
    <List
      itemLayout="vertical"
      size="large"
      dataSource={posts}
      renderItem={(post) => (
        <List.Item
          key={post.id}
          extra={
            post.media &&
            (isVideo(post.media.url) ? (
              <video width={270} controls src={post.media.url}></video>
            ) : (
              <Image width={270} preview={false} src={post.media.url} />
            ))
          }
        >
          <List.Item.Meta
            avatar={
              <Avatar
                src={
                  post.author.avatar
                    ? post.author.avatar.url
                    : '/default-avatar.png'
                }
              />
            }
            title={
              <b>
                <Link to={`/post/${post.slug}`}>{post.title}</Link>
              </b>
            }
            description={
              <small className="block">
                <Link to={`/sub/${post.sub.slug}`}>{post.sub.name}</Link>
                <Divider type="vertical" />
                Posted by{' '}
                <Link to={`/u/${post.author.username}`}>
                  u/{post.author.username}
                </Link>{' '}
                {formatTimeAgo(post.createdAt)}
              </small>
            }
          />
          <div>
            <Content content={trimContent(post.content)} />
          </div>
        </List.Item>
      )}
    />
  )
}

export default PostResults
