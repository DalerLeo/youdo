import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import {connect} from 'react-redux'
import {reset, change} from 'redux-form'
import {hashHistory} from 'react-router'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
import Layout from '../../components/Layout'
import * as ROUTER from '../../constants/routes'
import * as SUPPLY_TAB from '../../constants/supplyTab'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import numberWithoutSpaces from '../../helpers/numberWithoutSpaces'
import {DELETE_DIALOG_OPEN} from '../../components/DeleteDialog'
import {setItemAction} from '../../components/ReduxForm/Provider/ProviderSearchField'
import {
    SUPPLY_CREATE_DIALOG_OPEN,
    SUPPLY_UPDATE_DIALOG_OPEN,
    SUPPLY_FILTER_KEY,
    SUPPLY_FILTER_OPEN,
    SUPPLY_EXPENSE_CREATE_DIALOG_OPEN,
    SUPPLY_DEFECT_DIALOG_OPEN,
    SupplyGridList,
    TAB
} from '../../components/Supply'
import {
    supplyCreateAction,
    supplyUpdateAction,
    supplyListFetchAction,
    supplyDeleteAction,
    supplyItemFetchAction,
    supplyDefectAction,
    addProductsListAction,
    supplySyncAction
} from '../../actions/supply'
import {
    supplyExpenseCreateAction,
    supplyExpenseDeleteAction,
    supplyExpenseListFetchAction
} from '../../actions/supplyExpense'
import {
    supplyPaidListFetchAction
} from '../../actions/supplyPaid'
import {openErrorAction} from '../../actions/error'
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
        const paidList = _.get(state, ['supplyPaid', 'list', 'data'])
        const paidListLoading = _.get(state, ['supplyPaid', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'SupplyFilterForm'])
        const createForm = _.get(state, ['form', 'SupplyCreateForm'])
        const filter = filterHelper(list, pathname, query)
        const supplyExpenseLoading = _.get(state, ['supplyExpense', 'create', 'loading'])
        const createSupplyExpenseForm = _.get(state, ['form', 'SupplyExpenseCreateForm'])
        const supplyExpenseList = _.get(state, ['supplyExpense', 'list', 'data'])
        const supplyExpenseListLoading = _.get(state, ['supplyExpense', 'list', 'loading'])
        const addProductsForm = _.get(state, ['form', 'OrderAddProductsForm'])
        const addProducts = _.get(state, ['remainder', 'addProducts', 'data'])
        const addProductsLoading = _.get(state, ['remainder', 'addProducts', 'loading'])
        const filterProducts = filterHelper(addProducts, pathname, query, {'page': 'pdPage', 'pageSize': 'pdPageSize'})
        const filterItem = filterHelper(supplyExpenseList, pathname, query, {'page': 'dPage', 'pageSize': 'dPageSize'})

        return {
            list,
            listLoading,
            detail,
            defectData,
            detailLoading,
            createLoading,
            updateLoading,
            paidList,
            paidListLoading,
            filter,
            filterForm,
            createForm,
            supplyExpenseLoading,
            createSupplyExpenseForm,
            supplyExpenseList,
            supplyExpenseListLoading,
            filterItem,
            addProductsForm,
            addProducts,
            addProductsLoading,
            filterProducts
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
        return supplyId && (_.get(props, ['params', 'supplyId']) !== supplyId ||
            props.filterItem.filterRequest() !== nextProps.filterItem.filterRequest())
    }, ({dispatch, params}) => {
        const supplyId = _.toInteger(_.get(params, 'supplyId'))
        supplyId && dispatch(supplyItemFetchAction(supplyId))
    }),
    withPropsOnChange((props, nextProps) => {
        const prevSupplyId = _.get(props, ['params', 'supplyId'])
        const nextSupplyId = _.get(nextProps, ['params', 'supplyId'])
        const prevTab = _.get(props, ['location', 'query', 'tab'])
        const nextTab = _.get(nextProps, ['location', 'query', 'tab'])
        return prevSupplyId !== nextSupplyId || prevTab !== nextTab
    }, ({dispatch, params, location, filterItem}) => {
        const currentTab = _.get(location, ['query', TAB])
        const supplyId = _.toInteger(_.get(params, 'supplyId'))
        if (supplyId > ZERO && currentTab === SUPPLY_TAB.SUPPLY_TAB_EXPENSES) {
            supplyId && dispatch(supplyExpenseListFetchAction(supplyId, filterItem))
        } else if (supplyId > ZERO && currentTab === SUPPLY_TAB.SUPPLY_TAB_PAID) {
            supplyId && dispatch(supplyPaidListFetchAction(supplyId, filterItem))
        }
    }),

    withState('openConfirmDialog', 'setOpenConfirmDialog', false),
    withState('openSyncConfirmDialog', 'setOpenSyncConfirmDialog', false),
    withState('openConfirmExpenseDialog', 'setOpenConfirmExpenseDialog', false),
    withState('openSupplyExpenseConfirmDialog', 'setOpenSupplyExpenseConfirmDialog', false),
    withState('expenseRemoveId', 'setExpenseRemoveId', false),
    withState('openAddProductDialog', 'setOpenAddProductDialog', false),
    withState('openAddProductConfirm', 'setOpenAddProductConfirm', false),

    withPropsOnChange((props, nextProps) => {
        const except = {
            page: null,
            pageSize: null,
            contract: null,
            createdFromDate: null,
            createdToDate: null,
            deliveryFromDate: null,
            deliveryToDate: null,
            paymentType: null,
            openCreateDialog: null,
            openFilterDialog: null,
            product: null,
            provider: null,
            status: null,
            stock: null
        }
        const productType = _.get(props, ['addProductsForm', 'values', 'productType', 'value'])
        const productTypeNext = _.get(nextProps, ['addProductsForm', 'values', 'productType', 'value'])
        return ((props.filterProducts.filterRequest(except) !== nextProps.filterProducts.filterRequest(except)) ||
            (productType !== productTypeNext && nextProps.openAddProductDialog)) && !(props.openAddProductDialog !== nextProps.openAddProductDialog && nextProps.openAddProductDialog)
    }, ({setOpenAddProductConfirm, addProductsForm, openAddProductDialog, dispatch, filterProducts}) => {
        const products = _.filter(_.get(addProductsForm, ['values', 'product']), (item) => {
            const amount = _.toNumber(_.get(item, 'amount'))
            const price = _.toNumber(_.get(item, 'price'))
            return amount > ZERO && price > ZERO
        })
        const productType = _.get(addProductsForm, ['values', 'productType', 'value'])
        if (!_.isEmpty(products)) {
            setOpenAddProductConfirm(true)
        } else if (openAddProductDialog && _.isEmpty(products)) {
            setOpenAddProductConfirm(false)
            dispatch(addProductsListAction(filterProducts, productType))
        }
    }),

    withPropsOnChange((props, nextProps) => {
        return props.openAddProductDialog !== nextProps.openAddProductDialog && nextProps.openAddProductDialog
    }, ({dispatch, addProductsForm, openAddProductDialog, filterProducts, setOpenAddProductConfirm}) => {
        const productType = _.get(addProductsForm, ['values', 'productType', 'value'])
        if (openAddProductDialog) {
            setOpenAddProductConfirm(false)
            dispatch(addProductsListAction(filterProducts, productType))
        }
    }),

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
            const {dispatch, params, setOpenConfirmDialog, filter} = props
            const detailId = _.toInteger(_.get(params, 'supplyId'))
            dispatch(supplyDeleteAction(detailId))
                .then(() => {
                    setOpenConfirmDialog(false)
                    dispatch(openSnackbarAction({message: 'Успешно отменено'}))
                    return dispatch(supplyItemFetchAction(detailId))
                })
                .then(() => {
                    return dispatch(supplyListFetchAction(filter))
                })
                .catch(() => {
                    dispatch(openErrorAction({
                        message: 'Поставка не может быть отменена из за связки к доп расходу или к чему нибудь другому'
                    }))
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
            const {dispatch, setExpenseRemoveId, expenseRemoveId, detail, filterItem} = props
            const id = _.get(detail, 'id')
            dispatch(supplyExpenseDeleteAction(expenseRemoveId))
                .then(() => {
                    setExpenseRemoveId(false)
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .then(() => {
                    dispatch(supplyItemFetchAction(id))
                    return dispatch(supplyExpenseListFetchAction(id, filterItem))
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
            const product = _.get(filterForm, ['values', 'product', 'value']) || null
            const stock = _.get(filterForm, ['values', 'stock', 'value']) || null
            const status = _.get(filterForm, ['values', 'status', 'value']) || null
            const paymentType = _.get(filterForm, ['values', 'paymentType', 'value']) || null
            const contract = _.get(filterForm, ['values', 'contract']) || null

            filter.filterBy({
                [SUPPLY_FILTER_OPEN]: false,
                [SUPPLY_FILTER_KEY.PROVIDER]: provider,
                [SUPPLY_FILTER_KEY.PRODUCT]: product,
                [SUPPLY_FILTER_KEY.STOCK]: stock,
                [SUPPLY_FILTER_KEY.STATUS]: status,
                [SUPPLY_FILTER_KEY.PAYMENT_TYPE]: paymentType,
                [SUPPLY_FILTER_KEY.CONTRACT]: contract,
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
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
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
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },
        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.SUPPLY_LIST_URL, query: filter.getParams()})
        },
        handleTabChange: props => (tab) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname: pathname,
                query: filter.getParams({[TAB]: tab})
            })
        }
    }),

    withHandlers({
        handleSupplyExpenseOpenCreateDialog: props => () => {
            const {location: {pathname}, filter, dispatch} = props
            hashHistory.push({pathname, query: filter.getParams({[SUPPLY_EXPENSE_CREATE_DIALOG_OPEN]: true})})
            dispatch(reset('SupplyExpenseCreateForm'))
        },

        handleSupplyExpenseCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SUPPLY_EXPENSE_CREATE_DIALOG_OPEN]: false})})
        },
        handleSupplyExpenseSubmitCreateDialog: props => () => {
            const {dispatch, createSupplyExpenseForm, filter, location: {pathname}} = props
            const id = _.toInteger(_.get(props, ['params', 'supplyId']))

            return dispatch(supplyExpenseCreateAction(_.get(createSupplyExpenseForm, ['values']), id))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Расход добавлен'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[SUPPLY_EXPENSE_CREATE_DIALOG_OPEN]: false})})
                    dispatch(supplyItemFetchAction(id))
                    return dispatch(supplyExpenseListFetchAction(id, filter))
                })
        },

        handleOpenAddProduct: props => () => {
            const {setOpenAddProductDialog, filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({'pdPageSize': 25})})
            setOpenAddProductDialog(true)
        },

        handleCloseAddProduct: props => () => {
            const {setOpenAddProductDialog, filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({'pdPage': null, 'pdPageSize': null, 'pdSearch': null})})
            setOpenAddProductDialog(false)
        },

        handleSubmitAddProduct: props => () => {
            const {setOpenAddProductDialog, addProductsForm, addProducts, dispatch, createForm, filter, location: {pathname}} = props
            const existingProducts = _.get(createForm, ['values', 'products']) || []
            const values = _.get(addProductsForm, ['values', 'product'])
            const getProductData = (id) => {
                return _.find(_.get(addProducts, 'results'), {'id': id})
            }
            const newProductsArray = []
            _.map(values, (item, index) => {
                const id = _.toInteger(index)
                const product = getProductData(id)
                const amount = _.get(item, 'amount')
                const price = _.get(item, 'price')
                if (amount && price) {
                    newProductsArray.push({
                        amount: _.get(item, 'amount'),
                        cost: numberWithoutSpaces(_.get(item, 'price')),
                        product: {
                            id: id,
                            value: {
                                id: _.get(product, 'id'),
                                name: _.get(product, 'title'),
                                measurement: {
                                    id: _.get(product, ['measurement', 'id']),
                                    name: _.get(product, ['measurement', 'name'])
                                }
                            }
                        }
                    })
                }
            })
            const checkDifference = _.differenceBy(existingProducts, newProductsArray, (o) => {
                return o.product.value.id
            })
            dispatch(change('SupplyCreateForm', 'products', _.concat(newProductsArray, checkDifference)))
            hashHistory.push({pathname, query: filter.getParams({'pdPage': null, 'pdPageSize': null, 'pdSearch': null})})
            setOpenAddProductDialog(false)
        },

        handleCloseAddProductConfirm: props => () => {
            const {dispatch, addProductsForm, filterProducts, setOpenAddProductConfirm} = props
            const productType = _.get(addProductsForm, ['values', 'productType', 'value'])
            dispatch(addProductsListAction(filterProducts, productType))
            setOpenAddProductConfirm(false)
        },

        handleSubmitAddProductConfirm: props => () => {
            const {addProductsForm, addProducts, dispatch, createForm, filterProducts, setOpenAddProductConfirm} = props
            const productType = _.get(addProductsForm, ['values', 'productType', 'value'])
            const existingProducts = _.get(createForm, ['values', 'products']) || []
            const values = _.get(addProductsForm, ['values', 'product'])
            const getProductData = (id) => {
                return _.find(_.get(addProducts, 'results'), {'id': id})
            }
            const newProductsArray = []
            _.map(values, (item, index) => {
                const id = _.toInteger(index)
                const product = getProductData(id)
                const amount = _.get(item, 'amount')
                const price = _.get(item, 'price')
                if (amount && price) {
                    newProductsArray.push({
                        amount: _.get(item, 'amount'),
                        cost: numberWithoutSpaces(_.get(item, 'price')),
                        product: {
                            id: id,
                            value: {
                                id: _.get(product, 'id'),
                                name: _.get(product, 'title'),
                                measurement: {
                                    id: _.get(product, ['measurement', 'id']),
                                    name: _.get(product, ['measurement', 'name'])
                                }
                            }
                        }
                    })
                }
            })
            const checkDifference = _.differenceBy(existingProducts, newProductsArray, (o) => {
                return o.product.value.id
            })
            dispatch(change('SupplyCreateForm', 'products', _.concat(newProductsArray, checkDifference)))
            dispatch(addProductsListAction(filterProducts, productType))
            setOpenAddProductConfirm(false)
        },
        handleOpenSyncConfirmDialog: props => () => {
            const {setOpenSyncConfirmDialog} = props
            setOpenSyncConfirmDialog(true)
        },
        handleCloseSyncConfirmDialog: props => () => {
            const {setOpenSyncConfirmDialog} = props
            setOpenSyncConfirmDialog(false)
        },
        handleSubmitSyncConfirmDialog: props => () => {
            const {setOpenSyncConfirmDialog, params, dispatch} = props
            const id = _.get(params, 'supplyId')
            return dispatch(supplySyncAction(Number(id)))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Cинхронизирован'}))
                })
                .then(() => {
                 return dispatch(supplyItemFetchAction(id))
                })
                .then(() => {
                    setOpenSyncConfirmDialog(false)
                })
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Ошибка'}))
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
        paidList,
        paidListLoading,
        filter,
        layout,
        params,
        expenseRemoveId,
        filterItem,
        supplyExpenseLoading,
        supplyExpenseList,
        supplyExpenseListLoading,
        addProducts,
        addProductsLoading,
        filterProducts,
        openAddProductDialog,
        openAddProductConfirm,
        openSyncConfirmDialog
    } = props

    const openFilterDialog = toBoolean(_.get(location, ['query', SUPPLY_FILTER_OPEN]))
    const openCreateDialog = toBoolean(_.get(location, ['query', SUPPLY_CREATE_DIALOG_OPEN]))
    const openDefectDialog = _.toInteger(_.get(location, ['query', 'openDefectDialog']) || MINUS_ONE) > MINUS_ONE
    const openUpdateDialog = toBoolean(_.get(location, ['query', SUPPLY_UPDATE_DIALOG_OPEN]))
    const openDeleteDialog = toBoolean(_.get(location, ['query', DELETE_DIALOG_OPEN]))
    const provider = _.toInteger(filter.getParam(SUPPLY_FILTER_KEY.PROVIDER))
    const stock = _.toInteger(filter.getParam(SUPPLY_FILTER_KEY.STOCK))
    const status = _.toInteger(filter.getParam(SUPPLY_FILTER_KEY.STATUS))
    const contract = filter.getParam(SUPPLY_FILTER_KEY.CONTRACT)
    const deliveryFromDate = filter.getParam(SUPPLY_FILTER_KEY.DELIVERY_FROM_DATE)
    const deliveryToDate = filter.getParam(SUPPLY_FILTER_KEY.DELIVERY_TO_DATE)
    const createdFromDate = filter.getParam(SUPPLY_FILTER_KEY.CREATED_FROM_DATE)
    const createdToDate = filter.getParam(SUPPLY_FILTER_KEY.CREATED_TO_DATE)
    const detailId = _.toInteger(_.get(params, 'supplyId'))
    const tab = _.get(location, ['query', TAB]) || SUPPLY_TAB.SUPPLY_DEFAULT_TAB

    const addProductDialog = {
        openAddProductDialog,
        filter: filterProducts,
        data: _.get(addProducts, 'results'),
        loading: addProductsLoading,
        handleOpenAddProduct: props.handleOpenAddProduct,
        handleCloseAddProduct: props.handleCloseAddProduct,
        handleSubmitAddProduct: props.handleSubmitAddProduct,
        openAddProductConfirm,
        handleCloseAddProductConfirm: props.handleCloseAddProductConfirm,
        handleSubmitAddProductConfirm: props.handleSubmitAddProductConfirm
    }

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
    const confirmSyncDialog = {
        openSyncConfirmDialog,
        handleOpenConfirmDialog: props.handleOpenSyncConfirmDialog,
        handleCloseConfirmDialog: props.handleCloseSyncConfirmDialog,
        handleSubmitConfirmDialog: props.handleSubmitSyncConfirmDialog
    }

    const confirmExpenseDialog = {
        removeId: expenseRemoveId,
        openConfirmExpenseDialog: (expenseRemoveId > ZERO),
        handleOpenConfirmExpenseDialog: props.handleOpenConfirmExpenseDialog,
        handleCloseConfirmExpenseDialog: props.handleCloseConfirmExpenseDialog,
        handleSendConfirmExpenseDialog: props.handleSendConfirmExpenseDialog
    }
    const forUpdateProducts = _.map(_.get(detail, 'products'), (item) => {
        const amount = _.toNumber(_.get(item, 'amount'))
        const cost = _.toNumber(_.get(item, 'cost'))
        const summary = cost / amount
        return {
            amount: amount,
            id: _.get(item, 'id'),
            cost: summary,
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
                contract: _.get(detail, 'contract'),
                stock: {
                    value: _.get(detail, ['stock', 'id'])
                },
                paymentType: {
                    value: _.get(detail, ['paymentType'])
                },
                currency: {
                    value: _.get(detail, ['currency', 'id'])
                },
                contact: _.get(detail, ['contact', 'id']),
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
            status: {
                value: status
            },
            contract: contract,
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
    const paidData = {
        data: _.get(paidList, 'results'),
        loading: paidListLoading
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
    const tabData = {
        tab,
        handleTabChange: props.handleTabChange
    }
    return (
        <Layout {...layout}>
            <SupplyGridList
                tabData={tabData}
                filter={filter}
                filterItem={filterItem}
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
                paidData={paidData}
                supplyListData={supplyListData}
                detailId={detailId}
                supplyExpenseCreateDialog={supplyExpenseCreateDialog}
                addProductDialog={addProductDialog}
                confirmSyncDialog={confirmSyncDialog}
            />
        </Layout>
    )
})

export default SupplyList
