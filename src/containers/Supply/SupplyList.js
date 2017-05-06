import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {DELETE_DIALOG_OPEN} from '../../components/DeleteDialog'
import {
    SUPPLY_CREATE_DIALOG_OPEN,
    SUPPLY_UPDATE_DIALOG_OPEN,
    SUPPLY_FILTER_KEY,
    SUPPLY_FILTER_OPEN,
    SUPPLY_EXPENSE_CREATE_DIALOG_OPEN,
    SUPPLY_EXPENSE_DELETE_DIALOG_OPEN,
    SupplyGridList
} from '../../components/Supply'
import {
    supplyCreateAction,
    supplyUpdateAction,
    supplyListFetchAction,
    supplyCSVFetchAction,
    supplyDeleteAction,
    supplyItemFetchAction
} from '../../actions/supply'
import {
    supplyExpenseCreateAction,
    supplyExpenseCSVFetchAction,
    supplyExpenseDeleteAction,
    supplyExpenseListFetchAction,
    supplyExpenseItemFetchAction
} from '../../actions/supplyExpense'
import {openSnackbarAction} from '../../actions/snackbar'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['supply', 'item', 'data'])
        const detailLoading = _.get(state, ['supply', 'item', 'loading'])
        const createLoading = _.get(state, ['supply', 'create', 'loading'])
        const updateLoading = _.get(state, ['supply', 'update', 'loading'])
        const list = _.get(state, ['supply', 'list', 'data'])
        const listLoading = _.get(state, ['supply', 'list', 'loading'])
        const csvData = _.get(state, ['supply', 'csv', 'data'])
        const csvLoading = _.get(state, ['supply', 'csv', 'loading'])
        const filterForm = _.get(state, ['form', 'SupplyFilterForm'])
        const createForm = _.get(state, ['form', 'SupplyCreateForm'])
        const filter = filterHelper(list, pathname, query)

        const supplyExpenseLoading = _.get(state, ['supplyExpense', 'create', 'loading'])
        const createSupplyExpenseForm = _.get(state, ['form', 'SupplyExpenseCreateForm'])
        const supplyExpenseList = _.get(state, ['supplyExpense', 'list', 'data'])
        const supplyExpenseListLoading = _.get(state, ['supplyExpense', 'list', 'loading'])

        return {
            list,
            listLoading,
            detail,
            detailLoading,
            createLoading,
            updateLoading,
            csvData,
            csvLoading,
            filter,
            filterForm,
            createForm,

            supplyExpenseLoading,
            createSupplyExpenseForm,
            supplyExpenseList,
            supplyExpenseListLoading
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(supplyListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        return props.supplyExpenseList && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(supplyExpenseListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const supplyId = _.get(nextProps, ['params', 'supplyId'])

        return supplyId && _.get(props, ['params', 'supplyId']) !== supplyId
    }, ({dispatch, params}) => {
        const supplyId = _.toInteger(_.get(params, 'supplyId'))
        supplyId && dispatch(supplyItemFetchAction(supplyId))
    }),

    withState('openCSVDialog', 'setOpenCSVDialog', false),
    withState('openConfirmDialog', 'setOpenConfirmDialog', false),
    withState('openSupplyExpenseConfirmDialog', 'setOpenSupplyExpenseConfirmDialog', false),

    withHandlers({
        handleActionEdit: props => () => {
            return null
        },

        handleOpenCSVDialog: props => () => {
            const {dispatch, setOpenCSVDialog} = props
            setOpenCSVDialog(true)

            dispatch(supplyCSVFetchAction(props.filter))
        },

        handleCloseCSVDialog: props => () => {
            const {setOpenCSVDialog} = props
            setOpenCSVDialog(false)
        },

        handleOpenConfirmDialog: props => () => {
            const {setOpenConfirmDialog} = props
            setOpenConfirmDialog(true)
        },

        handleCloseConfirmDialog: props => () => {
            const {setOpenConfirmDialog} = props
            setOpenConfirmDialog(false)
        },
        handleSendConfirmDialog: props => () => {
            const {dispatch, detail, setOpenConfirmDialog} = props
            dispatch(supplyDeleteAction(detail.id))
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Successful deleted'}))
                })
                .then(() => {
                    setOpenConfirmDialog(false)
                })
        },

        handleOpenFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SUPPLY_FILTER_OPEN]: true})})
        },

        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SUPPLY_FILTER_OPEN]: false})})
        },

        handleClearFilterDialog: props => () => {
            const {location: {pathname}} = props
            hashHistory.push({pathname, query: {}})
        },

        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null
            const provider = _.get(filterForm, ['values', 'provider', 'value']) || null
            const stock = _.get(filterForm, ['values', 'stock', 'value']) || null

            filter.filterBy({
                [SUPPLY_FILTER_OPEN]: false,
                [SUPPLY_FILTER_KEY.PROVIDER]: provider,
                [SUPPLY_FILTER_KEY.STOCK]: stock,
                [SUPPLY_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [SUPPLY_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')
            })
        },
        handleOpenDeleteDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({openDeleteDialog: 'yes'})
            })
        },

        handleCloseDeleteDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({openDeleteDialog: false})})
        },

        handleOpenCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SUPPLY_CREATE_DIALOG_OPEN]: true})})
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SUPPLY_CREATE_DIALOG_OPEN]: false})})
        },
        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, filter} = props

            return dispatch(supplyCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Successful saved'}))
                })
                .then(() => {
                    hashHistory.push({query: filter.getParams({[SUPPLY_CREATE_DIALOG_OPEN]: false})})
                })
        },

        handleOpenUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SUPPLY_UPDATE_DIALOG_OPEN]: true})})
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SUPPLY_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter} = props
            const supplyId = _.toInteger(_.get(props, ['params', 'supplyId']))

            return dispatch(supplyUpdateAction(supplyId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(supplyItemFetchAction(supplyId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Successful saved'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[SUPPLY_UPDATE_DIALOG_OPEN]: false}))
                })
        }
    }),

    withHandlers({
        handleSupplyExpenseActionEdit: props => () => {
            return null
        },

        handleSupplyExpenseOpenCSVDialog: props => () => {
            const {dispatch, setOpenCSVDialog} = props
            setOpenCSVDialog(true)

            dispatch(supplyExpenseCSVFetchAction(props.filter))
        },

        handleSupplyExpenseCloseCSVDialog: props => () => {
            const {setOpenCSVDialog} = props
            setOpenCSVDialog(false)
        },

        handleSupplyExpenseOpenConfirmDialog: props => () => {
            const {setOpenSupplyExpenseConfirmDialog} = props
            setOpenSupplyExpenseConfirmDialog(true)
        },

        handleSupplyExpenseCloseConfirmDialog: props => () => {
            const {setOpenSupplyExpenseConfirmDialog} = props
            setOpenSupplyExpenseConfirmDialog(false)
        },
        handleSupplyExpenseSendConfirmDialog: props => () => {
            const {dispatch, detail, setOpenSupplyExpenseConfirmDialog} = props
            dispatch(supplyExpenseDeleteAction(detail.id))
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Successful deleted'}))
                })
                .then(() => {
                    setOpenSupplyExpenseConfirmDialog(false)
                })
        },

        handleSupplyExpenseOpenDeleteDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({openDeleteDialog: 'yes'})
            })
        },

        handleSupplyExpenseCloseDeleteDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({openDeleteDialog: false})})
        },

        handleSupplyExpenseOpenCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SUPPLY_EXPENSE_CREATE_DIALOG_OPEN]: true})})
        },

        handleSupplyExpenseCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SUPPLY_EXPENSE_CREATE_DIALOG_OPEN]: false})})
        },
        handleSupplyExpenseSubmitCreateDialog: props => () => {
            const {dispatch, createSupplyExpenseForm, filter, detail, location: {pathname}} = props
            const id = _.get(detail, 'id')

            return dispatch(supplyExpenseCreateAction(_.get(createSupplyExpenseForm, ['values']), id))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Successful saved'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[SUPPLY_EXPENSE_CREATE_DIALOG_OPEN]: false})})
                    dispatch(supplyItemFetchAction(id))
                })
        }
    })
)

const SupplyList = enhance((props) => {
    const {
        location,
        list,
        listLoading,
        detail,
        detailLoading,
        createLoading,
        updateLoading,
        filter,
        layout,
        params,

        supplyExpenseLoading,
        supplyExpenseList,
        supplyExpenseListLoading
    } = props

    const openFilterDialog = toBoolean(_.get(location, ['query', SUPPLY_FILTER_OPEN]))
    const openCreateDialog = toBoolean(_.get(location, ['query', SUPPLY_CREATE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', SUPPLY_UPDATE_DIALOG_OPEN]))
    const openDeleteDialog = toBoolean(_.get(location, ['query', DELETE_DIALOG_OPEN]))
    const provider = _.toInteger(filter.getParam(SUPPLY_FILTER_KEY.PROVIDER))
    const stock = _.toInteger(filter.getParam(SUPPLY_FILTER_KEY.STOCK))
    const fromDate = filter.getParam(SUPPLY_FILTER_KEY.FROM_DATE)
    const toDate = filter.getParam(SUPPLY_FILTER_KEY.TO_DATE)
    const detailId = _.toInteger(_.get(params, 'supplyId'))

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

    const deleteDialog = {
        openDeleteDialog,
        handleOpenDeleteDialog: props.handleOpenDeleteDialog,
        handleCloseDeleteDialog: props.handleCloseDeleteDialog
    }

    const confirmDialog = {
        openConfirmDialog: props.openConfirmDialog,
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
                provider: _.get(detail, 'provider'),
                stock: _.get(detail, 'stock'),
                dataDelivery: _.get(detail, 'dataDelivery'),
                contact: _.get(detail, 'contact'),
                currency: _.get(detail, 'currency')
            }
        })(),
        updateLoading: detailLoading || updateLoading,
        openUpdateDialog,
        handleOpenUpdateDialog: props.handleOpenUpdateDialog,
        handleCloseUpdateDialog: props.handleCloseUpdateDialog,
        handleSubmitUpdateDialog: props.handleSubmitUpdateDialog
    }

    const filterDialog = {
        initialValues: {
            provider: {
                value: provider
            },
            stock: {
                value: stock
            },
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
        detailLoading
    }

    // Supply Expense

    const supplyListData = {
        data: _.get(supplyExpenseList, 'results'),
        supplyExpenseListLoading,
        openSupplyExpenseDeleteDialog,
        handleSupplyExpenseOpenDeleteDialog: props.handleSupplyExpenseOpenDeleteDialog,
        handleSupplyExpenseCloseDeleteDialog: props.handleSupplyExpenseCloseDeleteDialog,
        openSupplyExpenseConfirmDialog: props.openSupplyExpenseConfirmDialog,
        handleSupplyExpenseOpenConfirmDialog: props.handleSupplyExpenseOpenConfirmDialog,
        handleSupplyExpenseCloseConfirmDialog: props.handleSupplyExpenseCloseConfirmDialog,
        handleSupplyExpenseSendConfirmDialog: props.handleSupplyExpenseSendConfirmDialog,
        handleSupplyExpenseActionDelete: props.handleSupplyExpenseOpenDeleteDialog
    }
    const openSupplyExpenseCreateDialog = toBoolean(_.get(location, ['query', SUPPLY_EXPENSE_CREATE_DIALOG_OPEN]))
    const openSupplyExpenseDeleteDialog = toBoolean(_.get(location, ['query', SUPPLY_EXPENSE_DELETE_DIALOG_OPEN]))

    // const supplyExpenseActionsDialog = {
    //     handleSupplyExpenseActionEdit: props.handleSupplyExpenseActionEdit,
    //     handleSupplyExpenseActionDelete: props.handleSupplyExpenseOpenDeleteDialog
    // }

    const supplyExpenseCreateDialog = {
        supplyExpenseLoading,
        openSupplyExpenseCreateDialog,
        handleSupplyExpenseOpenCreateDialog: props.handleSupplyExpenseOpenCreateDialog,
        handleSupplyExpenseCloseCreateDialog: props.handleSupplyExpenseCloseCreateDialog,
        handleSupplyExpenseSubmitCreateDialog: props.handleSupplyExpenseSubmitCreateDialog
    }

    // const supplyExpenseDeleteDialog = {
    //     // openSupplyExpenseDeleteDialog,
    //     handleSupplyExpenseOpenDeleteDialog: props.handleSupplyExpenseOpenDeleteDialog,
    //     handleSupplyExpenseCloseDeleteDialog: props.handleSupplyExpenseCloseDeleteDialog
    // }

    // const supplyExpenseConfirmDialog = {
    //     openSupplyExpenseConfirmDialog: props.openSupplyExpenseConfirmDialog,
    //     handleSupplyExpenseOpenConfirmDialog: props.handleSupplyExpenseOpenConfirmDialog,
    //     handleSupplyExpenseCloseConfirmDialog: props.handleSupplyExpenseCloseConfirmDialog,
    //     handleSupplyExpenseSendConfirmDialog: props.handleSupplyExpenseSendConfirmDialog
    // }

    return (
        <Layout {...layout}>
            <SupplyGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                createDialog={createDialog}
                deleteDialog={deleteDialog}
                confirmDialog={confirmDialog}
                updateDialog={updateDialog}
                actionsDialog={actionsDialog}
                filterDialog={filterDialog}
                csvDialog={csvDialog}

                supplyListData={supplyListData}
                supplyExpenseCreateDialog={supplyExpenseCreateDialog}
                // supplyExpenseDeleteDialog={supplyExpenseDeleteDialog}
                // supplyExpenseConfirmDialog={supplyExpenseConfirmDialog}
                // supplyExpenseActionsDialog={supplyExpenseActionsDialog}
            />
        </Layout>
    )
})

export default SupplyList
