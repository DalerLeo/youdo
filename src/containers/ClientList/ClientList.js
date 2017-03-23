import _ from 'lodash'
import React from 'react'
import {connect} from 'react-redux'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange} from 'recompose'
import ClientListTable from '../../components/ClientListTable'
import {clientListFetchAction} from '../../actions/clientCreate'
import filterHelper from '../../helpers/filter'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const list = _.get(state, ['client', 'list', 'data'])
        const loading = _.get(state, ['client', 'list', 'loading'])
        const filter = filterHelper(list, pathname, query)

        return {
            list,
            loading,
            filter
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.createURL() !== nextProps.filter.createURL()
    }, ({dispatch, filter}) => {
        dispatch(clientListFetchAction(filter))
    })
)

const ClientTable = enhance((props) => {
    const {list, loading, filter, layout} = props

    return (
        <Layout {...layout}>
            <ClientListTable
                filter={filter}
                loading={loading}
                data={_.get(list, 'results')}
            />
        </Layout>
    )
})

export default ClientTable

