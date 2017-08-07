import React from 'react'
import _ from 'lodash'
import {compose, withState} from 'recompose'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'

const enhance = compose(
    withState('course', 'setCourse', false)
)

const PriceMainRadionButton = enhance((props) => {
    const {input, mergedList} = props
    const getVal = (first, list) => {
        let primary = first
        _.map(list, (obj) => {
            if (_.get(obj, 'isPrimary')) {
                primary = _.get(obj, 'marketTypeId')
            }
        })
        return _.toInteger(primary)
    }
    return (
        <RadioButtonGroup name="isPrimary" onChange={input.onChange} defaultSelected={getVal(input.value, mergedList)}>
            {_.map(mergedList, (item, index) => {
                return (
                    <RadioButton
                        className='dottedList'
                        key={index}
                        value={_.toInteger(_.get(item, 'marketTypeId'))}/>
                )
            })}
        </RadioButtonGroup>
    )
})

export default PriceMainRadionButton
