import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import ReactToolTip from 'react-tooltip'
import {compose, withState} from 'recompose'

const enhance = compose(
  injectSheet({
    wrapper: {
      position: 'relative'
    },
    tooltip: {
      zIndex: '999999 !important',
      '&.place-left': {
        '&:after': {
          right: '-5px !important'
        }
      }
    }
  }),
  withState('visible', 'setVisible', false)
)

const CustomToolTip = enhance(({classes, text, children, position}) => {
  const uniqId = _.uniqueId('tooltip_')
  return (
    <div>
      <div data-tip data-for={uniqId}>
        {children}
      </div>
      <ReactToolTip
        place={position}
        id={uniqId}
        type="dark"
        effect="solid"
        className={classes.tooltip}>
        {text}
      </ReactToolTip>
    </div>
  )
})

CustomToolTip.propTypes = {
  position: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
}

export default CustomToolTip
