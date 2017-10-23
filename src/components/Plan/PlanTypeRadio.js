import _ from 'lodash'
import React from 'react'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import {compose, withPropsOnChange, lifecycle} from 'recompose'

const enhance = compose(
    withPropsOnChange((props, nextProps) => {
        const value = _.get(props, ['input', 'value'])
        const nextValue = _.get(nextProps, ['input', 'value'])
        return value !== nextValue && nextValue
    }, () => {
        return false
    }),
    lifecycle({
        componentWillReceiveProps (nextProps) {
            return nextProps
        }
    })
)

const radioButtonGroupStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px'
}

const PlanTypeRadio = enhance((props) => {
    const {input, isUpdate} = props
    if (!input.value && isUpdate) {
        return null
    }
    return (
        <RadioButtonGroup
            name="planType"
            style={radioButtonGroupStyle}
            onChange={input.onChange}
            defaultSelected={input.value}>
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
