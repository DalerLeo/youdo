import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {
    StatManufactureGridList,
    STAT_MANUFACTURE_CREATE_DIALOG_OPEN
} from '../../components/StatManufacture'
import {
    statManufactureListFetchAction,
    statManufactureItemFetchAction
} from '../../actions/statManufacture'
import {orderListFetchAction} from '../../actions/order'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['statManufacture', 'item', 'data'])
        const orderDetail = _.get(state, ['order', 'item', 'data'])
        const detailLoading = _.get(state, ['statManufacture', 'item', 'loading'])
        const createLoading = _.get(state, ['statManufacture', 'create', 'loading'])
        const updateLoading = _.get(state, ['statManufacture', 'update', 'loading'])
        const list = _.get(state, ['statManufacture', 'list', 'data'])
        const orderList = _.get(state, ['order', 'list', 'data'])
        const orderLoading = _.get(state, ['order', 'list', 'loading'])
        const listLoading = _.get(state, ['statManufacture', 'list', 'loading'])
        const createForm = _.get(state, ['form', 'StatManufactureCreateForm'])
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
        dispatch(statManufactureListFetchAction(filter))
        dispatch(orderListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const statManufactureId = _.get(nextProps, ['params', 'statManufactureId'])
        return statManufactureId && _.get(props, ['params', 'statManufactureId']) !== statManufactureId
    }, ({dispatch, params, filter}) => {
        const statManufactureId = _.toInteger(_.get(params, 'statManufactureId'))
        statManufactureId && dispatch(statManufactureItemFetchAction(statManufactureId))
        dispatch(orderListFetchAction(filter))
    }),

    withHandlers({
        handleOpenCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STAT_MANUFACTURE_CREATE_DIALOG_OPEN]: true})})
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STAT_MANUFACTURE_CREATE_DIALOG_OPEN]: false})})
        },
        handleClickItem: props => (id) => {
            hashHistory.push({
                pathname: sprintf(ROUTER.STAT_MANUFACTURE_ITEM_PATH, id)
            })
        }
    })
)

const StatManufacture = enhance((props) => {
    const {
        location,
        list,
        listLoading,
        detail,
        detailLoading,
        createLoading,
        filter,
        layout,
        params
    } = props

    const openCreateDialog = toBoolean(_.get(location, ['query', STAT_MANUFACTURE_CREATE_DIALOG_OPEN]))

    const detailId = _.toInteger(_.get(params, 'statManufactureId'))

    const actionsDialog = {
        handleActionEdit: props.handleActionEdit,
        handleActionDelete: props.handleOpenDeleteDialog
    }

    const createDialog = {
        createLoading,
        openCreateDialog,
        handleOpenCreateDialog: props.handleOpenCreateDialog,
        handleCloseCreateDialog: props.handleCloseCreateDialog
    }

    const listData = {
        data: _.get(list, 'results'),
        listLoading,
        handleClickItem: props.handleClickItem
    }

    const detailData = {
        id: detailId,
        data: detail,
        detailLoading
    }

    return (
        <Layout {...layout}>
            <StatManufactureGridList
                filter={filter}
                createDialog={createDialog}
                listData={listData}
                detailData={detailData}
                actionsDialog={actionsDialog}
            />
        </Layout>
    )
})

export default StatManufacture
