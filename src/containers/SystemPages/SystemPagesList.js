import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {reset} from 'redux-form'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {
    SYSTEM_PAGES_CREATE_DIALOG_OPEN,
    SYSTEM_PAGES_UPDATE_DIALOG_OPEN,
    SystemPagesGridList
} from '../../components/SystemPages'
import {
    systemPagesCreateAction,
    systemPagesUpdateAction,
    systemPagesListFetchAction,
    systemPagesDeleteAction,
    systemPagesItemFetchAction
} from '../../actions/systemPages'
import {openSnackbarAction} from '../../actions/snackbar'
import {openErrorAction} from '../../actions/error'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['systemPages', 'item', 'data'])
        const detailLoading = _.get(state, ['systemPages', 'item', 'loading'])
        const createLoading = _.get(state, ['systemPages', 'create', 'loading'])
        const updateLoading = _.get(state, ['systemPages', 'update', 'loading'])
        const list = _.get(state, ['systemPages', 'list', 'data'])
        const listLoading = _.get(state, ['systemPages', 'list', 'loading'])
        const createForm = _.get(state, ['form', 'SystemPagesCreateForm'])
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
        dispatch(systemPagesListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const systemPagesId = _.get(nextProps, ['params', 'systemPagesId'])
        return systemPagesId && _.get(props, ['params', 'systemPagesId']) !== systemPagesId
    }, ({dispatch, params}) => {
        const systemPagesId = _.toInteger(_.get(params, 'systemPagesId'))
        systemPagesId && dispatch(systemPagesItemFetchAction(systemPagesId))
    }),

    withState('openConfirmDialog', 'setOpenConfirmDialog', false),

    withHandlers({
        handleOpenConfirmDialog: props => () => {
            const {setOpenConfirmDialog} = props
            setOpenConfirmDialog(true)
        },

        handleCloseConfirmDialog: props => () => {
            const {setOpenConfirmDialog} = props
            setOpenConfirmDialog(false)
        },
        handleSendConfirmDialog: props => () => {
            const {dispatch, detail, setOpenConfirmDialog, filter} = props
            dispatch(systemPagesDeleteAction(detail.id))
                .then(() => {
                    setOpenConfirmDialog(false)
                    dispatch(systemPagesListFetchAction(filter))
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Ошибка при удалении'}))
                })
        },

        handleOpenCreateDialog: props => () => {
            const {dispatch, location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SYSTEM_PAGES_CREATE_DIALOG_OPEN]: true})})
            dispatch(reset('SystemPagesCreateForm'))
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SYSTEM_PAGES_CREATE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}} = props

            return dispatch(systemPagesCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[SYSTEM_PAGES_CREATE_DIALOG_OPEN]: false})})
                    dispatch(systemPagesListFetchAction(filter))
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
                pathname: sprintf(ROUTER.SYSTEM_PAGES_ITEM_PATH, id),
                query: filter.getParams({[SYSTEM_PAGES_UPDATE_DIALOG_OPEN]: true})
            })
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SYSTEM_PAGES_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter, detail} = props
            const systemPagesId = _.toInteger(_.get(props, ['params', 'systemPagesId']))

            return dispatch(systemPagesUpdateAction(systemPagesId, _.get(createForm, ['values']), _.get(detail, 'keyName')))
                .then(() => {
                    return dispatch(systemPagesItemFetchAction(systemPagesId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[SYSTEM_PAGES_UPDATE_DIALOG_OPEN]: false}))
                    dispatch(systemPagesListFetchAction(filter))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },

        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.SYSTEM_PAGES_LIST_URL, query: filter.getParams()})
        }
    })
)

const SystemPagesList = enhance((props) => {
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

    const openCreateDialog = toBoolean(_.get(location, ['query', SYSTEM_PAGES_CREATE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', SYSTEM_PAGES_UPDATE_DIALOG_OPEN]))
    const detailId = _.toInteger(_.get(params, 'systemPagesId'))

    const createDialog = {
        createLoading,
        openCreateDialog,
        handleOpenCreateDialog: props.handleOpenCreateDialog,
        handleCloseCreateDialog: props.handleCloseCreateDialog,
        handleSubmitCreateDialog: props.handleSubmitCreateDialog
    }

    const confirmDialog = {
        openConfirmDialog: props.openConfirmDialog,
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
                translations: _.get(detail, 'translations')
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
        detailLoading,
        handleCloseDetail: props.handleCloseDetail
    }

    return (
        <Layout {...layout}>
            <SystemPagesGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                createDialog={createDialog}
                confirmDialog={confirmDialog}
                updateDialog={updateDialog}
            />
        </Layout>
    )
})

export default SystemPagesList
