import { Space, Card, Divider, Col, Row } from 'antd'

import Comment from '../../components/Comment'
import CommentBox from '../../components/CommentBox'
import PostSidebar from '../../components/Sidebar/PostSidebar'
import SinglePost from '../../components/SinglePost'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchSinglePost } from '../../stores/postSlice'
import { RootState } from '../../stores/rootReducer'

function Post() {
  const dispatch = useDispatch()
  const { slug } = useParams<{ slug: string }>()
  const postState = useSelector((state: RootState) => state.post)
  const { sub, role, isAuthor, post, totalPosts, totalSubscribers } =
    postState.data

  useEffect(() => {
    dispatch(fetchSinglePost({ slug }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadComment = (parentId: number | null = null) => {
    if (!post.comments) return null

    const filteredComments = post.comments.filter((comment: any) => {
      return comment.parentId === parentId
    })

    if (!filteredComments.length) return null

    return filteredComments.map((comment: any) => (
      <Comment key={comment.id} comment={comment} role={role}>
        {loadComment(comment.id)}
      </Comment>
    ))
  }

  return (
    <>
      <Row>
        <Col span={16}>
          <div className="site-layout-content min-h-screen p-lg">
            <Space direction="vertical" size="large" className="w-full">
              <SinglePost post={post} isAuthor={isAuthor} role={role} />

              <Card bordered={false} className="w-content">
                <CommentBox post={post} postId={post.id} />

                <Divider />

                {loadComment()}
              </Card>
            </Space>
          </div>
        </Col>
        <Col span={8}>
          <PostSidebar
            sub={sub}
            role={role}
            totalPosts={totalPosts}
            totalSubscribers={totalSubscribers}
          />
        </Col>
      </Row>
    </>
  )
}

export default Post
