import React from 'react'
import MUICheckbox from 'material-ui/Checkbox'
import {compose} from 'recompose'
import injectSheet from 'react-jss'

const checkboxStyle = {
    textAlign: 'left',
    marginBottom: '10px',
    marginTop: '10px'
}

const enhance = compose(
    injectSheet({
        checkBox: {
            '& svg:first-child': {
                fill: '#cecece !important',
                color: '#cecece !important'
            },
            '& svg:last-child': {
                fill: '#12aaeb !important',
                color: '#12aaeb !important'
            },
            '& span': {
                top: '-10px !important',
                left: '-10px !important'
            }
        }
    })
)

const Checkbox = ({classes, input, meta, label, ...defaultProps}) => (
    <MUICheckbox
        label={label}
        className={classes.checkBox}
        style={checkboxStyle}
        iconStyle={{width: '20px', height: '20px'}}
        labelStyle={{lineHeight: '20px', left: '-5px'}}
        checked={Boolean(input.value)}
        onCheck={input.onChange}
        {...defaultProps}
    />
)

export default enhance(Checkbox)
