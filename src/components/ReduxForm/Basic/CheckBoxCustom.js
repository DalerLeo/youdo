import React from 'react'
import MUICheckbox from 'material-ui/Checkbox'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import toBoolean from '../../../helpers/toBoolean'

const enhance = compose(
    injectSheet({
        checkBox: {
            '& svg:first-child': {
                fill: '#666666 !important',
                color: '#666666 !important'
            },
            '& svg:last-child': {
                fill: '#666666 !important',
                color: '#666666 !important'
            },
            '& span': {
                top: '-10px !important',
                left: '-10px !important'
            }
        }
    })
)

const CheckboxCustom = enhance((props) => {
    const {classes, input, label, defaultChecked, disabled, marginTopOff, data} = props
    const checkboxStyle = {
        textAlign: 'left',
        marginBottom: '10px',
        marginTop: marginTopOff ? '0' : '10px'
    }
    return (
        <MUICheckbox
            label={label}
            className={classes.checkBox}
            style={checkboxStyle}
            iconStyle={{width: '20px', height: '20px'}}
            labelStyle={{lineHeight: '20px', left: '-10px'}}
            checked={toBoolean(input.value.state)}
            disabled={disabled}
            onCheck={(value, isInputChecked) => {
                input.onChange({state: isInputChecked, 'value': data})
            }}
            defaultChecked={defaultChecked}
        />)
})

export default CheckboxCustom
