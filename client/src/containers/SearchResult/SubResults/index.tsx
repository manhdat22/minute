import { Avatar, List, Button } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { RootState } from '../../../stores/rootReducer'
import { search } from '../../../stores/searchSlice'
import { subscribe, unsubscribe } from '../../../stores/subSlice'

function SubResults() {
  const dispatch = useDispatch()
  const { keyword } = useParams<{ keyword: string }>()
  const subs = useSelector((state: RootState) => state.search.subs)

  const handleSubscribe = async (subId: number) => {
    await dispatch(subscribe({ id: subId }))
    dispatch(search({ keyword }))
  }

  const handleUnsubscribe = async (subId: number) => {
    await dispatch(unsubscribe({ id: subId }))
    dispatch(search({ keyword }))
  }

  return (
    <List
      itemLayout="horizontal"
      size="large"
      dataSource={subs}
      renderItem={(sub) => (
        <List.Item
          key={sub.id}
          actions={[
            sub.role !== 0 &&
              (parseInt(sub.subscribed, 10) ? (
                <Button
                  type="default"
                  className="w-full"
                  onClick={() => handleUnsubscribe(sub.id)}
                >
                  Unsubscribe
                </Button>
              ) : (
                <Button
                  type="primary"
                  className="w-full"
                  onClick={() => handleSubscribe(sub.id)}
                >
                  Subscribe
                </Button>
              )),
          ]}
        >
          <List.Item.Meta
            avatar={
              <Avatar src={sub.icon ? sub.icon.url : '/default-icon.png'} />
            }
            title={
              <b>
                <Link to={`/sub/${sub.slug}`}>{sub.name}</Link>
              </b>
            }
            description={<small>{sub.description}</small>}
          />
        </List.Item>
      )}
    />
  )
}

export default SubResults
