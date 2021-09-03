import { Card, Divider, Avatar, Menu } from 'antd'
import { Link } from 'react-router-dom'

function CommunitiesWidget({ subs, title }: any) {
  return (
    <Card bordered={false} className=" cursor-default">
      <b>{title}</b>
      <Divider />

      <Menu className="border-0">
        {subs &&
          subs.map((sub: any) => (
            <Menu.Item key={sub.id} className="p-0">
              <Link to={`/sub/${sub.slug}`}>
                <Avatar
                  src={sub.icon ? sub.icon.url : '/default-icon.png'}
                  alt={sub.name}
                  className="mr-1"
                />
                {sub.name}
              </Link>
            </Menu.Item>
          ))}
      </Menu>
    </Card>
  )
}

export default CommunitiesWidget
