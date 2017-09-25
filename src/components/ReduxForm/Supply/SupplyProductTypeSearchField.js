import sprintf from 'sprintf'
import _ from 'lodash'
import React from 'react'
import SearchFieldCustom from './SupplySelectSearchField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'

const getOptions = (search) => {
    return axios().get(`${PATH.PRODUCT_TYPE_LIST}?page_size=100000&search=${search || ''}`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        }).then((data) => {
            return {options: _.map(data, (item) => {
                return {
                    label: item.name,
                    value: item.id
                }
            })}
        })
}

const getItem = (id) => {
    return axios().get(sprintf(PATH.PRODUCT_TYPE_ITEM, id))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}
const ProductTypeSearchField = (props) => {
    return (
        <SearchFieldCustom
            getValue={SearchFieldCustom.defaultGetValue('id')}
            getText={SearchFieldCustom.defaultGetText('name')}
            getOptions={getOptions}
            getItem={getItem}
            getItemText={SearchFieldCustom.defaultGetText('name')}
            {...props}
        />
    )
}

export default ProductTypeSearchField
