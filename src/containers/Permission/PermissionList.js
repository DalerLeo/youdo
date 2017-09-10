import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {
    PERMISSION_CREATE_DIALOG_OPEN,
    PERMISSION_UPDATE_DIALOG_OPEN,
    PERMISSION_DELETE_DIALOG_OPEN,
    PermissionGridList
} from '../../components/Permission'
import {
    permissionUpdateAction,
    permissionListFetchAction,
    permissionItemFetchAction,
    setDateAction
} from '../../actions/permission'
import {openSnackbarAction} from '../../actions/snackbar'

const SET_DATE_DIALOG_DATE = 'openSetDateDialog'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['access', 'item', 'data'])
        const detailLoading = _.get(state, ['access', 'item', 'loading'])
        const createLoading = _.get(state, ['access', 'create', 'loading'])
        const updateLoading = _.get(state, ['access', 'update', 'loading'])
        const list = _.get(state, ['access', 'list', 'data'])
        const listLoading = _.get(state, ['access', 'list', 'loading'])
        const createForm = _.get(state, ['form', 'PermissionCreateForm'])
        const setDateForm = _.get(state, ['form', 'SetDateDialogForm'])
        const filter = filterHelper(list, pathname, query)

        return {
            list,
            listLoading,
            detail,
            detailLoading,
            createLoading,
            updateLoading,
            filter,
            createForm,
            setDateForm,
            query
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(permissionListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const itemId = _.get(nextProps, ['params', 'itemId'])
        return itemId && _.get(props, ['params', 'itemId']) !== itemId
    }, ({dispatch, params}) => {
        const itemId = _.toInteger(_.get(params, 'itemId'))
        itemId && dispatch(permissionItemFetchAction(itemId))
    }),

    withHandlers({
        handleSubmitUpdateDialog: props => (id, status) => {
            const {dispatch, filter} = props

            return dispatch(permissionUpdateAction(id, status))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[PERMISSION_UPDATE_DIALOG_OPEN]: false}))
                    dispatch(permissionListFetchAction(filter))
                })
        },

        handleOpenSetDateDialog: props => (id) => {
            const {filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({[SET_DATE_DIALOG_DATE]: id})})
        },

        handleCloseSetDateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SET_DATE_DIALOG_DATE]: false})})
        },

        handleSubmitSetDateDialog: props => () => {
            const {dispatch, setDateForm, filter, location: {pathname}} = props
            const permissionId = _.toInteger(_.get(props, ['query', 'openSetDateDialog']))
            return dispatch(setDateAction(_.get(setDateForm, ['values']), permissionId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[SET_DATE_DIALOG_DATE]: false})})
                    dispatch(permissionListFetchAction(filter))
                })
        }
    })
)

const PermissionList = enhance((props) => {
    const {
        location,
        list,
        listLoading,
        detail,
        detailLoading,
        createLoading,
        updateLoading,
        filter,
        layout,
        params
    } = props

    const openCreateDialog = toBoolean(_.get(location, ['query', PERMISSION_CREATE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', PERMISSION_UPDATE_DIALOG_OPEN]))
    const openConfirmDialog = toBoolean(_.get(location, ['query', PERMISSION_DELETE_DIALOG_OPEN]))
    const openSetDateDialog = _.get(location, ['query', SET_DATE_DIALOG_DATE])
    const detailId = _.toInteger(_.get(params, 'itemId'))

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

    const confirmDialog = {
        confirmLoading: detailLoading,
        openConfirmDialog: openConfirmDialog,
        handleOpenConfirmDialog: props.handleOpenConfirmDialog,
        handleCloseConfirmDialog: props.handleCloseConfirmDialog,
        handleSendConfirmDialog: props.handleSendConfirmDialog
    }

    const updateDialog = {
        initialValues: (() => {
            if (!detail || openCreateDialog) {
                return {}
            }
            return {
                name: _.get(detail, 'name')
            }
        })(),
        updateLoading: detailLoading || updateLoading,
        openUpdateDialog,
        handleOpenUpdateDialog: props.handleOpenUpdateDialog,
        handleCloseUpdateDialog: props.handleCloseUpdateDialog,
        handleSubmitUpdateDialog: props.handleSubmitUpdateDialog
    }

    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }

    const detailData = {
        id: detailId,
        data: detail,
        detailLoading
    }
    const setDateDialog = {
        open: openSetDateDialog,
        handleOpenSetDateDialog: props.handleOpenSetDateDialog,
        handleCloseSetDateDialog: props.handleCloseSetDateDialog,
        handleSubmitSetDateDialog: props.handleSubmitSetDateDialog,
        handleClickTime: props.handleClickTime
    }

    return (
        <Layout {...layout}>
            <PermissionGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                createDialog={createDialog}
                confirmDialog={confirmDialog}
                updateDialog={updateDialog}
                actionsDialog={actionsDialog}
                setDateDialog={setDateDialog}
            />
        </Layout>
    )
})

export default PermissionList
