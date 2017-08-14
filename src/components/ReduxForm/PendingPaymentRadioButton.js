import React from 'react'
import {compose} from 'recompose'
import _ from 'lodash'
import {connect} from 'react-redux'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import getConfig from '../../helpers/getConfig'
import {pendingPaymentsConvertAction} from '../../actions/pendingPayments'

const enhance = compose(
    connect((state) => {
        const currency = _.get(state, ['form', 'PendingPaymentsCreateForm', 'values', 'cashbox', 'value', 'currency'])
        return {
            currency
        }
    }),
)
const PendingPaymentRadioButton = enhance((props) => {
    const {input, currency, dispatch, createdDate} = props
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const primaryCurrencyId = getConfig('PRIMARY_CURRENCY_ID')
    const currencyName = _.get(currency, 'name')
    const currencyId = _.get(currency, 'id')

    const data = {
        fromCurrency: currencyId,
        toCurrency: primaryCurrencyId,
        createdDate
    }

    if (currencyName === primaryCurrency || !currencyName) {
        return false
    } else if (primaryCurrency !== currencyName && currencyName) {
        dispatch(pendingPaymentsConvertAction(data))
    }
    return (
        <div style={{width: '205px'}}>
        <RadioButtonGroup name="currencyRate" onChange={input.onChange} defaultSelected={0}>
            <RadioButton
                value={0}
                style={{margin: '10px 0'}}
                label="Текущий курс"
            />
            <RadioButton
                value={1}
                style={{margin: '10px 0'}}
                label="Курс при оформлении"
            />
            <RadioButton
                value={2}
                style={{margin: '10px 0 0'}}
                label="Индивидуальный"
            />
        </RadioButtonGroup>
        </div>
    )
})

export default PendingPaymentRadioButton
