import React from 'react'
import _ from 'lodash'
import {compose} from 'recompose'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'

const enhance = compose()
const UserStockRadioButtonField = enhance((props) => {
  const {input, stockList, loading} = props

  if (loading) {
    return null
  }
  return (
    <RadioButtonGroup name="isPrimary" onChange={input.onChange} defaultSelected={_.toInteger(_.get(input, ['value']))}>
      {_.map(stockList, (item, index) => {
        return (
          <RadioButton
            style={{margin: '10px 0'}}
            label={_.get(item, 'name')}
            key={index}
            value={_.toInteger(_.get(item, 'id'))}/>
        )
      })}
    </RadioButtonGroup>
  )
})

export default UserStockRadioButtonField
