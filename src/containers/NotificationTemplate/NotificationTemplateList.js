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
    NotificationTemplateGridList,
    NOTIFICATION_UPDATE_DIALOG_OPEN
} from '../../components/NotificationTemplate'
import {
    notificationTemplateListFetchAction,
    notificationTemplateItemFetchAction,
    notificationTemplateUpdateAction,
    notificationTemplateChangeStatusAction
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
        dispatch(notificationTemplateListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const itemId = _.get(nextProps, ['params', 'notificationTemplateId'])
        return itemId && _.get(props, ['params', 'notificationTemplateId']) !== itemId
    }, ({dispatch, params}) => {
        const itemId = _.toInteger(_.get(params, 'notificationTemplateId'))
        dispatch(notificationTemplateItemFetchAction(itemId))
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
                    return dispatch(notificationTemplateItemFetchAction(notificationTemplateId))
                })
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
                    return dispatch(notificationTemplateItemFetchAction(_.get(item, 'id')))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[NOTIFICATION_UPDATE_DIALOG_OPEN]: false}))
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
            <NotificationTemplateGridList
                filter={filter}
                listData={listData}
                updateDialog={updateDialog}
                changeDialog={changeDialog}
            />
        </Layout>
    )
})

export default NotificationTemplateList
