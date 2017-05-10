import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {
    CURRENCY_CREATE_DIALOG_OPEN,
    CURRENCY_UPDATE_DIALOG_OPEN,
    PRIMARY_CURRENCY_DIALOG_OPEN,
    CURRENCY_DELETE_DIALOG_OPEN,
    CurrencyGridList
} from '../../components/Currency'
import {
    currencyCreateAction,
    currencyUpdateAction,
    currencyListFetchAction,
    currencyCSVFetchAction,
    currencyDeleteAction,
    currencyItemFetchAction,
    currencyPrimaryFetchAction,
    currencyPrimaryCreateAction
} from '../../actions/currency'
import {openSnackbarAction} from '../../actions/snackbar'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['currency', 'item', 'data'])
        const detailLoading = _.get(state, ['currency', 'item', 'loading'])
        const createLoading = _.get(state, ['currency', 'create', 'loading'])
        const updateLoading = _.get(state, ['currency', 'update', 'loading'])
        const primaryCurrency = _.get(state, ['currency', 'primary', 'data', 'data'])
        const primaryCurrencyLoading = _.get(state, ['currency', 'primary', 'loading'])
        const list = _.get(state, ['currency', 'list', 'data'])
        const listLoading = _.get(state, ['currency', 'list', 'loading'])
        const csvData = _.get(state, ['currency', 'csv', 'data'])
        const csvLoading = _.get(state, ['currency', 'csv', 'loading'])
        const createForm = _.get(state, ['form', 'CurrencyCreateForm'])
        const baseCreateForm = _.get(state, ['form', 'BaseCurrencyCreateForm'])
        const filter = filterHelper(list, pathname, query)
        return {
            list,
            listLoading,
            detail,
            detailLoading,
            createLoading,
            updateLoading,
            primaryCurrency,
            primaryCurrencyLoading,
            csvData,
            csvLoading,
            filter,
            baseCreateForm,
            createForm
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(currencyListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        return !nextProps.primaryCurrencyLoading && _.isNil(props.primaryCurrency)
    }, ({dispatch}) => {
        dispatch(currencyPrimaryFetchAction())
    }),

    withPropsOnChange((props, nextProps) => {
        const currencyId = _.get(nextProps, ['params', 'currencyId'])
        return currencyId && _.get(props, ['params', 'currencyId']) !== currencyId
    }, ({dispatch, params}) => {
        const currencyId = _.toInteger(_.get(params, 'currencyId'))
        currencyId && dispatch(currencyItemFetchAction(currencyId))
    }),

    withState('openCSVDialog', 'setOpenCSVDialog', false),
    withState('openConfirmDialog', 'setOpenConfirmDialog', false),

    withHandlers({
        handleActionEdit: props => () => {
            return null
        },

        handleOpenCSVDialog: props => () => {
            const {dispatch, setOpenCSVDialog} = props
            setOpenCSVDialog(true)

            dispatch(currencyCSVFetchAction(props.filter))
        },

        handleCloseCSVDialog: props => () => {
            const {setOpenCSVDialog} = props
            setOpenCSVDialog(false)
        },

        handleOpenConfirmDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.CURRENCY_ITEM_PATH, id),
                query: filter.getParams({[CURRENCY_DELETE_DIALOG_OPEN]: true})
            })
        },

        handleCloseConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CURRENCY_DELETE_DIALOG_OPEN]: false})})
        },
        handleSendConfirmDialog: props => () => {
            const {dispatch, detail, filter, location: {pathname}} = props
            dispatch(currencyDeleteAction(detail.id))
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[CURRENCY_DELETE_DIALOG_OPEN]: false})})
                    dispatch(currencyListFetchAction(filter))
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
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CURRENCY_CREATE_DIALOG_OPEN]: true})})
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CURRENCY_CREATE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, filter} = props

            return dispatch(currencyCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({query: filter.getParams({[CURRENCY_CREATE_DIALOG_OPEN]: false})})
                })
        },

        handlePrimaryOpenDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRIMARY_CURRENCY_DIALOG_OPEN]: true})})
        },

        handlePrimaryCloseDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRIMARY_CURRENCY_DIALOG_OPEN]: false})})
        },

        handleSubmitPrimaryDialog: props => () => {
            const {dispatch, baseCreateForm, filter, location: {pathname}} = props

            return dispatch(currencyPrimaryCreateAction(_.get(baseCreateForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[PRIMARY_CURRENCY_DIALOG_OPEN]: false})})
                    dispatch(currencyPrimaryFetchAction())
                })
        },

        handleOpenUpdateDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.CURRENCY_ITEM_PATH, id),
                query: filter.getParams({[CURRENCY_UPDATE_DIALOG_OPEN]: true})
            })
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CURRENCY_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter} = props
            const currencyId = _.toInteger(_.get(props, ['params', 'currencyId']))

            return dispatch(currencyUpdateAction(currencyId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(currencyItemFetchAction(currencyId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[CURRENCY_UPDATE_DIALOG_OPEN]: false}))
                })
        }
    })
)

const CurrencyList = enhance((props) => {
    const {
        location,
        list,
        listLoading,
        detail,
        detailLoading,
        createLoading,
        updateLoading,
        primaryCurrency,
        primaryCurrencyLoading,
        filter,
        layout,
        params
    } = props

    const openCreateDialog = toBoolean(_.get(location, ['query', CURRENCY_CREATE_DIALOG_OPEN]))
    const openPrimaryDialog = toBoolean(_.get(location, ['query', PRIMARY_CURRENCY_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', CURRENCY_UPDATE_DIALOG_OPEN]))
    const openConfirmDialog = toBoolean(_.get(location, ['query', CURRENCY_DELETE_DIALOG_OPEN]))

    const detailId = _.toInteger(_.get(params, 'currencyId'))

    const actionsDialog = {
        handleActionEdit: props.handleActionEdit,
        handleActionDelete: props.handleOpenDeleteDialog
    }

    const primaryDialog = {
        initialValues: (() => {
            if (!primaryCurrency) {
                return {}
            }
            return {
                currency: {
                    value: _.get(primaryCurrency, 'currency')
                }
            }
        })(),
        primaryCurrency: primaryCurrency,
        openPrimaryDialog,
        primaryCurrencyLoading,
        handlePrimaryOpenDialog: props.handlePrimaryOpenDialog,
        handlePrimaryCloseDialog: props.handlePrimaryCloseDialog,
        handleSubmitPrimaryDialog: props.handleSubmitPrimaryDialog
    }
    const createDialog = {
        createLoading,
        openCreateDialog,
        handleOpenCreateDialog: props.handleOpenCreateDialog,
        handleCloseCreateDialog: props.handleCloseCreateDialog,
        handleSubmitCreateDialog: props.handleSubmitCreateDialog
    }

    const confirmDialog = {
        openConfirmDialog: openConfirmDialog,
        handleOpenConfirmDialog: props.handleOpenConfirmDialog,
        handleCloseConfirmDialog: props.handleCloseConfirmDialog,
        handleSendConfirmDialog: props.handleSendConfirmDialog
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
        updateLoading: detailLoading || updateLoading,
        openUpdateDialog,
        handleOpenUpdateDialog: props.handleOpenUpdateDialog,
        handleCloseUpdateDialog: props.handleCloseUpdateDialog,
        handleSubmitUpdateDialog: props.handleSubmitUpdateDialog
    }

    const csvDialog = {
        csvData: props.csvData,
        csvLoading: props.csvLoading,
        openCSVDialog: props.openCSVDialog,
        handleOpenCSVDialog: props.handleOpenCSVDialog,
        handleCloseCSVDialog: props.handleCloseCSVDialog
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
            <CurrencyGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                createDialog={createDialog}
                primaryDialog={primaryDialog}
                confirmDialog={confirmDialog}
                updateDialog={updateDialog}
                actionsDialog={actionsDialog}
                csvDialog={csvDialog}
            />
        </Layout>
    )
})

export default CurrencyList