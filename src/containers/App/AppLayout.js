import React from 'react'
import {connect} from 'react-redux'
import _ from 'lodash'
import * as ROUTES from '../../constants/routes'
import {setTokenAction, signOutAction, setAuthConfirmAction} from '../../actions/signIn'
import {hashHistory} from 'react-router'
import injectSheet from 'react-jss'
import NotiFy from 'components/Images/notify.mp3'
import {feedbackListFetchAction} from 'containers/Feedback/actions/service'
import {getToken} from 'helpers/storage'
import {
  compose,
  withState,
  withHandlers,
  mapPropsStream
} from 'recompose'

import SideBarMenu from '../../components/SidebarMenu'
import {Observable} from 'rxjs'

const WAIT_SECUNDS = 5000
const enhance = compose(
  connect(state => ({
    feedCount: _.get(state, 'feedback.list.data.count'),
    authLoading: _.get(state, ['authConfirm', 'loading'])
  })),
  mapPropsStream(props$ => {
    const source = Observable.interval(WAIT_SECUNDS)
    const everySecond = source.withLatestFrom(props$).subscribe(([, props]) => {
      const getParams = () => _.get(props, 'location.query')
      if (getToken()) {
        return props.dispatch(feedbackListFetchAction({getParams}))
          .then(({value}) => {
            if (value.count !== props.feedCount) {
              const audio = new Audio(NotiFy)
              audio.play()
            }
          })
      }
      return null
    })
    props$.last().subscribe(() => everySecond.unsubscribe())

    return props$
  }),
  withHandlers({
    handleSignOut: prop => (event) => {
      const {dispatch} = prop
      event.preventDefault()

      dispatch(signOutAction())
        .then(() => {
          hashHistory.push(ROUTES.SIGN_IN)
        })
    }
  }),
  withState('scrollValue', 'updateScrollValue', false),
  injectSheet({
    sidenav: {
      position: 'fixed',
      width: '74px',
      top: '0',
      left: '0',
      bottom: '0',
      zIndex: '100',
      transition: 'all 100ms',
      transitionDelay: '300ms',
      '&:hover': {
        width: '220px',
        '& a > span': {
          visibility: 'visible',
          opacity: '1'

        }
      },
      '& a > span': {
        transition: 'all 200ms',
        transitionDelay: '300ms',
        visibility: 'hidden',
        opacity: '0',
        marginLeft: '10px'
      }
    }
  })

)

class AppLayout extends React.Component {
  constructor (props) {
    super(props)
    const {dispatch} = props
    dispatch(setTokenAction())
    dispatch(setAuthConfirmAction())
  }
  componentWillReceiveProps (nextProps) {
    const props = this.props
    const prevLocation = _.get(props, ['location', 'pathname'])
    const nextLocation = _.get(nextProps, ['location', 'pathname'])
    const updateScrollValue = _.get(nextProps, 'updateScrollValue')
    if (prevLocation !== nextLocation) {
      updateScrollValue(false)
    }
  }

  render () {
    const {
      handleSignOut,
      scrollValue,
      updateScrollValue,
      location: {pathname},
      classes,
      authLoading
    } = this.props
    const layout = {scrollValue, updateScrollValue, pathname}
    const isSignIn = pathname === '/sign-in'
    return (
      <div style={{width: '100%', height: '100%'}}>
        {!isSignIn &&
        <div className={classes.sidenav}>
          {!authLoading && <SideBarMenu
            handleSignOut={handleSignOut}
            handleOpenNotificationBar={() => null}/>}
        </div>}
        {React.cloneElement(this.props.children, {layout})}
      </div>
    )
  }
}

export default enhance(AppLayout)
