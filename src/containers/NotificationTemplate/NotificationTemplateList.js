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
import {
    NotificationTemplateGridList,
    NOTIFICATION_UPDATE_DIALOG_OPEN,
    NOTIFICATION_CONFIRM_USER_OPEN,
    NOTIFICATION_ADD_USER_OPEN
} from '../../components/NotificationTemplate'
import {
    notificationTemplateListFetchAction,
    notificationTemplateUpdateAction,
    notificationTemplateChangeStatusAction,
    notificationAddUserAction,
    notificationRemoveUserAction
} from '../../actions/notificationTemplate'
import {openSnackbarAction} from '../../actions/snackbar'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['notificationTemplate', 'item', 'data'])
        const detailLoading = _.get(state, ['notificationTemplate', 'item', 'loading'])
        const list = _.get(state, ['notificationTemplate', 'list', 'data'])
        const listLoading = _.get(state, ['notificationTemplate', 'list', 'loading'])
        const updateForm = _.get(state, ['form', 'NotificationTemplateUpdateDialog'])
        const userForm = _.get(state, ['form', 'ZoneBindAgentForm'])
        const filter = filterHelper(list, pathname, query)

        return {
            list,
            listLoading,
            detail,
            detailLoading,
            filter,
            updateForm,
            userForm,
            query
        }
    }),
    withPropsOnChange((props, nextProps) => {
        const except = {
            openAddUser: null
        }
        return props.list && props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
    }, ({dispatch, filter}) => {
        dispatch(notificationTemplateListFetchAction(filter))
    }),

    withHandlers({
        handleOpenUpdateDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.NOTIFICATION_TEMPLATE_ITEM_PATH, id),
                query: filter.getParams({[NOTIFICATION_UPDATE_DIALOG_OPEN]: id})
            })
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[NOTIFICATION_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, updateForm, filter, detail} = props
            const notificationTemplateId = _.toInteger(_.get(props, ['params', 'notificationTemplateId']))

            return dispatch(notificationTemplateUpdateAction(notificationTemplateId, _.get(updateForm, ['values']), detail))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[NOTIFICATION_UPDATE_DIALOG_OPEN]: false}))
                    dispatch(notificationTemplateListFetchAction(filter))
                })
        },
        handelChangeStatus: props => (item) => {
            const {dispatch, filter} = props

            return dispatch(notificationTemplateChangeStatusAction(_.get(item, 'id'), item))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[NOTIFICATION_UPDATE_DIALOG_OPEN]: false}))
                    dispatch(notificationTemplateListFetchAction(filter))
                })
        },
        handleOpenAddUser: props => (id) => {
            const {location: {pathname}, filter, dispatch} = props
            dispatch(reset('ZoneBindAgentForm'))
            hashHistory.push({
                pathname,
                query: filter.getParams({[NOTIFICATION_ADD_USER_OPEN]: id})
            })
        },
        handleCloseAddUser: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({[NOTIFICATION_ADD_USER_OPEN]: false})
            })
        },
        handleSubmitAddUser: props => () => {
            const {dispatch, filter, userForm, location} = props
            const item = _.toNumber(_.get(location, ['query', 'openAddUser']))

            return dispatch(notificationAddUserAction(item, _.get(userForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[NOTIFICATION_ADD_USER_OPEN]: false}))
                    dispatch(notificationTemplateListFetchAction(filter))
                })
        },
        handleOpenConfirmUser: props => (user, id) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({[NOTIFICATION_CONFIRM_USER_OPEN]: user, id: id})
            })
        },
        handleCloseConfirmUser: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({[NOTIFICATION_CONFIRM_USER_OPEN]: false, id: null})
            })
        },
        handleSubmitConfirmUser: props => () => {
            const {dispatch, filter, location} = props
            const id = _.toNumber(_.get(location, ['query', 'id']))
            const user = _.toNumber(_.get(location, ['query', 'openConfirmUser']))

            return dispatch(notificationRemoveUserAction(id, user))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[NOTIFICATION_CONFIRM_USER_OPEN]: false}))
                    dispatch(notificationTemplateListFetchAction(filter))
                })
        }
    })
)

const NotificationTemplateList = enhance((props) => {
    const {
        list,
        listLoading,
        filter,
        layout,
        location,
        detail
    } = props

    const openUpdateDialog = _.get(location, ['query', 'openUpdateDialog'])
    const openAddUser = _.get(location, ['query', 'openAddUser'])
    const openConfirmUser = _.get(location, ['query', 'openConfirmUser'])

    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }

    const updateDialog = {
        initialValues: (() => {
            if (!detail) {
                return {}
            }
            return {
                name: _.get(detail, 'name')
            }
        })(),
        open: openUpdateDialog,
        handleOpenUpdateDialog: props.handleOpenUpdateDialog,
        handleCloseUpdateDialog: props.handleCloseUpdateDialog,
        handleSubmitUpdateDialog: props.handleSubmitUpdateDialog
    }

    const changeDialog = {
        handelChangeStatus: props.handelChangeStatus
    }

    const notificationUser = {
        open: openAddUser,
        handleOpenAddUser: props.handleOpenAddUser,
        handleCloseAddUser: props.handleCloseAddUser,
        handleSubmitAddUser: props.handleSubmitAddUser
    }

    const userConfirm = {
        open: openConfirmUser,
        handleOpenConfirmUser: props.handleOpenConfirmUser,
        handleCloseConfrimUser: props.handleCloseConfirmUser,
        handleSubmitConfirmUser: props.handleSubmitConfirmUser
    }
    return (
        <Layout {...layout}>
            <NotificationTemplateGridList
                filter={filter}
                listData={listData}
                updateDialog={updateDialog}
                changeDialog={changeDialog}
                notificationUser={notificationUser}
                userConfirm={userConfirm}
            />
        </Layout>
    )
})

export default NotificationTemplateList
