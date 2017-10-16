import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import {
    NotificationGridList,
    NOTIFICATION_UPDATE_DIALOG_OPEN
} from '../../components/Notification'
import {
    notificationListFetchAction,
    notificationItemFetchAction,
    notificationUpdateAction,
    notificationChangeStatusAction
} from '../../actions/notification'
import {openSnackbarAction} from '../../actions/snackbar'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['notification', 'item', 'data'])
        const detailLoading = _.get(state, ['notification', 'item', 'loading'])
        const list = _.get(state, ['notification', 'list', 'data'])
        const listLoading = _.get(state, ['notification', 'list', 'loading'])
        const updateForm = _.get(state, ['form', 'NotificationUpdateDialogForm'])
        const filter = filterHelper(list, pathname, query)

        return {
            list,
            listLoading,
            detail,
            detailLoading,
            filter,
            updateForm,
            query
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(notificationListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const itemId = _.get(nextProps, ['params', 'notificationId'])
        return itemId && _.get(props, ['params', 'notificationId']) !== itemId
    }, ({dispatch, params}) => {
        const itemId = _.toInteger(_.get(params, 'notificationId'))
        dispatch(notificationItemFetchAction(itemId))
    }),

    withHandlers({
        handleOpenUpdateDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.NOTIFICATION_ITEM_PATH, id),
                query: filter.getParams({[NOTIFICATION_UPDATE_DIALOG_OPEN]: id})
            })
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[NOTIFICATION_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, updateForm, filter, detail} = props
            const notificationId = _.toInteger(_.get(props, ['params', 'notificationId']))

            return dispatch(notificationUpdateAction(notificationId, _.get(updateForm, ['values']), detail))
                .then(() => {
                    return dispatch(notificationItemFetchAction(notificationId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[NOTIFICATION_UPDATE_DIALOG_OPEN]: false}))
                    dispatch(notificationListFetchAction(filter))
                })
        },
        handelChangeStatus: props => (item) => {
            const {dispatch, filter} = props

            return dispatch(notificationChangeStatusAction(_.get(item, 'id'), item))
                .then(() => {
                    return dispatch(notificationItemFetchAction(_.get(item, 'id')))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[NOTIFICATION_UPDATE_DIALOG_OPEN]: false}))
                    dispatch(notificationListFetchAction(filter))
                })
        }
    })
)

const NotificationList = enhance((props) => {
    const {
        list,
        listLoading,
        filter,
        layout,
        location,
        detail
    } = props

    const openUpdateDialog = _.get(location, ['query', 'openUpdateDialog'])

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

    return (
        <Layout {...layout}>
            <NotificationGridList
                filter={filter}
                listData={listData}
                updateDialog={updateDialog}
                changeDialog={changeDialog}
            />
        </Layout>
    )
})

export default NotificationList
