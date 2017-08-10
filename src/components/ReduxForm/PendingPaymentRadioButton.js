import React from 'react'
import {compose, withState} from 'recompose'
import _ from 'lodash'
import {connect} from 'react-redux'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import getConfig from '../../helpers/getConfig'

const enhance = compose(
    connect((state) => {
        const currency = _.get(state, ['form', 'PendingPaymentsCreateForm', 'values', 'cashbox', 'value', 'currency', 'name'])
        return {
            currency
        }
    }),
    withState('course', 'setCourse', false)
)
const PendingPaymentRadioButton = enhance((props) => {
    const {input, currency} = props
    if (currency === getConfig('PRIMARY_CURRENCY') || !currency) {
        return null
    }
    return (
        <div style={{width: '205px'}}>
        <RadioButtonGroup name="currencyRate" onChange={input.onChange} defaultSelected={0}>
            <RadioButton
                value={0}
                label="Текущий курс"
            />
            <RadioButton
                value={1}
                label="Курс при оформлении"
            />
            <RadioButton
                value={2}
                label="индивидуальный"
            />
        </RadioButtonGroup>
        </div>
    )
})

export default PendingPaymentRadioButton
