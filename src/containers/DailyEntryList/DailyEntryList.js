import _ from 'lodash'
import React from 'react'
import {connect} from 'react-redux'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange} from 'recompose'
import DailyEntryListTable from '../../components/DailyEntryListTable'
import {dailyEntryListFetchAction} from '../../actions/dailyEntry'
import filterHelper from '../../helpers/filter'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const list = _.get(state, ['dailyEntry', 'list', 'data'])
        const loading = _.get(state, ['dailyEntry', 'list', 'loading'])
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
        dispatch(dailyEntryListFetchAction(filter))
    })
)

const DailyEntryList = enhance((props) => {
    const {dispatch, list, loading, filter, layout} = props

    if (!list && !loading) {
        dispatch(dailyEntryListFetchAction(filter))
    }

    return (
        <Layout {...layout}>
            <DailyEntryListTable
                filter={filter}
                loading={loading}
                data={_.get(list, 'results')}
            />
        </Layout>
    )
})

export default DailyEntryList
