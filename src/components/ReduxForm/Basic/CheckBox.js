import React from 'react'
import MUICheckbox from 'material-ui/Checkbox'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import toBoolean from '../../../helpers/toBoolean'

const checkboxStyle = {
    textAlign: 'left',
    marginBottom: '10px',
    marginTop: '10px'
}

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

const Checkbox = enhance((props) => {
    const {classes, input, label, defaultChecked} = props
    return (
        <MUICheckbox
            label={label}
            className={classes.checkBox}
            style={checkboxStyle}
            iconStyle={{width: '20px', height: '20px'}}
            labelStyle={{lineHeight: '20px', left: '-10px'}}
            checked={toBoolean(input.value)}
            onCheck={input.onChange}
            defaultChecked={defaultChecked}
        />)
})

export default Checkbox
