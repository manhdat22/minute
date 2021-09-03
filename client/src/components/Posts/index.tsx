import { Space, Card, Divider } from 'antd'
import { trimContent } from '../../utils/format'
import Action from '../Card/Action'
import Content from '../Card/Content'
import Title from '../Card/Title'
import Media from '../Media'

function Post({ posts, type }: any) {
  if (!posts) return <></>

  return (
    <div className="site-layout-content min-h-screen p-lg">
      <Space direction="vertical" size="large" className="w-full">
        {posts.length ? (
          posts.map((post: any) => {
            return (
              <Card
                key={post.id}
                bordered={false}
                hoverable
                className="w-content cursor-default"
              >
                <Title post={post} />
                <Divider />
                {post.media && <Media src={post.media.url} />}
                <Content content={trimContent(post.content)} />
                <Divider />
                <Action post={post} type={type} />
              </Card>
            )
          })
        ) : (
          <Card bordered={false} hoverable className="w-content cursor-default">
            <div className="text-center">No posts yet</div>
          </Card>
        )}
      </Space>
    </div>
  )
}

export default Post
