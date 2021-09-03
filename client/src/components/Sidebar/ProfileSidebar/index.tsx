import { Space } from 'antd'

import CopyrightWidget from '../../Widget/CopyrightWidget'
import CommunitiesWidget from '../../Widget/CommunitiesWidget'
import ProfileWidget from '../../Widget/ProfileWidget'

function ProfileSidebar({ profile, subs, totalPosts }: any) {
  return (
    <div className="sticky top-6 float-right m-lg ml-0">
      <Space direction="vertical" size="large" className="w-sidebar ">
        <ProfileWidget profile={profile} totalPosts={totalPosts} />
        <CommunitiesWidget
          subs={subs}
          title={`u/${profile?.username}'s communities`}
        />
        <CopyrightWidget />
      </Space>
    </div>
  )
}

export default ProfileSidebar
