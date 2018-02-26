import _ from 'lodash'
import React from 'react'
import SearchFieldCustom from '../Basic/SearchFieldCustom'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import searchFieldGetOptions from '../../../helpers/searchFieldGetOptions'

const getItem = (value) => {
    const id = _.isObject(value) ? _.get(value, 'id') : value
    return axios().get(PATH.MEASUREMENT_H_LIST, {params: {ids: id}})
        .then(({data}) => {
            return Promise.resolve(toCamelCase(_.first(data)))
        })
}

const MeasurementAllValuesSearchField = (props) => {
    const {params, pageSize} = props
    return (
        <SearchFieldCustom
            getValue={(value) => _.get(value, 'id')}
            getText={(value) => _.get(value, 'name')}
            getOptions={search => searchFieldGetOptions(PATH.MEASUREMENT_LIST, search, params, pageSize)}
            getItem={(value) => getItem(value)}
            getItemText={(value) => _.get(value, 'name')}
            autoFetch={true}
            {...props}
        />
    )
}

export default MeasurementAllValuesSearchField
