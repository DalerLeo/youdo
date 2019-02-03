import _ from 'lodash'
import React from 'react'
import MUICheckbox from 'material-ui/Checkbox'
import {compose, withHandlers} from 'recompose'
import injectSheet from 'react-jss'
import classNames from 'classnames'

const enhance = compose(
  withHandlers({
    onChange: props => (checked, id) => {
      const {input: {value, onChange}} = props
      if (checked) {
        return onChange(_.union(value, [id]))
      }
      return onChange(_.filter(value, v => v !== id))
    }
  }),
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

const Checkbox = ({classes, onChange, className, input, label, items, ...defaultProps}) => {
  const props = {}
  _.map(defaultProps, (obj, index) => {
    if (index !== 'meta' && index !== 'sheet') {
      props[index] = obj
    }
  })
  return _.map(items, item => (
    <MUICheckbox
      label={item.name}
      className={classNames(classes.checkBox, className)}
      iconStyle={{width: '20px', height: '20px'}}
      labelStyle={{lineHeight: '20px', left: '-10px'}}
      checked={_.includes(input.value, item.id)}
      onCheck={(ev, checked) => onChange(checked, item.id)}
      {...props}
    />))
}

export default enhance(Checkbox)
