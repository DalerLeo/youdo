import sprintf from 'sprintf'
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

const getItem = (id) => {
    return axios().get(sprintf(PATH.ZONE_ITEM, id))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
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
            getItem={getItem}
            getItemText={itemText}
            {...props}
        />
    )
}

export default ZoneSearchField
