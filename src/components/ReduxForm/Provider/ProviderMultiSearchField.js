import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import MultiSelectField from '../Basic/MultiSelectField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import * as actionTypes from '../../../constants/actionTypes'
import {connect} from 'react-redux'

const getOptions = (search) => {
    return axios().get(`${PATH.PROVIDER_LIST}?search=${search || ''}&page_size=100`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

export const setItemAction = (data, loading) => {
    return {
        type: actionTypes.PROVIDER_CONTACTS,
        data: data,
        loading: loading
    }
}

const getItem = (id, dispatch) => {
    dispatch(setItemAction(null, true))

    return axios().get(sprintf(PATH.PROVIDER_ITEM, id))
        .then(({data}) => {
            dispatch(setItemAction(_.get(data, 'contacts'), false))
            return Promise.resolve(toCamelCase(data))
        })
}

const ProviderMultiSearchField = connect()((props) => {
    const {dispatch} = props
    const test = (id) => {
        return getItem(id, dispatch)
    }

    return (
        <MultiSelectField
            getValue={MultiSelectField.defaultGetValue('id')}
            getText={MultiSelectField.defaultGetText('name')}
            getOptions={getOptions}
            getItem={test}
            getItemText={MultiSelectField.defaultGetText('name')}
            withDetails={true}
            {...props}
        />
    )
})

export default ProviderMultiSearchField
