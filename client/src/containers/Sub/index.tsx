import { Col, Row } from 'antd'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'

import { RootState } from '../../stores/rootReducer'
import { fetchSub } from '../../stores/subSlice'

import Posts from '../../components/Posts'
import PostSidebar from '../../components/Sidebar/PostSidebar'

function Sub() {
  const dispatch = useDispatch()
  const subState = useSelector((state: RootState) => state.sub)
  const { slug } = useParams<{ slug: string }>()
  const { sub, role, posts, totalPosts, totalSubscribers } = subState.data

  useEffect(() => {
    dispatch(fetchSub({ slug }))
  }, [])

  return (
    <>
      <Row>
        <Col span={16}>
          <Posts posts={posts} type="sub"></Posts>
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

export default Sub
