import React from 'react'
import _ from 'lodash'
import {withState, compose} from 'recompose'
import OkIcon from 'material-ui/svg-icons/action/done'
import injectSheet from 'react-jss'
import IconButton from 'material-ui/IconButton'
import Loader from '../Loader'
const enhance = compose(
  injectSheet({
    field: {
      display: 'flex',
      alignItems: 'flex-end',
      zIndex: '1'
    }
  }),
  withState('showField', 'setShowField', {loading: false, show: false})
)
const iconStyle = {
  icon: {
    color: '#129fdd',
    width: 24,
    height: 24
  },
  button: {
    width: 48,
    height: 48,
    padding: 12
  }
}

const InlineCustomField = enhance((props) => {
  const {
    classes,
    label,
    loading,
    updateAction,
    showField,
    setShowField,
    labelClass,
    wrapperClass
  } = props

  let fieldNames = []
  if (showField.show && _.isArray(props.children)) {
    return (
      <div
        className={wrapperClass}>
        {props.children.map((child, key) => {
          fieldNames.push(child.props.name)
          return React.cloneElement(child, {key})
        })}
        <IconButton
          iconStyle={iconStyle.icon}
          style={iconStyle.button}
          onClick={() => {
            updateAction(fieldNames)
            setShowField({loading: true, show: false})
          }}
          touch={true}>
          <OkIcon />
        </IconButton>
      </div>)
  }
  if (showField.show) {
    return (
      <div
        className={classes.field}>
        {props.children}
        <IconButton
          iconStyle={iconStyle.icon}
          style={iconStyle.button}
          onClick={() => {
            updateAction([props.children.props.name])
            setShowField({loading: true, show: false})
          }}
          touch={true}>
          <OkIcon />
        </IconButton>
      </div>)
  }
  return showField.loading && loading
    ? <div className={classes.loader}>
      <Loader size={0.45}/>
    </div>
    : (
      <div
        className={labelClass}
        style={{zIndex: '2'}}
        onDoubleClick={() => setShowField({loading: false, show: true})}>
        {label}
      </div>
    )
})

export default InlineCustomField
