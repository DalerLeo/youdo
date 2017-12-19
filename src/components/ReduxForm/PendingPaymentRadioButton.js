import React from 'react'
import {compose} from 'recompose'
import _ from 'lodash'
import moment from 'moment'
import {connect} from 'react-redux'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import {pendingPaymentsConvertAction} from '../../actions/pendingPayments'
import getConfig from '../../helpers/getConfig'

const enhance = compose(
    connect((state) => {
        const currency = _.get(state, ['form', 'PendingPaymentsCreateForm', 'values', 'cashbox', 'value', 'currency'])
        return {
            currency
        }
    }),
)
const PendingPaymentRadioButton = enhance((props) => {
    const {input, currency, dispatch, createdDate, primaryCurrency, primaryCurrencyId, canSetCustomRate} = props
    const currencyName = _.get(currency, 'name')
    const currencyId = _.toInteger(_.get(currency, 'id'))
    const configCurrencyId = _.toInteger(getConfig('PRIMARY_CURRENCY_ID'))
    const data = {
        fromCurrency: configCurrencyId,
        toCurrency: primaryCurrencyId === configCurrencyId ? currencyId : primaryCurrencyId,
        createdDate: createdDate ? moment(createdDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
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
                disabled={!canSetCustomRate}
                style={{margin: '10px 0 0'}}
                label="Индивидуальный"
            />
        </RadioButtonGroup>
        </div>
    )
})

export default PendingPaymentRadioButton
