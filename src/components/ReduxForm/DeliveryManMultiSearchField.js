import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import SearchField from './Basic/MultiSelectField'
import axios from '../../helpers/axios'
import * as PATH from '../../constants/api'
import toCamelCase from '../../helpers/toCamelCase'

const getOptions = (search) => {
    return axios().get(`${PATH.USERS_LIST}?search=${search || ''}&page_size=100&group=delivery`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

const getItem = (id) => {
    return axios().get(sprintf(PATH.USERS_ITEM, id))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}

const getText = (obj) => {
    return _.get(obj, 'firstName') + ' ' + _.get(obj, 'secondName')
}
const DeliveryManSearchField = (props) => {
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={getText}
            getOptions={getOptions}
            getItem={getItem}
            getItemText={SearchField.defaultGetText('secontName')}
            multi={true}
            {...props}
        />
    )
}

export default DeliveryManSearchField
