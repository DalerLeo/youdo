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
    MARKET_TYPE_CREATE_DIALOG_OPEN,
    MARKET_TYPE_UPDATE_DIALOG_OPEN,
    MARKET_TYPE_DELETE_DIALOG_OPEN,
    MarketTypeGridList
} from '../../components/MarketType'
import {
    marketTypeCreateAction,
    marketTypeUpdateAction,
    marketTypeListFetchAction,
    marketTypeDeleteAction,
    marketTypeItemFetchAction
} from '../../actions/marketType'
import {openErrorAction} from '../../actions/error'
import {openSnackbarAction} from '../../actions/snackbar'
import t from '../../helpers/translate'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['marketType', 'item', 'data'])
        const detailLoading = _.get(state, ['marketType', 'item', 'loading'])
        const createLoading = _.get(state, ['marketType', 'create', 'loading'])
        const updateLoading = _.get(state, ['marketType', 'update', 'loading'])
        const list = _.get(state, ['marketType', 'list', 'data'])
        const listLoading = _.get(state, ['marketType', 'list', 'loading'])
        const createForm = _.get(state, ['form', 'MarketTypeCreateForm'])
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
        dispatch(marketTypeListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const marketTypeId = _.get(nextProps, ['params', 'marketTypeId'])

        return marketTypeId && _.get(props, ['params', 'marketTypeId']) !== marketTypeId
    }, ({dispatch, params}) => {
        const marketTypeId = _.toInteger(_.get(params, 'marketTypeId'))
        marketTypeId && dispatch(marketTypeItemFetchAction(marketTypeId))
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
                pathname: sprintf(ROUTER.MARKET_TYPE_ITEM_PATH, id),
                query: filter.getParams({[MARKET_TYPE_DELETE_DIALOG_OPEN]: true})
            })
        },

        handleCloseConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[MARKET_TYPE_DELETE_DIALOG_OPEN]: false})})
        },
        handleSendConfirmDialog: props => () => {
            const {dispatch, detail, filter, location: {pathname}} = props
            dispatch(marketTypeDeleteAction(detail.id))
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[MARKET_TYPE_DELETE_DIALOG_OPEN]: false})})
                    dispatch(marketTypeListFetchAction(filter))
                    return dispatch(openSnackbarAction({message: t('Успешно удалено')}))
                })
                .catch(() => {
                    return dispatch(openSnackbarAction({message: t('Ошибка при удалении')}))
                })
        },

        handleOpenCreateDialog: props => () => {
            const {dispatch, location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[MARKET_TYPE_CREATE_DIALOG_OPEN]: true})})
            dispatch(reset('MarketTypeCreateForm'))
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[MARKET_TYPE_CREATE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}} = props

            return dispatch(marketTypeCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[MARKET_TYPE_CREATE_DIALOG_OPEN]: false})})
                    dispatch(marketTypeListFetchAction(filter))
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
                pathname: sprintf(ROUTER.MARKET_TYPE_ITEM_PATH, id),
                query: filter.getParams({[MARKET_TYPE_UPDATE_DIALOG_OPEN]: true})
            })
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[MARKET_TYPE_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter} = props
            const marketTypeId = _.toInteger(_.get(props, ['params', 'marketTypeId']))

            return dispatch(marketTypeUpdateAction(marketTypeId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[MARKET_TYPE_UPDATE_DIALOG_OPEN]: false}))
                    dispatch(marketTypeListFetchAction(filter))
                })
        }
    })
)

const MarketTypeList = enhance((props) => {
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

    const openCreateDialog = toBoolean(_.get(location, ['query', MARKET_TYPE_CREATE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', MARKET_TYPE_UPDATE_DIALOG_OPEN]))
    const openConfirmDialog = toBoolean(_.get(location, ['query', MARKET_TYPE_DELETE_DIALOG_OPEN]))

    const detailId = _.toInteger(_.get(params, 'marketTypeId'))

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
                parent: {value: _.get(detail, 'parent')},
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
        data: list,
        listLoading
    }
    const detailData = {
        id: detailId,
        data: detail,
        detailLoading
    }

    return (
        <Layout {...layout}>
            <MarketTypeGridList
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

export default MarketTypeList
