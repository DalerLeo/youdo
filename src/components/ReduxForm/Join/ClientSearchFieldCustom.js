import sprintf from 'sprintf'
import React from 'react'
import SearchField from '../Basic/SearchField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import {connect} from 'react-redux'
import searchFieldGetOptions from '../../../helpers/searchFieldGetOptions'

const getItem = (id) => {
    return axios().get(sprintf(PATH.CLIENT_ITEM, id))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}

const ClientSearchFieldCustom = connect()((props) => {
    const {params, pageSize} = props
    const test = (id) => {
        return getItem(id)
    }
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={search => searchFieldGetOptions(PATH.CLIENT_LIST, search, params, pageSize)}
            getItem={test}
            getItemText={SearchField.defaultGetText('name')}
            {...props}
        />
    )
})

export default ClientSearchFieldCustom
