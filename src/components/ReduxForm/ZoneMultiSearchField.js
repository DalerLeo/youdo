import _ from 'lodash'
import React from 'react'
import SearchField from './Basic/MultiSelectField'
import axios from '../../helpers/axios'
import * as PATH from '../../constants/api'
import toCamelCase from '../../helpers/toCamelCase'
import caughtCancel from '../../helpers/caughtCancel'

const CancelToken = axios().CancelToken
let zoneListToken = null

const getOptions = (search) => {
    if (zoneListToken) {
        zoneListToken.cancel()
    }
    zoneListToken = CancelToken.source()
    return axios().get(`${PATH.ZONE_LIST}?search=${search || ''}`, {cancelToken: zoneListToken.token})
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
        .catch((error) => {
            caughtCancel(error)
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
