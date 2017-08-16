import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import {connect} from 'react-redux'
import sprintf from 'sprintf'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import * as ROUTER from '../../constants/routes'
import {compose, withHandlers, withPropsOnChange} from 'recompose'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'

import {StatSalesGridList, STAT_SALES_DIALOG_OPEN} from '../../components/Statistics'
import {STAT_SALES_FILTER_KEY} from '../../components/Statistics/StatSalesGridList'
import {
    orderListFetchAction,
    orderItemFetchAction
} from '../../actions/order'

import {
    statSalesDataFetchAction
}
from '../../actions/statSales'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['order', 'item', 'data'])
        const graphList = _.get(state, ['statSales', 'data', 'data'])
        const graphLoading = _.get(state, ['statSales', 'data', 'loading'])
        const detailLoading = _.get(state, ['order', 'item', 'loading'])
        const list = _.get(state, ['order', 'list', 'data'])
        const listLoading = _.get(state, ['order', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'StatSalesFilterForm'])
        const filter = filterHelper(list, pathname, query)
        return {
            list,
            listLoading,
            detail,
            detailLoading,
            filter,
            filterForm,
            graphList,
            graphLoading
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(orderListFetchAction(filter))
        dispatch(statSalesDataFetchAction(filter))
    }),
    withPropsOnChange((props, nextProps) => {
        const saleId = _.get(nextProps, ['params', 'statSaleId'])
        return saleId && _.get(props, ['params', 'statSaleId']) !== saleId
    }, ({dispatch, params}) => {
        const saleId = _.toInteger(_.get(params, 'statSaleId'))
        saleId && dispatch(orderItemFetchAction(saleId))
    }),

    withHandlers({
        handleOpenStatSaleDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({pathname: sprintf(ROUTER.STATISTICS_SALES_ITEM_PATH, id), query: filter.getParams({[STAT_SALES_DIALOG_OPEN]: true})})
        },

        handleCloseStatSaleDialog: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.STATISTICS_SALES_URL, query: filter.getParams({[STAT_SALES_DIALOG_OPEN]: false})})
        },
        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null
            const division = _.get(filterForm, ['values', 'division', 'value']) || null

            filter.filterBy({
                [STAT_SALES_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [STAT_SALES_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD'),
                [STAT_SALES_FILTER_KEY.DIVISION]: division

            })
        }
    })
)

const StatSalesList = enhance((props) => {
    const {
        location,
        list,
        listLoading,
        detail,
        detailLoading,
        filter,
        layout,
        returnData,
        params,
        graphList,
        graphLoading
    } = props

    const detailId = _.toInteger(_.get(params, 'statSaleId'))
    const openStatSaleDialog = toBoolean(_.get(location, ['query', STAT_SALES_DIALOG_OPEN]))
    const firstDayOfMonth = _.get(location, ['query', 'fromDate']) || moment().format('YYYY-MM-01')
    const lastDay = moment().daysInMonth()
    const lastDayOfMonth = _.get(location, ['query', 'toDate']) || moment().format('YYYY-MM-' + lastDay)

    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }
    const statSaleDialog = {
        openStatSaleDialog,
        handleCloseStatSaleDialog: props.handleCloseStatSaleDialog,
        handleOpenStatSaleDialog: props.handleOpenStatSaleDialog
    }
    const detailData = {
        id: detailId,
        data: detail,
        return: returnData,
        detailLoading,
        handleCloseDetail: props.handleCloseDetail
    }

    const filterForm = {
        initialValues: {
            date: {
                fromDate: moment(firstDayOfMonth),
                toDate: moment(lastDayOfMonth)
            }
        }
    }

    const graphData = {
        data: graphList,
        graphLoading
    }
    const order = false

    return (
        <Layout {...layout}>
            <StatSalesGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                statSaleDialog={statSaleDialog}
                type={order}
                initialValues={filterForm.initialValues}
                filterForm={filterForm}
                onSubmit={props.handleSubmitFilterDialog}
                graphData={graphData}
            />
        </Layout>
    )
})

export default StatSalesList
