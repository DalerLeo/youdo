import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import SearchField from '../Basic/ChildSearchField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import searchFieldGetOptions from '../../../helpers/searchFieldGetOptions'

const getItem = (id) => {
    return axios().get(sprintf(PATH.SHOP_ITEM, id))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}

const MarketSearchField = (props) => {
    const {params, pageSize} = props
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={search => searchFieldGetOptions(PATH.SHOP_LIST, search, params, pageSize)}
            getItem={getItem}
            getItemText={SearchField.defaultGetText('name')}
            {...props}
            parent={params.client}
        />
    )
}

export default MarketSearchField
