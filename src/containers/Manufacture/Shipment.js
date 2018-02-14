import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import moment from 'moment'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import {change, reset} from 'redux-form'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers, withState} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import {splitToArray, joinArray} from '../../helpers/joinSplitValues'
import toBoolean from '../../helpers/toBoolean'
import t from '../../helpers/translate'
import {
    ManufactureShipmentWrapper,
    OPEN_FILTER,
    OPEN_ADD_PRODUCT_MATERIAL_DIALOG,
    TYPE_PRODUCT,
    TYPE_RAW
} from '../../components/Manufacture'
import * as SHIPMENT_TAB from '../../constants/manufactureShipmentTab'
import {MANUF_ACTIVITY_FILTER_KEY} from '../../components/Manufacture/ManufactureActivityFilterDialog'
import {
    shipmentListFetchAction,
    shipmentItemFetchAction,
    shipmentLogsListFetchAction,
    shipmentProductsListFetchAction,
    shipmentMaterialsListFetchAction,
    addProductsListAction,
    addRawsListAction,
    addProductsSubmitAction,
    addRawsSubmitAction,
    editReturnAmountAction,
    editWriteOffAmountAction
} from '../../actions/manufactureShipment'
import {openSnackbarAction} from '../../actions/snackbar'
import {openErrorAction} from '../../actions/error'
import ManufactureWrapper from './Wrapper'

const TAB = 'tab'
const MINUS_ONE = -1
const ZERO = 0
const defaultDate = moment().format('YYYY-MM-DD')
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const list = _.get(state, ['manufacture', 'list', 'data'])
        const listLoading = _.get(state, ['manufacture', 'list', 'loading'])
        const filter = filterHelper(list, pathname, query)
        const shipmentList = _.get(state, ['shipment', 'list', 'data'])
        const shipmentListLoading = _.get(state, ['shipment', 'list', 'loading'])
        const shipmentDetail = _.get(state, ['shipment', 'item', 'data'])
        const shipmentDetailLoading = _.get(state, ['shipment', 'item', 'loading'])
        const shipmentLogs = _.get(state, ['shipment', 'logs', 'data'])
        const shipmentLogsLoading = _.get(state, ['shipment', 'logs', 'loading'])
        const shipmentProducts = _.get(state, ['shipment', 'products', 'data'])
        const shipmentProductsLoading = _.get(state, ['shipment', 'products', 'loading'])
        const shipmentMaterials = _.get(state, ['shipment', 'materials', 'data'])
        const shipmentMaterialsLoading = _.get(state, ['shipment', 'materials', 'loading'])
        const addProductsMaterialsList = _.get(query, OPEN_ADD_PRODUCT_MATERIAL_DIALOG) === TYPE_PRODUCT
            ? _.get(state, ['shipment', 'addProducts', 'data'])
            : _.get(state, ['shipment', 'addRaws', 'data'])
        const addProductsMaterialsLoading = _.get(query, OPEN_ADD_PRODUCT_MATERIAL_DIALOG) === TYPE_PRODUCT
            ? _.get(state, ['shipment', 'addProducts', 'loading'])
            : _.get(state, ['shipment', 'addRaws', 'loading'])
        const filterShipment = filterHelper(shipmentList, pathname, query)
        const filterProducts = filterHelper(addProductsMaterialsList, pathname, query, {page: 'pdPage', pageSize: 'pdPageSize'})
        const filterLogs = filterHelper(shipmentLogs, pathname, query, {page: 'logsPage', pageSize: 'logsPageSize'})
        const beginDate = _.get(query, 'beginDate') || defaultDate
        const endDate = _.get(query, 'endDate') || defaultDate
        const filterForm = _.get(state, ['form', 'ManufactureActivityFilterForm'])
        const productMaterialForm = _.get(state, ['form', 'ManufactureProductMaterialForm'])
        const addProductsForm = _.get(state, ['form', 'ShipmentAddProductsForm'])
        const LogEditForm = _.get(state, ['form', 'LogEditForm'])

        return {
            query,
            pathname,
            list,
            filter,
            filterLogs,
            listLoading,
            shipmentList,
            shipmentListLoading,
            shipmentDetail,
            shipmentDetailLoading,
            shipmentProducts,
            shipmentProductsLoading,
            shipmentMaterials,
            shipmentMaterialsLoading,
            shipmentLogs,
            shipmentLogsLoading,
            filterShipment,
            beginDate,
            endDate,
            filterForm,
            productMaterialForm,
            addProductsMaterialsList,
            addProductsMaterialsLoading,
            filterProducts,
            addProductsForm,
            LogEditForm
        }
    }),

    // REVIEW LIST
    withPropsOnChange((props, nextProps) => {
        const beginDate = _.get(props, 'beginDate')
        const endDate = _.get(props, 'endDate')
        const nextBeginDate = _.get(nextProps, 'beginDate')
        const nextEndDate = _.get(nextProps, 'endDate')
        const manufacture = _.toInteger(_.get(props, ['params', 'manufactureId']))
        const nextManufacture = _.toInteger(_.get(nextProps, ['params', 'manufactureId']))
        return (beginDate !== nextBeginDate) || (endDate !== nextEndDate) || (manufacture !== nextManufacture)
    }, ({dispatch, beginDate, endDate, params}) => {
        const manufactureId = _.toInteger(_.get(params, 'manufactureId'))
        const dateRange = {
            beginDate,
            endDate
        }
        dispatch(shipmentProductsListFetchAction(dateRange, manufactureId))
        dispatch(shipmentMaterialsListFetchAction(dateRange, manufactureId))
    }),

    // LOGS LIST
    withPropsOnChange((props, nextProps) => {
        const except = {
            page: null,
            pageSize: null,
            openFilter: null,
            openProductMaterialDialog: null,
            pdPage: null,
            pdPageSize: null,
            pdSearch: null,
            openId: null,
            openType: null
        }
        const manufacture = _.toInteger(_.get(props, ['params', 'manufactureId']))
        const nextManufacture = _.toInteger(_.get(nextProps, ['params', 'manufactureId']))
        return (props.filterLogs.filterRequest(except) !== nextProps.filterLogs.filterRequest(except) && nextManufacture > ZERO) ||
            (manufacture !== nextManufacture && nextManufacture)
    }, ({dispatch, filterLogs, params, beginDate, endDate}) => {
        const manufactureId = _.toInteger(_.get(params, 'manufactureId'))
        const dateRange = {
            beginDate,
            endDate
        }
        dispatch(shipmentLogsListFetchAction(filterLogs, manufactureId, dateRange))
    }),

    // SHIFTS LIST
    withPropsOnChange((props, nextProps) => {
        const except = {
            openFilter: null,
            logsPage: null,
            logsPageSize: null,
            openProductMaterialDialog: null,
            pdPage: null,
            pdPageSize: null,
            pdSearch: null,
            openId: null,
            openType: null
        }
        const manufactureId = _.get(props, ['params', 'manufactureId'])
        const nextManufactureId = _.get(nextProps, ['params', 'manufactureId'])
        return (props.filterShipment.filterRequest(except) !== nextProps.filterShipment.filterRequest(except) && nextManufactureId > ZERO) ||
            (manufactureId !== nextManufactureId && nextManufactureId)
    }, ({dispatch, filterShipment, params, beginDate, endDate}) => {
        const dateRange = {
            beginDate,
            endDate
        }
        const manufactureId = _.toInteger(_.get(params, 'manufactureId'))
        if (manufactureId > ZERO) {
            dispatch(shipmentListFetchAction(filterShipment, manufactureId, dateRange))
        }
    }),

    // ADD PRODUCTS BIG DIALOG
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
            stock: null,
            openId: null,
            openType: null
        }
        const productType = _.get(props, ['addProductsForm', 'values', 'productType', 'value'])
        const productTypeNext = _.get(nextProps, ['addProductsForm', 'values', 'productType', 'value'])
        const listLoading = _.get(props, ['listLoading'])
        const listLoadingNext = _.get(nextProps, ['listLoading'])
        return (listLoading !== listLoadingNext && listLoadingNext === false) ||
            (productType !== productTypeNext && nextProps.openAddProductDialog) ||
            (props.filterProducts.filterRequest(except) !== nextProps.filterProducts.filterRequest(except))
    }, ({setOpenAddProductConfirm, addProductsForm, openAddProductDialog, dispatch, filterProducts, location: {query}, params, list}) => {
        const type = _.get(query, OPEN_ADD_PRODUCT_MATERIAL_DIALOG)
        const manufactureId = _.toInteger(_.get(params, 'manufactureId'))
        const stock = _.get(_.find(_.get(list, 'results'), {id: manufactureId}), ['warehouse', 'id'])
        const products = _.filter(_.get(addProductsForm, ['values', 'product']), (item) => {
            const amount = _.toNumber(_.get(item, 'amount'))
            const defect = _.toNumber(_.get(item, 'defect'))
            return amount > ZERO || defect > ZERO
        })
        const productType = _.get(addProductsForm, ['values', 'productType', 'value'])
        if (!_.isEmpty(products)) {
            return setOpenAddProductConfirm(true)
        } else if (openAddProductDialog && _.isEmpty(products)) {
            setOpenAddProductConfirm(false)
            return type === TYPE_PRODUCT
                ? dispatch(addProductsListAction(filterProducts, productType, manufactureId))
                : dispatch(addRawsListAction(filterProducts, productType, stock, manufactureId))
        }
        return null
    }),
    withPropsOnChange((props, nextProps) => {
        const listLoading = _.get(props, ['listLoading'])
        const listLoadingNext = _.get(nextProps, ['listLoading'])
        return (listLoading !== listLoadingNext && listLoadingNext === false) ||
            (props.openAddProductDialog !== nextProps.openAddProductDialog && nextProps.openAddProductDialog)
    }, ({dispatch, addProductsForm, openAddProductDialog, filterProducts, setOpenAddProductConfirm, location: {query}, params, list}) => {
        const type = _.get(query, OPEN_ADD_PRODUCT_MATERIAL_DIALOG)
        const manufactureId = _.toInteger(_.get(params, 'manufactureId'))
        const stock = _.get(_.find(_.get(list, 'results'), {id: manufactureId}), ['warehouse', 'id'])
        const productType = _.get(addProductsForm, ['values', 'productType', 'value'])
        if (openAddProductDialog) {
            setOpenAddProductConfirm(false)
            return type === TYPE_PRODUCT
                ? dispatch(addProductsListAction(filterProducts, productType, manufactureId))
                : dispatch(addRawsListAction(filterProducts, productType, stock, manufactureId))
        }
        return null
    }),

    withHandlers({
        handleTabChange: props => (tab) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname: pathname,
                query: filter.getParams({[TAB]: tab})
            })
        },

        handleClickItem: props => (id) => {
            const {filterShipment} = props
            hashHistory.push({pathname: sprintf(ROUTER.MANUFACTURE_SHIPMENT_ITEM_PATH, id), query: filterShipment.getParams()})
        },

        handleOpenFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[OPEN_FILTER]: true})})
        },
        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[OPEN_FILTER]: false})})
        },
        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const shift = _.get(filterForm, ['values', 'shift']) || null
            filter.filterBy({
                [OPEN_FILTER]: false,
                [MANUF_ACTIVITY_FILTER_KEY.SHIFT]: joinArray(shift)
            })
        },

        handleShipmentClick: props => (id) => {
            const {filterShipment, location: {pathname}, dispatch} = props
            hashHistory.push({
                pathname,
                query: filterShipment.getParams({'shipmentId': id})
            })
            dispatch(shipmentItemFetchAction(id))
        },

        handleCloseDetail: props => () => {
            const {location: {pathname, query}} = props
            const page = _.get(query, 'page')
            const pageSize = _.get(query, 'pageSize')
            hashHistory.push({pathname: pathname, query: {page: page, pageSize: pageSize}})
        },

        // ADD PRODUCT & RAW
        handleOpenAddProductMaterial: props => (type) => {
            const {dispatch, location: {pathname}, filter} = props
            dispatch(reset('ManufactureProductMaterialForm'))
            hashHistory.push({pathname, query: filter.getParams({[OPEN_ADD_PRODUCT_MATERIAL_DIALOG]: type})})
        },

        handleCloseAddProductMaterial: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[OPEN_ADD_PRODUCT_MATERIAL_DIALOG]: false})})
        },

        handleSubmitAddProductMaterial: props => () => {
            const {dispatch, location: {pathname, query}, params, filter, productMaterialForm, filterShipment, filterLogs, beginDate, endDate} = props
            const dialogType = _.get(query, OPEN_ADD_PRODUCT_MATERIAL_DIALOG)
            const manufactureId = _.toInteger(_.get(params, 'manufactureId'))
            const dateRange = {
                beginDate,
                endDate
            }
            return (dialogType === TYPE_PRODUCT
                ? dispatch(addProductsSubmitAction(_.get(productMaterialForm, 'values')))
                : dispatch(addRawsSubmitAction(_.get(productMaterialForm, 'values'))))
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[OPEN_ADD_PRODUCT_MATERIAL_DIALOG]: false})})
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    dispatch(shipmentListFetchAction(filterShipment, manufactureId, dateRange))
                    dispatch(shipmentLogsListFetchAction(filterLogs, manufactureId, dateRange))
                    dispatch(shipmentProductsListFetchAction(dateRange, manufactureId))
                    dispatch(shipmentMaterialsListFetchAction(dateRange, manufactureId))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },

        // ADD PRODUCTS BIG DIALOG
        handleOpenAddProduct: props => () => {
            const {dispatch, setOpenAddProductDialog, filter, location: {pathname}} = props
            dispatch(reset('ShipmentAddProductsForm'))
            hashHistory.push({pathname, query: filter.getParams({'pdPageSize': 25})})
            setOpenAddProductDialog(true)
        },

        handleCloseAddProduct: props => () => {
            const {setOpenAddProductDialog, filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({'pdPage': null, 'pdPageSize': null, 'pdSearch': null})})
            setOpenAddProductDialog(false)
        },

        handleSubmitAddProduct: props => () => {
            const {setOpenAddProductDialog, addProductsForm, addProductsMaterialsList, dispatch, productMaterialForm, filter, location: {pathname, query}} = props
            const existingProducts = _.get(productMaterialForm, ['values', 'products'])
            const values = _.get(addProductsForm, ['values', 'product'])
            const dialogType = _.get(query, OPEN_ADD_PRODUCT_MATERIAL_DIALOG)
            const getProductData = (id) => {
                return _.find(_.get(addProductsMaterialsList, 'results'), {'id': id})
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
                                name: dialogType === TYPE_RAW ? _.get(product, 'title') : _.get(product, 'name'),
                                type: _.get(product, ['type', 'name']),
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
            dispatch(change('ManufactureProductMaterialForm', 'products', _.concat(_.filter(newProductsArray, (item) => item.product.value.id), checkDifference)))

            hashHistory.push({pathname, query: filter.getParams({'pdPage': null, 'pdPageSize': null, 'pdSearch': null})})
            setOpenAddProductDialog(false)
        },

        handleCloseAddProductConfirm: props => () => {
            const {dispatch, addProductsForm, filterProducts, setOpenAddProductConfirm, location: {query}, params, list} = props
            const manufacture = _.toInteger(_.get(params, 'manufactureId'))
            const stock = _.get(_.find(_.get(list, 'results'), {id: manufacture}), ['warehouse', 'id'])
            const dialogType = _.get(query, OPEN_ADD_PRODUCT_MATERIAL_DIALOG)
            const productType = _.get(addProductsForm, ['values', 'productType', 'value'])
            setOpenAddProductConfirm(false)
            return dialogType === TYPE_PRODUCT
                ? dispatch(addProductsListAction(filterProducts, productType, manufacture))
                : dispatch(addRawsListAction(filterProducts, productType, stock, manufacture))
        },

        handleSubmitAddProductConfirm: props => () => {
            const {addProductsForm, addProductsMaterialsList, dispatch, productMaterialForm, filterProducts, setOpenAddProductConfirm, location: {query}, params, list} = props
            const productType = _.get(addProductsForm, ['values', 'productType', 'value'])
            const manufacture = _.toInteger(_.get(params, 'manufactureId'))
            const stock = _.get(_.find(_.get(list, 'results'), {id: manufacture}), ['warehouse', 'id'])
            const existingProducts = _.get(productMaterialForm, ['values', 'products'])
            const values = _.get(addProductsForm, ['values', 'product'])
            const dialogType = _.get(query, OPEN_ADD_PRODUCT_MATERIAL_DIALOG)
            const getProductData = (id) => {
                return _.find(_.get(addProductsMaterialsList, 'results'), {'id': id})
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
                                name: dialogType === TYPE_RAW ? _.get(product, 'title') : _.get(product, 'name'),
                                type: _.get(product, ['type', 'name']),
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
            dispatch(change('ManufactureProductMaterialForm', 'products', _.concat(_.filter(newProductsArray, (item) => item.product.value.id), checkDifference)))
            setOpenAddProductConfirm(false)
            return dialogType === TYPE_PRODUCT
                ? dispatch(addProductsListAction(filterProducts, productType, manufacture))
                : dispatch(addRawsListAction(filterProducts, productType, stock, manufacture))
        },
        handleEditProductAmount: props => () => {
            const {dispatch, LogEditForm, filter} = props
            const amount = _.get(LogEditForm, ['values', 'editAmount'])
            const type = filter.getParam('openType')
            const id = _.toNumber(filter.getParam('openId'))
            if (type === 'writeoff') {
                dispatch(editWriteOffAmountAction(id, amount))
            } else if (type === 'return') {
                dispatch(editReturnAmountAction(id, amount))
            }
        }
    })
)

const ManufactureShipmentList = enhance((props) => {
    const {
        filter,
        filterLogs,
        list,
        location,
        listLoading,
        shipmentList,
        shipmentListLoading,
        shipmentDetail,
        shipmentDetailLoading,
        shipmentLogs,
        shipmentLogsLoading,
        shipmentProducts,
        shipmentProductsLoading,
        shipmentMaterials,
        shipmentMaterialsLoading,
        filterShipment,
        params,
        layout,
        beginDate,
        endDate,
        openAddProductDialog,
        openAddProductConfirm,
        addProductsMaterialsList,
        addProductsMaterialsLoading,
        filterProducts
    } = props

    const detailId = _.toInteger(_.get(params, 'manufactureId'))
    const shipmentId = _.toNumber(_.get(props, ['location', 'query', 'shipmentId']) || MINUS_ONE)
    const tab = _.get(location, ['query', TAB]) || SHIPMENT_TAB.DEFAULT_TAB
    const openFilterDialog = toBoolean(_.get(location, ['query', OPEN_FILTER]))
    const openProductMaterialDialog = _.get(location, ['query', OPEN_ADD_PRODUCT_MATERIAL_DIALOG])
    const shift = _.get(location, ['query', MANUF_ACTIVITY_FILTER_KEY.SHIFT])

    const tabData = {
        tab,
        handleTabChange: props.handleTabChange
    }

    const listData = {
        data: _.get(list, 'results'),
        listLoading,
        handleClickItem: props.handleClickItem
    }

    const detailData = {
        id: detailId,
        handleCloseDetail: props.handleCloseDetail
    }

    const shipmentDetailData = {
        id: shipmentId,
        data: shipmentDetail,
        loading: shipmentDetailLoading,
        logs: _.get(shipmentLogs, 'results'),
        logsLoading: shipmentLogsLoading,
        products: shipmentProducts,
        productsLoading: shipmentProductsLoading,
        materials: shipmentMaterials,
        materialsLoading: shipmentMaterialsLoading
    }

    const shipmentData = {
        filter: filterShipment,
        listLoading: shipmentListLoading,
        shipmentList: _.get(shipmentList, 'results'),
        detailData: shipmentDetailData,
        handleShipmentClick: props.handleShipmentClick
    }

    const filterDialog = {
        initialValues: {
            shift: shift && splitToArray(shift),
            dateRange: {
                startDate: moment(beginDate),
                endDate: moment(endDate)
            }
        },
        openFilterDialog,
        handleOpenFilterDialog: props.handleOpenFilterDialog,
        handleCloseFilterDialog: props.handleCloseFilterDialog,
        handleSubmitFilterDialog: props.handleSubmitFilterDialog
    }

    const productMaterialDialog = {
        open: openProductMaterialDialog === TYPE_PRODUCT || openProductMaterialDialog === TYPE_RAW,
        type: openProductMaterialDialog,
        handleOpen: props.handleOpenAddProductMaterial,
        handleClose: props.handleCloseAddProductMaterial,
        handleSubmit: props.handleSubmitAddProductMaterial
    }

    const addProductDialog = {
        openAddProductDialog,
        filter: filterProducts,
        data: _.get(addProductsMaterialsList, 'results'),
        loading: addProductsMaterialsLoading,
        handleOpenAddProduct: props.handleOpenAddProduct,
        handleCloseAddProduct: props.handleCloseAddProduct,
        handleSubmitAddProduct: props.handleSubmitAddProduct,
        openAddProductConfirm,
        handleCloseAddProductConfirm: props.handleCloseAddProductConfirm,
        handleSubmitAddProductConfirm: props.handleSubmitAddProductConfirm
    }

    return (
        <Layout {...layout}>
            <ManufactureWrapper detailId={detailId} clickDetail={props.handleClickItem}>
                <ManufactureShipmentWrapper
                    filter={filter}
                    filterDialog={filterDialog}
                    filterLogs={filterLogs}
                    tabData={tabData}
                    shipmentData={shipmentData}
                    listData={listData}
                    detailData={detailData}
                    productMaterialDialog={productMaterialDialog}
                    addProductDialog={addProductDialog}
                    handleEditProductAmount={props.handleEditProductAmount}
                />
            </ManufactureWrapper>
        </Layout>
    )
})

export default ManufactureShipmentList
