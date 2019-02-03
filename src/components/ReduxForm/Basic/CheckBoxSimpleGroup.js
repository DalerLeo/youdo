import _ from 'lodash'
import React from 'react'
import MUICheckbox from 'material-ui/Checkbox'
import {compose, withHandlers} from 'recompose'
import injectSheet from 'react-jss'
import classNames from 'classnames'

const enhance = compose(
  withHandlers({
    onCheck: props => (checked, id) => {
      const {values, onChange} = props
      if (checked) {
        const value = _.union(values, [id])
        return onChange(value)
      }
      const value = _.filter(values, v => v !== id)
      return onChange(value)
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

const Checkbox = props => {
  const {
    classes,
    onCheck,
    className,
    values,
    items,
    ...defaultProps
  } = props
  return _.map(items, item => (
    <MUICheckbox
      key={item.id}
      label={item.name}
      className={classNames(classes.checkBox, className)}
      iconStyle={{width: '20px', height: '20px'}}
      labelStyle={{lineHeight: '20px', left: '-10px'}}
      checked={_.includes(values, item.id)}
      onCheck={(ev, checked) => onCheck(checked, item.id)}
      {...defaultProps}
    />))
}

export default enhance(Checkbox)
