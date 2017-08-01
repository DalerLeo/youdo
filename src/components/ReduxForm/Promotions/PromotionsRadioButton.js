import React from 'react'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'

const PromotionsRadioButton = (props) => {
    const {input} = props
    return (
        <div>
            <RadioButtonGroup name="promotionType" onChange={input.onChange} defaultSelected="bonus">
                <RadioButton
                    value="discount"
                    label="Скидочная акция"
                    disableTouchRipple={true}
                />
                <RadioButton
                    value="bonus"
                    label="Бонусная акция"
                    disableTouchRipple={true}
                />
            </RadioButtonGroup>
        </div>
    )
}

export default PromotionsRadioButton
