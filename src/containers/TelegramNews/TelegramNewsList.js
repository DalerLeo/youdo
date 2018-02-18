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
import {} from '../../helpers/toCamelCase'
import toBoolean from '../../helpers/toBoolean'
import {
    TELEGRAM_NEWS_CREATE_DIALOG_OPEN,
    TELEGRAM_NEWS_UPDATE_DIALOG_OPEN,
    TelegramNewsGridList
} from '../../components/TelegramNews'
import {
    telegramNewsCreateAction,
    telegramNewsUpdateAction,
    telegramNewsListFetchAction,
    telegramNewsDeleteAction,
    telegramNewsItemFetchAction
} from '../../actions/telegramNews'
import {openSnackbarAction} from '../../actions/snackbar'
import {openErrorAction} from '../../actions/error'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['telegramNews', 'item', 'data'])
        const detailLoading = _.get(state, ['telegramNews', 'item', 'loading'])
        const createLoading = _.get(state, ['telegramNews', 'create', 'loading'])
        const updateLoading = _.get(state, ['telegramNews', 'update', 'loading'])
        const list = _.get(state, ['telegramNews', 'list', 'data'])
        const listLoading = _.get(state, ['telegramNews', 'list', 'loading'])
        const createForm = _.get(state, ['form', 'TelegramNewsCreateForm'])
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
        dispatch(telegramNewsListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const telegramNewsId = _.get(nextProps, ['params', 'telegramNewsId'])
        return telegramNewsId && _.get(props, ['params', 'telegramNewsId']) !== telegramNewsId
    }, ({dispatch, params}) => {
        const telegramNewsId = _.toInteger(_.get(params, 'telegramNewsId'))
        telegramNewsId && dispatch(telegramNewsItemFetchAction(telegramNewsId))
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
            dispatch(telegramNewsDeleteAction(detail.id))
                .then(() => {
                    setOpenConfirmDialog(false)
                    dispatch(telegramNewsListFetchAction(filter))
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Удаление невозможно из-за связи с другими данными'}))
                })
        },

        handleOpenCreateDialog: props => () => {
            const {dispatch, location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TELEGRAM_NEWS_CREATE_DIALOG_OPEN]: true})})
            dispatch(reset('TelegramNewsCreateForm'))
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TELEGRAM_NEWS_CREATE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}} = props

            return dispatch(telegramNewsCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[TELEGRAM_NEWS_CREATE_DIALOG_OPEN]: false})})
                    dispatch(telegramNewsListFetchAction(filter))
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
                pathname: sprintf(ROUTER.TELEGRAM_NEWS_ITEM_PATH, id),
                query: filter.getParams({[TELEGRAM_NEWS_UPDATE_DIALOG_OPEN]: true})
            })
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TELEGRAM_NEWS_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter} = props
            const telegramNewsId = _.toInteger(_.get(props, ['params', 'telegramNewsId']))

            return dispatch(telegramNewsUpdateAction(telegramNewsId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(telegramNewsItemFetchAction(telegramNewsId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[TELEGRAM_NEWS_UPDATE_DIALOG_OPEN]: false}))
                    dispatch(telegramNewsListFetchAction(filter))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },

        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.TELEGRAM_NEWS_LIST_URL, query: filter.getParams()})
        }
    })
)

const TelegramNewsList = enhance((props) => {
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

    const openCreateDialog = toBoolean(_.get(location, ['query', TELEGRAM_NEWS_CREATE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', TELEGRAM_NEWS_UPDATE_DIALOG_OPEN]))
    const detailId = _.toInteger(_.get(params, 'telegramNewsId'))

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
                title: _.get(detail, 'title'),
                description: _.get(detail, 'description'),
                content: _.get(detail, 'telegraph_link'),
                translations: {
                    ru: {
                        title: _.get(detail, 'title'),
                        description: _.get(detail, 'description'),
                        'telegraph_link': _.get(detail, 'telegraphLink')
                    },
                    en: {
                        title: _.get(detail, 'title'),
                        description: _.get(detail, 'description'),
                        'telegraph_link': _.get(detail, 'telegraphLink')
                    },
                    uz: {
                        title: _.get(detail, 'title'),
                        description: _.get(detail, 'description'),
                        'telegraph_link': _.get(detail, 'telegraphLink')
                    }
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
        detailLoading,
        handleCloseDetail: props.handleCloseDetail
    }

    return (
        <Layout {...layout}>
            <TelegramNewsGridList
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

export default TelegramNewsList
