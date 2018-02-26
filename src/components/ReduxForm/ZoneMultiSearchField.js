import _ from 'lodash'
import React from 'react'
import SearchField from './Basic/MultiSelectField'
import axios from '../../helpers/axios'
import * as PATH from '../../constants/api'
import toCamelCase from '../../helpers/toCamelCase'
import searchFieldGetOptions from '../../helpers/searchFieldGetOptions'

const getIdsOption = (ids) => {
    return axios().get(`${PATH.ZONE_LIST}?ids=${ids || ''}`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

const itemText = (obj) => {
    return _.get(obj, ['properties', 'title'])
}
const ZoneMultiSearchField = (props) => {
    const {params, pageSize} = props
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('title')}
            getOptions={search => searchFieldGetOptions(PATH.ZONE_LIST, search, params, pageSize)}
            getIdsOption={getIdsOption}
            getItemText={itemText}
            {...props}
        />
    )
}

export default ZoneMultiSearchField
