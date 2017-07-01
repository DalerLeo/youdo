import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {
    ORDER_DETAIL_OPEN,
    StatCashboxGridList
} from '../../components/StatCashbox'
import {
    statCashboxListFetchAction,
    statCashboxItemFetchAction
} from '../../actions/statCashbox'
import {orderListFetchAction, orderItemFetchAction} from '../../actions/order'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['statCashbox', 'item', 'data'])
        const orderDetail = _.get(state, ['order', 'item', 'data'])
        const detailLoading = _.get(state, ['statCashbox', 'item', 'loading'])
        const createLoading = _.get(state, ['statCashbox', 'create', 'loading'])
        const updateLoading = _.get(state, ['statCashbox', 'update', 'loading'])
        const list = _.get(state, ['statCashbox', 'list', 'data'])
        const orderList = _.get(state, ['order', 'list', 'data'])
        const orderLoading = _.get(state, ['order', 'list', 'loading'])
        const listLoading = _.get(state, ['statCashbox', 'list', 'loading'])
        const createForm = _.get(state, ['form', 'StatCashboxCreateForm'])
        const orderId = _.toInteger(_.get(['location', 'query', 'orderId']))

        const filter = filterHelper(list, pathname, query)

        return {
            list,
            listLoading,
            orderList,
            orderLoading,
            detail,
            orderDetail,
            orderId,
            detailLoading,
            createLoading,
            updateLoading,
            filter,
            createForm
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(statCashboxListFetchAction(filter))
        dispatch(orderListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const statCashboxId = _.get(nextProps, ['params', 'statCashboxId'])
        return statCashboxId && _.get(props, ['params', 'statCashboxId']) !== statCashboxId
    }, ({dispatch, params, filter}) => {
        const statCashboxId = _.toInteger(_.get(params, 'statCashboxId'))
        statCashboxId && dispatch(statCashboxItemFetchAction(statCashboxId))
        dispatch(orderListFetchAction(filter))
    }),

    withState('openCSVDialog', 'setOpenCSVDialog', false),

    withHandlers({
        handleOrderClick: props => (id) => {
            const {filter, location: {pathname}, dispatch} = props
            hashHistory.push({
                pathname: pathname,
                query: filter.getParams({[ORDER_DETAIL_OPEN]: true, 'orderId': id})
            })
            dispatch(orderItemFetchAction(id))
        },

        handleOrderDetailClose: props => () => {
            const {filter, location: {pathname}} = props
            hashHistory.push({
                pathname: pathname,
                query: filter.getParams({[ORDER_DETAIL_OPEN]: false, 'orderId': -1})
            })
        }
    })
)

const StatCashbox = enhance((props) => {
    const {
        location,
        list,
        orderList,
        orderLoading,
        orderDetail,
        listLoading,
        detail,
        detailLoading,
        filter,
        layout,
        params
    } = props

    const orderDetailOpen = toBoolean(_.get(location, ['query', ORDER_DETAIL_OPEN]))

    const detailId = _.toInteger(_.get(params, 'statCashboxId'))

    const actionsDialog = {
        handleActionEdit: props.handleActionEdit,
        handleActionDelete: props.handleOpenDeleteDialog
    }

    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }

    const detailData = {
        id: detailId,
        data: detail,
        detailLoading
    }

    const orderData = {
        orderList,
        orderDetail,
        orderLoading,
        orderDetailOpen: orderDetailOpen,
        handleOrderDetailClose: props.handleOrderDetailClose,
        handleOrderClick: props.handleOrderClick
    }

    return (
        <Layout {...layout}>
            <StatCashboxGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                actionsDialog={actionsDialog}
                orderData={orderData}
            />
        </Layout>
    )
})

export default StatCashbox
