import sprintf from 'sprintf'
import React from 'react'
import ParentSearchField from '../Basic/ParentSearchField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import _ from 'lodash'
import caughtCancel from '../../../helpers/caughtCancel'

const CancelToken = axios().CancelToken
let remainderProductListToken = null

const getOptions = (search) => {
    if (remainderProductListToken) {
        remainderProductListToken.cancel()
    }
    remainderProductListToken = CancelToken.source()
    return axios().get(`${PATH.PRODUCT_TYPE_LIST}?page_size=100000&search=${search || ''}`, {cancelToken: remainderProductListToken.token})
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
        .then((data) => {
            return {options: _.map(data, (item) => {
                return {
                    label: _.get(item, 'name'),
                    value: _.get(item, 'id')
                }
            })}
        })
        .catch((error) => {
            caughtCancel(error)
        })
}

const getItem = (id) => {
    return axios().get(sprintf(PATH.PRODUCT_TYPE_ITEM, id))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}
const RemainderProductTypeSearchField = (props) => {
    return (
        <ParentSearchField
            getValue={ParentSearchField.defaultGetValue('id')}
            getText={ParentSearchField.defaultGetText('name')}
            getOptions={getOptions}
            getItem={getItem}
            getItemText={ParentSearchField.defaultGetText('name')}
            {...props}
        />
    )
}

export default RemainderProductTypeSearchField
