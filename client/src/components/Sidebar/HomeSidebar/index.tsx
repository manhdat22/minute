import { Space } from 'antd'
import CopyrightWidget from '../../Widget/CopyrightWidget'
import HomeWidget from '../../Widget/HomeWidget'
import CommunitiesWidget from '../../Widget/CommunitiesWidget'
import { useSelector } from 'react-redux'
import { RootState } from '../../../stores/rootReducer'

function HomeSidebar({ subs }: any) {
  const user = useSelector((state: RootState) => state.auth.user)

  return (
    <div className="sticky top-6 float-right m-lg ml-0">
      <Space direction="vertical" size="large" className="w-sidebar ">
        <HomeWidget />
        <CommunitiesWidget
          title={`${user ? 'My' : 'All'} Communities`}
          subs={subs}
        />
        <CopyrightWidget />
      </Space>
    </div>
  )
}

export default HomeSidebar
