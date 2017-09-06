import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {reset} from 'redux-form'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import * as MANUFACTURE_TAB from '../../constants/manufactureTab'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {
    MANUFACTURE_SHOW_BOM_DIALOG_OPEN,
    MANUFACTURE_CREATE_PRODUCT_DIALOG_OPEN,
    MANUFACTURE_ADD_PRODUCT_DIALOG_OPEN,
    MANUFACTURE_EDIT_PRODUCT_DIALOG_OPEN,
    OPEN_DELETE_PRODUCT_DIALOG,
    OPEN_DELETE_MATERIALS_DIALOG,
    MANUFACTURE_CHANGE,
    ManufactureProductWrapper
} from '../../components/Manufacture'
import {PRODUCT_FILTER_KEY, PRODUCT_FILTER_OPEN} from '../../components/Product'
import {manufactureListFetchAction} from '../../actions/manufacture'
import {
    productListFetchAction,
    productItemFetchAction
} from '../../actions/product'
import {
    manufactureProductCreateAction,
    manufactureProductDeleteAction,
    productChangeManufacture
} from '../../actions/manufactureProduct'
import {openSnackbarAction} from '../../actions/snackbar'

const MINUS_ONE = -1
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const list = _.get(state, ['manufacture', 'list', 'data'])
        const listLoading = _.get(state, ['manufacture', 'list', 'loading'])
        const productList = _.get(state, ['product', 'list', 'data'])
        const productDetail = _.get(state, ['ingredient', 'list', 'data'])
        const productDetailLoading = _.get(state, ['ingredient', 'list', 'loading'])
        const productListLoading = _.get(state, ['product', 'list', 'loading'])
        const productAddForm = _.get(state, ['form', 'ManufactureAddProductForm'])
        const changeForm = _.get(state, ['form', 'ChangeManufactureForm'])
        const filter = filterHelper(list, pathname, query)
        const filterProduct = filterHelper(productList, pathname, query)
        const filterProductForm = _.get(state, ['form', 'ProductFilterForm'])

        return {
            query,
            pathname,
            list,
            filter,
            listLoading,
            productList,
            productDetail,
            productDetailLoading,
            productListLoading,
            productAddForm,
            changeForm,
            filterProduct,
            filterProductForm
        }
    }),

    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter, filterProduct}) => {
        dispatch(manufactureListFetchAction(filter))
        dispatch(productListFetchAction(filterProduct))
    }),

    withHandlers({
        handleOpenProductFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRODUCT_FILTER_OPEN]: true})})
        },
        handleCloseProductFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRODUCT_FILTER_OPEN]: false})})
        },
        handleClearProductFilterDialog: props => () => {
            const {location: {pathname}} = props
            hashHistory.push({pathname, query: {}})
        },
        handleSubmitProductFilterDialog: props => () => {
            const {filterProduct, filterProductForm} = props
            const type = _.get(filterProductForm, ['values', 'type', 'value']) || null
            const measurement = _.get(filterProductForm, ['values', 'measurement', 'value']) || null
            const brand = _.get(filterProductForm, ['values', 'brand', 'value']) || null

            filterProduct.filterBy({
                [PRODUCT_FILTER_OPEN]: false,
                [PRODUCT_FILTER_KEY.TYPE]: type,
                [PRODUCT_FILTER_KEY.MEASUREMENT]: measurement,
                [PRODUCT_FILTER_KEY.BRAND]: brand
            })
        },

        handleOpenAddProductDialog: props => () => {
            const {dispatch, location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[MANUFACTURE_ADD_PRODUCT_DIALOG_OPEN]: true})})
            dispatch(reset('ManufactureAddProductForm'))
        },
        handleCloseAddProductDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[MANUFACTURE_ADD_PRODUCT_DIALOG_OPEN]: false})})
        },
        handleSubmitAddProductDialog: props => () => {
            const {dispatch, productAddForm, filterProduct, location: {pathname}, params} = props
            const manufactureId = _.toInteger(_.get(params, 'manufactureId'))

            return dispatch(manufactureProductCreateAction(_.get(productAddForm, ['values']), manufactureId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({
                        pathname,
                        query: filterProduct.getParams({[MANUFACTURE_ADD_PRODUCT_DIALOG_OPEN]: false})
                    })
                    return dispatch(productListFetchAction(filterProduct, manufactureId))
                })
        },

        handleOpenProductConfirmDialog: props => (id) => {
            const {filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({[OPEN_DELETE_PRODUCT_DIALOG]: true, 'productId': id})})
        },
        handleCloseProductConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({[OPEN_DELETE_PRODUCT_DIALOG]: false})
            })
        },
        handleSendProductConfirmDialog: props => () => {
            const {dispatch, filterProduct, location: {pathname}, params} = props
            const productId = _.get(props, ['location', 'query', 'productId'])
            const manufactureId = _.toInteger(_.get(params, 'manufactureId'))
            dispatch(manufactureProductDeleteAction(_.toInteger(productId)))
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Ошибка при удалении'}))
                })
                .then(() => {
                    hashHistory.push({
                        pathname,
                        query: filterProduct.getParams({[OPEN_DELETE_PRODUCT_DIALOG]: false, 'productId': MINUS_ONE})
                    })
                    dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                    return dispatch(productListFetchAction(filterProduct, manufactureId))
                })
        },

        handleOpenChangeManufacture: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[MANUFACTURE_CHANGE]: true})})
        },
        handleCloseChangeManufacture: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[MANUFACTURE_CHANGE]: false})})
        },
        handleSubmitChangeManufacture: props => () => {
            const {dispatch, filterProduct, location: {pathname}, params, changeForm} = props
            const manufactureId = _.toNumber(_.get(params, 'manufactureId'))
            const productId = _.toNumber(_.get(props, ['location', 'query', 'productId']))

            dispatch(productChangeManufacture(productId, _.get(changeForm, ['values'])))
                .then(() => {
                    hashHistory.push({pathname, query: filterProduct.getParams({[MANUFACTURE_CHANGE]: false})})
                    dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                    return dispatch(productListFetchAction(filterProduct, manufactureId))
                })
        },

        handleCloseDetail: props => () => {
            const {filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParam({'productId': MINUS_ONE})})
        }
    })
)

const ManufactureProductList = enhance((props) => {
    const {
        list,
        listLoading,
        productList,
        productListLoading,
        productDetail,
        productDetailLoading,
        filterProduct,
        location,
        params,
        layout
    } = props

    const openShowBom = toBoolean(_.get(location, ['query', MANUFACTURE_SHOW_BOM_DIALOG_OPEN]))
    const openEditMaterials = toBoolean(_.get(location, ['query', MANUFACTURE_EDIT_PRODUCT_DIALOG_OPEN]))
    const openCreateMaterials = toBoolean(_.get(location, ['query', MANUFACTURE_CREATE_PRODUCT_DIALOG_OPEN]))
    const type = _.toInteger(filterProduct.getParam(PRODUCT_FILTER_KEY.TYPE))
    const brand = _.toInteger(filterProduct.getParam(PRODUCT_FILTER_KEY.BRAND))
    const openDeleteMaterialsDialog = toBoolean(_.get(location, ['query', OPEN_DELETE_MATERIALS_DIALOG]))
    const openAddProductDialog = toBoolean(_.get(location, ['query', MANUFACTURE_ADD_PRODUCT_DIALOG_OPEN]))
    const openProductConfirmDialog = toBoolean(_.get(location, ['query', OPEN_DELETE_PRODUCT_DIALOG]))
    const openProductFilterDialog = toBoolean(_.get(location, ['query', PRODUCT_FILTER_OPEN]))
    const openManufactureChangeDialog = toBoolean(_.get(location, ['query', MANUFACTURE_CHANGE]))
    const productId = _.get(props, ['location', 'query', 'productId']) || MINUS_ONE
    const detailId = _.toInteger(_.get(params, 'manufactureId'))
    const ingredientId = _.get(props, ['location', 'query', 'ingId']) || MINUS_ONE

    const listData = {
        data: _.get(list, 'results'),
        listLoading,
        handleClickItem: props.handleClickItem
    }

    const detailData = {
        id: detailId,
        handleCloseDetail: props.handleCloseDetail
    }

    const showBom = {
        open: openShowBom,
        handleOpen: props.handleOpenShowBom,
        handleClose: props.handleCloseShowBom,
        handleLoading: props.handleCloseShowBom
    }
    const addProductDialog = {
        open: openAddProductDialog,
        productList: _.get(productList, 'results'),
        productListLoading,
        handleOpenCreateDialog: props.handleOpenAddProductDialog,
        handleCloseCreateDialog: props.handleCloseAddProductDialog,
        handleSubmitCreateDialog: props.handleSubmitAddProductDialog
    }
    const createMaterials = {
        open: openCreateMaterials,
        handleOpen: props.handleOpenCreateMaterials,
        handleClose: props.handleCloseCreateMaterials,
        handleSubmit: props.handleSubmitCreateMaterials
    }

    const selectProduct = _.find(_.get(productDetail, 'ingredient'), {'id': _.toInteger(ingredientId)})
    const editMaterials = {
        initialValues: {
            ingredient: {
                value: _.get(selectProduct, ['ingredient', 'id'])
            },
            amount: _.get(selectProduct, 'amount')
        },
        measurement: _.get(selectProduct, ['ingredient', 'measurement', 'name']),
        open: openEditMaterials,
        handleOpen: props.handleOpenEditMaterials,
        handleClose: props.handleCloseEditMaterials,
        handleSubmit: props.handleSubmitEditMaterials
    }

    const deleteMaterials = {
        name: _.get(selectProduct, ['ingredient', 'name']),
        open: openDeleteMaterialsDialog,
        handleOpenConfirmDialog: props.handleOpenMaterialsConfirmDialog,
        handleCloseConfirmDialog: props.handleCloseMaterialsConfirmDialog,
        handleSendConfirmDialog: props.handleSendMaterialsConfirmDialog
    }

    const productFilterDialog = {
        initialValues: {
            type: {
                value: type
            },
            brand: {
                value: brand
            }
        },
        filterLoading: false,
        openFilterDialog: openProductFilterDialog,
        handleOpenFilterDialog: props.handleOpenProductFilterDialog,
        handleCloseFilterDialog: props.handleCloseProductFilterDialog,
        handleClearFilterDialog: props.handleClearProductFilterDialog,
        handleSubmitFilterDialog: props.handleSubmitProductFilterDialog
    }
    const deleteProductDialog = {
        openConfirmDialog: openProductConfirmDialog,
        handleOpenConfirmDialog: props.handleOpenProductConfirmDialog,
        handleCloseConfirmDialog: props.handleCloseProductConfirmDialog,
        handleSendConfirmDialog: props.handleSendProductConfirmDialog
    }

    const productDetailData = {
        id: productId,
        data: productDetail,
        detailLoading: productDetailLoading
    }

    const changeManufacture = {
        open: openManufactureChangeDialog,
        handleOpenChangeManufacture: props.handleOpenChangeManufacture,
        handleCloseChangeManufacture: props.handleCloseChangeManufacture,
        handleSubmitChangeManufacture: props.handleSubmitChangeManufacture
    }

    const productData = {
        productList: _.get(productList, 'results'),
        listLoading: productListLoading,
        detailData: productDetailData,
        createDialog: addProductDialog,
        filterDialog: productFilterDialog,
        confirmDialog: deleteProductDialog,
        handleItemClick: props.handleItemClick,
        changeManufacture: changeManufacture
    }

    return (
        <Layout {...layout}>
            <ManufactureProductWrapper
                filter={filterProduct}
                createMaterials={createMaterials}
                editMaterials={editMaterials}
                deleteMaterials={deleteMaterials}
                detailData={detailData}
                listData={listData}
                showBom={showBom}
                productData={productData}
                productFilterDialog={productFilterDialog}
            />
        </Layout>
    )
})

export default ManufactureProductList
