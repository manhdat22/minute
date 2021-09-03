import { Col, Row } from 'antd'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Posts from '../../components/Posts'
import HomeSidebar from '../../components/Sidebar/HomeSidebar'
import { fetchPost } from '../../stores/homeSlice'
import { RootState } from '../../stores/rootReducer'

function Home() {
  const dispatch = useDispatch()
  const home = useSelector((state: RootState) => state.home)
  const { posts, subs } = home.data

  useEffect(() => {
    dispatch(fetchPost({}))
  }, [])

  return (
    <>
      <Row>
        <Col span={16}>
          <Posts posts={posts} type="home"></Posts>
        </Col>
        <Col span={8}>
          <HomeSidebar subs={subs} />
        </Col>
      </Row>
    </>
  )
}

export default Home
