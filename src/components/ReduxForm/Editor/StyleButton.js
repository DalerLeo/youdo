import React from 'react'
import {compose} from 'recompose'
import classNames from 'classnames'
import injectSheet from 'react-jss'
import {LINK_COLOR} from 'constants/styleConstants'

const enhance = compose(
  injectSheet({
    button: {
      alignItems: 'center',
      cursor: 'pointer',
      display: 'inline-flex',
      justifyContent: 'center',
      marginRight: '15px',
      height: '20px',
      width: '20px',
      '& > svg': {
        fill: '#555',
        fontSize: '20px'
      }
    },
    active: {
      '& > svg': {
        fill: LINK_COLOR,
        fontSize: '20px'
      }
    }
  })
)
const StyleButton = (props) => {
  const {classes, active, onToggle, style, label} = props

  const thisOnToggle = (event) => {
    event.preventDefault()
    return onToggle(style)
  }

  return (
    <span className={classNames(classes.button, {
      [classes.active]: active
    })} onMouseDown={thisOnToggle}>
      {label}
    </span>
  )
}

export default enhance(StyleButton)
