import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {reset} from 'redux-form'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../../components/Layout/index'
import * as ROUTER from '../../../constants/routes'
import filterHelper from '../../../helpers/filter'
import toBoolean from '../../../helpers/toBoolean'
import {
    USERS_CREATE_DIALOG_OPEN,
    USERS_UPDATE_DIALOG_OPEN,
    USERS_DELETE_DIALOG_OPEN,
    USERS_FILTER_KEY,
    USERS_FILTER_OPEN,
    UsersGridList
} from '../../../components/Administration/Users/index'
import {
    usersCreateAction,
    usersUpdateAction,
    usersListFetchAction,
    usersDeleteAction,
    usersItemFetchAction
} from '../../../actions/Administration/users'
import {openSnackbarAction} from '../../../actions/snackbar'
import t from '../../../helpers/translate'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['users', 'item', 'data'])
        const detailLoading = _.get(state, ['users', 'item', 'loading'])
        const createLoading = _.get(state, ['users', 'create', 'loading'])
        const updateLoading = _.get(state, ['users', 'update', 'loading'])
        const list = _.get(state, ['users', 'list', 'data'])
        const listLoading = _.get(state, ['users', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'UsersFilterForm'])
        const createForm = _.get(state, ['form', 'UsersCreateForm'])
        const filter = filterHelper(list, pathname, query)

        return {
            list,
            listLoading,
            detail,
            detailLoading,
            createLoading,
            updateLoading,
            filter,
            filterForm,
            createForm
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(usersListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const usersId = _.get(nextProps, ['params', 'usersId'])
        return usersId && _.get(props, ['params', 'usersId']) !== usersId
    }, ({dispatch, params}) => {
        const usersId = _.toInteger(_.get(params, 'usersId'))
        if (usersId) {
            dispatch(usersItemFetchAction(usersId))
        }
    }),

    withHandlers({
        handleOpenConfirmDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.USERS_ITEM_PATH, id),
                query: filter.getParams({[USERS_DELETE_DIALOG_OPEN]: true})
            })
        },

        handleCloseConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[USERS_DELETE_DIALOG_OPEN]: false})})
        },
        handleSendConfirmDialog: props => () => {
            const {dispatch, detail, filter, location: {pathname}} = props
            dispatch(usersDeleteAction(detail.id))
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[USERS_DELETE_DIALOG_OPEN]: false})})
                    dispatch(usersListFetchAction(filter))
                    return dispatch(openSnackbarAction({message: t('Успешно удалено')}))
                })
                .catch(() => {
                    return dispatch(openSnackbarAction({message: t('Удаление невозможно из-за связи с другими данными')}))
                })
        },

        handleOpenFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[USERS_FILTER_OPEN]: true})})
        },

        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[USERS_FILTER_OPEN]: false})})
        },

        handleClearFilterDialog: props => () => {
            const {location: {pathname}} = props
            hashHistory.push({pathname, query: {}})
        },

        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const manufacture = _.get(filterForm, ['values', 'manufacture']) || null
            const group = _.get(filterForm, ['values', 'group']) || null

            filter.filterBy({
                [USERS_FILTER_OPEN]: false,
                [USERS_FILTER_KEY.MANUFACTURE]: _.join(manufacture, '-'),
                [USERS_FILTER_KEY.GROUP]: _.join(group, '-')
            })
        },

        handleOpenDeleteDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({openDeleteDialog: 'yes'})
            })
        },

        handleCloseDeleteDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({openDeleteDialog: false})})
        },

        handleOpenCreateDialog: props => () => {
            const {dispatch, location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[USERS_CREATE_DIALOG_OPEN]: true})})
            dispatch(reset('UsersCreateForm'))
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[USERS_CREATE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}} = props

            return dispatch(usersCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[USERS_CREATE_DIALOG_OPEN]: false})})
                    dispatch(usersListFetchAction(filter))
                })
        },

        handleOpenUpdateDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.USERS_ITEM_PATH, id),
                query: filter.getParams({[USERS_UPDATE_DIALOG_OPEN]: true})
            })
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[USERS_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}} = props
            const usersId = _.toInteger(_.get(props, ['params', 'usersId']))
            return dispatch(usersUpdateAction(usersId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push({
                        pathname,
                        query: filter.getParams({[USERS_UPDATE_DIALOG_OPEN]: false, 'passErr': false})
                    })
                    dispatch(usersListFetchAction(filter))
                    dispatch(usersItemFetchAction(usersId))
                })
        }
    })
)

const UsersList = enhance((props) => {
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

    const openFilterDialog = toBoolean(_.get(location, ['query', USERS_FILTER_OPEN]))
    const openCreateDialog = toBoolean(_.get(location, ['query', USERS_CREATE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', USERS_UPDATE_DIALOG_OPEN]))
    const openConfirmDialog = toBoolean(_.get(location, ['query', USERS_DELETE_DIALOG_OPEN]))

    const manufacture = _.toInteger(filter.getParam(USERS_FILTER_KEY.MANUFACTURE))
    const group = _.toInteger(filter.getParam(USERS_FILTER_KEY.GROUP))
    const detailId = _.toInteger(_.get(params, 'usersId'))

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
                firstName: _.get(detail, 'firstName'),
                lastName: _.get(detail, 'lastName'),
                username: _.get(detail, 'username'),
                isActive: _.get(detail, 'isActive'),
                isStaff: _.get(detail, 'isStaff')
            }
        })(),
        updateLoading: detailLoading || updateLoading,
        openUpdateDialog,
        handleOpenUpdateDialog: props.handleOpenUpdateDialog,
        handleCloseUpdateDialog: props.handleCloseUpdateDialog,
        handleSubmitUpdateDialog: props.handleSubmitUpdateDialog
    }
    const filterDialog = {
        initialValues: {
            manufacture: manufacture && _.map(_.split(manufacture, '-'), (item) => {
                return _.toNumber(item)
            }),
            group: group && _.map(_.split(group, '-'), (item) => {
                return _.toNumber(item)
            })
        },
        filterLoading: false,
        openFilterDialog,
        handleOpenFilterDialog: props.handleOpenFilterDialog,
        handleCloseFilterDialog: props.handleCloseFilterDialog,
        handleClearFilterDialog: props.handleClearFilterDialog,
        handleSubmitFilterDialog: props.handleSubmitFilterDialog
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
            <UsersGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                createDialog={createDialog}
                confirmDialog={confirmDialog}
                updateDialog={updateDialog}
                actionsDialog={actionsDialog}
                filterDialog={filterDialog}
            />
        </Layout>
    )
})

export default UsersList
