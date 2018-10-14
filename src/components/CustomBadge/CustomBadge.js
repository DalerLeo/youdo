import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import {compose, lifecycle} from 'recompose'
import Badge from 'material-ui/Badge'
import ToolTip from '../Utils/ToolTip'
import FlatButton from 'material-ui/FlatButton'
import Notification from 'material-ui/svg-icons/social/notifications'
import {notificationCountFetchAction} from '../../actions/notifications'
import t from '../../helpers/translate'

const ZERO = 0
const TIMER = 60000

let notificationCountInterval = null

const enhance = compose(
  lifecycle({
    componentDidMount () {
      const dispatch = this.props.dispatch
      dispatch(notificationCountFetchAction())
      if (notificationCountInterval) {
        clearInterval(notificationCountInterval)
      }
      notificationCountInterval = setInterval(() => {
        dispatch(notificationCountFetchAction())
      }, TIMER)
    }
  }),
  connect((state) => {
    const count = _.get(state, ['notifications', 'count', 'data', 'count']) || ZERO
    return {
      count
    }
  })
)

const CustomBadge = enhance((props) => {
  const {classBadge, style, handleOpen, count, rippleColor} = props
  if (count <= ZERO) {
    return (
      <ToolTip position="right" text={t('Уведомления')}>
        <FlatButton
          rippleColor={rippleColor}
          hoverColor={rippleColor}
          style={style}
          onClick={() => {
            handleOpen(true)
          }}>
          <Notification />
        </FlatButton>
      </ToolTip>
    )
  }
  return (
    <Badge
      className={classBadge}
      badgeContent={count}
      badgeStyle={{top: 8, right: 10}}>
      <ToolTip position="right" text={t('Уведомления')}>
        <FlatButton
          rippleColor="#fff"
          style={style}
          onClick={() => {
            handleOpen(true)
          }}>
          <Notification />
        </FlatButton>
      </ToolTip>
    </Badge>
  )
})

export default CustomBadge
