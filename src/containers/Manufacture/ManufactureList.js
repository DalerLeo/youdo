import React from 'react'
import moment from 'moment'
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
    MANUFACTURE_ADD_PRODUCT_DIALOG_OPEN,
    SHIFT_DELETE_DIALOG_OPEN,
    MANUFACTURE_ADD_SHIFT_FORM_OPEN,
    USER_SHIFT_DELETE_DIALOG_OPEN,
    INGREDIENT_DELETE_DIALOG_OPEN,

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
    shiftCreateAction,
    shiftListFetchAction,
    shiftUpdateAction,
    shiftDeleteAction
} from '../../actions/shift'
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
    manufactureProductUpdateAction,
    manufactureProductDeleteAction
} from '../../actions/manufactureProduct'
import {equipmentListFetchAction} from '../../actions/equipment'
import {openSnackbarAction} from '../../actions/snackbar'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
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
        const staffCreateForm = _.get(state, ['form', 'StaffCreateForm'])
        const productAddForm = _.get(state, ['form', 'ProviderCreateForm'])
        const shiftId = _.get(props, ['location', 'query', 'shiftId'])
        const userShiftId = _.get(props, ['location', 'query', 'userShiftId']) || '-1'
        const filter = filterHelper(list, pathname, query)

        const productList = _.get(state, ['product', 'list', 'data'])
        const productDetail = _.get(state, ['product', 'item', 'data'])
        const productDetailLoading = _.get(state, ['product', 'item', 'loading'])
        const productListLoading = _.get(state, ['product', 'list', 'loading'])
        const productId = _.get(props, ['location', 'query', 'productId']) || '-1'
        const filterProduct = filterHelper(productList, pathname, query)
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
            filterProductForm
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
        return !nextProps.shiftListLoading && _.isNil(nextProps.shiftList)
    }, ({dispatch, filter, params}) => {
        const manufactureId = _.toInteger(_.get(params, 'manufactureId'))
        manufactureId && dispatch(shiftListFetchAction(filter, manufactureId))
    }),
    withPropsOnChange((props, nextProps) => {
        return !nextProps.userShiftLoading && _.isNil(nextProps.userShiftList)
    }, ({dispatch, filter, params}) => {
        const manufactureId = _.toInteger(_.get(params, 'manufactureId'))
        manufactureId && dispatch(userShiftListFetchAction(filter, manufactureId))
    }),
    withPropsOnChange((props, nextProps) => {
        return !nextProps.equipmentListLoading && _.isNil(nextProps.equipmentList)
    }, ({dispatch, filter, params}) => {
        const manufactureId = _.toInteger(_.get(params, 'manufactureId'))
        manufactureId && dispatch(equipmentListFetchAction(filter, manufactureId))
    }),

    withPropsOnChange((props, nextProps) => {
        const manufactureId = _.get(nextProps, ['params', 'manufactureId'])
        return manufactureId && _.get(props, ['params', 'manufactureId']) !== manufactureId
    }, ({dispatch, params, filter}) => {
        const manufactureId = _.toInteger(_.get(params, 'manufactureId'))
        manufactureId && dispatch(manufactureItemFetchAction(manufactureId))
        manufactureId && dispatch(shiftListFetchAction(filter, manufactureId))
        manufactureId && dispatch(userShiftListFetchAction(filter))
        manufactureId && dispatch(equipmentListFetchAction(filter, manufactureId))
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

        handleOpenConfirmDialog: props => (id) => {
            const {filter, location: {pathname}} = props
            hashHistory.push({
                pathname: pathname,
                query: filter.getParams({[SHIFT_DELETE_DIALOG_OPEN]: true, 'shiftId': id})
            })
        },

        handleCloseConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SHIFT_DELETE_DIALOG_OPEN]: false, 'shiftId': -1})})
        },
        handleSendConfirmDialog: props => () => {
            const {dispatch, filter, location: {pathname}, shiftId, detail} = props
            dispatch(shiftDeleteAction(_.toInteger(shiftId)))
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[SHIFT_DELETE_DIALOG_OPEN]: false})})
                    dispatch(shiftListFetchAction(filter, detail.id))
                })
        },
        handleOpenUserShiftConfirmDialog: props => (id) => {
            const {filter, location: {pathname}} = props
            hashHistory.push({
                pathname: pathname,
                query: filter.getParams({[USER_SHIFT_DELETE_DIALOG_OPEN]: true, 'userShiftId': id})
            })
        },

        handleCloseUserShiftConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({[USER_SHIFT_DELETE_DIALOG_OPEN]: false, 'userShiftId': -1})
            })
        },
        handleSendUserShiftConfirmDialog: props => () => {
            const {dispatch, filter, location: {pathname}, userShiftId, detail} = props
            const userShiftIdExp = _.toInteger(userShiftId)
            dispatch(userShiftDeleteAction(userShiftIdExp))
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[USER_SHIFT_DELETE_DIALOG_OPEN]: false})})
                    dispatch(shiftListFetchAction(filter, detail.id))
                    dispatch(userShiftListFetchAction(filter))
                })
        },

        handleOpenAddShiftForm: props => (open) => {
            const {filter, location: {pathname}} = props
            if (open) {
                hashHistory.push({
                    pathname: pathname,
                    query: filter.getParams({[MANUFACTURE_ADD_SHIFT_FORM_OPEN]: true})
                })
            } else {
                hashHistory.push({
                    pathname: pathname,
                    query: filter.getParams({[MANUFACTURE_ADD_SHIFT_FORM_OPEN]: false})
                })
            }
        },

        handleSubmitShiftAddForm: props => () => {
            const {dispatch, shiftCreateForm, filter, location: {pathname}, detail} = props

            return dispatch(shiftCreateAction(_.get(shiftCreateForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({
                        pathname,
                        query: filter.getParams({[MANUFACTURE_ADD_SHIFT_FORM_OPEN]: false})
                    })
                    dispatch(shiftListFetchAction(filter, detail.id))
                })
        },

        handleUpdateShiftForm: props => (id) => {
            const {filter, location: {pathname}} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({[MANUFACTURE_ADD_SHIFT_FORM_OPEN]: true, 'shiftId': id})
            })
        },
        handleSubmitUpdateShiftAddForm: props => () => {
            const {dispatch, shiftCreateForm, filter, location: {pathname}, shiftId, detail} = props

            return dispatch(shiftUpdateAction(_.toInteger(shiftId), _.get(shiftCreateForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[MANUFACTURE_ADD_SHIFT_FORM_OPEN]: false})})
                    dispatch(shiftListFetchAction(filter, detail.id))
                })
        },

        handleOpenShowBom: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[MANUFACTURE_SHOW_BOM_DIALOG_OPEN]: true})})
        },

        handleCloseShowBom: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[MANUFACTURE_SHOW_BOM_DIALOG_OPEN]: false})})
        },

        handleSubmitShowBom: props => () => {
            const {dispatch, shiftCreateForm, filter, location: {pathname}, detail} = props

            return dispatch(shiftCreateAction(_.get(shiftCreateForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[OPEN_USER_CREATE_DIALOG_]: true})})
                    dispatch(shiftListFetchAction(filter, detail.id))
                })
        },

        handleClickItem: props => (id) => {
            const {dispatch, filter, detail} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.MANUFACTURE_ITEM_PATH, id)
            })
            dispatch(shiftListFetchAction(filter, detail.id))
            dispatch(equipmentListFetchAction(filter, detail.id))
        },
        handleSubmitAddIngredient: props => () => {
            const {dispatch, shiftCreateForm, filter, location: {pathname}, detail} = props

            return dispatch(shiftCreateAction(_.get(shiftCreateForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname})
                    dispatch(shiftListFetchAction(filter, detail.id))
                })
        },
        handleOpenIngredientConfirmDialog: props => (id) => {
            const {filter, location: {pathname}} = props
            hashHistory.push({
                pathname: pathname,
                query: filter.getParams({[INGREDIENT_DELETE_DIALOG_OPEN]: true, 'productId': id})
            })
        },

        handleCloseIngredientConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({[INGREDIENT_DELETE_DIALOG_OPEN]: false, 'productId': -1})
            })
        },
        handleSendIngredientConfirmDialog: props => () => {
            const {dispatch, location: {pathname}, filter, detail, productId} = props
            return dispatch(manufactureProductDeleteAction(productId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({
                        pathname,
                        query: filter.getParam({[INGREDIENT_DELETE_DIALOG_OPEN]: false, 'productId': -1})
                    })
                    dispatch(productListFetchAction(filter, detail.id))
                })
        },
        handleTabChange: props => (tab) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname: pathname,
                query: filter.getParams({[TAB]: tab})
            })
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
                    hashHistory.push({pathname, query: filter.getParams({[MANUFACTURE_ADD_PRODUCT_DIALOG_OPEN]: true})})
                    dispatch(shiftListFetchAction(filter, detail.id))
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
                    dispatch(shiftListFetchAction(filter, detail.id))
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
                    dispatch(shiftListFetchAction(filter, detail.id))
                    dispatch(userShiftListFetchAction(filter))
                })
        },

        handleOpenUserUpdateDialog: props => (id) => {
            const {filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({[OPEN_USER_UPDATE_DIALOG]: true})})
        },
        handleCloseUserUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[OPEN_UPDATE_PRODUCT_DIALOG]: false})})
        },
        handleSubmitUserUpdateDialog: props => () => {
            const {dispatch, staffCreateForm, filter} = props
            const productId = _.toInteger(_.get(props, ['params', 'productId']))

            return dispatch(userShiftUpdateAction(productId, _.get(staffCreateForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[OPEN_UPDATE_PRODUCT_DIALOG]: false}))
                    dispatch(productListFetchAction(filter))
                })
        },

        handleOpenUserConfirmDialog: props => () => {
            const {filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({[OPEN_USER_CONFIRM_DIALOG]: true})})
        },
        handleCloseUserConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[OPEN_USER_CONFIRM_DIALOG]: false, 'shiftId': -1})})
        },
        handleSendUserConfirmDialog: props => () => {
            const {dispatch, filter, location: {pathname}, productId, detail} = props
            dispatch(userShiftDeleteAction(_.toInteger(productId)))
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[OPEN_USER_CONFIRM_DIALOG]: false})})
                    dispatch(shiftListFetchAction(filter, detail.id))
                })
        }
    })
)

const ManufactureList = enhance((props) => {
    const {
        list,
        shiftList,
        shiftListLoading,
        shiftId,
        userShiftList,
        userShiftLoading,
        userFilter,
        userShiftId,
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
        filterProduct
    } = props

    const openCreateUser = toBoolean(_.get(location, ['query', OPEN_USER_CREATE_DIALOG]))
    const openUpdateUserDialog = toBoolean(_.get(location, ['query', OPEN_USER_UPDATE_DIALOG]))
    const openShowBom = toBoolean(_.get(location, ['query', MANUFACTURE_SHOW_BOM_DIALOG_OPEN]))
    const openAddProductDialog = toBoolean(_.get(location, ['query', MANUFACTURE_ADD_PRODUCT_DIALOG_OPEN]))
    const openAddShiftForm = toBoolean(_.get(location, ['query', MANUFACTURE_ADD_SHIFT_FORM_OPEN]))
    const openConfirmDialog = toBoolean(_.get(location, ['query', SHIFT_DELETE_DIALOG_OPEN]))
    const openIngredientConfirmDialog = toBoolean(_.get(location, ['query', INGREDIENT_DELETE_DIALOG_OPEN]))
    const openProductConfirmDialog = toBoolean(_.get(location, ['query', OPEN_DELETE_PRODUCT_DIALOG]))
    const openUserShiftConfirmDialog = toBoolean(_.get(location, ['query', USER_SHIFT_DELETE_DIALOG_OPEN]))
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

    const confirmDialog = {
        openConfirmDialog: openConfirmDialog,
        handleOpenConfirmDialog: props.handleOpenConfirmDialog,
        handleCloseConfirmDialog: props.handleCloseConfirmDialog,
        handleSendConfirmDialog: props.handleSendConfirmDialog
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
    const currentShift = _.find(_.get(shiftList, 'results'), {'id': _.toInteger(shiftId)})
    const shiftData = {
        openAddShiftForm,
        shiftListLoading,
        handleOpenAddShiftForm: props.handleOpenAddShiftForm,
        handleUpdateShiftForm: props.handleUpdateShiftForm,
        shiftList: _.get(shiftList, 'results'),
        shiftId: shiftId,
        handleSubmitShiftAddForm: props.handleSubmitShiftAddForm,
        handleSubmitUpdateShiftAddForm: props.handleSubmitUpdateShiftAddForm,
        initialValues: (() => {
            if (!shiftId) {
                return {}
            }
            return {
                name: _.get(currentShift, 'name'),
                beginTime: moment(_.get(currentShift, 'beginTime')),
                endTime: {
                    value: _.get(currentShift, 'endTime')
                }
            }
        })()
    }
    const userShift = {
        userShiftId: _.toInteger(userShiftId),
        userShiftLoading,
        userShiftList: _.get(userShiftList, 'results'),
        openUserShiftConfirmDialog,
        handleOpenUserShiftConfirmDialog: props.handleOpenUserShiftConfirmDialog,
        handleCloseUserShiftConfirmDialog: props.handleCloseUserShiftConfirmDialog,
        handleSendUserShiftConfirmDialog: props.handleSendUserShiftConfirmDialog
    }

    const equipmentData = {
        equipmentListLoading,
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
        handleItemClick: props.handleItemClick,

        handleSubmitAddIngredient: props.handleSubmitAddIngredient,
        openIngredientConfirmDialog: openIngredientConfirmDialog,
        handleOpenIngredientConfirmDialog: props.handleOpenIngredienConfirmDialog,
        handleCloseIngredientConfirmDialog: props.handleCloseIngredienConfirmDialog,
        handleSendIngredientConfirmDialog: props.handleSendIngredientConfirmDialog
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

    console.log(openCreateUser)
    const addUser = {
        open: openCreateUser,
        handleOpenDialog: props.handleOpenUserCreateDialog,
        handleCloseDialog: props.handleCloseUserCreateDialog,
        handleSubmitDialog: props.handleSubmitUserCreateDialog
    }
    const updateUser = {
        initialValues: (() => {
            if (!shiftId) {
                return {}
            }
            return {
                name: _.get(currentShift, 'name'),
                beginTime: moment(_.get(currentShift, 'beginTime')),
                endTime: {
                    value: _.get(currentShift, 'endTime')
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
                detailData={detailData}
                listData={listData}
                equipmentData={equipmentData}
                showBom={showBom}
                addProductDialog={addProductDialog}
                shiftData={shiftData}
                productData={productData}
                confirmDialog={confirmDialog}
                userShift={userShift}
                tabData={tabData}
                productFilterDialog={productFilterDialog}
                updateProductDialog={updateProductDialog}
                personData={personData}
            />
        </Layout>
    )
})

export default ManufactureList
