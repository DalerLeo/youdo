import React from 'react'
import {compose} from 'recompose'
import _ from 'lodash'
import {connect} from 'react-redux'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'

const enhance = compose(
    connect((state) => {
        const dealType = _.get(state, ['form', 'OrderCreateForm', 'values', 'dealType'])
        return {
            dealType
        }
    }),
)
const radioButtonGroupStyle = {
    display: 'flex',
    justifyContent: 'space-between'
}
const PlanTypeRadio = enhance((props) => {
    const {input} = props
    return (
        <RadioButtonGroup
            name="planType"
            style={radioButtonGroupStyle}
            onChange={input.onChange}
            defaultSelected={input.value || 'week'}>
            <RadioButton
                value={'week'}
                style={{width: '150px'}}
                label="На неделю"
            />
            <RadioButton
                value={'month'}
                style={{width: '150px'}}
                label="На месяц"
            />
        </RadioButtonGroup>
    )
})

export default PlanTypeRadio
