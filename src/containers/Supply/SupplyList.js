import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
import Layout from '../../components/Layout'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {DELETE_DIALOG_OPEN} from '../../components/DeleteDialog'
import {setItemAction} from '../../components/ReduxForm/Provider/ProviderSearchField'
import {
    SUPPLY_CREATE_DIALOG_OPEN,
    SUPPLY_UPDATE_DIALOG_OPEN,
    SUPPLY_FILTER_KEY,
    SUPPLY_FILTER_OPEN,
    SUPPLY_EXPENSE_CREATE_DIALOG_OPEN,
    SUPPLY_DEFECT_DIALOG_OPEN,
    SupplyGridList
} from '../../components/Supply'
import {
    supplyCreateAction,
    supplyUpdateAction,
    supplyListFetchAction,
    supplyDeleteAction,
    supplyItemFetchAction,
    supplyDefectAction
} from '../../actions/supply'
import {
    supplyExpenseCreateAction,
    supplyExpenseDeleteAction,
    supplyExpenseListFetchAction
} from '../../actions/supplyExpense'
import {openSnackbarAction} from '../../actions/snackbar'

const MINUS_ONE = -1
const ZERO = 0
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['supply', 'item', 'data'])
        const detailLoading = _.get(state, ['supply', 'item', 'loading'])
        const createLoading = _.get(state, ['supply', 'create', 'loading'])
        const updateLoading = _.get(state, ['supply', 'update', 'loading'])
        const list = _.get(state, ['supply', 'list', 'data'])
        const defectData = _.get(state, ['supply', 'defect', 'data'])
        const listLoading = _.get(state, ['supply', 'list', 'loading'])
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
            defectData,
            detailLoading,
            createLoading,
            updateLoading,
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
        const prevDefect = _.toInteger(_.get(props, ['location', 'query', 'openDefectDialog']))
        const nextDefect = _.toInteger(_.get(nextProps, ['location', 'query', 'openDefectDialog']))
        return prevDefect !== nextDefect && nextDefect > ZERO
    }, ({dispatch, params, location}) => {
        const supplyId = _.toInteger(_.get(params, 'supplyId'))
        const productId = _.toInteger(_.get(location, ['query', 'openDefectDialog']))
        if (productId > ZERO) {
            dispatch(supplyDefectAction(supplyId, productId))
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const supplyId = _.get(nextProps, ['params', 'supplyId'])
        return supplyId && _.get(props, ['params', 'supplyId']) !== supplyId
    }, ({dispatch, params}) => {
        const supplyId = _.toInteger(_.get(params, 'supplyId'))
        supplyId && dispatch(supplyItemFetchAction(supplyId))
        supplyId && dispatch(supplyExpenseListFetchAction(supplyId))
    }),

    withState('openConfirmDialog', 'setOpenConfirmDialog', false),
    withState('openConfirmExpenseDialog', 'setOpenConfirmExpenseDialog', false),
    withState('openSupplyExpenseConfirmDialog', 'setOpenSupplyExpenseConfirmDialog', false),
    withState('expenseRemoveId', 'setExpenseRemoveId', false),

    withHandlers({
        handleActionEdit: props => () => {
            return null
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
            const {dispatch, detail, setOpenConfirmDialog, filter} = props
            dispatch(supplyDeleteAction(detail.id))
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно отменено'}))
                })
                .then(() => {
                    setOpenConfirmDialog(false)
                    dispatch(supplyListFetchAction(filter))
                })
        },

        handleOpenConfirmExpenseDialog: props => (expId) => {
            const {setExpenseRemoveId} = props
            setExpenseRemoveId(expId)
        },

        handleCloseConfirmExpenseDialog: props => () => {
            const {setExpenseRemoveId} = props
            setExpenseRemoveId(false)
        },
        handleSendConfirmExpenseDialog: props => () => {
            const {dispatch, setExpenseRemoveId, expenseRemoveId, detail} = props
            const id = _.get(detail, 'id')
            dispatch(supplyExpenseDeleteAction(expenseRemoveId))
                .then(() => {
                    setExpenseRemoveId(false)
                    dispatch(supplyExpenseListFetchAction(id))
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Ошибка при удалении'}))
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
            const deliveryFromDate = _.get(filterForm, ['values', 'dateDelivery', 'fromDate']) || null
            const deliveryToDate = _.get(filterForm, ['values', 'dateDelivery', 'toDate']) || null
            const createdFromDate = _.get(filterForm, ['values', 'dateCreated', 'fromDate']) || null
            const createdToDate = _.get(filterForm, ['values', 'dateCreated', 'toDate']) || null
            const provider = _.get(filterForm, ['values', 'provider', 'value']) || null
            const stock = _.get(filterForm, ['values', 'stock', 'value']) || null

            filter.filterBy({
                [SUPPLY_FILTER_OPEN]: false,
                [SUPPLY_FILTER_KEY.PROVIDER]: provider,
                [SUPPLY_FILTER_KEY.STOCK]: stock,
                [SUPPLY_FILTER_KEY.DELIVERY_FROM_DATE]: deliveryFromDate && deliveryFromDate.format('YYYY-MM-DD'),
                [SUPPLY_FILTER_KEY.DELIVERY_TO_DATE]: deliveryToDate && deliveryToDate.format('YYYY-MM-DD'),
                [SUPPLY_FILTER_KEY.CREATED_FROM_DATE]: createdFromDate && createdFromDate.format('YYYY-MM-DD'),
                [SUPPLY_FILTER_KEY.CREATED_TO_DATE]: createdToDate && createdToDate.format('YYYY-MM-DD')
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
            const {location: {pathname}, filter, dispatch} = props
            hashHistory.push({pathname, query: filter.getParams({[SUPPLY_CREATE_DIALOG_OPEN]: true})})
            dispatch(setItemAction(null, false))
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SUPPLY_CREATE_DIALOG_OPEN]: false})})
        },
        handleSubmitCreateDialog: props => () => {
            const {location: {pathname}, dispatch, createForm, filter} = props
            return dispatch(supplyCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[SUPPLY_CREATE_DIALOG_OPEN]: false})})
                    dispatch(supplyListFetchAction(filter))
                })
        },

        handleOpenDefectDialog: props => (id) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SUPPLY_DEFECT_DIALOG_OPEN]: id})})
        },

        handleCloseDefectDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SUPPLY_DEFECT_DIALOG_OPEN]: MINUS_ONE})})
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
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[SUPPLY_UPDATE_DIALOG_OPEN]: false}))
                    dispatch(supplyListFetchAction(filter))
                })
        },
        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.SUPPLY_LIST_URL, query: filter.getParam()})
        }
    }),

    withHandlers({
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
                    dispatch(supplyExpenseListFetchAction(id))
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
        defectData,
        detailLoading,
        createLoading,
        updateLoading,
        filter,
        layout,
        params,
        expenseRemoveId,

        supplyExpenseLoading,
        supplyExpenseList,
        supplyExpenseListLoading
    } = props

    const openFilterDialog = toBoolean(_.get(location, ['query', SUPPLY_FILTER_OPEN]))
    const openCreateDialog = toBoolean(_.get(location, ['query', SUPPLY_CREATE_DIALOG_OPEN]))
    const openDefectDialog = _.toInteger(_.get(location, ['query', 'openDefectDialog']) || MINUS_ONE) > MINUS_ONE
    const openUpdateDialog = toBoolean(_.get(location, ['query', SUPPLY_UPDATE_DIALOG_OPEN]))
    const openDeleteDialog = toBoolean(_.get(location, ['query', DELETE_DIALOG_OPEN]))
    const provider = _.toInteger(filter.getParam(SUPPLY_FILTER_KEY.PROVIDER))
    const stock = _.toInteger(filter.getParam(SUPPLY_FILTER_KEY.STOCK))
    const deliveryFromDate = filter.getParam(SUPPLY_FILTER_KEY.DELIVERY_FROM_DATE)
    const deliveryToDate = filter.getParam(SUPPLY_FILTER_KEY.DELIVERY_TO_DATE)
    const createdFromDate = filter.getParam(SUPPLY_FILTER_KEY.CREATED_FROM_DATE)
    const createdToDate = filter.getParam(SUPPLY_FILTER_KEY.CREATED_TO_DATE)
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

    const defectDialog = {
        openDefectDialog,
        handleOpenDefectDialog: props.handleOpenDefectDialog,
        handleCloseDefectDialog: props.handleCloseDefectDialog
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

    const confirmExpenseDialog = {
        removeId: expenseRemoveId,
        openConfirmExpenseDialog: (expenseRemoveId > ZERO),
        handleOpenConfirmExpenseDialog: props.handleOpenConfirmExpenseDialog,
        handleCloseConfirmExpenseDialog: props.handleCloseConfirmExpenseDialog,
        handleSendConfirmExpenseDialog: props.handleSendConfirmExpenseDialog
    }
    const forUpdateProducts = _.map(_.get(detail, 'products'), (item) => {
        return {
            amount: _.get(item, 'amount'),
            cost: _.get(item, 'cost'),
            product: {
                value: {
                    id: _.get(item, ['product', 'id']),
                    name: _.get(item, ['product', 'name']),
                    measurement: _.get(item, ['product', 'measurement'])
                }
            }

        }
    })
    const updateDialog = {
        initialValues: (() => {
            if (!detail || openCreateDialog) {
                return {}
            }
            return {
                provider: {
                    value: _.get(detail, ['provider', 'id'])
                },
                stock: {
                    value: _.get(detail, ['stock', 'id'])
                },
                currency: {
                    value: _.get(detail, ['currency', 'id'])
                },
                contact: {
                    value: _.get(detail, 'contact', 'name') + ' ' + _.get(detail, 'contact', 'phone') + ' ' + _.get(detail, 'contact', 'email')
                },
                date_delivery: moment(_.get(detail, ['dateDelivery'])).toDate(),
                products: forUpdateProducts,
                comment: _.get(detail, 'comment')
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
            dateDelivery: {
                fromDate: deliveryFromDate && moment(deliveryFromDate, 'YYYY-MM-DD'),
                toDate: deliveryToDate && moment(deliveryToDate, 'YYYY-MM-DD')
            },
            dateCreated: {
                fromDate: createdFromDate && moment(createdFromDate, 'YYYY-MM-DD'),
                toDate: createdToDate && moment(createdToDate, 'YYYY-MM-DD')
            }
        },
        filterLoading: false,
        openFilterDialog,
        handleOpenFilterDialog: props.handleOpenFilterDialog,
        handleCloseFilterDialog: props.handleCloseFilterDialog,
        handleClearFilterDialog: props.handleClearFilterDialog,
        handleSubmitFilterDialog: props.handleSubmitFilterDialog
    }

    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }
    const detailData = {
        id: detailId,
        data: detail,
        defect: defectData,
        detailLoading,
        handleCloseDetail: props.handleCloseDetail
    }

    // Supply Expense

    const supplyListData = {
        data: _.get(supplyExpenseList, 'results'),
        supplyExpenseListLoading,
        openSupplyExpenseConfirmDialog: props.openSupplyExpenseConfirmDialog,
        handleSupplyExpenseOpenConfirmDialog: props.handleSupplyExpenseOpenConfirmDialog,
        handleSupplyExpenseCloseConfirmDialog: props.handleSupplyExpenseCloseConfirmDialog
    }
    const openSupplyExpenseCreateDialog = toBoolean(_.get(location, ['query', SUPPLY_EXPENSE_CREATE_DIALOG_OPEN]))

    const supplyExpenseCreateDialog = {
        supplyExpenseLoading,
        openSupplyExpenseCreateDialog,
        handleSupplyExpenseOpenCreateDialog: props.handleSupplyExpenseOpenCreateDialog,
        handleSupplyExpenseCloseCreateDialog: props.handleSupplyExpenseCloseCreateDialog,
        handleSupplyExpenseSubmitCreateDialog: props.handleSupplyExpenseSubmitCreateDialog
    }

    return (
        <Layout {...layout}>
            <SupplyGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                createDialog={createDialog}
                defectDialog={defectDialog}
                deleteDialog={deleteDialog}
                confirmDialog={confirmDialog}
                confirmExpenseDialog={confirmExpenseDialog}
                updateDialog={updateDialog}
                actionsDialog={actionsDialog}
                filterDialog={filterDialog}

                supplyListData={supplyListData}
                supplyExpenseCreateDialog={supplyExpenseCreateDialog}
            />
        </Layout>
    )
})

export default SupplyList
