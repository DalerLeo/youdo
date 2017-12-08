import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import SearchFieldCustom from '../Basic/SearchFieldCustom'
import axios from '../../../helpers/axios'
import * as PATH from '../../../constants/api'
import toCamelCase from '../../../helpers/toCamelCase'
import {connect} from 'react-redux'
import sprintf from 'sprintf'

const getOptions = (search) => {
    return axios().get(`${PATH.EXPENSIVE_CATEGORY_LIST}?search=${search || ''}&page_size=100`)
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data.results))
        })
}

const getItem = (id) => {
    return axios().get(sprintf(PATH.EXPENSIVE_CATEGORY_ITEM, id))
        .then(({data}) => {
            return Promise.resolve(toCamelCase(data))
        })
}

const enhance = compose(
    connect((state, props) => {
        const dispatch = _.get(props, 'dispatch')

        return {
            state,
            dispatch
        }
    })
)

const ProductCustomSearchField = enhance((props) => {
    const {dispatch, ...defaultProps} = props
    const test = (id) => {
        return getItem(id, dispatch)
    }
    return (
        <SearchFieldCustom
            getValue={(value) => {
                return _.get(value, 'id')
            }}
            getText={(value) => {
                return _.get(value, 'name')
            }}
            getOptions={getOptions}
            getItem={test}
            getItemText={(value) => {
                return _.get(value, ['name'])
            }}
            {...defaultProps}
        />
    )
})

export default ProductCustomSearchField
