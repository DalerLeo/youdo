import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
import * as MANUFACTURE_TAB from '../../constants/manufactureTab'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {
    OPEN_USER_CREATE_DIALOG,
    OPEN_USER_UPDATE_DIALOG,
    MANUFACTURE_SHOW_BOM_DIALOG_OPEN,
    MANUFACTURE_CREATE_PRODUCT_DIALOG_OPEN,
    MANUFACTURE_ADD_PRODUCT_DIALOG_OPEN,
    MANUFACTURE_EDIT_PRODUCT_DIALOG_OPEN,
    OPEN_USER_CONFIRM_DIALOG,
    OPEN_UPDATE_PRODUCT_DIALOG,
    OPEN_DELETE_PRODUCT_DIALOG,
    OPEN_DELETE_MATERIALS_DIALOG,
    MANUFACTURE_CHANGE,
    TAB,
    ManufactureGridList
} from '../../components/Manufacture'
import {PRODUCT_FILTER_KEY, PRODUCT_FILTER_OPEN} from '../../components/Product'
import {
    manufactureListFetchAction,
    manufactureCSVFetchAction
} from '../../actions/manufacture'
import {
    userShiftCreateAction,
    userShiftListFetchAction,
    userShiftUpdateAction,
    userShiftDeleteAction
} from '../../actions/userShift'

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
import {equipmentListFetchAction} from '../../actions/equipment'
import {openSnackbarAction} from '../../actions/snackbar'

const MINUS_ONE = -1
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const selectProduct = _.get(state, ['product', 'item', 'data'])
        const detail = _.get(state, ['manufacture', 'item', 'data'])
        const detailLoading = _.get(state, ['manufacture', 'item', 'loading'])
        const createLoading = _.get(state, ['manufacture', 'create', 'loading'])
        const updateLoading = _.get(state, ['manufacture', 'update', 'loading'])
        const list = _.get(state, ['manufacture', 'list', 'data'])
        const listLoading = _.get(state, ['manufacture', 'list', 'loading'])
        const csvData = _.get(state, ['manufacture', 'csv', 'data'])
        const csvLoading = _.get(state, ['manufacture', 'csv', 'loading'])
        const createForm = _.get(state, ['form', 'ManufactureCreateForm'])
        const ingredientCreateForm = _.get(state, ['form', 'IngredientCreateForm'])
        const filter = filterHelper(list, pathname, query)

        const productList = _.get(state, ['product', 'list', 'data'])
        const productDetail = _.get(state, ['ingredient', 'list', 'data'])
        const productDetailLoading = _.get(state, ['ingredient', 'list', 'loading'])
        const productListLoading = _.get(state, ['product', 'list', 'loading'])
        const productAddForm = _.get(state, ['form', 'ProviderCreateForm'])
        const changeForm = _.get(state, ['form', 'ChangeManufactureForm'])
        const filterProduct = filterHelper(productList, pathname, query)
        const filterProductForm = _.get(state, ['form', 'ProductFilterForm'])

        const userShiftList = _.get(state, ['userShift', 'list', 'data'])
        const userShiftLoading = _.get(state, ['userShift', 'list', 'loading'])
        const filterUser = filterHelper(userShiftList, pathname, query)
        const staffCreateForm = _.get(state, ['form', 'ManufactureCreateUserForm'])

        const equipmentList = _.get(state, ['equipment', 'list', 'data'])
        const equipmentListLoading = _.get(state, ['equipment', 'list', 'loading'])
        const filterEquipment = filterHelper(equipmentList, pathname, query)

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
            createForm,
            selectProduct,

            productList,
            productDetail,
            productListLoading,
            productDetailLoading,
            productAddForm,
            ingredientCreateForm,
            changeForm,
            filterProduct,
            filterProductForm,

            staffCreateForm,
            userShiftList,
            userShiftLoading,
            filterUser,

            equipmentList,
            equipmentListLoading,
            filterEquipment

        }
    }),
    withPropsOnChange((props, nextProps) => {
        return !nextProps.listLoading && _.isNil(nextProps.list)
    }, ({dispatch, filter}) => {
        dispatch(manufactureListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const manufactureId = _.get(nextProps, ['params', 'manufactureId'])
        const tab = _.get(props, ['location', 'query', 'tab'])
        return (manufactureId && _.get(props, ['params', 'manufactureId']) !== manufactureId) ||
            ((tab !== _.get(nextProps, ['location', 'query', 'tab'])) ||
            (props.filterProduct.filterRequest() !== nextProps.filterProduct.filterRequest()) ||
            (_.get(props, ['location', 'query', 'productId']) !== _.get(nextProps, ['location', 'query', 'productId'])) ||
            (props.filterUser.filterRequest() !== nextProps.filterUser.filterRequest()))
    }, ({dispatch, location, params, filterProduct, filterUser, filterEquipment}) => {
        const nextTab = _.get(location, ['query', 'tab']) || 'product'
        const manufactureId = _.get(params, 'manufactureId')
        if (nextTab === 'product') {
            dispatch(productListFetchAction(filterProduct, manufactureId))
            if (_.get(location, ['query', 'productId'])) {
                const productId = _.toInteger(_.get(location, ['query', 'productId']))
                dispatch(productItemFetchAction(productId))
                dispatch(ingredientListFetchAction(productId))
            }
        } else if (nextTab === 'person') {
            dispatch(userShiftListFetchAction(filterUser, manufactureId))
        } else if (nextTab === 'equipment') {
            dispatch(equipmentListFetchAction(filterEquipment, manufactureId))
        }
    }),

    withState('openCSVDialog', 'setOpenCSVDialog', false),
    // Product withHandlers
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
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[MANUFACTURE_ADD_PRODUCT_DIALOG_OPEN]: true})})
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
                query: filter.getParams({[OPEN_DELETE_PRODUCT_DIALOG]: false, 'productId': MINUS_ONE})
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
        }
    }),
    // Ingredient withHandlers
    withHandlers({
        handleOpenCreateMaterials: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[MANUFACTURE_CREATE_PRODUCT_DIALOG_OPEN]: true})})
        },
        handleCloseCreateMaterials: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[MANUFACTURE_CREATE_PRODUCT_DIALOG_OPEN]: false})})
        },
        handleSubmitCreateMaterials: props => () => {
            const {dispatch, ingredientCreateForm, filter, location: {pathname}} = props
            const productId = _.toNumber(_.get(props, ['location', 'query', 'productId']))
            return dispatch(ingredientCreateAction(_.get(ingredientCreateForm, ['values']), productId))
                .then(() => {
                    hashHistory.push({
                        pathname,
                        query: filter.getParams({[MANUFACTURE_CREATE_PRODUCT_DIALOG_OPEN]: false})
                    })
                    dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                    return dispatch(ingredientListFetchAction(productId))
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
        }
    }),
    // Person withHandlers
    withHandlers({
        handleOpenUserCreateDialog: props => () => {
            const {location: {pathname}, filterUser} = props
            hashHistory.push({pathname, query: filterUser.getParams({[OPEN_USER_CREATE_DIALOG]: true})})
        },
        handleCloseUserCreateDialog: props => () => {
            const {location: {pathname}, filterUser} = props
            hashHistory.push({pathname, query: filterUser.getParams({[OPEN_USER_CREATE_DIALOG]: false})})
        },
        handleSubmitUserCreateDialog: props => () => {
            const {dispatch, staffCreateForm, filterUser, location: {pathname}, params} = props
            const manufactureId = _.get(params, 'manufactureId')
            return dispatch(userShiftCreateAction(_.get(staffCreateForm, ['values']), manufactureId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filterUser.getParams({[OPEN_USER_CREATE_DIALOG]: false})})
                    dispatch(userShiftListFetchAction(filterUser, manufactureId))
                })
        },

        handleOpenUserUpdateDialog: props => (id) => {
            const {filterUser, location: {pathname}} = props
            hashHistory.push({pathname, query: filterUser.getParams({[OPEN_USER_UPDATE_DIALOG]: true, 'personId': id})})
        },
        handleCloseUserUpdateDialog: props => () => {
            const {location: {pathname}, filterUser} = props
            hashHistory.push({pathname, query: filterUser.getParams({[OPEN_USER_UPDATE_DIALOG]: false, 'personId': -1})})
        },
        handleSubmitUserUpdateDialog: props => () => {
            const {dispatch, staffCreateForm, filterUser, params} = props
            const manufactureId = _.get(params, 'manufactureId')
            const personId = _.toNumber(_.get(props, ['location', 'query', 'personId']))
            return dispatch(userShiftUpdateAction(personId, _.get(staffCreateForm, ['values']), manufactureId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filterUser.createURL({[OPEN_USER_UPDATE_DIALOG]: false, 'personId': -1}))
                    dispatch(userShiftListFetchAction(filterUser, manufactureId))
                })
        },

        handleOpenUserConfirmDialog: props => (id) => {
            const {filterUser, location: {pathname}} = props
            hashHistory.push({pathname, query: filterUser.getParams({[OPEN_USER_CONFIRM_DIALOG]: true, 'personId': id})})
        },
        handleCloseUserConfirmDialog: props => () => {
            const {location: {pathname}, filterUser} = props
            hashHistory.push({pathname, query: filterUser.getParams({[OPEN_USER_CONFIRM_DIALOG]: false, 'personId': -1})})
        },
        handleSendUserConfirmDialog: props => () => {
            const {dispatch, filterUser, location: {pathname}, params} = props
            const personId = _.toNumber(_.get(props, ['location', 'query', 'personId']) || '-1')
            const manufactureId = _.toNumber(_.get(params, 'manufactureId'))
            dispatch(userShiftDeleteAction(_.toInteger(personId)))
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Ошибка при удалении'}))
                })
                .then(() => {
                    hashHistory.push({
                        pathname,
                        query: filterUser.getParams({[OPEN_USER_CONFIRM_DIALOG]: false, 'personId': -1})
                    })
                    dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                    return dispatch(userShiftListFetchAction(filterUser, manufactureId))
                })
        }
    }),
    // List withHandlers
    withHandlers({
        handleActionEdit: props => () => {
            return null
        },

        handleOpenCSVDialog: props => () => {
            const {dispatch, setOpenCSVDialog} = props
            setOpenCSVDialog(true)

            dispatch(manufactureCSVFetchAction(props.filter))
        },

        handleCloseCSVDialog: props => () => {
            const {setOpenCSVDialog} = props
            setOpenCSVDialog(false)
        },

        handleOpenShowBom: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[MANUFACTURE_SHOW_BOM_DIALOG_OPEN]: true})})
        },

        handleCloseShowBom: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[MANUFACTURE_SHOW_BOM_DIALOG_OPEN]: false})})
        },

        handleClickItem: props => (id) => {
            const tab = _.get(props, ['location', 'query', 'tab'])
            hashHistory.push({pathname: sprintf(ROUTER.MANUFACTURE_ITEM_PATH, id), query: {'tab': tab}})
        },
        handleTabChange: props => (tab) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname: pathname,
                query: filter.getParams({[TAB]: tab})
            })
        },
        handleItemClick: props => (id) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({'productId': id})})
        }
    })
)

const ManufactureList = enhance((props) => {
    const {
        list,
        equipmentList,
        equipmentListLoading,
        listLoading,
        location,
        detail,
        detailLoading,
        layout,
        filterEquipment,
        params,

        productList,
        productListLoading,
        productDetail,
        productDetailLoading,
        filterProduct,

        userShiftList,
        userShiftLoading,
        filterUser
    } = props

    const openShowBom = toBoolean(_.get(location, ['query', MANUFACTURE_SHOW_BOM_DIALOG_OPEN]))
    const openEditMaterials = toBoolean(_.get(location, ['query', MANUFACTURE_EDIT_PRODUCT_DIALOG_OPEN]))
    const openCreateMaterials = toBoolean(_.get(location, ['query', MANUFACTURE_CREATE_PRODUCT_DIALOG_OPEN]))
    const type = _.toInteger(filterProduct.getParam(PRODUCT_FILTER_KEY.TYPE))
    const measurement = _.toInteger(filterProduct.getParam(PRODUCT_FILTER_KEY.MEASUREMENT))
    const brand = _.toInteger(filterProduct.getParam(PRODUCT_FILTER_KEY.BRAND))
    const openDeleteMaterialsDialog = toBoolean(_.get(location, ['query', OPEN_DELETE_MATERIALS_DIALOG]))
    const tab = _.get(location, ['query', TAB]) || MANUFACTURE_TAB.MANUFACTURE_DEFAULT_TAB

    const openAddProductDialog = toBoolean(_.get(location, ['query', MANUFACTURE_ADD_PRODUCT_DIALOG_OPEN]))
    const openProductConfirmDialog = toBoolean(_.get(location, ['query', OPEN_DELETE_PRODUCT_DIALOG]))
    const openProductFilterDialog = toBoolean(_.get(location, ['query', PRODUCT_FILTER_OPEN]))
    const openUpdateProductDialog = toBoolean(_.get(location, ['query', OPEN_UPDATE_PRODUCT_DIALOG]))
    const openManufactureChangeDialog = toBoolean(_.get(location, ['query', MANUFACTURE_CHANGE]))
    const productId = _.get(props, ['location', 'query', 'productId']) || MINUS_ONE

    const openCreateUser = toBoolean(_.get(location, ['query', OPEN_USER_CREATE_DIALOG]))
    const openUpdateUserDialog = toBoolean(_.get(location, ['query', OPEN_USER_UPDATE_DIALOG]))
    const openUserConfirmDialog = toBoolean(_.get(location, ['query', OPEN_USER_CONFIRM_DIALOG]))

    const personId = _.get(props, ['location', 'query', 'personId']) || MINUS_ONE
    const ingredientId = _.get(props, ['location', 'query', 'ingId']) || MINUS_ONE

    const detailId = _.toInteger(_.get(params, 'manufactureId'))

    const detailData = {
        id: detailId,
        data: detail,
        detailLoading
    }

    const showBom = {
        open: openShowBom,
        handleOpen: props.handleOpenShowBom,
        handleClose: props.handleCloseShowBom,
        handleLoading: props.handleCloseShowBom,
        handleSubmit: props.handleSubmitShowBom
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

    const equipmentData = {
        filter: filterEquipment,
        listLoading: equipmentListLoading,
        equipmentList: _.get(equipmentList, 'results')
    }

    const listData = {
        data: _.get(list, 'results'),
        listLoading,
        handleClickItem: props.handleClickItem
    }

    const tabData = {
        filter: filterProduct,
        tab,
        handleTabChange: props.handleTabChange
    }

    const productFilterDialog = {
        initialValues: {
            type: {
                value: type
            },
            brand: {
                value: brand
            },
            measurement: {
                value: measurement
            }
        },
        filterLoading: false,
        openFilterDialog: openProductFilterDialog,
        handleOpenFilterDialog: props.handleOpenProductFilterDialog,
        handleCloseFilterDialog: props.handleCloseProductFilterDialog,
        handleClearFilterDialog: props.handleClearProductFilterDialog,
        handleSubmitFilterDialog: props.handleSubmitProductFilterDialog
    }
    const updateProductDialog = {
        initialValues: (() => {
            if (!detail) {
                return {}
            }
            return {
                name: _.get(detail, 'name'),
                type: {
                    value: _.get(detail, ['type', 'id'])
                },
                brand: {
                    value: _.get(detail, ['brand', 'id'])
                },
                measurement: {
                    value: _.get(detail, ['measurement', 'id'])
                },
                image: _.get(detail, 'image')
            }
        })(),
        updateLoading: detailLoading,
        open: openUpdateProductDialog,
        handleOpenUpdateDialog: props.handleOpenUpdateProductDialog,
        handleCloseUpdateDialog: props.handleCloseUpdateProductDialog,
        handleSubmitUpdateDialog: props.handleSubmitUpdateProductDialog
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
        updateDialog: updateProductDialog,
        confirmDialog: deleteProductDialog,
        handleItemClick: props.handleItemClick,
        changeManufacture: changeManufacture
    }

    const personFilterDialog = {
        initialValues: {
            category: {
                value: type
            }
        },
        filterLoading: false,
        openFilterDialog: openProductFilterDialog,
        handleOpenFilterDialog: props.handleOpenProductFilterDialog,
        handleCloseFilterDialog: props.handleCloseProductFilterDialog,
        handleClearFilterDialog: props.handleClearProductFilterDialog,
        handleSubmitFilterDialog: props.handleSubmitProductFilterDialog
    }

    const addUser = {
        open: openCreateUser,
        handleOpenDialog: props.handleOpenUserCreateDialog,
        handleCloseDialog: props.handleCloseUserCreateDialog,
        handleSubmitDialog: props.handleSubmitUserCreateDialog
    }
    const userShiftItem = _.find(_.get(userShiftList, 'results'), (o) => {
        return o.id === _.toInteger(personId)
    })

    const updateUser = {
        initialValues: (() => {
            if (!userShiftItem) {
                return {}
            }
            return {
                user: {
                    value: _.get(userShiftItem, ['user', 'id'])
                },
                shift: {
                    value: _.get(userShiftItem, 'shift')
                }
            }
        })(),
        open: openUpdateUserDialog,
        handleOpenUpdateDialog: props.handleOpenUserUpdateDialog,
        handleCloseUpdateDialog: props.handleCloseUserUpdateDialog,
        handleSubmitUpdateDialog: props.handleSubmitUserUpdateDialog
    }
    const confirmUser = {
        open: openUserConfirmDialog,
        handleOpenConfirmDialog: props.handleOpenUserConfirmDialog,
        handleCloseConfirmDialog: props.handleCloseUserConfirmDialog,
        handleSendConfirmDialog: props.handleSendUserConfirmDialog
    }

    const personData = {
        userShiftItem,
        list: userShiftList,
        listLoading: userShiftLoading,
        filter: filterUser,
        filterDialog: personFilterDialog,
        createDialog: addUser,
        updateDialog: updateUser,
        confirmDialog: confirmUser
    }

    return (
        <Layout {...layout}>
            <ManufactureGridList
                createMaterials={createMaterials}
                editMaterials={editMaterials}
                deleteMaterials={deleteMaterials}
                detailData={detailData}
                listData={listData}
                equipmentData={equipmentData}
                showBom={showBom}
                productData={productData}
                tabData={tabData}
                productFilterDialog={productFilterDialog}
                personData={personData}
            />
        </Layout>
    )
})

export default ManufactureList
