import { Space } from 'antd'
import CommunityWidget from '../../Widget/CommunityWidget'
import CopyrightWidget from '../../Widget/CopyrightWidget'

function PostSidebar({ sub, role, totalPosts, totalSubscribers }: any) {
  return (
    <div className="sticky top-6 float-right m-lg ml-0">
      <Space direction="vertical" size="large" className="w-sidebar ">
        <CommunityWidget
          sub={sub}
          role={role}
          totalPosts={totalPosts}
          totalSubscribers={totalSubscribers}
        />
        <CopyrightWidget />
      </Space>
    </div>
  )
}

export default PostSidebar
