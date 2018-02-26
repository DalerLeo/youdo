import _ from 'lodash'
import sprintf from 'sprintf'
import React from 'react'
import SearchField from '../Basic/SearchField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import searchFieldGetOptions from '../../../helpers/searchFieldGetOptions'

const getItem = (id) => {
    return axios().get(sprintf(PATH.USERS_ITEM, id))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}

const getText = (obj) => {
    return _.get(obj, 'firstName') + ' ' + _.get(obj, 'secondName')
}

const UsersSearchField = (props) => {
    const selectFieldScroll = _.get(props, 'selectFieldScroll')
    const {params, pageSize} = props
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={getText}
            selectFieldScroll={selectFieldScroll}
            getOptions={search => searchFieldGetOptions(PATH.USERS_LIST, search, params, pageSize)}
            getItem={getItem}
            getItemText={getText}
            {...props}
        />
    )
}

export default UsersSearchField
