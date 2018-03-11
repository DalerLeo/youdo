import _ from 'lodash'
import React from 'react'
import SearchField from './Basic/MultiSelectField'
import * as PATH from '../../constants/api'
import searchFieldGetOptions from '../../helpers/searchFieldGetOptions'
import getIdsOption from '../../helpers/getIdsOption'

const itemText = (obj) => {
    return _.get(obj, ['properties', 'title'])
}
const ZoneMultiSearchField = (props) => {
    const {params, pageSize} = props
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('title')}
            getOptions={search => searchFieldGetOptions(PATH.ZONE_LIST, search, params, pageSize)}
            getIdsOption={(ids) => getIdsOption(ids, PATH.ZONE_LIST)}
            getItemText={itemText}
            {...props}
        />
    )
}

export default ZoneMultiSearchField
