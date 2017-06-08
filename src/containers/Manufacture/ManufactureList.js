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
    TAB,
    ManufactureGridList
} from '../../components/Manufacture'
import {PRODUCT_FILTER_KEY, PRODUCT_FILTER_OPEN} from '../../components/Product'
import {
    manufactureListFetchAction,
    manufactureCSVFetchAction,
    manufactureItemFetchAction
} from '../../actions/manufacture'
import {
    userShiftCreateAction,
    userShiftListFetchAction,
    userShiftUpdateAction,
    userShiftDeleteAction
} from '../../actions/userShift'

import {
    productListFetchAction,
    productItemFetchAction,
} from '../../actions/product'
import {
    manufactureProductCreateAction,
    manufactureProductUpdateAction,
    manufactureProductDeleteAction
} from '../../actions/manufactureProduct'
import {
    ingredientCreateAction,
    ingredientUpdateAction,
    ingredientListFetchAction
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
        const shiftList = _.get(state, ['shift', 'list', 'data'])
        const shiftListLoading = _.get(state, ['shift', 'list', 'loading'])
        const equipmentList = _.get(state, ['equipment', 'list', 'data'])
        const equipmentListLoading = _.get(state, ['equipment', 'list', 'loading'])
        const userShiftList = _.get(state, ['userShift', 'list', 'data'])
        const userShiftLoading = _.get(state, ['userShift', 'list', 'loading'])
        const userFilter = filterHelper(userShiftList, pathname, query)
        const listLoading = _.get(state, ['manufacture', 'list', 'loading'])
        const csvData = _.get(state, ['manufacture', 'csv', 'data'])
        const csvLoading = _.get(state, ['manufacture', 'csv', 'loading'])
        const createForm = _.get(state, ['form', 'ManufactureCreateForm'])
        const shiftCreateForm = _.get(state, ['form', 'ShiftCreateForm'])
        const staffCreateForm = _.get(state, ['form', 'ManufactureCreateUserForm'])
        const productAddForm = _.get(state, ['form', 'ProviderCreateForm'])
        const ingredientCreateForm = _.get(state, ['form', 'IngredientCreateForm'])
        const shiftId = _.get(props, ['location', 'query', 'shiftId'])
        const userShiftId = _.get(props, ['location', 'query', 'userShiftId']) || '-1'
        const filter = filterHelper(list, pathname, query)

        const productList = _.get(state, ['product', 'list', 'data'])
        const productDetail = _.get(state, ['ingredient', 'list', 'data'])
        const productDetailLoading = _.get(state, ['product', 'ingredientList', 'loading'])
        const productListLoading = _.get(state, ['product', 'list', 'loading'])
        const productId = _.get(props, ['location', 'query', 'productId']) || '-1'
        const ingredientId = _.get(props, ['location', 'query', 'ingId'])
        const personId = _.get(props, ['location', 'query', 'personId']) || '-1'
        const filterProduct = filterHelper(productList, pathname, query)
        const equipmentFilter = filterHelper(equipmentList, pathname, query)
        const filterProductForm = _.get(state, ['form', 'ProductFilterForm'])

        return {
            productList,
            productDetail,
            productListLoading,
            productDetailLoading,
            productId,
            list,
            shiftList,
            equipmentList,
            equipmentListLoading,
            equipmentFilter,
            shiftListLoading,
            listLoading,
            detail,
            detailLoading,
            createLoading,
            updateLoading,
            csvData,
            csvLoading,
            filter,
            createForm,
            shiftCreateForm,
            productAddForm,
            shiftId,
            staffCreateForm,
            userShiftList,
            userShiftLoading,
            userFilter,
            userShiftId,
            filterProduct,
            filterProductForm,
            ingredientCreateForm,
            personId,
            ingredientId,
            selectProduct
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return !nextProps.listLoading && _.isNil(nextProps.list)
    }, ({dispatch, filter, params}) => {
        const manufactureId = _.toInteger(_.get(params, 'manufactureId'))
        dispatch(manufactureListFetchAction(filter))
        dispatch(productListFetchAction(filter, manufactureId))
    }),
    withPropsOnChange((props, nextProps) => {
        const manufactureId = _.get(nextProps, ['params', 'manufactureId'])
        return manufactureId && _.get(props, ['params', 'manufactureId']) !== manufactureId
    }, ({dispatch, params, filter}) => {
        const manufactureId = _.toInteger(_.get(params, 'manufactureId'))
        manufactureId && dispatch(manufactureItemFetchAction(manufactureId))
        manufactureId && dispatch(productListFetchAction(filter, manufactureId))
    }),

    withState('openCSVDialog', 'setOpenCSVDialog', false),

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

        handleOpenEditMaterials: props => (id) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[MANUFACTURE_EDIT_PRODUCT_DIALOG_OPEN]: true, 'ingId': id})})
        },

        handleCloseEditMaterials: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[MANUFACTURE_EDIT_PRODUCT_DIALOG_OPEN]: false, 'ingId': MINUS_ONE})})
        },

        handleSubmitEditMaterials: props => () => {
            const {dispatch, ingredientCreateForm, filter, location: {pathname}, ingredientId, productId} = props
            return dispatch(ingredientUpdateAction(_.get(ingredientCreateForm, ['values']), _.toNumber(ingredientId), productId))
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[MANUFACTURE_EDIT_PRODUCT_DIALOG_OPEN]: false, 'engId': MINUS_ONE})})
                    dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                    return dispatch(ingredientListFetchAction(productId))
                })
        },

        handleClickItem: props => (id) => {
            const {dispatch, filter, detail} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.MANUFACTURE_ITEM_PATH, id)
            })
            dispatch(productListFetchAction(filter, detail.id))
        },
        handleTabChange: props => (tab) => {
            const {location: {pathname}, filter, detail, dispatch} = props
            hashHistory.push({
                pathname: pathname,
                query: filter.getParams({[TAB]: tab})
            })
            if (tab === 'product') {
                dispatch(productListFetchAction(filter, detail.id))
            } else if (tab === 'person') {
                dispatch(userShiftListFetchAction(filter, detail.id))
            } else if (tab === 'equipment') {
                dispatch(equipmentListFetchAction(filter, detail.id))
            }
        },

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
            const {filter, productFilterForm} = props
            const type = _.get(productFilterForm, ['values', 'type', 'value']) || null
            const measurement = _.get(productFilterForm, ['values', 'measurement', 'value']) || null
            const brand = _.get(productFilterForm, ['values', 'brand', 'value']) || null

            filter.filterBy({
                [PRODUCT_FILTER_OPEN]: false,
                [PRODUCT_FILTER_KEY.TYPE]: type,
                [PRODUCT_FILTER_KEY.MEASUREMENT]: measurement,
                [PRODUCT_FILTER_KEY.BRAND]: brand
            })
        },

        handleItemClick: props => (id) => {
            const {location: {pathname}, filter, dispatch} = props
            hashHistory.push({pathname, query: filter.getParams({'productId': id})})
            dispatch(productItemFetchAction(id))
            dispatch(ingredientListFetchAction(id))
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
            const {dispatch, productAddForm, filter, location: {pathname}, detail} = props
            return dispatch(manufactureProductCreateAction(_.get(productAddForm, ['values']), detail.id))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[MANUFACTURE_ADD_PRODUCT_DIALOG_OPEN]: false})})
                    dispatch(productListFetchAction(filter, detail.id))
                })
        },
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
                    hashHistory.push({pathname, query: filter.getParams({[MANUFACTURE_CREATE_PRODUCT_DIALOG_OPEN]: false})})
                    dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                    return dispatch(ingredientListFetchAction(productId))
                })
        },

        handleOpenUpdateProductDialog: props => (id) => {
            const {filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({[OPEN_UPDATE_PRODUCT_DIALOG]: true})})
        },

        handleCloseUpdateProductDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[OPEN_UPDATE_PRODUCT_DIALOG]: false})})
        },

        handleSubmitUpdateProductDialog: props => () => {
            const {dispatch, productAddForm, filter} = props
            const productId = _.toInteger(_.get(props, ['params', 'productId']))

            return dispatch(manufactureProductUpdateAction(productId, _.get(productAddForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[OPEN_UPDATE_PRODUCT_DIALOG]: false}))
                    dispatch(productListFetchAction(filter))
                })
        },

        handleOpenProductConfirmDialog: props => () => {
            const {filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({[OPEN_DELETE_PRODUCT_DIALOG]: true})})
        },
        handleCloseProductConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[OPEN_DELETE_PRODUCT_DIALOG]: false, 'shiftId': -1})})
        },
        handleSendProductConfirmDialog: props => () => {
            const {dispatch, filter, location: {pathname}, productId, detail} = props
            dispatch(manufactureProductDeleteAction(_.toInteger(productId)))
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[OPEN_DELETE_PRODUCT_DIALOG]: false})})
                    dispatch(productListFetchAction(filter, detail.id))
                })
        },

        handleOpenUserCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[OPEN_USER_CREATE_DIALOG]: true})})
        },
        handleCloseUserCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[OPEN_USER_CREATE_DIALOG]: false})})
        },

        handleSubmitUserCreateDialog: props => () => {
            const {dispatch, staffCreateForm, filter, location: {pathname}, detail} = props
            return dispatch(userShiftCreateAction(_.get(staffCreateForm, ['values']), detail.id))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[OPEN_USER_CREATE_DIALOG]: false})})
                    dispatch(userShiftListFetchAction(filter))
                })
        },

        handleOpenUserUpdateDialog: props => (id) => {
            const {filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({[OPEN_USER_UPDATE_DIALOG]: true, 'personId': id})})
        },
        handleCloseUserUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[OPEN_USER_UPDATE_DIALOG]: false, 'personId': -1})})
        },
        handleSubmitUserUpdateDialog: props => () => {
            const {dispatch, staffCreateForm, filter, userShiftItem, detail} = props

            return dispatch(userShiftUpdateAction(userShiftItem.id, _.get(staffCreateForm, ['values']), detail.id))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[OPEN_USER_UPDATE_DIALOG]: false, 'personId': -1}))
                    dispatch(userShiftListFetchAction(filter, detail.id))
                })
        },

        handleOpenUserConfirmDialog: props => (id) => {
            const {filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({[OPEN_USER_CONFIRM_DIALOG]: true, 'personId': id})})
        },
        handleCloseUserConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[OPEN_USER_CONFIRM_DIALOG]: false, 'personId': -1})})
        },
        handleSendUserConfirmDialog: props => () => {
            const {dispatch, filter, location: {pathname}, personId, detail} = props
            dispatch(userShiftDeleteAction(_.toInteger(personId)))
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .then(() => {
                    hashHistory.push({
                        pathname,
                        query: filter.getParams({[OPEN_USER_CONFIRM_DIALOG]: false, 'personId': -1})
                    })
                    dispatch(userShiftListFetchAction(filter, detail.id))
                })
        }
    })
)

const ManufactureList = enhance((props) => {
    const {
        list,
        userShiftList,
        userShiftLoading,
        userFilter,
        equipmentList,
        equipmentListLoading,
        listLoading,
        location,
        detail,
        detailLoading,
        layout,
        productList,
        productListLoading,
        productId,
        productDetail,
        productDetailLoading,
        params,
        filterProduct,
        personId,
        equipmentFilter,
        ingredientId
    } = props

    const openCreateUser = toBoolean(_.get(location, ['query', OPEN_USER_CREATE_DIALOG]))
    const openUpdateUserDialog = toBoolean(_.get(location, ['query', OPEN_USER_UPDATE_DIALOG]))
    const openShowBom = toBoolean(_.get(location, ['query', MANUFACTURE_SHOW_BOM_DIALOG_OPEN]))
    const openAddProductDialog = toBoolean(_.get(location, ['query', MANUFACTURE_ADD_PRODUCT_DIALOG_OPEN]))
    const openEditMaterials = toBoolean(_.get(location, ['query', MANUFACTURE_EDIT_PRODUCT_DIALOG_OPEN]))
    const openCreateMaterials = toBoolean(_.get(location, ['query', MANUFACTURE_CREATE_PRODUCT_DIALOG_OPEN]))
    const openProductConfirmDialog = toBoolean(_.get(location, ['query', OPEN_DELETE_PRODUCT_DIALOG]))
    const category = _.toInteger(filterProduct.getParam(PRODUCT_FILTER_KEY.CATEGORY))
    const openProductFilterDialog = toBoolean(_.get(location, ['query', PRODUCT_FILTER_OPEN]))
    const openUpdateProductDialog = toBoolean(_.get(location, ['query', OPEN_UPDATE_PRODUCT_DIALOG]))
    const openUserConfirmDialog = toBoolean(_.get(location, ['query', OPEN_USER_CONFIRM_DIALOG]))
    const tab = _.get(location, ['query', TAB]) || MANUFACTURE_TAB.MANUFACTURE_DEFAULT_TAB

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

    const equipmentData = {
        filter: equipmentFilter,
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
            category: {
                value: category
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

    const productData = {
        productList: _.get(productList, 'results'),
        listLoading: productListLoading,
        detailData: productDetailData,
        createDialog: addProductDialog,
        filterDialog: productFilterDialog,
        updateDialog: updateProductDialog,
        confirmDialog: deleteProductDialog,
        handleItemClick: props.handleItemClick
    }

    const personFilterDialog = {
        initialValues: {
            category: {
                value: category
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
        filter: userFilter,
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
