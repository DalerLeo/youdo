import React from 'react'
import {compose} from 'recompose'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import getConfig from '../../../helpers/getConfig'
import numberFormat from '../../../helpers/numberFormat'
import t from '../../../helpers/translate'

const enhance = compose()
const RateRadioButton = enhance((props) => {
    const {input, currency, canSetCustomRate, showOrderRate, customRateField, rate} = props
    const ZERO = 0
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
                        label={t('Текущий курс')}
                    />
                    <RadioButton
                        value={'order'}
                        disabled={!showOrderRate}
                        style={{margin: '10px 0'}}
                        label={t('Курс при оформлении')}
                    />
                    <RadioButton
                        value={'custom'}
                        disabled={!canSetCustomRate}
                        style={{margin: '10px 0 0'}}
                        label={t('Индивидуальный')}
                    />
                </RadioButtonGroup>
            </div>
            <div style={{width: '120px'}}>
                {defaultValue === 'custom'
                    ? customRateField
                    : <div style={{textAlign: 'right'}}>
                        {rate > ZERO && <strong>1 {configCurrencyName} = {numberFormat(rate, currencyName)}</strong>}
                    </div>}
            </div>
        </div>
    )
})

export default RateRadioButton
