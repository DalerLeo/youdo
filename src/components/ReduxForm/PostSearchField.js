import sprintf from 'sprintf'
import React from 'react'
import SearchField from './Basic/SearchField'
import {compose} from 'recompose'
import axios from '../../helpers/axios'
import _ from 'lodash'
import * as PATH from '../../constants/api'
import toCamelCase from '../../helpers/toCamelCase'
import * as actionTypes from '../../constants/actionTypes'
import {connect} from 'react-redux'
import caughtCancel from '../../helpers/caughtCancel'

const CancelToken = axios().CancelToken
let postListToken = null

const getOptions = (search) => {
    if (postListToken) {
        postListToken.cancel()
    }
    postListToken = CancelToken.source()
    return axios().get(`${PATH.POST_LIST}?search=${search || ''}&page_size=100`, {cancelToken: postListToken.token})
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
        .catch((error) => {
            caughtCancel(error)
        })
}

const setExtraData = (data) => {
    return {
        type: actionTypes.POST_ITEM,
        payload: Promise.resolve(toCamelCase(data))
    }
}

const getItem = (id, dispatch) => {
    return axios().get(sprintf(PATH.POST_ITEM, id))
        .then(({data}) => {
            dispatch(setExtraData(data))
            return Promise.resolve(toCamelCase(data))
        })
}

const enhance = compose(
    connect((state, props) => {
        const dispatch = _.get(props, 'dispatch')
        return {
            dispatch
        }
    })
)

const PositionSearchField = enhance((props) => {
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={getOptions}
            getItem={id => getItem(id, props.dispatch) }
            getItemText={SearchField.defaultGetText('name')}
            withDetails={true}
            {...props}
        />
    )
})

export default PositionSearchField
