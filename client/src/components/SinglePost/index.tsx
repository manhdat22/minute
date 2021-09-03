import { Card, Divider } from 'antd'
import Action from '../Card/Action'
import Content from '../Card/Content'
import Title from '../Card/Title'
import Media from '../Media'

function SinglePost({ post, role, isAuthor }: any) {
  if (!post) return <></>

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
      <Content content={post.content} />
      <Divider />
      <Action post={post} type="single" role={role} isAuthor={isAuthor} />
    </Card>
  )
}

export default SinglePost
