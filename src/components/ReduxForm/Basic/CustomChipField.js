import sprintf from 'sprintf'
import React from 'react'
import ChipSearchField from '../Basic/ChipSearchField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'

const getOptions = (search) => {
    return axios().get(`${PATH.MARKET_TYPE_LIST}?search=${search || ''}`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

const getItem = (id) => {
    return axios().get(sprintf(PATH.MARKET_TYPE_ITEM, id))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}

const MarketTypeSearchField = (props) => {
    return (
        <ChipSearchField
            getValue={ChipSearchField.defaultGetValue('id')}
            getText={ChipSearchField.defaultGetText('name')}
            getOptions={getOptions}
            getItem={getItem}
            getItemText={ChipSearchField.defaultGetText('name')}
            {...props}
        />
    )
}

export default MarketTypeSearchField
