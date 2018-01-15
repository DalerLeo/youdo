import sprintf from 'sprintf'
import React from 'react'
import _ from 'lodash'
import SearchField from '../Basic/SearchField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import caughtCancel from '../../../helpers/caughtCancel'

const CancelToken = axios().CancelToken
let measurementListToken = null

const getOptions = (search, parent) => {
    if (measurementListToken) {
        measurementListToken.cancel()
    }
    measurementListToken = CancelToken.source()
    return axios().get(`${PATH.MEASUREMENT_LIST}?parent=${parent}&search=${search || ''}&page_size=100`, {cancelToken: measurementListToken.token})
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
        .catch((error) => {
            caughtCancel(error)
        })
}

const custom = (parentType) => {
    return (search) => {
        return getOptions(search, parentType)
    }
}

const getItem = (id) => {
    return axios().get(sprintf(PATH.MEASUREMENT_ITEM, id))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}

const MeasurementChildSearchField = (props) => {
    const parentType = _.get(props, 'parent')
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={custom(parentType)}
            getItem={getItem}
            getItemText={SearchField.defaultGetText('name')}
            {...props}
        />
    )
}

export default MeasurementChildSearchField