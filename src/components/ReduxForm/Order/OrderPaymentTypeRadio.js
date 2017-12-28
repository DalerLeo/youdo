import React from 'react'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import t from '../../../helpers/translate'

const OrderPaymentTypeRadio = (props) => {
    const {input} = props
    return (
        <div style={{width: '205px', marginBottom: '20px'}}>
            <RadioButtonGroup name="paymentType" onChange={input.onChange} defaultSelected={input.value}>
                <RadioButton
                    value={'cash'}
                    style={{margin: '10px 0'}}
                    label={t('Наличными')}
                />
                <RadioButton
                    value={'bank'}
                    style={{margin: '10px 0'}}
                    label={t('Перечислением')}
                />
            </RadioButtonGroup>
        </div>
    )
}

export default OrderPaymentTypeRadio
