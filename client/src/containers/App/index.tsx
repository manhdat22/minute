import { lazy, Suspense } from 'react'
import { Switch, Route } from 'react-router-dom'
import DefaultLayout from '../../components/Layout'
import FlashMessage from '../../components/FlashMessage'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en)

const Home = lazy(() => import('../Home'))
const Post = lazy(() => import('../Post'))
const Sub = lazy(() => import('../Sub'))
const Profile = lazy(() => import('../Profile'))
const SearchResult = lazy(() => import('../SearchResult'))

function App() {
  return (
    <div className="App">
      <Suspense fallback={null}>
        <FlashMessage />
        <DefaultLayout>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/post/:slug" component={Post} />
            <Route path="/sub/:slug" component={Sub} />
            <Route path="/u/:username" component={Profile} />
            <Route path="/search/:keyword" component={SearchResult} />
          </Switch>
        </DefaultLayout>
      </Suspense>
    </div>
  )
}

export default App
