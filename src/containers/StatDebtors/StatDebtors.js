import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import moment from 'moment'
import toBoolean from '../../helpers/toBoolean'
import {
    STATDEBTORS_CREATE_DIALOG_OPEN,
    STATDEBTORS_UPDATE_DIALOG_OPEN,
    STATDEBTORS_FILTER_OPEN,
    STATDEBTORS_DELETE_DIALOG_OPEN,
    STATDEBTORS_FILTER_KEY,
    ORDER_DETAIL_OPEN,
    StatDebtorsGridList
} from '../../components/StatDebtors'
import {
    statDebtorsCreateAction,
    statDebtorsUpdateAction,
    statDebtorsListFetchAction,
    statDebtorsOrderListFetchAction,
    statDebtorsCSVFetchAction,
    statDebtorsSumFetchAction,
    statDebtorsDeleteAction,
    statDebtorsItemFetchAction,
    getDocumentAction
} from '../../actions/statDebtors'
import {orderItemFetchAction} from '../../actions/order'
import {openSnackbarAction} from '../../actions/snackbar'
const ONE = 1

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const list = _.get(state, ['statDebtors', 'list', 'data'])
        const listLoading = _.get(state, ['statDebtors', 'list', 'loading'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['statDebtors', 'item', 'data'])
        const detailLoading = _.get(state, ['statDebtors', 'orderList', 'loading'])
        const orderList = _.get(state, ['statDebtors', 'orderList', 'data'])
        const orderDetail = _.get(state, ['order', 'item', 'data'])
        const orderDetailLoading = _.get(state, ['order', 'item', 'loading'])
        const orderLoading = _.get(state, ['statDebtors', 'orderList', 'loading'])
        const createLoading = _.get(state, ['statDebtors', 'create', 'loading'])
        const updateLoading = _.get(state, ['statDebtors', 'update', 'loading'])
        const csvData = _.get(state, ['statDebtors', 'csv', 'data'])
        const csvLoading = _.get(state, ['statDebtors', 'csv', 'loading'])
        const createForm = _.get(state, ['form', 'StatDebtorsCreateForm'])
        const orderId = _.toInteger(_.get(['location', 'query', 'orderId']))
        const sumList = _.get(state, ['statDebtors', 'sum', 'data'])
        const sumLoading = _.get(state, ['statDebtors', 'sum', 'loading'])
        const tab = _.toInteger(_.get(props, ['location', 'query', 'tab']) || ONE)

        const filter = filterHelper(list, pathname, query)
        const filterForm = _.get(state, ['form', 'StatDebtorsFilterForm'])

        return {
            list,
            listLoading,
            orderList,
            orderLoading,
            detail,
            orderDetail,
            orderDetailLoading,
            orderId,
            detailLoading,
            createLoading,
            updateLoading,
            csvData,
            csvLoading,
            filter,
            filterForm,
            createForm,
            sumList,
            tab,
            sumLoading
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return (props.filter.filterRequest() !== nextProps.filter.filterRequest() || props.tab !== nextProps.tab)
    }, ({dispatch, filter, tab}) => {
        if (tab === ONE) dispatch(statDebtorsListFetchAction(filter))
        else dispatch(statDebtorsOrderListFetchAction(true))
    }),
    withPropsOnChange((props, nextProps) => {
        return !nextProps.sumList && _.isNil(nextProps.sumLoading)
    }, ({dispatch}) => {
        dispatch(statDebtorsSumFetchAction())
    }),

    withPropsOnChange((props, nextProps) => {
        const statDebtorsId = _.get(nextProps, ['params', 'statDebtorsId'])
        return statDebtorsId && _.get(props, ['params', 'statDebtorsId']) !== statDebtorsId
    }, ({dispatch, params}) => {
        const statDebtorsId = _.toInteger(_.get(params, 'statDebtorsId'))
        statDebtorsId && dispatch(statDebtorsOrderListFetchAction(statDebtorsId))
    }),

    withState('openCSVDialog', 'setOpenCSVDialog', false),

    withHandlers({
        handleActionEdit: props => () => {
            return null
        },

        handleOpenCSVDialog: props => () => {
            const {dispatch, setOpenCSVDialog} = props
            setOpenCSVDialog(true)

            dispatch(statDebtorsCSVFetchAction(props.filter))
        },

        handleCloseCSVDialog: props => () => {
            const {setOpenCSVDialog} = props
            setOpenCSVDialog(false)
        },

        handleOpenConfirmDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.STATDEBTORS_ITEM_PATH, id),
                query: filter.getParams({[STATDEBTORS_DELETE_DIALOG_OPEN]: true})
            })
        },

        handleCloseConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STATDEBTORS_DELETE_DIALOG_OPEN]: false})})
        },
        handleSendConfirmDialog: props => () => {
            const {dispatch, detail, filter, location: {pathname}} = props
            dispatch(statDebtorsDeleteAction(detail.id))
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[STATDEBTORS_DELETE_DIALOG_OPEN]: false})})
                    dispatch(statDebtorsListFetchAction(filter))
                })
        },

        handleOpenCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STATDEBTORS_CREATE_DIALOG_OPEN]: true})})
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STATDEBTORS_CREATE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}} = props

            return dispatch(statDebtorsCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[STATDEBTORS_CREATE_DIALOG_OPEN]: false})})
                    dispatch(statDebtorsListFetchAction(filter))
                })
        },

        handleOpenUpdateDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.STATDEBTORS_ITEM_PATH, id),
                query: filter.getParams({[STATDEBTORS_UPDATE_DIALOG_OPEN]: true})
            })
        },

        handleOpenFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STATDEBTORS_FILTER_OPEN]: true})})
        },

        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STATDEBTORS_FILTER_OPEN]: false})})
        },

        handleClearFilterDialog: props => () => {
            const {location: {pathname}} = props
            hashHistory.push({pathname, query: {}})
        },

        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null

            filter.filterBy({
                [STATDEBTORS_FILTER_OPEN]: false,
                [STATDEBTORS_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [STATDEBTORS_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')
            })
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STATDEBTORS_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter} = props
            const statDebtorsId = _.toInteger(_.get(props, ['params', 'statDebtorsId']))

            return dispatch(statDebtorsUpdateAction(statDebtorsId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(statDebtorsItemFetchAction(statDebtorsId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[STATDEBTORS_UPDATE_DIALOG_OPEN]: false}))
                    dispatch(statDebtorsListFetchAction(filter))
                })
        },

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
        },
        handleClickTab: props => (tab) => {
            const {filter, location: {pathname}} = props
            hashHistory.push({
                pathname: pathname,
                query: filter.getParams({'tab': tab})
            })
        },
        handleGetDocument: props => () => {
            const {dispatch, filter} = props
            return dispatch(getDocumentAction(filter))
        },

        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.STATDEBTORS_LIST_URL, query: filter.getParam()})
        }
    })
)

const StatDebtors = enhance((props) => {
    const {
        location,
        list,
        orderList,
        orderDetail,
        orderDetailLoading,
        listLoading,
        detail,
        detailLoading,
        createLoading,
        sumLoading,
        sumList,
        updateLoading,
        filter,
        layout,
        params
    } = props

    const openCreateDialog = toBoolean(_.get(location, ['query', STATDEBTORS_CREATE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', STATDEBTORS_UPDATE_DIALOG_OPEN]))
    const openConfirmDialog = toBoolean(_.get(location, ['query', STATDEBTORS_DELETE_DIALOG_OPEN]))
    const openFilterDialog = toBoolean(_.get(location, ['query', STATDEBTORS_FILTER_OPEN]))
    const orderDetailOpen = toBoolean(_.get(location, ['query', ORDER_DETAIL_OPEN]))
    const tab = _.toInteger(_.get(location, ['query', 'tab'])) || ONE

    const detailId = _.toInteger(_.get(params, 'statDebtorsId'))

    const fromDate = filter.getParam(STATDEBTORS_FILTER_KEY.FROM_DATE)
    const toDate = filter.getParam(STATDEBTORS_FILTER_KEY.TO_DATE)

    const actionsDialog = {
        handleActionEdit: props.handleActionEdit,
        handleActionDelete: props.handleOpenDeleteDialog
    }

    const createDialog = {
        createLoading,
        openCreateDialog,
        handleOpenCreateDialog: props.handleOpenCreateDialog,
        handleCloseCreateDialog: props.handleCloseCreateDialog,
        handleSubmitCreateDialog: props.handleSubmitCreateDialog
    }

    const confirmDialog = {
        openConfirmDialog: openConfirmDialog,
        handleOpenConfirmDialog: props.handleOpenConfirmDialog,
        handleCloseConfirmDialog: props.handleCloseConfirmDialog,
        handleSendConfirmDialog: props.handleSendConfirmDialog
    }

    const updateDialog = {
        initialValues: (() => {
            if (!detail) {
                return {}
            }
            return {
                name: _.get(detail, 'name')
            }
        })(),
        updateLoading: detailLoading || updateLoading,
        openUpdateDialog,
        handleOpenUpdateDialog: props.handleOpenUpdateDialog,
        handleCloseUpdateDialog: props.handleCloseUpdateDialog,
        handleSubmitUpdateDialog: props.handleSubmitUpdateDialog
    }

    const csvDialog = {
        csvData: props.csvData,
        csvLoading: props.csvLoading,
        openCSVDialog: props.openCSVDialog,
        handleOpenCSVDialog: props.handleOpenCSVDialog,
        handleCloseCSVDialog: props.handleCloseCSVDialog
    }

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

    const filterDialog = {
        initialValues: {
            date: {
                fromDate: fromDate && moment(fromDate, 'YYYY-MM-DD'),
                toDate: toDate && moment(toDate, 'YYYY-MM-DD')
            }
        },
        filterLoading: false,
        openFilterDialog,
        handleOpenFilterDialog: props.handleOpenFilterDialog,
        handleCloseFilterDialog: props.handleCloseFilterDialog,
        handleClearFilterDialog: props.handleClearFilterDialog,
        handleSubmitFilterDialog: props.handleSubmitFilterDialog
    }

    const orderData = {
        orderList,
        orderDetail,
        detailLoading: orderDetailLoading,
        orderDetailOpen: orderDetailOpen,
        handleOrderDetailClose: props.handleOrderDetailClose,
        handleOrderClick: props.handleOrderClick
    }

    const sumData = {
        data: sumList,
        loading: sumLoading
    }

    const tabData = {
        tab: _.toInteger(tab),
        handleClick: props.handleClickTab
    }

    const getDocument = {
        handleGetDocument: props.handleGetDocument
    }

    return (
        <Layout {...layout}>
            <StatDebtorsGridList
                filter={filter}
                filterDialog={filterDialog}
                listData={listData}
                sumData={sumData}
                detailData={detailData}
                createDialog={createDialog}
                confirmDialog={confirmDialog}
                updateDialog={updateDialog}
                actionsDialog={actionsDialog}
                csvDialog={csvDialog}
                orderData={orderData}
                tabData={tabData}
                getDocument={getDocument}
            />
        </Layout>
    )
})

export default StatDebtors
