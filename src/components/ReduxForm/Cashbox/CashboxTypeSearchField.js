import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import SearchField from '../Basic/SearchField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import {compose} from 'recompose'
import {connect} from 'react-redux'

const getOptions = (search, type, currency) => {
    return axios().get(`${PATH.CASHBOX_LIST}?currency=${currency || ''}&type=${type || ''}&page_size=1000&search=${search || ''}`)
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
    const currency = _.get(cashbox, ['currency', 'id'])
    if (cashbox) {
        return (
            <SearchField
                getValue={SearchField.defaultGetValue('id')}
                getText={SearchField.defaultGetText('name')}
                getOptions={(search) => { return getOptions(search, type, currency) }}
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
