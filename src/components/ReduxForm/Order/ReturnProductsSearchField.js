import _ from 'lodash'
import React from 'react'
import {connect} from 'react-redux'
import SearchField from '../Basic/SearchField'
import {compose} from 'recompose'
import PropTypes from 'prop-types'

const Items = [
    {id: 0, name: 'Продукт 1'},
    {id: 1, name: 'Продукт 2'},
    {id: 2, name: 'Продукт 3'},
    {id: 3, name: 'Продукт 4'}
]

const enhance = compose(
    connect((state) => {
        const measurement = _.get(state, ['product', 'measurement', 'data'])
        const measurementLoading = _.get(state, ['product', 'measurement', 'loading'])
        return {
            measurement,
            measurementLoading
        }
    })
)

const getOptions = (search) => {
    return Promise.resolve(Items)
}

const getItem = (id) => {
    return Promise.resolve(
        _.find(Items, (o) => { return o.id === _.toInteger(id) }))
}

const ReturnProductsSearchField = enhance((props) => {
    return (
        <SearchField
            getValue={SearchField.defaultGetValue('id')}
            getText={SearchField.defaultGetText('name')}
            getOptions={getOptions}
            getItem={getItem}
            getItemText={SearchField.defaultGetText('name')}
            {...props}
        />
    )
})
ReturnProductsSearchField.propTyeps = {
    orderData: PropTypes.object.isRequired
}
export default ReturnProductsSearchField
