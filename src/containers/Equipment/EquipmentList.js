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
import {
    EQUIPMENT_CREATE_DIALOG_OPEN,
    EQUIPMENT_UPDATE_DIALOG_OPEN,
    EQUIPMENT_DELETE_DIALOG_OPEN,
    EquipmentGridList
} from '../../components/Equipment'
import {
    equipmentCreateAction,
    equipmentUpdateAction,
    equipmentListFetchAction,
    equipmentDeleteAction,
    equipmentItemFetchAction
} from '../../actions/equipment'
import {openSnackbarAction} from '../../actions/snackbar'
import t from '../../helpers/translate'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['equipment', 'item', 'data'])
        const detailLoading = _.get(state, ['equipment', 'item', 'loading'])
        const createLoading = _.get(state, ['equipment', 'create', 'loading'])
        const updateLoading = _.get(state, ['equipment', 'update', 'loading'])
        const list = _.get(state, ['equipment', 'list', 'data'])
        const listLoading = _.get(state, ['equipment', 'list', 'loading'])
        const createForm = _.get(state, ['form', 'EquipmentCreateForm'])
        const filter = filterHelper(list, pathname, query)

        return {
            list,
            listLoading,
            detail,
            detailLoading,
            createLoading,
            updateLoading,
            filter,
            createForm
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(equipmentListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const equipmentId = _.get(nextProps, ['params', 'equipmentId'])
        return equipmentId && _.get(props, ['params', 'equipmentId']) !== equipmentId
    }, ({dispatch, params}) => {
        const equipmentId = _.toInteger(_.get(params, 'equipmentId'))
        equipmentId && dispatch(equipmentItemFetchAction(equipmentId))
    }),

    withHandlers({
        handleActionEdit: props => () => {
            return null
        },
        handleOpenDeleteDialog: props => () => {
            return null
        },

        handleOpenConfirmDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.EQUIPMENT_ITEM_PATH, id),
                query: filter.getParams({[EQUIPMENT_DELETE_DIALOG_OPEN]: true})
            })
        },

        handleCloseConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[EQUIPMENT_DELETE_DIALOG_OPEN]: false})})
        },

        handleSendConfirmDialog: props => () => {
            const {dispatch, detail, filter, location: {pathname}} = props
            dispatch(equipmentDeleteAction(detail.id))
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[EQUIPMENT_DELETE_DIALOG_OPEN]: false})})
                    dispatch(equipmentListFetchAction(filter))
                    return dispatch(openSnackbarAction({message: t('Успешно удалено')}))
                })
                .catch(() => {
                    return dispatch(openSnackbarAction({message: t('Удаление невозможно из-за связи с другими данными')}))
                })
        },

        handleOpenCreateDialog: props => () => {
            const {dispatch, location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[EQUIPMENT_CREATE_DIALOG_OPEN]: true})})
            dispatch(reset('EquipmentCreateForm'))
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[EQUIPMENT_CREATE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}} = props

            return dispatch(equipmentCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[EQUIPMENT_CREATE_DIALOG_OPEN]: false})})
                    dispatch(equipmentListFetchAction(filter))
                })
        },

        handleOpenUpdateDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.EQUIPMENT_ITEM_PATH, id),
                query: filter.getParams({[EQUIPMENT_UPDATE_DIALOG_OPEN]: true})
            })
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[EQUIPMENT_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter} = props
            const equipmentId = _.toInteger(_.get(props, ['params', 'equipmentId']))

            return dispatch(equipmentUpdateAction(equipmentId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[EQUIPMENT_UPDATE_DIALOG_OPEN]: false}))
                    dispatch(equipmentListFetchAction(filter))
                })
        }
    })
)

const EquipmentList = enhance((props) => {
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

    const openCreateDialog = toBoolean(_.get(location, ['query', EQUIPMENT_CREATE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', EQUIPMENT_UPDATE_DIALOG_OPEN]))
    const openConfirmDialog = toBoolean(_.get(location, ['query', EQUIPMENT_DELETE_DIALOG_OPEN]))

    const detailId = _.toInteger(_.get(params, 'equipmentId'))

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
                name: _.get(detail, 'name'),
                manufacture: {
                    value: _.get(detail, ['manufacture', 'id'])
                },
                image: _.get(detail, 'image')
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

    return (
        <Layout {...layout}>
            <EquipmentGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                createDialog={createDialog}
                confirmDialog={confirmDialog}
                updateDialog={updateDialog}
                actionsDialog={actionsDialog}
            />
        </Layout>
    )
})

export default EquipmentList
