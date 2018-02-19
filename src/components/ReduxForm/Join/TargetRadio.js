import React from 'react'
import _ from 'lodash'
import {compose, withState} from 'recompose'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'

const enhance = compose(
    withState('course', 'setCourse', false)
)

const TargetRadio = enhance((props) => {
    const {input, data, target} = props
    return (
        <RadioButtonGroup
            name="target"
            onChange={input.onChange}
            valueSelected={Number(target)}
            defaultSelected={Number(target)}>
            {_.map(data, (item) => {
                const id = _.get(item, ['market', 'value']) || _.get(item, ['client', 'value'])
                return (
                    <RadioButton
                        key={id}
                        value={id}
                        iconStyle={{width: 22, height: 22}}
                        disableTouchRipple={true}/>
                )
            })}
        </RadioButtonGroup>
    )
})

export default TargetRadio
