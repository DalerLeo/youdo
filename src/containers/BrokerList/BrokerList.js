import _ from 'lodash'
import React from 'react'
import {connect} from 'react-redux'
import {compose, withPropsOnChange} from 'recompose'
import Layout from '../../components/Layout'
import BrokerListTable from '../../components/BrokerListTable'
import {brokerListFetchAction} from '../../actions/broker'
import filterHelper from '../../helpers/filter'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const list = _.get(state, ['broker', 'list', 'data'])
        const loading = _.get(state, ['broker', 'list', 'loading'])
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
        dispatch(brokerListFetchAction(filter))
    })
)

const BrokerList = enhance((props) => {
    const {list, loading, filter, layout} = props
    return (
        <Layout {...layout}>
            <BrokerListTable
                filter={filter}
                loading={loading}
                data={_.get(list, 'results')}
            />
        </Layout>
    )
})

export default BrokerList
