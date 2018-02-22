import React from 'react'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import t from '../../../helpers/translate'
import {compose} from 'recompose'
import injectSheet from 'react-jss'

const enhance = compose(
    injectSheet({
        wrapper: {
            width: '100%'
        },
        error: {
            color: '#f44336',
            fontSize: '12px'
        }
    })
)
const OrderPaymentTypeRadio = enhance((props) => {
    const {classes, input, isUpdate, meta: {error}} = props
    return (
        <div className={classes.wrapper}>
            {(input.value || !isUpdate) &&
            <RadioButtonGroup
                name="paymentType"
                onChange={input.onChange}
                defaultSelected={input.value}
                valueSelected={input.value}>
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
            </RadioButtonGroup>}
            {error && <div className={classes.error}>{error}</div>}
        </div>
    )
})

export default OrderPaymentTypeRadio
