import React from 'react'
import _ from 'lodash'
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

const TAB = 'tab'
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['order', 'item', 'data'])
        const detailLoading = _.get(state, ['order', 'item', 'loading'])
        const list = _.get(state, ['order', 'list', 'data'])
        const listLoading = _.get(state, ['order', 'list', 'loading'])
        const returnData = _.get(state, ['order', 'return', 'data', 'results'])
        const filterForm = _.get(state, ['form', 'StatAgentFilterForm'])
        const filter = filterHelper(list, pathname, query)
        return {
            list,
            listLoading,
            detail,
            detailLoading,
            filter,
            filterForm,
            returnData
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(orderListFetchAction(filter))
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
            const product = _.get(filterForm, ['values', 'product', 'value']) || null
            const productType = _.get(filterForm, ['values', 'productType', 'value']) || null
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null

            filter.filterBy({
                [STAT_SALES_FILTER_KEY.PRODUCT]: product,
                [STAT_SALES_FILTER_KEY.PRODUCT_TYPE]: productType,
                [STAT_SALES_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [STAT_SALES_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')

            })
        },
        handleTabChange: props => (tab) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname: pathname,
                query: filter.getParams({[TAB]: tab})
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
        params
    } = props

    const detailId = _.toInteger(_.get(params, 'statSaleId'))
    const openStatSaleDialog = toBoolean(_.get(location, ['query', STAT_SALES_DIALOG_OPEN]))

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

    const order = false

    return (
        <Layout {...layout}>
            <StatSalesGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                statSaleDialog={statSaleDialog}
                type={order}
            />
        </Layout>
    )
})

export default StatSalesList
