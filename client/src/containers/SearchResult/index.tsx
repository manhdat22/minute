import { Space, Card, Divider, Button } from 'antd'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { RootState } from '../../stores/rootReducer'
import { search } from '../../stores/searchSlice'

import PostResults from './PostResults'
import SubResults from './SubResults'
import UserResults from './UserResults'

function SearchResult() {
  const dispatch = useDispatch()
  const { keyword } = useParams<{ keyword: string }>()
  const [currentTab, setCurrentTab] = useState('post')
  const { posts, subs, users } = useSelector((state: RootState) => state.search)

  const active = (tab: string): string => {
    return currentTab === tab ? 'text-primary' : ''
  }

  const tabContent = () => {
    switch (currentTab) {
      case 'post':
        return <PostResults />
      case 'sub':
        return <SubResults />
      case 'user':
        return <UserResults />
      default:
        return <>No data</>
    }
  }

  useEffect(() => {
    dispatch(search({ keyword }))
  }, [keyword])

  return (
    <div className="site-layout-content min-h-screen p-lg">
      <Space direction="vertical" size="large" className="w-full">
        <Card bordered={false} className="w-page">
          <div className="float-left w-1/2 leading-8">
            Search results for: <b>"{keyword}"</b>
          </div>
          <div className="float-right w-1/2 text-right">
            <Button
              type="text"
              className={active('post')}
              onClick={() => setCurrentTab('post')}
            >
              Posts ({posts.length})
            </Button>
            <Divider type="vertical" />
            <Button
              type="text"
              className={active('sub')}
              onClick={() => setCurrentTab('sub')}
            >
              Communities ({subs.length})
            </Button>
            <Divider type="vertical" />
            <Button
              type="text"
              className={active('user')}
              onClick={() => setCurrentTab('user')}
            >
              Users ({users.length})
            </Button>
          </div>
        </Card>
        <Card bordered={false} className="w-page">
          {tabContent()}
        </Card>
      </Space>
    </div>
  )
}

export default SearchResult
