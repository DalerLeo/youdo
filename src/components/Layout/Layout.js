import _ from 'lodash'
import filterHelper from '../../helpers/filter'
import {
  compose,
  withState,
  withHandlers,
  lifecycle
} from 'recompose'
import React from 'react'
import injectSheet from 'react-jss'
import DocumentTitle from 'react-document-title'
import SideBarMenu from '../SidebarMenu'
import SnakeBar from '../Snackbar'
import {connect} from 'react-redux'
import ErrorDialog from '../ErrorDialog'
import Notifications from './Notifications'
import {
  notificationListFetchAction,
  notificationCountFetchAction
} from '../../actions/notifications'

const enhance = compose(
  connect((state, props) => {
    const query = _.get(props, ['location', 'query'])
    const pathname = _.get(props, ['location', 'pathname'])
    const filter = filterHelper(pathname, query)
    const notificationsList = _.get(state, ['notifications', 'list', 'data'])
    const notificationsLoading = _.get(state, ['notifications', 'list', 'loading'])

    return {
      filter,
      notificationsList,
      notificationsLoading
    }
  }),
  injectSheet({
    wrapper: {
      height: '100%',
      width: '100%',
      display: 'flex'
    },
    loader: {
      padding: '100px 0'
    },
    sidenav: {
      position: 'fixed',
      width: '84px',
      top: '0',
      left: '0',
      bottom: '0',
      zIndex: '100'
    },
    content: {
      position: 'relative',
      background: '#f7f8f9',
      width: 'calc(100% - 84px)',
      marginLeft: '84px',
      padding: '0 28px 28px',
      overflowY: 'auto',
      overflowX: 'hidden'
    }
  }),
  withState('loading', 'setLoading', false),
  withState('openNotifications', 'setOpenNotifications', false),
  withHandlers({
    handleOpenNotificationBar: props => (status) => {
      const {setOpenNotifications, dispatch, setLoading} = props
      setOpenNotifications(status)
      setLoading(true)
      if (status) {
        dispatch(notificationListFetchAction())
          .then(() => {
            setLoading(false)
            dispatch(notificationCountFetchAction())
          })
      }
    }
  }),
  lifecycle({
    componentDidMount () {
      const content = this.refs.content
      const updateScrollValue = _.get(this, ['props', 'updateScrollValue'])
      const THRESHOLD = 110
      if (updateScrollValue) {
        let fixed = false
        content.addEventListener('scroll', () => {
          const value = content.scrollTop
          const newValue = value >= THRESHOLD
          if (fixed !== newValue) {
            updateScrollValue(newValue)
            fixed = newValue
          }
        })
      }
    }
  })
)

const Layout = enhance((props) => {
  const {
    classes,
    handleSignOut,
    children,
    dispatch,
    loading,
    setLoading,
    openNotifications,
    notificationsList,
    notificationsLoading,
    pathname,
    title
  } = props
  const mainTitle = 'MyJob Administration'
  return (
    <DocumentTitle title={title || mainTitle}>
      <div className={classes.wrapper}>
        <Notifications
          dispatch={dispatch}
          notificationsList={notificationsList}
          notificationsLoading={notificationsLoading}
          openNotifications={openNotifications}
          loading={loading}
          setLoading={setLoading}
          handleOpenNotificationBar={props.handleOpenNotificationBar}

        />
        <div className={classes.sidenav}>
          <SideBarMenu
            pathname={pathname}
            handleSignOut={handleSignOut}
            handleOpenNotificationBar={props.handleOpenNotificationBar}/>
        </div>
        <div className={classes.content} ref="content">

          {children}
        </div>

        <SnakeBar/>
        <ErrorDialog/>
      </div>
    </DocumentTitle>
  )
})

export default Layout
