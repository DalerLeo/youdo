import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {COLOR_RED} from 'constants/styleConstants'

const enhance = compose(
  injectSheet({
    label: {
      fontWeight: '600',
      lineHeight: 'normal',
      marginBottom: '10px'
    },
    errorLabel: {
      color: COLOR_RED
    },
    required: {
      color: COLOR_RED
    }
  })
)

const Label = ({...props}) => {
  const {classes, label, required, error} = props
  if (label) {
    return (
      <div className={classNames(classes.label, {[classes.errorLabel]: error})}>
        <span>
          {label}
          {required && <span className={classes.required}>*</span>}
        </span>
      </div>
    )
  }
  return null
}

Label.propTypes = {
  label: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.bool
}

Label.defaultProps = {
  label: null,
  required: false,
  error: false
}

export default enhance(Label)
