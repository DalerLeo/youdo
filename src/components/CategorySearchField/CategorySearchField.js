import sprintf from 'sprintf'
import React from 'react'
import SearchField from '../ReduxForm/SearchField'
import axios from '../../helpers/axios'
import * as PATH from '../../constants/api'

const getOptions = (search) => {
    return axios().get(`${PATH.CATEGORY_LIST}?search=${search || ''}`)
        .then(({data}) => {
            return Promise.resolve(data.results)
        })
}

const getItem = (id) => {
    return axios().get(sprintf(PATH.SHOP_ITEM, id))
        .then(({data}) => {
            return Promise.resolve(data)
        })
}

const CategorySearchField = (props) => {
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={getOptions}
            getItem={getItem}
            getItemText={SearchField.defaultGetText('category_name')}
            {...props}
        />
    )
}

export default CategorySearchField
