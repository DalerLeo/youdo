import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import SearchField from '../Basic/SearchField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import {compose} from 'recompose'
import {connect} from 'react-redux'

const getOptions = (search, type, currency, cashboxId) => {
    if (cashboxId) {
        return currency && type && axios().get(`${PATH.CASHBOX_LIST}?type=${type}&page_size=1000&search=${search || ''}&exclude_id=${cashboxId}&currency=${currency}`)
            .then(({data}) => {
                return Promise.resolve(toCamelCase(data.results))
            })
    }
    return currency && type && axios().get(`${PATH.CASHBOX_LIST}?type=${type}&page_size=1000&search=${search || ''}&currency=${currency}`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

const getItem = (id) => {
    return axios().get(sprintf(PATH.CASHBOX_ITEM, id))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}
const enhance = compose(
    connect((state, props) => {
        const dispatch = _.get(props, 'dispatch')
        return {
            state,
            dispatch
        }
    })
)

const CashboxTypeSearchField = enhance((props) => {
    const {dispatch, cashbox, ...defaultProps} = props
    const test = (id) => {
        return getItem(id, dispatch)
    }
    const type = _.get(cashbox, 'type')
    const cashboxId = _.get(cashbox, 'id')
    const currency = _.get(cashbox, ['currency', 'id'])
    if (_.get(cashbox, 'type') && _.get(cashbox, 'currency')) {
        return (
            <SearchField
                getValue={SearchField.defaultGetValue('id')}
                getText={SearchField.defaultGetText('name')}
                getOptions={(search) => {
                    return type && currency && getOptions(search, type, currency, cashboxId)
                }}
                getItem={test}
                getItemText={(value) => {
                    return _.get(value, ['name'])
                }}
                type={type}
                currency={currency}
                {...defaultProps}
            />
        )
    }
    return null
})

export default CashboxTypeSearchField
