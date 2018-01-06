import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import {reset} from 'redux-form'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {
    DIVISION_CREATE_DIALOG_OPEN,
    DIVISION_UPDATE_DIALOG_OPEN,
    DIVISION_DELETE_DIALOG_OPEN,
    DivisionGridList
} from '../../components/Division'
import {
    divisionCreateAction,
    divisionUpdateAction,
    divisionListFetchAction,
    divisionDeleteAction,
    divisionItemFetchAction
} from '../../actions/division'
import {openSnackbarAction} from '../../actions/snackbar'
import t from '../../helpers/translate'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['division', 'item', 'data'])
        const detailLoading = _.get(state, ['division', 'item', 'loading'])
        const createLoading = _.get(state, ['division', 'create', 'loading'])
        const updateLoading = _.get(state, ['division', 'update', 'loading'])
        const list = _.get(state, ['division', 'list', 'data'])
        const listLoading = _.get(state, ['division', 'list', 'loading'])
        const createForm = _.get(state, ['form', 'DivisionCreateForm'])
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
        dispatch(divisionListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const divisionId = _.get(nextProps, ['params', 'divisionId'])
        return divisionId && _.get(props, ['params', 'divisionId']) !== divisionId
    }, ({dispatch, params}) => {
        const divisionId = _.toInteger(_.get(params, 'divisionId'))
        divisionId && dispatch(divisionItemFetchAction(divisionId))
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
                pathname: sprintf(ROUTER.DIVISION_ITEM_PATH, id),
                query: filter.getParams({[DIVISION_DELETE_DIALOG_OPEN]: true})
            })
        },

        handleCloseConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[DIVISION_DELETE_DIALOG_OPEN]: false})})
        },
        handleSendConfirmDialog: props => () => {
            const {dispatch, detail, filter, location: {pathname}} = props
            dispatch(divisionDeleteAction(detail.id))
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[DIVISION_DELETE_DIALOG_OPEN]: false})})
                    dispatch(divisionListFetchAction(filter))
                    return dispatch(openSnackbarAction({message: t('Успешно удалено')}))
                })
                .catch(() => {
                    return dispatch(openSnackbarAction({message: t('Ошибка при удалении')}))
                })
        },

        handleOpenCreateDialog: props => () => {
            const {dispatch, location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[DIVISION_CREATE_DIALOG_OPEN]: true})})
            dispatch(reset('DivisionCreateForm'))
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[DIVISION_CREATE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}} = props

            return dispatch(divisionCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[DIVISION_CREATE_DIALOG_OPEN]: false})})
                    dispatch(divisionListFetchAction(filter))
                })
        },

        handleOpenUpdateDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.DIVISION_ITEM_PATH, id),
                query: filter.getParams({[DIVISION_UPDATE_DIALOG_OPEN]: true})
            })
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[DIVISION_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter} = props
            const divisionId = _.toInteger(_.get(props, ['params', 'divisionId']))

            return dispatch(divisionUpdateAction(divisionId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[DIVISION_UPDATE_DIALOG_OPEN]: false}))
                    dispatch(divisionListFetchAction(filter))
                })
        }
    })
)

const DivisionList = enhance((props) => {
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

    const openCreateDialog = toBoolean(_.get(location, ['query', DIVISION_CREATE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', DIVISION_UPDATE_DIALOG_OPEN]))
    const openConfirmDialog = toBoolean(_.get(location, ['query', DIVISION_DELETE_DIALOG_OPEN]))
    const detailId = _.toInteger(_.get(params, 'divisionId'))

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

    return (
        <Layout {...layout}>
            <DivisionGridList
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

export default DivisionList
