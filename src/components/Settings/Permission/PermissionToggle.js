import _ from 'lodash'
import React from 'react'
import {compose, withState, withHandlers} from 'recompose'
import Toggle from 'material-ui/Toggle'
import {hashHistory} from 'react-router'

const pathname = '/permission'

const enhance = compose(
  withState('course', 'setCourse', false),
  withHandlers({
    toggle: props => () => {
      const {input, id, filter, status, update} = props
      input.onChange()
      hashHistory.push({pathname, query: filter.getParams({id: id, status: status})})
      update()
    }
  })
)

const styles = {
  thumbOff: {
    backgroundColor: '#f5f5f5'
  },
  trackOff: {
    backgroundColor: '#bdbdbd'
  },
  thumbSwitched: {
    backgroundColor: '#81c784'
  },
  trackSwitched: {
    backgroundColor: '#c8e6c9'
  }
}

const ONE = 1
const PermissionToggle = enhance((props) => {
  const {status} = props
  const ON = 1
  const toggleStatus = _.toInteger(status)
  return (
    <Toggle
      thumbStyle={styles.thumbOff}
      trackStyle={styles.trackOff}
      thumbSwitchedStyle={styles.thumbSwitched}
      trackSwitchedStyle={styles.trackSwitched}
      toggled={toggleStatus === ON}
      onToggle={props.toggle}
      label={status === ONE ? 'Включен' : 'Выключен'}/>
  )
})

export default PermissionToggle
