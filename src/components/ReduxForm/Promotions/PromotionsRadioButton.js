import React from 'react'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'

const PromotionsRadioButton = (props) => {
    const {input, selectedType} = props
    return (
        <div>
            <RadioButtonGroup name="promotionType" onChange={input.onChange} defaultSelected={selectedType}>
                <RadioButton
                    value="discount"
                    label="Скидочная акция"
                    disabled={true}
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
