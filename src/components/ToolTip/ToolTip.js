import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import ReactToolTip from 'react-tooltip'
import {compose, withState} from 'recompose'

const enhance = compose(
  injectSheet({
    wrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    },
    alignRightWrapper: {
      extend: 'wrapper',
      justifyContent: 'flex-end'
    },
    tooltip: {
      zIndex: '999999 !important',
      borderRadius: '2px !important',
      background: '#2d3037 !important',
      lineHeight: '1.3',
      whiteSpace: 'nowrap',
      '&.place-left': {
        '&:after': {
          right: '-5px !important'
        }
      },
      '&:after': {
        display: 'none !important'
      }
    }
  }),
  withState('visible', 'setVisible', false)
)

const ToolTip = enhance(({classes, text, children, position, type, disabled, alignRight}) => {
  const uniqId = _.uniqueId('tooltip_')
  return (
    <div>
      <div data-tip data-for={uniqId} className={alignRight ? classes.alignRightWrapper : classes.wrapper}>
        {children}
      </div>
      {text && <ReactToolTip
        place={position}
        id={uniqId}
        type={type || 'dark'}
        effect="solid"
        className={classes.tooltip}
        html={true}>
        {text}
      </ReactToolTip>}
    </div>
  )
})

ToolTip.propTypes = {
  position: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
}

export default ToolTip
