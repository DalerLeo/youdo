import React from 'react'
import {compose} from 'recompose'
import _ from 'lodash'
import {connect} from 'react-redux'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import getConfig from '../../../helpers/getConfig'
import toBoolean from '../../../helpers/toBoolean'
import t from '../../../helpers/translate'
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
    }),
    connect((state) => {
        const dealType = _.get(state, ['form', 'OrderCreateForm', 'values', 'dealType'])
        return {
            dealType
        }
    }),
)
const OrderDealTypeRadio = enhance((props) => {
    const {classes, input, isUpdate, meta: {error}} = props
    const individual = toBoolean(getConfig('INDIVIDUAL_DEAL_TYPE'))

    if (individual) {
        return (
            <div className={classes.wrapper}>
                {(input.value || !isUpdate) &&
                <RadioButtonGroup name="dealType" onChange={input.onChange} defaultSelected={input.value}>
                    <RadioButton
                        value={'standart'}
                        style={{margin: '10px 0'}}
                        label={t('Стандартная')}
                    />
                    <RadioButton
                        value={'consignment'}
                        style={{margin: '10px 0'}}
                        label={t('Консигнация')}
                    />
                    <RadioButton
                        value={'individualDealType'}
                        style={{margin: '10px 0'}}
                        label={t('Индивидуальный')}
                    />
                </RadioButtonGroup>}
                {error && <div className={classes.error}>{error}</div>}
            </div>
        )
    }
    return (
        <div className={classes.wrapper}>
            {(input.value || !isUpdate) &&
            <RadioButtonGroup name="dealType" onChange={input.onChange} defaultSelected={input.value}>
                <RadioButton
                    value={'standart'}
                    style={{margin: '10px 0'}}
                    label={t('Стандартная')}
                />
                <RadioButton
                    value={'consignment'}
                    style={{margin: '10px 0'}}
                    label={t('Консигнация')}
                />
            </RadioButtonGroup>}
            {error && <div className={classes.error}>{error}</div>}
        </div>
    )
})

export default OrderDealTypeRadio
