import sprintf from 'sprintf'
import React from 'react'
import SearchField from './Basic/MultiSelectField'
import axios from '../../helpers/axios'
import * as PATH from '../../constants/api'
import toCamelCase from '../../helpers/toCamelCase'
import searchFieldGetOptions from '../../helpers/searchFieldGetOptions'

const getItem = (id) => {
    return axios().get(sprintf(PATH.DIVISION_ITEM, id))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}

const DivisionSearchField = (props) => {
    const {params, pageSize} = props
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={search => searchFieldGetOptions(PATH.DIVISION_LIST, search, params, pageSize)}
            getItem={getItem}
            getItemText={SearchField.defaultGetText('name')}
            {...props}
        />
    )
}

export default DivisionSearchField
