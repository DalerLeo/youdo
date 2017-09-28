import React from 'react'
import _ from 'lodash'
import {compose, withState} from 'recompose'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'

const enhance = compose(
    withState('course', 'setCourse', false)
)

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
                        label={_.get(item, 'name')}
                        key={index}
                        value={_.toInteger(_.get(item, 'id'))}/>
                )
            })}
        </RadioButtonGroup>
    )
})

export default UserStockRadioButtonField
