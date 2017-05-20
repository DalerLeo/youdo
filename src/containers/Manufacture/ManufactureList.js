import React from 'react'
import moment from 'moment'
import _ from 'lodash'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {
    MANUFACTURE_ADD_STAFF_DIALOG_OPEN,
    MANUFACTURE_SHOW_BOM_DIALOG_OPEN,
    MANUFACTURE_ADD_PRODUCT_DIALOG_OPEN,
    SHIFT_DELETE_DIALOG_OPEN,
    MANUFACTURE_ADD_SHIFT_FORM_OPEN,
    MANUFACTURE_ADD_STAF_FORM_OPEN,
    USER_SHIFT_DELETE_DIALOG_OPEN,
    ManufactureGridList
} from '../../components/Manufacture'
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
    userShiftDeleteAction
} from '../../actions/userShift'
import {
    manufactureProductCreateAction
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

        return {
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
            userShiftId
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return !nextProps.listLoading && _.isNil(nextProps.list)
    }, ({dispatch, filter}) => {
        dispatch(manufactureListFetchAction(filter))
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
            hashHistory.push({pathname, query: filter.getParams({[USER_SHIFT_DELETE_DIALOG_OPEN]: false, 'userShiftId': -1})})
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

        handleOpenAddStaff: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[MANUFACTURE_ADD_STAFF_DIALOG_OPEN]: true})})
        },
        handleCloseAddStaff: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[MANUFACTURE_ADD_STAFF_DIALOG_OPEN]: false})})
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
                        query: filter.getParams({[MANUFACTURE_ADD_SHIFT_FORM_OPEN]: false})})
                    dispatch(shiftListFetchAction(filter, detail.id))
                })
        },

        handleUpdateShiftForm: props => (id) => {
            const {filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({[MANUFACTURE_ADD_SHIFT_FORM_OPEN]: true, 'shiftId': id})})
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

        handleOpenAddStaffForm: props => (open) => {
            const {filter, location: {pathname}} = props
            if (open) {
                hashHistory.push({
                    pathname: pathname,
                    query: filter.getParams({[MANUFACTURE_ADD_STAF_FORM_OPEN]: true})
                })
            } else {
                hashHistory.push({
                    pathname: pathname,
                    query: filter.getParams({[MANUFACTURE_ADD_STAF_FORM_OPEN]: false})
                })
            }
        },

        handleSubmitStaffAddForm: props => () => {
            const {dispatch, staffCreateForm, filter, location: {pathname}, detail} = props
            return dispatch(userShiftCreateAction(_.get(staffCreateForm, ['values']), detail.id))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[MANUFACTURE_ADD_STAF_FORM_OPEN]: false})})
                    dispatch(shiftListFetchAction(filter, detail.id))
                    dispatch(userShiftListFetchAction(filter))
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
                    hashHistory.push({pathname, query: filter.getParams({[MANUFACTURE_ADD_STAFF_DIALOG_OPEN]: true})})
                    dispatch(shiftListFetchAction(filter, detail.id))
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
            const {dispatch, productAddForm, filter, location: {pathname}, detail} = props

            return dispatch(manufactureProductCreateAction(_.get(productAddForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[MANUFACTURE_ADD_PRODUCT_DIALOG_OPEN]: true})})
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
        userShiftId,
        equipmentList,
        equipmentListLoading,
        listLoading,
        location,
        detail,
        detailLoading,
        layout,
        params
    } = props

    const openAddStaffDialog = toBoolean(_.get(location, ['query', MANUFACTURE_ADD_STAFF_DIALOG_OPEN]))
    const openShowBom = toBoolean(_.get(location, ['query', MANUFACTURE_SHOW_BOM_DIALOG_OPEN]))
    const openAddProductDialog = toBoolean(_.get(location, ['query', MANUFACTURE_ADD_PRODUCT_DIALOG_OPEN]))
    const openAddShiftForm = toBoolean(_.get(location, ['query', MANUFACTURE_ADD_SHIFT_FORM_OPEN]))
    const openAddStaffForm = toBoolean(_.get(location, ['query', MANUFACTURE_ADD_STAF_FORM_OPEN]))
    const openConfirmDialog = toBoolean(_.get(location, ['query', SHIFT_DELETE_DIALOG_OPEN]))
    const openUserShiftConfirmDialog = toBoolean(_.get(location, ['query', USER_SHIFT_DELETE_DIALOG_OPEN]))

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

    const addStaff = {
        open: openAddStaffDialog,
        handleOpen: props.handleOpenAddStaff,
        handleClose: props.handleCloseAddStaff,
        handleLoading: props.handleCloseAddStaff,
        handleSubmit: props.handleCloseAddStaff
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
        handleOpen: props.handleOpenAddProductDialog,
        handleClose: props.handleCloseAddProductDialog,
        handleLoading: props.handleCloseAddProductDialog,
        handleSubmit: props.handleSubmitAddProductDialog
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
    const staffData = {
        openAddStaffForm,
        handleOpenAddStaffForm: props.handleOpenAddStaffForm,
        handleUpdateStaffForm: props.handleUpdateStaffForm,
        handleSubmitStaffAddForm: props.handleSubmitStaffAddForm,
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

    const equipmentData = {
        equipmentListLoading,
        equipmentList: _.get(equipmentList, 'results')
    }

    const productData = {
        handleSubmitAddIngredient: props.handleSubmitAddIngredient
    }

    const listData = {
        data: _.get(list, 'results'),
        listLoading,
        handleClickItem: props.handleClickItem
    }

    return (
        <Layout {...layout}>
            <ManufactureGridList
                detailData={detailData}
                listData={listData}
                equipmentData={equipmentData}
                addStaff={addStaff}
                showBom={showBom}
                addProductDialog={addProductDialog}
                shiftData={shiftData}
                productData={productData}
                confirmDialog={confirmDialog}
                staffData={staffData}
                userShift={userShift}
            />
        </Layout>
    )
})

export default ManufactureList
