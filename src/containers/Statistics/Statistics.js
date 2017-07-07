import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'

import {StatisticsGridList} from '../../components/Statistics'
import {
    statisticsListFetchAction,
    statisticsItemFetchAction
} from '../../actions/statistics'

const ZERO = 0

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['statistics', 'item', 'data'])
        const detailLoading = _.get(state, ['statistics', 'item', 'loading'])
        const list = _.get(state, ['statistics', 'list', 'data'])
        const listLoading = _.get(state, ['statistics', 'list', 'loading'])
        const filter = filterHelper(list, pathname, query)
        return {
            list,
            listLoading,
            detail,
            detailLoading,
            filter
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(statisticsListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const statisticsId = _.get(nextProps, ['params', 'statisticsId']) || ZERO
        return statisticsId > ZERO && _.get(props, ['params', 'statisticsId']) !== statisticsId
    }, ({dispatch, params}) => {
        const statisticsId = _.toInteger(_.get(params, 'statisticsId'))
        if (statisticsId > ZERO) {
            dispatch(statisticsItemFetchAction(statisticsId))
        }
    }),

    withHandlers({

        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.STATISTICS_LIST_URL, query: filter.getParam()})
        }
    })
)

const StatisticsList = enhance((props) => {
    const {
        list,
        listLoading,
        detail,
        detailLoading,
        filter,
        layout,
        params
    } = props
    const detailId = _.toInteger(_.get(params, 'statisticsId'))

    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }

    const detailData = {
        id: detailId,
        data: detail,
        detailLoading,
        handleCloseDetail: props.handleCloseDetail
    }
    return (
        <Layout {...layout}>
            <StatisticsGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
            />
        </Layout>
    )
})

export default StatisticsList
