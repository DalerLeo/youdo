import React from 'react'
import MUICheckbox from 'material-ui/Checkbox'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import toBoolean from '../../../helpers/toBoolean'

const enhance = compose(
    injectSheet({
        checkBox: {
            textAlign: 'left',
            marginBottom: '10px',
            marginTop: '10px',
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

const Checkbox = ({classes, input, label, ...defaultProps}) => {
    return (
        <MUICheckbox
            label={label}
            className={classes.checkBox}
            iconStyle={{width: '20px', height: '20px'}}
            labelStyle={{lineHeight: '20px', left: '-10px'}}
            checked={toBoolean(input.value)}
            onCheck={input.onChange}
            {...defaultProps}
        />)
}

export default enhance(Checkbox)
