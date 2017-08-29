import React from 'react'
import _ from 'lodash'
import {compose, withState} from 'recompose'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'

const enhance = compose(
    withState('course', 'setCourse', false)
)

const TargetRadio = enhance((props) => {
    const {input, data} = props
    return (
        <RadioButtonGroup name="target" onChange={input.onChange}>
            {_.map(data, (item) => {
                const id = _.get(item, ['market', 'value']) || _.get(item, ['client', 'value'])
                return (
                    <RadioButton
                        key={id}
                        value={id}/>
                )
            })}
        </RadioButtonGroup>
    )
})

export default TargetRadio
