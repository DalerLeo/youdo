import React from 'react'
import _ from 'lodash'
import {compose, withState} from 'recompose'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'

const enhance = compose(
    withState('course', 'setCourse', false)
)

const PriceMainRadionButton = enhance((props) => {
    const {input, mergedList} = props

    return (
        <RadioButtonGroup name="isPrimary" onChange={input.onChange} defaultSelected={input.value}>
            {_.map(mergedList, (item, index) => {
                return (
                    <RadioButton
                        className='dottedList'
                        key={index}
                        value={_.get(item, 'marketTypeId')}/>
                )
            })}
        </RadioButtonGroup>
    )
})

export default PriceMainRadionButton
