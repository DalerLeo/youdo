import _ from 'lodash'
import React from 'react'
import SearchField from '../Basic/MultiSelectField'
import * as PATH from '../../../constants/api'
import searchFieldGetOptions from '../../../helpers/searchFieldGetOptions'
import getIdsOption from '../../../helpers/getIdsOption'

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
            getIdsOption={(ids) => getIdsOption(ids, PATH.USERS_LIST)}
            getItemText={getText}
            {...props}
        />
    )
}

export default UsersSearchField
