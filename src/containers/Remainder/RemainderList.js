import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import {reset, change} from 'redux-form'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers, withState} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import {splitToArray, joinArray} from '../../helpers/joinSplitValues'
import toBoolean from '../../helpers/toBoolean'
import sprintf from 'sprintf'
import {openSnackbarAction} from '../../actions/snackbar'
import {openErrorAction} from '../../actions/error'
import {
    RemainderGridList,
    REMAINDER_TRANSFER_DIALOG_OPEN,
    REMAINDER_FILTER_OPEN,
    REMAINDER_FILTER_KEY,
    REMAINDER_DISCARD_DIALOG_OPEN,
    REMAINDER_RESERVED_DIALOG_OPEN
} from '../../components/Remainder'
import {
    remainderListFetchAction,
    remainderItemFetchAction,
    remainderTransferAction,
    remainderDiscardAction,
    remainderReversedListFetchAction,
    addProductsListAction
} from '../../actions/remainder'

const ZERO = 0
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['remainder', 'item', 'data'])
        const detailLoading = _.get(state, ['remainder', 'item', 'loading'])
        const list = _.get(state, ['remainder', 'list', 'data'])
        const listLoading = _.get(state, ['remainder', 'list', 'loading'])
        const inventoryList = _.get(state, ['remainder', 'inventory', 'data', 'results'])
        const inventoryListLoading = _.get(state, ['remainder', 'inventory', 'loading'])
        const reserved = _.get(state, ['remainder', 'reserved', 'data'])
        const reservedLoading = _.get(state, ['remainder', 'reserved', 'loading'])
        const filterForm = _.get(state, ['form', 'RemainderFilterForm'])
        const searchForm = _.get(state, ['form', 'RemainderSearchForm'])
        const transferForm = _.get(state, ['form', 'RemainderTransferForm'])
        const discardForm = _.get(state, ['form', 'RemainderDiscardForm'])
        const inventoryForm = _.get(state, ['form', 'RemainderInventoryForm'])
        const addProducts = _.get(state, ['remainder', 'addProducts', 'data'])
        const addProductsLoading = _.get(state, ['remainder', 'addProducts', 'loading'])
        const addProductsForm = _.get(state, ['form', 'RemainderAddProductsForm'])
        const filterProducts = filterHelper(addProducts, pathname, query, {'page': 'pdPage', 'pageSize': 'pdPageSize'})
        const filter = filterHelper(list, pathname, query)
        const filterItem = filterHelper(detail, pathname, query, {'page': 'dPage', 'pageSize': 'dPageSize'})
        const dialogFilter = filterHelper(reserved, pathname, query, {'page': 'dPage', 'pageSize': 'dPageSize'})

        return {
            list,
            listLoading,
            detail,
            detailLoading,
            filter,
            filterForm,
            transferForm,
            discardForm,
            searchForm,
            inventoryForm,
            filterItem,
            reserved,
            reservedLoading,
            dialogFilter,
            filterProducts,
            addProducts,
            addProductsLoading,
            addProductsForm,
            inventoryList,
            inventoryListLoading
        }
    }),
    withState('openAddProductDialog', 'setOpenAddProductDialog', false),
    withState('openAddProductConfirm', 'setOpenAddProductConfirm', false),
    withState('stockChooseDialog', 'setStockChooseDialog', true),
    withPropsOnChange((props, nextProps) => {
        const except = {
            openDiscardDialog: null,
            openInventoryDialog: null,
            dPage: null,
            pdPage: null,
            pdPageSize: null,
            pdSearch: null,
            pdStock: null
        }
        return props.list && props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
    }, ({dispatch, filter}) => {
        dispatch(remainderListFetchAction(filter))
    }),
    withPropsOnChange((props, nextProps) => {
        const remainderId = _.get(nextProps, ['params', 'remainderId'])
        return (remainderId && _.get(props, ['params', 'remainderId']) !== remainderId) ||
            (props.filterItem.filterRequest() !== nextProps.filterItem.filterRequest())
    }, ({dispatch, params, filter}) => {
        const remainderId = _.toInteger(_.get(params, 'remainderId'))
        if (remainderId) {
            dispatch(remainderItemFetchAction(remainderId, filter))
        }
    }),
    withPropsOnChange((props, nextProps) => {
        const nextDialog = toBoolean(_.get(nextProps, ['location', 'query', REMAINDER_RESERVED_DIALOG_OPEN]))
        const prevDialog = toBoolean(_.get(props, ['location', 'query', REMAINDER_RESERVED_DIALOG_OPEN]))
        const prevPage = _.get(props, ['location', 'query', 'dPage'])
        const nextPage = _.get(nextProps, ['location', 'query', 'dPage'])
        return (prevDialog !== nextDialog && nextDialog !== false) ||
            (prevPage !== nextPage)
    }, ({dispatch, location}) => {
        const product = _.toInteger(_.get(location, ['query', REMAINDER_RESERVED_DIALOG_OPEN]))
        const stock = _.get(location, ['query', REMAINDER_FILTER_KEY.STOCK])
        const page = _.get(location, ['query', 'dPage'])
        if (product > ZERO) {
            dispatch(remainderReversedListFetchAction(product, page, stock))
        }
    }),
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
            const defect = _.toNumber(_.get(item, 'defect'))
            return amount > ZERO && defect > ZERO
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
    }, ({dispatch, addProductsForm, openAddProductDialog, filterProducts, setOpenAddProductConfirm, transferForm, discardForm, location}) => {
        const productType = _.get(addProductsForm, ['values', 'productType', 'value'])
        const stock = toBoolean(_.get(location, ['query', REMAINDER_TRANSFER_DIALOG_OPEN]))
            ? _.get(transferForm, ['values', 'fromStock', 'value'])
            : _.get(discardForm, ['values', 'fromStock', 'value'])
        if (openAddProductDialog) {
            setOpenAddProductConfirm(false)
            dispatch(addProductsListAction(filterProducts, productType, stock))
        }
    }),

    withHandlers({
        handleOpenRemainderReservedDialog: props => (id) => {
            const {filter, location: {pathname}, dispatch} = props
            hashHistory.push({pathname, query: filter.getParams({[REMAINDER_RESERVED_DIALOG_OPEN]: id})})
            return dispatch(remainderReversedListFetchAction(id))
        },

        handleCloseRemainderReservedDialog: props => () => {
            const {filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({[REMAINDER_RESERVED_DIALOG_OPEN]: false})})
        },
        handleOpenFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[REMAINDER_FILTER_OPEN]: true})})
        },
        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[REMAINDER_FILTER_OPEN]: false})})
        },
        handleClearFilterDialog: props => () => {
            const {location: {pathname}} = props
            hashHistory.push({pathname, query: {}})
        },
        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const stock = _.get(filterForm, ['values', 'stock']) || null
            const typeParent = _.get(filterForm, ['values', 'typeParent', 'value']) || null
            const typeChild = _.get(filterForm, ['values', 'typeChild', 'value']) || null
            const measurement = _.get(filterForm, ['values', 'measurement']) || null
            filter.filterBy({
                [REMAINDER_FILTER_OPEN]: false,
                [REMAINDER_FILTER_KEY.STOCK]: joinArray(stock),
                [REMAINDER_FILTER_KEY.TYPE_PARENT]: typeParent,
                [REMAINDER_FILTER_KEY.TYPE_CHILD]: typeChild,
                [REMAINDER_FILTER_KEY.MEASUREMENT]: joinArray(measurement)
            })
        },
        handleSubmitSearch: props => () => {
            const {filter, searchForm} = props
            const search = _.get(searchForm, ['values', 'search']) || null
            filter.filterBy({
                'search': search
            })
        },
        handleOpenTransferDialog: props => () => {
            const {location: {pathname}, filter, dispatch} = props
            dispatch(reset('RemainderTransferForm'))
            hashHistory.push({pathname, query: filter.getParams({[REMAINDER_TRANSFER_DIALOG_OPEN]: true})})
        },
        handleCloseTransferDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[REMAINDER_TRANSFER_DIALOG_OPEN]: false})})
        },
        handleSubmitTransferDialog: props => () => {
            const {location: {pathname}, dispatch, transferForm, filter} = props
            return dispatch(remainderTransferAction(_.get(transferForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно отправлено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[REMAINDER_TRANSFER_DIALOG_OPEN]: false})})
                    dispatch(remainderListFetchAction(filter))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },
        handleOpenDiscardDialog: props => () => {
            const {location: {pathname}, filter, dispatch} = props
            dispatch(reset('RemainderDiscardForm'))
            hashHistory.push({pathname, query: filter.getParams({[REMAINDER_DISCARD_DIALOG_OPEN]: true})})
        },
        handleCloseDiscardDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[REMAINDER_DISCARD_DIALOG_OPEN]: false})})
        },
        handleSubmitDiscardDialog: props => () => {
            const {location: {pathname}, dispatch, discardForm, filter} = props
            return dispatch(remainderDiscardAction(_.get(discardForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно списано'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[REMAINDER_DISCARD_DIALOG_OPEN]: false})})
                    dispatch(remainderListFetchAction(filter))
                }).catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },
        handleResetFilter: props => () => {
            const {dispatch, location: {pathname}} = props
            dispatch(reset('RemainderFilterForm'))
            hashHistory.push({pathname})
        },
        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.REMAINDER_LIST_URL, query: filter.getParams()})
        },
        handleOpenDetail: props => (id) => {
            const {filter} = props
            hashHistory.push({pathname: sprintf(ROUTER.REMAINDER_ITEM_PATH, id), query: filter.getParams()})
        },
        handleOpenAddProduct: props => (type) => {
            const {setOpenAddProductDialog, filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({'pdPageSize': 25, 'dialogType': type})})
            setOpenAddProductDialog(true)
        },

        handleCloseAddProduct: props => () => {
            const {setOpenAddProductDialog, filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({'pdPage': null, 'pdPageSize': null, 'pdSearch': null})})
            setOpenAddProductDialog(false)
        },

        handleSubmitAddProduct: props => () => {
            const {setOpenAddProductDialog, addProductsForm, addProducts, dispatch, transferForm, discardForm, filter, location: {pathname}} = props
            const dialog = _.get(props, ['location', 'query', 'dialogType'])
            const productsDiscart = _.get(discardForm, ['values', 'products'])
            const productsTransfer = _.get(transferForm, ['values', 'products'])
            const existingProducts = dialog === 'discard' ? productsDiscart : productsTransfer
            const values = _.get(addProductsForm, ['values', 'product'])
            const getProductData = (id) => {
                return _.find(_.get(addProducts, 'results'), {'id': id})
            }
            const newProductsArray = []
            _.map(values, (item, index) => {
                const id = _.toInteger(index)
                const product = getProductData(id)
                const amount = _.get(item, 'amount')
                const defect = _.get(item, 'defect')
                if (amount || defect) {
                    newProductsArray.push({
                        amount: _.get(item, 'amount'),
                        defect: _.get(item, 'defect'),
                        product: {
                            value: {
                                id: _.get(product, 'id'),
                                name: _.get(product, 'title'),
                                balance: _.get(product, 'balance'),
                                measurement: _.get(product, 'measurement')
                            }
                        }
                    })
                }
            })
            const checkDifference = _.differenceBy(existingProducts, newProductsArray, (o) => {
                return o.product.value.id
            })
            if (dialog === 'discard') {
                dispatch(change('RemainderDiscardForm', 'products', _.concat(newProductsArray, checkDifference)))
            } else {
                dispatch(change('RemainderTransferForm', 'products', _.concat(newProductsArray, checkDifference)))
            }

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
            const {addProductsForm, addProducts, dispatch, discardForm, transferForm, filterProducts, setOpenAddProductConfirm} = props
            const productType = _.get(addProductsForm, ['values', 'productType', 'value'])
            const dialog = _.get(props, ['location', 'query', 'dialogType'])
            const productsDiscart = _.get(discardForm, ['values', 'products'])
            const productsTransfer = _.get(transferForm, ['values', 'products'])
            const existingProducts = dialog === 'discard' ? productsDiscart : productsTransfer
            const values = _.get(addProductsForm, ['values', 'product'])
            const getProductData = (id) => {
                return _.find(_.get(addProducts, 'results'), {'id': id})
            }
            const newProductsArray = []
            _.map(values, (item, index) => {
                const id = _.toInteger(index)
                const product = getProductData(id)
                const amount = _.get(item, 'amount')
                const defect = _.get(item, 'defect')
                if (amount || defect) {
                    newProductsArray.push({
                        amount: _.get(item, 'amount'),
                        defect: _.get(item, 'defect'),
                        product: {
                            value: {
                                id: _.get(product, 'id'),
                                name: _.get(product, 'name'),
                                balance: _.get(product, 'balance'),
                                measurement: _.get(product, 'measurement')
                            }
                        }
                    })
                }
            })
            const checkDifference = _.differenceBy(existingProducts, newProductsArray, (o) => {
                return o.product.value.id
            })
            if (dialog === 'discard') {
                dispatch(change('RemainderDiscardForm', 'products', _.concat(newProductsArray, checkDifference)))
            } else {
                dispatch(change('RemainderTransferForm', 'products', _.concat(newProductsArray, checkDifference)))
            }
            dispatch(addProductsListAction(filterProducts, productType))
            setOpenAddProductConfirm(false)
        }
    })
)

const RemainderList = enhance((props) => {
    const {
        location,
        list,
        listLoading,
        detail,
        detailLoading,
        filter,
        layout,
        params,
        filterItem,
        reserved,
        reservedLoading,
        dialogFilter,
        filterProducts,
        openAddProductDialog,
        addProducts,
        addProductsLoading,
        openAddProductConfirm
    } = props

    const stock = (filter.getParam(REMAINDER_FILTER_KEY.STOCK))
    const measurement = (filter.getParam(REMAINDER_FILTER_KEY.MEASUREMENT))
    const typeParent = _.toInteger(filter.getParam(REMAINDER_FILTER_KEY.TYPE_PARENT))
    const typeChild = _.toInteger(filter.getParam(REMAINDER_FILTER_KEY.TYPE_CHILD))
    const openFilterDialog = toBoolean(_.get(location, ['query', REMAINDER_FILTER_OPEN]))
    const openTransferDialog = toBoolean(_.get(location, ['query', REMAINDER_TRANSFER_DIALOG_OPEN]))
    const openReversedDialog = _.toNumber(_.get(location, ['query', REMAINDER_RESERVED_DIALOG_OPEN]))
    const openDiscardDialog = toBoolean(_.get(location, ['query', REMAINDER_DISCARD_DIALOG_OPEN]))
    const detailId = _.toInteger(_.get(params, 'remainderId'))

    const reservedDetail = _.filter(_.get(list, 'results'), (item) => {
        return _.get(item, 'id') === openReversedDialog
    })
    const reservedDialog = {
        reservedDetail,
        data: _.get(reserved, 'results'),
        loading: reservedLoading,
        dialogFilter,
        openReversedDialog,
        handleCloseRemainderReservedDialog: props.handleCloseRemainderReservedDialog,
        handleOpenRemainderReservedDialog: props.handleOpenRemainderReservedDialog
    }

    const filterDialog = {
        initialValues: {
            stock: stock && splitToArray(stock),
            measurement: measurement && splitToArray(measurement),
            typeParent: {value: typeParent},
            typeChild: {value: typeChild}
        },
        openFilterDialog: openFilterDialog,
        handleOpenFilterDialog: props.handleOpenFilterDialog,
        handleCloseFilterDialog: props.handleCloseFilterDialog,
        handleSubmitFilterDialog: props.handleSubmitFilterDialog,
        handleClearFilterDialog: props.handleClearFilterDialog
    }

    const discardDialog = {
        openDiscardDialog,
        handleOpenDiscardDialog: props.handleOpenDiscardDialog,
        handleCloseDiscardDialog: props.handleCloseDiscardDialog,
        handleSubmitDiscardDialog: props.handleSubmitDiscardDialog
    }
    const transferDialog = {
        openTransferDialog,
        handleOpenTransferDialog: props.handleOpenTransferDialog,
        handleCloseTransferDialog: props.handleCloseTransferDialog,
        handleSubmitTransferDialog: props.handleSubmitTransferDialog
    }
    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }
    const currentRow = _.filter(_.get(list, 'results'), (item) => {
        return _.get(item, 'id') === detailId
    })

    const detailData = {
        id: detailId,
        data: detail,
        detailLoading,
        currentRow
    }
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

    return (
        <Layout {...layout}>
            <RemainderGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                filterDialog={filterDialog}
                handleCloseDetail={props.handleCloseDetail}
                handleOpenDetail={props.handleOpenDetail}
                transferDialog={transferDialog}
                resetFilter={props.handleResetFilter}
                discardDialog={discardDialog}
                searchSubmit={props.handleSubmitSearch}
                filterItem={filterItem}
                reservedDialog={reservedDialog}
                addProductDialog={addProductDialog}
            />
        </Layout>
    )
})

export default RemainderList
