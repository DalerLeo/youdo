import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers, withState} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {splitToArray, joinArray} from '../../helpers/joinSplitValues'
import {openErrorAction} from '../../actions/error'
import moment from 'moment'

import {
    CLIENT_TRANSACTION_DELETE_DIALOG_OPEN,
    CLIENT_TRANSACTION_FILTER_KEY,
    CLIENT_TRANSACTION_FILTER_OPEN,
    ClientTransactionGridList
} from '../../components/ClientTransaction'
import {
    clientTransactionListFetchAction,
    clientTransactionDeleteAction,
    clientTransactionResendAction
} from '../../actions/clientTransaction'
import {openSnackbarAction} from '../../actions/snackbar'
import t from '../../helpers/translate'

const ZERO = 0
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const list = _.get(state, ['clientTransaction', 'list', 'data'])
        const listLoading = _.get(state, ['clientTransaction', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'ClientTransactionFilterForm'])
        const filter = filterHelper(list, pathname, query)
        const isAdmin = _.get(state, ['authConfirm', 'data', 'isSuperuser'])
        return {
            list,
            listLoading,
            filter,
            filterForm,
            isAdmin
        }
    }),

    withState('openResendDialog', 'setOpenResendDialog', false),
    withPropsOnChange((props, nextProps) => {
        return (props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()) ||
            (_.get(props, ['params', 'clientTransactionId']) !== _.get(nextProps, ['params', 'clientTransactionId']))
    }, ({dispatch, filter, params}) => {
        const clientId = _.toInteger(_.get(params, 'clientTransactionId'))
        dispatch(clientTransactionListFetchAction(filter, clientId === ZERO ? null : clientId))
    }),

    withHandlers({
        handleOpenConfirmDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.CLIENT_TRANSACTION_ITEM_PATH, id),
                query: filter.getParams({[CLIENT_TRANSACTION_DELETE_DIALOG_OPEN]: true})
            })
        },

        handleCloseConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CLIENT_TRANSACTION_DELETE_DIALOG_OPEN]: false})})
        },
        handleSubmitConfirmDialog: props => () => {
            const {dispatch, filter, location: {pathname}, clientId, params} = props
            const transactionID = _.toInteger(_.get(params, 'transactionId'))
            dispatch(clientTransactionDeleteAction(transactionID))
                .then(() => {
                    hashHistory.push({
                        pathname,
                        query: filter.getParams({[CLIENT_TRANSACTION_DELETE_DIALOG_OPEN]: false})
                    })
                    dispatch(clientTransactionListFetchAction(filter, clientId))
                    return dispatch(openSnackbarAction({message: t('Транзакция успешно удалена')}))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },

        handleOpenResendDialog: props => (id) => {
            const {filter, setOpenResendDialog} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.CLIENT_TRANSACTION_ITEM_PATH, id),
                query: filter.getParams()
            })
            setOpenResendDialog(true)
        },

        handleCloseResendDialog: props => () => {
            const {setOpenResendDialog} = props
            setOpenResendDialog(false)
        },
        handleSubmitResendDialog: props => () => {
            const {dispatch, filter, clientId, params, setOpenResendDialog} = props
            const transactionID = _.toInteger(_.get(params, 'transactionId'))
            dispatch(clientTransactionResendAction(transactionID))
                .then(() => {
                    setOpenResendDialog(false)
                    dispatch(clientTransactionListFetchAction(filter, clientId))
                    return dispatch(openSnackbarAction({message: t('Транзакция переотправлена')}))
                })
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Ошибка при отправке запроса'}))
                })
        },

        handleOpenFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CLIENT_TRANSACTION_FILTER_OPEN]: true})})
        },

        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CLIENT_TRANSACTION_FILTER_OPEN]: false})})
        },

        handleClearFilterDialog: props => () => {
            const {location: {pathname}} = props
            hashHistory.push({pathname, query: {}})
        },

        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const division = _.get(filterForm, ['values', 'division']) || null
            const client = _.get(filterForm, ['values', 'client']) || null
            const status = _.get(filterForm, ['values', 'status', 'value']) || null
            const fromDate = _.get(filterForm, ['values', 'createdDate', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'createdDate', 'toDate']) || null

            filter.filterBy({
                [CLIENT_TRANSACTION_FILTER_OPEN]: false,
                [CLIENT_TRANSACTION_FILTER_KEY.DIVISION]: joinArray(division),
                [CLIENT_TRANSACTION_FILTER_KEY.CLIENT]: joinArray(client),
                [CLIENT_TRANSACTION_FILTER_KEY.STATUS]: status,
                [CLIENT_TRANSACTION_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [CLIENT_TRANSACTION_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')
            })
        },

        handleClickClient: props => (id) => {
            hashHistory.push({pathname: sprintf(ROUTER.CLIENT_TRANSACTION_ITEM_PATH, _.toInteger(id)), query: {}})
        }
    })
)

const ClientTransactionList = enhance((props) => {
    const {
        location,
        list,
        listLoading,
        filter,
        layout,
        params,
        isAdmin
    } = props

    const openFilterDialog = toBoolean(_.get(location, ['query', CLIENT_TRANSACTION_FILTER_OPEN]))
    const openConfirmDialog = toBoolean(_.get(location, ['query', CLIENT_TRANSACTION_DELETE_DIALOG_OPEN]))

    const status = filter.getParam(CLIENT_TRANSACTION_FILTER_KEY.STATUS)
    const division = _.toInteger(filter.getParam(CLIENT_TRANSACTION_FILTER_KEY.DIVISION))
    const client = _.toInteger(filter.getParam(CLIENT_TRANSACTION_FILTER_KEY.CLIENT))
    const fromDate = filter.getParam(CLIENT_TRANSACTION_FILTER_KEY.FROM_DATE)
    const toDate = filter.getParam(CLIENT_TRANSACTION_FILTER_KEY.TO_DATE)
    const transactionID = _.toInteger(_.get(params, 'transactionId'))

    const confirmDialog = {
        open: openConfirmDialog,
        handleOpenConfirmDialog: props.handleOpenConfirmDialog,
        handleCloseConfirmDialog: props.handleCloseConfirmDialog,
        handleSubmitConfirmDialog: props.handleSubmitConfirmDialog
    }
    const resendDialog = {
        open: props.openResendDialog,
        handleOpenResendDialog: props.handleOpenResendDialog,
        handleCloseResendDialog: props.handleCloseResendDialog,
        handleSubmitResendDialog: props.handleSubmitResendDialog
    }

    const filterDialog = {
        initialValues: {
            division: division && splitToArray(division),
            client: client && splitToArray(client),
            status: {
                value: status
            },
            createdDate: {
                fromDate: fromDate && moment(fromDate, 'YYYY-MM-DD'),
                toDate: toDate && moment(toDate, 'YYYY-MM-DD')
            }
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

    return (
        <Layout {...layout}>
            <ClientTransactionGridList
                filter={filter}
                listData={listData}
                transactionID={transactionID}
                confirmDialog={confirmDialog}
                resendDialog={resendDialog}
                filterDialog={filterDialog}
                isAdmin={isAdmin}
            />
        </Layout>
    )
})

export default ClientTransactionList
