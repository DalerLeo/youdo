import _ from 'lodash'
import React from 'react'
import MUICheckbox from 'material-ui/Checkbox'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import toBoolean from '../../../helpers/toBoolean'
import classNames from 'classnames'

const enhance = compose(
  injectSheet({
    checkBox: {
      textAlign: 'left',
      marginBottom: '10px',
      marginTop: '10px',
      '& svg:first-child': {
        fill: '#666666 !important',
        color: '#666666 !important'
      },
      '& svg:last-child': {
        fill: '#666666 !important',
        color: '#666666 !important'
      },
      '& span': {
        top: '-10px !important',
        left: '-10px !important'
      }
    }
  })
)

const Checkbox = ({classes, className, input, label, ...defaultProps}) => {
  const props = {}
  _.map(defaultProps, (obj, index) => {
    if (index !== 'meta' && index !== 'sheet') {
      props[index] = obj
    }
  })
  return (
    <MUICheckbox
      label={label}
      className={classNames(classes.checkBox, className)}
      iconStyle={{width: '20px', height: '20px'}}
      labelStyle={{lineHeight: '20px', left: '-10px'}}
      checked={toBoolean(input.value)}
      onCheck={input.onChange}
      {...props}
    />)
}

export default enhance(Checkbox)
