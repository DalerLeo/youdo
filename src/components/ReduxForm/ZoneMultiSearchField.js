import _ from 'lodash'
import React from 'react'
import SearchField from './Basic/MultiSelectField'
import axios from '../../helpers/axios'
import * as PATH from '../../constants/api'
import toCamelCase from '../../helpers/toCamelCase'

const getOptions = (search) => {
    return axios().get(`${PATH.ZONE_LIST}?search=${search || ''}`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

const getIdsOption = (ids) => {
    return axios().get(`${PATH.ZONE_LIST}?ids=${ids || ''}`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

const itemText = (obj) => {
    return _.get(obj, ['properties', 'title'])
}
const ZoneSearchField = (props) => {
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('title')}
            getOptions={getOptions}
            getIdsOption={getIdsOption}
            getItemText={itemText}
            {...props}
        />
    )
}

export default ZoneSearchField
