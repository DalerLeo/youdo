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
    SHIFT_CREATE_DIALOG_OPEN,
    SHIFT_UPDATE_DIALOG_OPEN,
    SHIFT_DELETE_DIALOG_OPEN,
    ShiftGridList
} from '../../components/Shift'
import {
    shiftCreateAction,
    shiftUpdateAction,
    shiftListFetchAction,
    shiftDeleteAction,
    shiftItemFetchAction
} from '../../actions/shift'
import {openErrorAction} from '../../actions/error'
import {openSnackbarAction} from '../../actions/snackbar'
import t from '../../helpers/translate'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['shift', 'item', 'data'])
        const detailLoading = _.get(state, ['shift', 'item', 'loading'])
        const createLoading = _.get(state, ['shift', 'create', 'loading'])
        const updateLoading = _.get(state, ['shift', 'update', 'loading'])
        const list = _.get(state, ['shift', 'list', 'data'])
        const listLoading = _.get(state, ['shift', 'list', 'loading'])
        const createForm = _.get(state, ['form', 'ShiftCreateForm'])
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
    }, ({dispatch, filter, location}) => {
        dispatch(shiftListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const shiftId = _.get(nextProps, ['params', 'shiftId'])
        return shiftId && _.get(props, ['params', 'shiftId']) !== shiftId
    }, ({dispatch, params}) => {
        const shiftId = _.toInteger(_.get(params, 'shiftId'))
        shiftId && dispatch(shiftItemFetchAction(shiftId))
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
                pathname: sprintf(ROUTER.SHIFT_ITEM_PATH, id),
                query: filter.getParams({[SHIFT_DELETE_DIALOG_OPEN]: true})
            })
        },

        handleCloseConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SHIFT_DELETE_DIALOG_OPEN]: false})})
        },

        handleSendConfirmDialog: props => () => {
            const {dispatch, detail, filter, location: {pathname}} = props
            dispatch(shiftDeleteAction(detail.id))
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[SHIFT_DELETE_DIALOG_OPEN]: false})})
                    dispatch(shiftListFetchAction(filter))
                    return dispatch(openSnackbarAction({message: t('Успешно удалено')}))
                })
                .catch(() => {
                    return dispatch(openSnackbarAction({message: t('Удаление невозможно из-за связи с другими данными')}))
                })
        },

        handleOpenCreateDialog: props => () => {
            const {dispatch, location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SHIFT_CREATE_DIALOG_OPEN]: true})})
            dispatch(reset('ShiftCreateForm'))
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SHIFT_CREATE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}} = props

            return dispatch(shiftCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[SHIFT_CREATE_DIALOG_OPEN]: false})})
                    dispatch(shiftListFetchAction(filter))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },

        handleOpenUpdateDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.SHIFT_ITEM_PATH, id),
                query: filter.getParams({[SHIFT_UPDATE_DIALOG_OPEN]: true})
            })
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SHIFT_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter} = props
            const shiftId = _.toInteger(_.get(props, ['params', 'shiftId']))

            return dispatch(shiftUpdateAction(shiftId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(shiftItemFetchAction(shiftId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[SHIFT_UPDATE_DIALOG_OPEN]: false}))
                    dispatch(shiftListFetchAction(filter))
                })
        }
    })
)

const ShiftList = enhance((props) => {
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

    const openCreateDialog = toBoolean(_.get(location, ['query', SHIFT_CREATE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', SHIFT_UPDATE_DIALOG_OPEN]))
    const openConfirmDialog = toBoolean(_.get(location, ['query', SHIFT_DELETE_DIALOG_OPEN]))

    const detailId = _.toInteger(_.get(params, 'shiftId'))

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
                beginTime: {
                    value: _.get(detail, 'beginTime')
                },
                endTime: {
                    value: _.get(detail, 'endTime')
                }
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
            <ShiftGridList
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

export default ShiftList
