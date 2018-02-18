import React from 'react'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import t from '../../../helpers/translate'
const PromotionsRadioButton = (props) => {
    const {input} = props
    return (
        <div>
            <RadioButtonGroup name="promotionType" onChange={input.onChange} defaultSelected="bonus">
                <RadioButton
                    value="discount"
                    label={t('Скидочная акция')}
                    disabled={true}
                    disableTouchRipple={true}
                />
                <RadioButton
                    value="bonus"
                    label={t('Бонусная акция')}
                    disableTouchRipple={true}
                />
            </RadioButtonGroup>
        </div>
    )
}

export default PromotionsRadioButton
