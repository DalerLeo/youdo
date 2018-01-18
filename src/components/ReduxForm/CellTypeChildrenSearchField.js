import sprintf from 'sprintf'
import React from 'react'
import SearchField from './Basic/ChildSearchField'
import axios from '../../helpers/axios'
import * as PATH from '../../constants/api'
import toCamelCase from '../../helpers/toCamelCase'
import caughtCancel from '../../helpers/caughtCancel'

const CancelToken = axios().CancelToken
let cellTypeChildrenListToken = null

const getOptions = (search, parent) => {
    if (cellTypeChildrenListToken) {
        cellTypeChildrenListToken.cancel()
    }
    cellTypeChildrenListToken = CancelToken.source()
    return axios().get(`${PATH.CELL_TYPE_LIST}?search=${search || ''}&page_size=100&parent=${parent || ''}`, {cancelToken: cellTypeChildrenListToken.token})
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
        .catch((error) => {
            caughtCancel(error)
        })
}

const getItem = (id) => {
    return axios().get(sprintf(PATH.CELL_TYPE_ITEM, id))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}
const CellTypeChildrenSearchField = (props) => {
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={(search) => getOptions(search, props.parent)}
            getItem={getItem}
            getItemText={SearchField.defaultGetText('name')}
            {...props}
        />
    )
}

export default CellTypeChildrenSearchField
