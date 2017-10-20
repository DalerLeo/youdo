import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {reset} from 'redux-form'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import ManufactureWrapper from './Wrapper'
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
import {
    productListFetchAction,
    productItemFetchAction
} from '../../actions/product'
import {
    manufactureProductCreateAction,
    manufactureProductDeleteAction,
    productChangeManufacture
} from '../../actions/manufactureProduct'
import {
    ingredientCreateAction,
    ingredientUpdateAction,
    ingredientListFetchAction,
    ingredientDeleteAction
} from '../../actions/ingredient'
import {openSnackbarAction} from '../../actions/snackbar'
import {openErrorAction} from '../../actions/error'

const MINUS_ONE = -1
const ZERO = 0
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
        const ingredientCreateForm = _.get(state, ['form', 'IngredientCreateForm'])
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
            filterProductForm,
            ingredientCreateForm
        }
    }),
    withPropsOnChange((props, nextProps) => {
        const manufactureId = _.get(props, ['params', 'manufactureId'])
        const nextManufactureId = _.get(nextProps, ['params', 'manufactureId'])
        return (manufactureId !== nextManufactureId && nextManufactureId) ||
            (props.listLoading && props.filterProduct.filterRequest() !== nextProps.filterProduct.filterRequest() && nextManufactureId > ZERO)
    }, ({dispatch, filterProduct, params}) => {
        const manufactureId = _.toInteger(_.get(params, 'manufactureId'))
        if (manufactureId > ZERO) {
            dispatch(productListFetchAction(filterProduct, manufactureId))
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const productId = _.get(props, ['query', 'productId'])
        const nextProductId = _.get(nextProps, ['query', 'productId'])
        return productId !== nextProductId && nextProductId > ZERO
    }, ({dispatch, query}) => {
        const productId = _.toInteger(_.get(query, 'productId'))
        if (productId > ZERO) {
            dispatch(productItemFetchAction(productId))
            dispatch(ingredientListFetchAction(productId))
        }
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
            const {dispatch, params, filterProduct, location: {pathname}} = props
            const manufactureId = _.toInteger(_.get(params, 'manufactureId'))
            hashHistory.push({pathname, query: {}})
                .then(() => {
                    return dispatch(productListFetchAction(filterProduct, manufactureId))
                })
                .catch((error) => {
                    const errorWhole = _.map(error, (item, index) => {
                        return <p key={index} style={{marginBottom: '10px'}}>{(index !== 'non_field_errors') && <b style={{textTransform: 'uppercase'}}>{index}:</b>} {item}</p>
                    })
                    dispatch(openErrorAction({
                        message: <div style={{padding: '0 30px'}}>
                            {errorWhole}
                        </div>
                    }))
                })
        },
        handleSubmitProductFilterDialog: props => () => {
            const {dispatch, filterProduct, filterProductForm, params} = props
            const manufactureId = _.toInteger(_.get(params, 'manufactureId'))
            const typeParent = _.get(filterProductForm, ['values', 'typeParent', 'value']) || null
            const typeChild = _.get(filterProductForm, ['values', 'typeChild', 'value']) || null
            const measurement = _.get(filterProductForm, ['values', 'measurement', 'value']) || null
            const brand = _.get(filterProductForm, ['values', 'brand', 'value']) || null

            filterProduct.filterBy({
                [PRODUCT_FILTER_KEY.TYPE_PARENT]: typeParent,
                [PRODUCT_FILTER_KEY.TYPE_CHILD]: typeChild,
                [PRODUCT_FILTER_KEY.MEASUREMENT]: measurement,
                [PRODUCT_FILTER_KEY.BRAND]: brand
            })
            dispatch(productListFetchAction(filterProduct, manufactureId))
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
                .catch((error) => {
                    const errorWhole = _.map(error, (item, index) => {
                        return <p style={{marginBottom: '10px'}}>{(index !== 'non_field_errors' || _.isNumber(index)) && <b style={{textTransform: 'uppercase'}}>{index}:</b>} {item}</p>
                    })

                    dispatch(openErrorAction({
                        message: <div style={{padding: '0 30px'}}>
                            {errorWhole}
                        </div>
                    }))
                })
        },

        handleOpenProductConfirmDialog: props => () => {
            const {filterProduct, location: {pathname}} = props
            hashHistory.push({pathname, query: filterProduct.getParams({[OPEN_DELETE_PRODUCT_DIALOG]: true})})
        },
        handleCloseProductConfirmDialog: props => () => {
            const {location: {pathname}, filterProduct} = props
            hashHistory.push({
                pathname,
                query: filterProduct.getParams({[OPEN_DELETE_PRODUCT_DIALOG]: false})
            })
        },
        handleSendProductConfirmDialog: props => () => {
            const {dispatch, filterProduct, location: {pathname}, params} = props
            const productId = _.toInteger(_.get(props, ['location', 'query', 'productId']))
            const manufactureId = _.toInteger(_.get(params, 'manufactureId'))
            dispatch(manufactureProductDeleteAction(productId))
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Ошибка при удалении'}))
                })
                .then(() => {
                    hashHistory.push({
                        pathname,
                        query: filterProduct.getParams({[OPEN_DELETE_PRODUCT_DIALOG]: false})
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
                .catch((error) => {
                    const errorWhole = _.map(error, (item, index) => {
                        return <p key={index} style={{marginBottom: '10px'}}>{(index !== 'non_field_errors') && <b style={{textTransform: 'uppercase'}}>{index}:</b>} {item}</p>
                    })
                    dispatch(openErrorAction({
                        message: <div style={{padding: '0 30px'}}>
                            {errorWhole}
                        </div>
                    }))
                })
        },

        handleOpenCreateMaterials: props => () => {
            const {dispatch, location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[MANUFACTURE_CREATE_PRODUCT_DIALOG_OPEN]: true})})
            dispatch(reset('IngredientCreateForm'))
        },
        handleCloseCreateMaterials: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[MANUFACTURE_CREATE_PRODUCT_DIALOG_OPEN]: false})})
        },
        handleSubmitCreateMaterials: props => () => {
            const {dispatch, ingredientCreateForm, filter, location: {pathname}, params} = props
            const productId = _.toNumber(_.get(props, ['location', 'query', 'productId']))
            const manufacture = _.toInteger(_.get(params, 'manufactureId'))
            return dispatch(ingredientCreateAction(_.get(ingredientCreateForm, ['values']), productId, manufacture))
                .then(() => {
                    hashHistory.push({
                        pathname,
                        query: filter.getParams({[MANUFACTURE_CREATE_PRODUCT_DIALOG_OPEN]: false})
                    })
                    dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                    return dispatch(ingredientListFetchAction(productId))
                })
                .catch((error) => {
                    const errorWhole = _.map(error, (item, index) => {
                        return <p style={{marginBottom: '10px'}}>{(index !== 'non_field_errors' || _.isNumber(index)) &&
                        <b style={{textTransform: 'uppercase'}}>{index}:</b>} {item.length > ZERO
                            ? 'ERROR: CHECK AMOUNT OR PRODUCT' : item}</p>
                    })

                    dispatch(openErrorAction({
                        message: <div style={{padding: '0 30px'}}>
                            {errorWhole}
                        </div>
                    }))
                })
        },

        handleOpenEditMaterials: props => (id) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({[MANUFACTURE_EDIT_PRODUCT_DIALOG_OPEN]: true, 'ingId': id})
            })
        },
        handleCloseEditMaterials: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({[MANUFACTURE_EDIT_PRODUCT_DIALOG_OPEN]: false, 'ingId': MINUS_ONE})
            })
        },
        handleSubmitEditMaterials: props => () => {
            const {dispatch, ingredientCreateForm, filter, location: {pathname}} = props
            const productId = _.toNumber(_.get(props, ['location', 'query', 'productId']))
            const ingredientId = _.toNumber(_.get(props, ['location', 'query', 'ingId']))
            return dispatch(ingredientUpdateAction(_.get(ingredientCreateForm, ['values']), _.toNumber(ingredientId), productId))
                .then(() => {
                    hashHistory.push({
                        pathname,
                        query: filter.getParams({[MANUFACTURE_EDIT_PRODUCT_DIALOG_OPEN]: false, 'ingId': MINUS_ONE})
                    })
                    dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                    return dispatch(ingredientListFetchAction(productId))
                })
                .catch((error) => {
                    const errorWhole = _.map(error, (item, index) => {
                        return <p key={index} style={{marginBottom: '10px'}}>{(index !== 'non_field_errors') && <b style={{textTransform: 'uppercase'}}>{index}:</b>} {item}</p>
                    })
                    dispatch(openErrorAction({
                        message: <div style={{padding: '0 30px'}}>
                            {errorWhole}
                        </div>
                    }))
                })
        },

        handleOpenMaterialsConfirmDialog: props => (id) => {
            const {filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({[OPEN_DELETE_MATERIALS_DIALOG]: true, 'ingId': id})})
        },
        handleCloseMaterialsConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({[OPEN_DELETE_MATERIALS_DIALOG]: false, 'ingId': MINUS_ONE})
            })
        },
        handleSendMaterialsConfirmDialog: props => () => {
            const {dispatch, filter, location: {pathname}} = props
            const ingId = _.toNumber(_.get(props, ['location', 'query', 'ingId']))
            const productId = _.toNumber(_.get(props, ['location', 'query', 'productId']))
            dispatch(ingredientDeleteAction(_.toNumber(ingId)))
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Ошибка при удалении'}))
                })
                .then(() => {
                    hashHistory.push({
                        pathname,
                        query: filter.getParams({[OPEN_DELETE_MATERIALS_DIALOG]: false, 'ingId': MINUS_ONE})
                    })
                    dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                    return dispatch(ingredientListFetchAction(productId))
                })
        },

        handleClickItem: props => (id) => {
            const {filterProduct} = props
            hashHistory.push({pathname: sprintf(ROUTER.MANUFACTURE_PRODUCT_ITEM_PATH, id), query: filterProduct.getParams()})
        },

        handleItemClick: props => (id) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({'productId': id})})
        },

        handleCloseDetail: props => () => {
            const {filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({'productId': false})})
        }
    })
)

const ManufactureProductList = enhance((props) => {
    const {
        filter,
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
            <ManufactureWrapper detailId={detailId} clickDetail={props.handleClickItem}>
                <ManufactureProductWrapper
                    filter={filter}
                    filterProduct={filterProduct}
                    listData={listData}
                    detailData={detailData}
                    showBom={showBom}
                    addProductDialog={addProductDialog}
                    createMaterials={createMaterials}
                    selectProduct={selectProduct}
                    editMaterials={editMaterials}
                    deleteMaterials={deleteMaterials}
                    productFilterDialog={productFilterDialog}
                    deleteProductDialog={deleteProductDialog}
                    productDetailData={productDetailData}
                    changeManufacture={changeManufacture}
                    productData={productData}
                />
            </ManufactureWrapper>
        </Layout>
    )
})

export default ManufactureProductList
