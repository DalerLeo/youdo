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
import searchFieldGetOptions from '../../helpers/searchFieldGetOptions'

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
    const {params, pageSize} = props
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={search => searchFieldGetOptions(PATH.POST_LIST, search, params, pageSize)}
            getItem={id => getItem(id, props.dispatch) }
            getItemText={SearchField.defaultGetText('name')}
            withDetails={true}
            {...props}
        />
    )
})

export default PositionSearchField
