import { Col, Row } from 'antd'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getProfile } from '../../stores/profileSlice'
import { RootState } from '../../stores/rootReducer'

import Posts from '../../components/Posts'
import ProfileSidebar from '../../components/Sidebar/ProfileSidebar'

function Profile() {
  const dispatch = useDispatch()
  const { username } = useParams<{ username: string }>()
  const data = useSelector((state: RootState) => state.profile)
  const { profile, posts, subs, totalPosts } = data

  useEffect(() => {
    dispatch(getProfile({ username }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Row>
        <Col span={16}>
          <Posts posts={posts} type="profile"></Posts>
        </Col>
        <Col span={8}>
          <ProfileSidebar
            profile={profile}
            subs={subs}
            totalPosts={totalPosts}
          />
        </Col>
      </Row>
    </>
  )
}

export default Profile
