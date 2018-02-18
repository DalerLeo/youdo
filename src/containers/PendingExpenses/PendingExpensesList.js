import React from 'react'
import moment from 'moment'
import _ from 'lodash'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import {reset, change} from 'redux-form'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import {joinArray, splitToArray} from '../../helpers/joinSplitValues'
import toBoolean from '../../helpers/toBoolean'
import {
    PENDING_EXPENSES_UPDATE_DIALOG_OPEN,
    PENDING_EXPENSES_FILTER_KEY,
    PENDING_EXPENSES_FILTER_OPEN,
    PendingExpensesGridList
} from '../../components/PendingExpenses'
import {
    pendingExpensesUpdateAction,
    pendingExpensesListFetchAction
} from '../../actions/pendingExpenses'
import {cashboxListFetchAction} from '../../actions/cashbox'
import {transactionConvertAction} from '../../actions/transaction'
import {openErrorAction} from '../../actions/error'
import {openSnackbarAction} from '../../actions/snackbar'
import t from '../../helpers/translate'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const createLoading = _.get(state, ['pendingExpenses', 'create', 'loading'])
        const list = _.get(state, ['pendingExpenses', 'list', 'data'])
        const listLoading = _.get(state, ['pendingExpenses', 'list', 'loading'])
        const convertAmount = _.get(state, ['pendingPayments', 'convert', 'data', 'amount'])
        const convertLoading = _.get(state, ['pendingPayments', 'convert', 'loading'])
        const filterForm = _.get(state, ['form', 'PendingExpensesFilterForm'])
        const createForm = _.get(state, ['form', 'TransactionCreateForm'])
        const cashboxList = _.get(state, ['cashbox', 'list', 'data'])
        const cashboxListLoading = _.get(state, ['cashbox', 'list', 'loading'])
        const filterCashbox = filterHelper(cashboxList, pathname, query)
        const filter = filterHelper(list, pathname, query)

        return {
            list,
            listLoading,
            createLoading,
            convertAmount,
            convertLoading,
            filter,
            filterForm,
            createForm,
            cashboxList,
            cashboxListLoading,
            filterCashbox
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return !nextProps.cashboxListLoading && _.isNil(nextProps.cashboxList)
    }, ({dispatch, filterCashbox}) => {
        dispatch(cashboxListFetchAction(filterCashbox))
    }),

    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(pendingExpensesListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const cashbox = _.get(props, ['createForm', 'values', 'cashbox', 'value'])
        const nextCashbox = _.get(nextProps, ['createForm', 'values', 'cashbox', 'value'])
        const currencyRate = _.get(props, ['createForm', 'values', 'currencyRate'])
        const nextCurrencyRate = _.get(nextProps, ['createForm', 'values', 'currencyRate'])
        const date = _.get(props, ['createForm', 'values', 'date'])
        const nextDate = _.get(nextProps, ['createForm', 'values', 'date'])
        return (cashbox !== nextCashbox && nextCashbox) || (date !== nextDate && nextDate) || (currencyRate !== nextCurrencyRate && nextCurrencyRate)
    }, ({dispatch, createForm, cashboxList}) => {
        const cashbox = _.get(createForm, ['values', 'cashbox', 'value'])
        const currencyRate = _.get(createForm, ['values', 'currencyRate'])
        const order = _.get(createForm, ['values', 'order', 'value'])
        const date = _.get(createForm, ['values', 'date'])
        const currency = _.get(_.find(_.get(cashboxList, 'results'), {'id': cashbox}), ['currency', 'id'])
        const form = 'TransactionCreateForm'
        if (cashbox) {
            switch (currencyRate) {
                case 'order': return dispatch(transactionConvertAction(date, currency, order))
                case 'custom': return dispatch(change(form, 'custom_rate', ''))
                default: return dispatch(transactionConvertAction(date, currency))
            }
        }
        return null
    }),

    withPropsOnChange((props, nextProps) => {
        return props.convertLoading !== nextProps.convertLoading && nextProps.convertLoading === false
    }, ({dispatch, convertAmount}) => {
        if (convertAmount) {
            const form = 'TransactionCreateForm'
            dispatch(change(form, 'custom_rate', convertAmount))
        }
    }),

    withState('openConfirmDialog', 'setOpenConfirmDialog', false),
    withHandlers({
        handleOpenFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PENDING_EXPENSES_FILTER_OPEN]: true})})
        },

        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PENDING_EXPENSES_FILTER_OPEN]: false})})
        },

        handleClearFilterDialog: props => () => {
            const {location: {pathname}} = props
            hashHistory.push({pathname, query: {}})
        },

        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null
            const type = _.get(filterForm, ['values', 'type', 'value']) || null
            const paymentType = _.get(filterForm, ['values', 'paymentType', 'value']) || null
            const provider = _.get(filterForm, ['values', 'provider']) || null
            const supply = _.get(filterForm, ['values', 'supply']) || null
            const division = _.get(filterForm, ['values', 'division']) || null

            filter.filterBy({
                [PENDING_EXPENSES_FILTER_OPEN]: false,
                [PENDING_EXPENSES_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [PENDING_EXPENSES_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD'),
                [PENDING_EXPENSES_FILTER_KEY.TYPE]: type,
                [PENDING_EXPENSES_FILTER_KEY.PAYMENT_TYPE]: paymentType,
                [PENDING_EXPENSES_FILTER_KEY.PROVIDER]: joinArray(provider),
                [PENDING_EXPENSES_FILTER_KEY.SUPPLY]: joinArray(supply),
                [PENDING_EXPENSES_FILTER_KEY.DIVISION]: joinArray(division)
            })
        },

        handleOpenUpdateDialog: props => (id) => {
            const {filter, dispatch} = props
            dispatch(reset('PendingExpensesCreateForm'))
            hashHistory.push({
                pathname: sprintf(ROUTER.PENDING_EXPENSES_ITEM_PATH, id),
                query: filter.getParams({[PENDING_EXPENSES_UPDATE_DIALOG_OPEN]: true})
            })
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PENDING_EXPENSES_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter} = props
            return dispatch(pendingExpensesUpdateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[PENDING_EXPENSES_UPDATE_DIALOG_OPEN]: false}))
                    dispatch(pendingExpensesListFetchAction(filter))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        }
    })
)

const PendingExpensesList = enhance((props) => {
    const {
        location,
        list,
        listLoading,
        cashboxList,
        cashboxListLoading,
        filter,
        layout,
        params
    } = props

    const openFilterDialog = toBoolean(_.get(location, ['query', PENDING_EXPENSES_FILTER_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', PENDING_EXPENSES_UPDATE_DIALOG_OPEN]))
    const fromDate = filter.getParam(PENDING_EXPENSES_FILTER_KEY.FROM_DATE)
    const toDate = filter.getParam(PENDING_EXPENSES_FILTER_KEY.TO_DATE)
    const type = filter.getParam(PENDING_EXPENSES_FILTER_KEY.TYPE)
    const paymentType = filter.getParam(PENDING_EXPENSES_FILTER_KEY.PAYMENT_TYPE)
    const provider = filter.getParam(PENDING_EXPENSES_FILTER_KEY.PROVIDER)
    const supply = filter.getParam(PENDING_EXPENSES_FILTER_KEY.SUPPLY)
    const division = filter.getParam(PENDING_EXPENSES_FILTER_KEY.DIVISION)
    const detailId = _.toInteger(_.get(params, 'pendingExpensesId'))

    const cashboxData = {
        data: _.get(cashboxList, 'results'),
        listLoading: cashboxListLoading
    }

    const confirmDialog = {
        openConfirmDialog: props.openConfirmDialog,
        handleOpenConfirmDialog: props.handleOpenConfirmDialog,
        handleCloseConfirmDialog: props.handleCloseConfirmDialog,
        handleSendConfirmDialog: props.handleSendConfirmDialog
    }

    const updateDialog = {
        openUpdateDialog,
        handleOpenUpdateDialog: props.handleOpenUpdateDialog,
        handleCloseUpdateDialog: props.handleCloseUpdateDialog,
        handleSubmitUpdateDialog: props.handleSubmitUpdateDialog
    }

    const filterDialog = {
        initialValues: {
            date: {
                fromDate: fromDate && moment(fromDate, 'YYYY-MM-DD'),
                toDate: toDate && moment(toDate, 'YYYY-MM-DD')
            },
            type: {
                value: type
            },
            paymentType: {
                value: paymentType
            },
            provider: provider && splitToArray(provider),
            supply: supply && splitToArray(supply),
            division: division && splitToArray(division)
        },
        filterLoading: false,
        openFilterDialog,
        handleOpenFilterDialog: props.handleOpenFilterDialog,
        handleCloseFilterDialog: props.handleCloseFilterDialog,
        handleClearFilterDialog: props.handleClearFilterDialog,
        handleSubmitFilterDialog: props.handleSubmitFilterDialog
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

    return (
        <Layout {...layout}>
            <PendingExpensesGridList
                filter={filter}
                listData={listData}
                confirmDialog={confirmDialog}
                updateDialog={updateDialog}
                filterDialog={filterDialog}
                csvDialog={csvDialog}
                detailId={detailId}
                cashboxData={cashboxData}
            />
        </Layout>
    )
})

export default PendingExpensesList
