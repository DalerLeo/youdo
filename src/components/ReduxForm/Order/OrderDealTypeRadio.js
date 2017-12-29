import React from 'react'
import {compose} from 'recompose'
import _ from 'lodash'
import {connect} from 'react-redux'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import getConfig from '../../../helpers/getConfig'
import toBoolean from '../../../helpers/toBoolean'
import t from '../../../helpers/translate'

const enhance = compose(
    connect((state) => {
        const dealType = _.get(state, ['form', 'OrderCreateForm', 'values', 'dealType'])
        return {
            dealType
        }
    }),
)
const OrderDealTypeRadio = enhance((props) => {
    const {input} = props
    const individual = toBoolean(getConfig('INDIVIDUAL_DEAL_TYPE'))

    if (individual) {
        return (
            <div style={{width: '205px', marginBottom: '20px'}}>
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
                </RadioButtonGroup>
            </div>
        )
    }
    return (
        <div style={{width: '205px', marginBottom: '20px'}}>
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
            </RadioButtonGroup>
        </div>
    )
})

export default OrderDealTypeRadio
