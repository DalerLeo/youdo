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
    STATSTOCK_CREATE_DIALOG_OPEN,
    STATSTOCK_UPDATE_DIALOG_OPEN,
    STATSTOCK_FILTER_OPEN,
    STATSTOCK_DELETE_DIALOG_OPEN,
    STATSTOCK_FILTER_KEY,
    StatStockGridList
} from '../../components/StatStock'
import {
    statStockCreateAction,
    statStockUpdateAction,
    statStockListFetchAction,
    statStockCSVFetchAction,
    statStockDeleteAction,
    statStockItemFetchAction,
    statStockDataFetchAction
} from '../../actions/statStock'
import {
    remainderStockListFetchAction
} from '../../actions/remainderStock'
import {
    transactionStockListFetchAction
} from '../../actions/transactionStock'
import {openSnackbarAction} from '../../actions/snackbar'
const ONE = 1
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['statStock', 'item', 'data'])
        const detailLoading = _.get(state, ['statStock', 'item', 'loading'])
        const createLoading = _.get(state, ['statStock', 'create', 'loading'])
        const updateLoading = _.get(state, ['statStock', 'update', 'loading'])
        const list = _.get(state, ['statStock', 'list', 'data'])
        const remainderList = _.get(state, ['remainderStock', 'list', 'data'])
        const remainderLoading = _.get(state, ['remainderStock', 'list', 'loading'])
        const transactionList = _.get(state, ['transactionStock', 'list', 'data'])
        const transactionLoading = _.get(state, ['transactionStock', 'list', 'loading'])
        const listLoading = _.get(state, ['statStock', 'list', 'loading'])
        const csvData = _.get(state, ['statStock', 'csv', 'data'])
        const csvLoading = _.get(state, ['statStock', 'csv', 'loading'])
        const createForm = _.get(state, ['form', 'StatStockCreateForm'])
        const tab = _.toInteger(_.get(props, ['location', 'query', 'tab']) || ONE)
        const statStockData = _.get(state, ['statStock', 'statStockData', 'data'])
        const statStockDataLoading = _.get(state, ['statStock', 'statStockData', 'loading'])
        const filter = filterHelper(tab === ONE ? remainderList : transactionList, pathname, query)
        const filterForm = _.get(state, ['form', 'StatStockFilterForm'])
        return {
            list,
            remainderList,
            remainderLoading,
            transactionList,
            transactionLoading,
            listLoading,
            detail,
            detailLoading,
            createLoading,
            updateLoading,
            csvData,
            csvLoading,
            filter,
            filterForm,
            tab,
            createForm,
            statStockData,
            statStockDataLoading
        }
    }),
    withPropsOnChange((props, nextProps) => {
        const currentStat = _.toInteger(_.get(props, ['params', 'statStockId']))
        const statStockId = _.toInteger(_.get(nextProps, ['params', 'statStockId']))

        return (
            (props.filter.filterRequest() !== nextProps.filter.filterRequest()) || currentStat !== statStockId ||
            (_.get(props, 'tab') !== _.get(nextProps, 'tab'))
        )
    }, ({dispatch, filter, params, tab}) => {
        const statStockId = _.toInteger(_.get(params, 'statStockId'))
        if (_.toInteger(tab) === ONE) dispatch(remainderStockListFetchAction(filter, statStockId))
        else dispatch(transactionStockListFetchAction(filter, statStockId))
    }),
    withPropsOnChange((props, nextProps) => {
        return !nextProps.listLoading && _.isNil(nextProps.list)
    }, ({dispatch, filter}) => {
        dispatch(statStockListFetchAction(filter))
    }),
    withPropsOnChange((props, nextProps) => {
        const statStockId = _.get(nextProps, ['params', 'statStockId'])
        return statStockId && _.get(props, ['params', 'statStockId']) !== statStockId
    }, ({dispatch, params}) => {
        const statStockId = _.toInteger(_.get(params, 'statStockId'))
        dispatch(statStockDataFetchAction(statStockId))
    }),

    withState('openCSVDialog', 'setOpenCSVDialog', false),

    withHandlers({
        handleActionEdit: props => () => {
            return null
        },

        handleOpenCSVDialog: props => () => {
            const {dispatch, setOpenCSVDialog} = props
            setOpenCSVDialog(true)

            dispatch(statStockCSVFetchAction(props.filter))
        },

        handleCloseCSVDialog: props => () => {
            const {setOpenCSVDialog} = props
            setOpenCSVDialog(false)
        },

        handleOpenConfirmDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.STATSTOCK_ITEM_PATH, id),
                query: filter.getParams({[STATSTOCK_DELETE_DIALOG_OPEN]: true})
            })
        },

        handleCloseConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STATSTOCK_DELETE_DIALOG_OPEN]: false})})
        },
        handleSendConfirmDialog: props => () => {
            const {dispatch, detail, filter, location: {pathname}} = props
            dispatch(statStockDeleteAction(detail.id))
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[STATSTOCK_DELETE_DIALOG_OPEN]: false})})
                    dispatch(statStockListFetchAction(filter))
                })
        },

        handleOpenCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STATSTOCK_CREATE_DIALOG_OPEN]: true})})
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STATSTOCK_CREATE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}} = props

            return dispatch(statStockCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[STATSTOCK_CREATE_DIALOG_OPEN]: false})})
                    dispatch(statStockListFetchAction(filter))
                })
        },

        handleOpenUpdateDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.STATSTOCK_ITEM_PATH, id),
                query: filter.getParams({[STATSTOCK_UPDATE_DIALOG_OPEN]: true})
            })
        },

        handleOpenFilterDialog: props => (id) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STATSTOCK_FILTER_OPEN]: true})})
        },

        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STATSTOCK_FILTER_OPEN]: false})})
        },

        handleClearFilterDialog: props => () => {
            const {location: {pathname}} = props
            const tab = _.get(props, ['location', 'query', 'tab'])
            hashHistory.push({pathname, query: {'tab': tab}})
        },

        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const tab = _.toInteger(_.get(props, ['location', 'query', 'tab']))
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null
            const brand = _.get(filterForm, ['values', 'brand', 'value']) || null
            const type = _.get(filterForm, ['values', 'type', 'value']) || null
            if (tab === ONE) {
                filter.filterBy({
                    [STATSTOCK_FILTER_OPEN]: false,
                    [STATSTOCK_FILTER_KEY.TYPE]: type,
                    [STATSTOCK_FILTER_KEY.BRAND]: brand
                })
            } else {
                filter.filterBy({
                    [STATSTOCK_FILTER_OPEN]: false,
                    [STATSTOCK_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                    [STATSTOCK_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD'),
                    [STATSTOCK_FILTER_KEY.BRAND]: brand,
                    [STATSTOCK_FILTER_KEY.TYPE]: type
                })
            }
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STATSTOCK_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter} = props
            const statStockId = _.toInteger(_.get(props, ['params', 'statStockId']))

            return dispatch(statStockUpdateAction(statStockId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(statStockItemFetchAction(statStockId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[STATSTOCK_UPDATE_DIALOG_OPEN]: false}))
                    dispatch(statStockListFetchAction(filter))
                })
        },

        handleClickTapChange: props => (id) => {
            const {filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({'tab': id})})
        },
        handleClickStock: props => (id) => {
            const {filter, dispatch} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.STATSTOCK_ITEM_PATH, id),
                query: filter.getParams()
            })
            dispatch(statStockDataFetchAction())
        },
        handleClickStatStock: props => (id) => {
            hashHistory.push({pathname: sprintf(ROUTER.STATSTOCK_ITEM_PATH, id), query: {}})
        }
    })
)

const StatStock = enhance((props) => {
    const {
        location,
        list,
        remainderList,
        remainderLoading,
        transactionList,
        transactionLoading,
        listLoading,
        detail,
        detailLoading,
        createLoading,
        updateLoading,
        filter,
        layout,
        params,
        statStockData,
        statStockDataLoading,
        tab
    } = props

    const openCreateDialog = toBoolean(_.get(location, ['query', STATSTOCK_CREATE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', STATSTOCK_UPDATE_DIALOG_OPEN]))
    const openConfirmDialog = toBoolean(_.get(location, ['query', STATSTOCK_DELETE_DIALOG_OPEN]))
    const openFilterDialog = toBoolean(_.get(location, ['query', STATSTOCK_FILTER_OPEN]))
    const brand = _.toInteger(filter.getParam(STATSTOCK_FILTER_KEY.BRAND))
    const type = _.toInteger(filter.getParam(STATSTOCK_FILTER_KEY.TYPE))
    const detailId = _.toInteger(_.get(params, 'statStockId'))

    const fromDate = filter.getParam(STATSTOCK_FILTER_KEY.FROM_DATE)
    const toDate = filter.getParam(STATSTOCK_FILTER_KEY.TO_DATE)

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
        stockList: _.get(list, 'results'),
        transactionList: _.get(transactionList, 'results'),
        remainderList: _.get(remainderList, 'results'),
        remainderLoading,
        transactionLoading,
        listLoading,
        handleClickTapChange: props.handleClickTapChange,
        handleClickStatStock: props.handleClickStatStock,
        tab: _.toInteger(tab)

    }

    const detailData = {
        id: detailId,
        data: detail,
        detailLoading
    }

    const filterDialog = {
        initialValues: (() => {
            return {
                date: {
                    fromDate: fromDate && moment(fromDate, 'YYYY-MM-DD'),
                    toDate: toDate && moment(toDate, 'YYYY-MM-DD')
                },
                brand: {
                    value: brand
                },
                type: {
                    value: type
                }
            }
        })(),
        filterLoading: false,
        openFilterDialog,
        handleOpenFilterDialog: props.handleOpenFilterDialog,
        handleCloseFilterDialog: props.handleCloseFilterDialog,
        handleClearFilterDialog: props.handleClearFilterDialog,
        handleSubmitFilterDialog: props.handleSubmitFilterDialog
    }

    const handleClickStock = {
        clickItem: props.handleClickStock
    }
    const statStockDataExp = {
        statStockData,
        statStockDataLoading
    }

    return (
        <Layout {...layout}>
            <StatStockGridList
                filter={filter}
                filterDialog={filterDialog}
                listData={listData}
                detailData={detailData}
                createDialog={createDialog}
                confirmDialog={confirmDialog}
                updateDialog={updateDialog}
                actionsDialog={actionsDialog}
                csvDialog={csvDialog}
                statStockData={statStockDataExp}
                handleClickStock={handleClickStock}
            />
        </Layout>
    )
})

export default StatStock
