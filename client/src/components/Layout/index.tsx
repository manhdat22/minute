import { Layout } from 'antd'
import DefaultHeader from '../Header'

const { Content } = Layout

function DefaultLayout(props: { children: JSX.Element }) {
  return (
    <>
      <Layout className="layout">
        <DefaultHeader />

        <Content className="py-0 px-xl mx-auto">{props.children}</Content>
      </Layout>
    </>
  )
}

export default DefaultLayout
