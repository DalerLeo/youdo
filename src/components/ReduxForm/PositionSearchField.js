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

const getOptions = (search) => {
    return axios().get(`${PATH.POSITION_LIST}?search=${search || ''}&page_size=100`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

const setExtraData = (data) => {
    return {
        type: actionTypes.POSITION_ITEM,
        payload: Promise.resolve(toCamelCase(data))
    }
}

const getItem = (id, dispatch) => {
    return axios().get(sprintf(PATH.POSITION_ITEM, id))
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
