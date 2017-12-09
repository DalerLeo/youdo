import _ from 'lodash'
import React from 'react'
import SearchField from '../Basic/MultiSelectField'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'

const getOptions = (search) => {
    return axios().get(`${PATH.USERS_LIST}?search=${search || ''}&page_size=100`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

const getIdsOption = (ids) => {
    return axios().get(`${PATH.USERS_LIST}?ids=${ids || ''}`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

const getText = (obj) => {
    return _.get(obj, 'firstName') + ' ' + _.get(obj, 'secondName')
}

const UsersSearchField = (props) => {
    const selectFieldScroll = _.get(props, 'selectFieldScroll')
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={getText}
            selectFieldScroll={selectFieldScroll}
            getOptions={getOptions}
            getIdsOption={getIdsOption}
            getItemText={getText}
            {...props}
        />
    )
}

export default UsersSearchField
