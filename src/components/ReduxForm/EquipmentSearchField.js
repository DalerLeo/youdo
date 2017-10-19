import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import SearchField from './Basic/SearchField'
import axios from '../../helpers/axios'
import * as PATH from '../../constants/api'
import toCamelCase from '../../helpers/toCamelCase'

const getOptions = (search, manufacture) => {
    return axios().get(`${PATH.EQUIPMENT_LIST}?search=${search || ''}&manufacture=` + manufacture)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

const custom = (manufacture) => {
    return (search) => {
        return getOptions(search, manufacture)
    }
}

const getItem = (id) => {
    return axios().get(sprintf(PATH.EQUIPMENT_ITEM, id))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}

const EquipmentSearchField = (props) => {
    const manufacture = _.get(props, 'data-manufacture')
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={custom(manufacture)}
            getItem={getItem}
            getItemText={SearchField.defaultGetText('name')}
            {...props}
        />
    )
}

export default EquipmentSearchField
