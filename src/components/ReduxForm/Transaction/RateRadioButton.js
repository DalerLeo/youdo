import React from 'react'
import {compose} from 'recompose'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import getConfig from '../../../helpers/getConfig'

const enhance = compose()
const RateRadioButton = enhance((props) => {
    const {input, currency, canSetCustomRate, showOrderRate, customRateField} = props
    const currencyName = currency
    const configCurrencyName = getConfig('PRIMARY_CURRENCY')

    if (currencyName === configCurrencyName || !currencyName) {
        return null
    }
    const defaultValue = input.value || 'current'
    return (
        <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between'}}>
            <div style={{width: '210px'}}>
                <RadioButtonGroup
                    name="currencyRate"
                    onChange={input.onChange}
                    valueSelected={defaultValue}
                    defaultSelected={defaultValue}>
                    <RadioButton
                        value={'current'}
                        style={{margin: '10px 0'}}
                        label="Текущий курс"
                    />
                    <RadioButton
                        value={'order'}
                        disabled={!showOrderRate}
                        style={{margin: '10px 0'}}
                        label="Курс при оформлении"
                    />
                    <RadioButton
                        value={'custom'}
                        disabled={!canSetCustomRate}
                        style={{margin: '10px 0 0'}}
                        label="Индивидуальный"
                    />
                </RadioButtonGroup>
            </div>
            <div style={{width: '120px'}}>
                {customRateField}
            </div>
        </div>
    )
})

export default RateRadioButton
