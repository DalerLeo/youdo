import React from 'react'
import moment from 'moment'
import _ from 'lodash'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import {reset, change} from 'redux-form'
import toBoolean from '../../helpers/toBoolean'
import filterHelper from '../../helpers/filter'

import {
    PENDING_PAYMENTS_UPDATE_DIALOG_OPEN,
    PENDING_PAYMENTS_FILTER_KEY,
    PENDING_PAYMENTS_FILTER_OPEN,
    PendingPaymentsGridList
} from '../../components/PendingPayments'
import {
    pendingPaymentsUpdateAction,
    pendingPaymentsListFetchAction,
    pendingPaymentsItemFetchAction
} from '../../actions/pendingPayments'
import {cashboxListFetchAction} from '../../actions/cashbox'
import {optionsListFetchAction} from '../../actions/expensiveCategory'
import {openErrorAction} from '../../actions/error'
import {transactionConvertAction} from '../../actions/transaction'
import {openSnackbarAction} from '../../actions/snackbar'
import t from '../../helpers/translate'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['pendingPayments', 'item', 'data'])
        const detailLoading = _.get(state, ['pendingPayments', 'item', 'loading'])
        const updateLoading = _.get(state, ['pendingPayments', 'update', 'loading'])
        const list = _.get(state, ['pendingPayments', 'list', 'data'])
        const listLoading = _.get(state, ['pendingPayments', 'list', 'loading'])
        const convertAmount = _.get(state, ['pendingPayments', 'convert', 'data', 'amount'])
        const convertLoading = _.get(state, ['pendingPayments', 'convert', 'loading'])
        const filterForm = _.get(state, ['form', 'PendingPaymentsFilterForm'])
        const createForm = _.get(state, ['form', 'TransactionCreateForm'])
        const convert = _.get(state, ['pendingPayments', 'convert'])
        const cashboxList = _.get(state, ['cashbox', 'list', 'data'])
        const cashboxListLoading = _.get(state, ['cashbox', 'list', 'loading'])
        const filter = filterHelper(list, pathname, query)
        const filterCashbox = filterHelper(cashboxList, pathname, query)
        return {
            list,
            listLoading,
            detail,
            detailLoading,
            convertAmount,
            convertLoading,
            updateLoading,
            filter,
            filterForm,
            createForm,
            convert,
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
        dispatch(pendingPaymentsListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const pendingPaymentsId = _.get(nextProps, ['params', 'pendingPaymentsId'])
        return pendingPaymentsId && _.get(props, ['params', 'pendingPaymentsId']) !== pendingPaymentsId
    }, ({dispatch, params}) => {
        const pendingPaymentsId = _.toInteger(_.get(params, 'pendingPaymentsId'))
        pendingPaymentsId && dispatch(pendingPaymentsItemFetchAction(pendingPaymentsId))
    }),

    withPropsOnChange((props, nextProps) => {
        const prevIncomeCat = _.get(props, ['createForm', 'values', 'incomeCategory', 'value', 'id'])
        const nextIncomeCat = _.get(nextProps, ['createForm', 'values', 'incomeCategory', 'value', 'id'])
        return prevIncomeCat !== nextIncomeCat && nextIncomeCat
    }, ({dispatch}) => {
        dispatch(optionsListFetchAction())
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
                case 'custom': return dispatch(change(form, 'customRate', ''))
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
            dispatch(change(form, 'customRate', convertAmount))
        }
    }),

    withState('openConfirmDialog', 'setOpenConfirmDialog', false),
    withHandlers({
        handleOpenFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PENDING_PAYMENTS_FILTER_OPEN]: true})})
        },

        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PENDING_PAYMENTS_FILTER_OPEN]: false})})
        },

        handleClearFilterDialog: props => () => {
            const {location: {pathname}} = props
            hashHistory.push({pathname, query: {}})
        },

        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null
            const client = _.get(filterForm, ['values', 'client']) || null
            const market = _.get(filterForm, ['values', 'market']) || null
            const agent = _.get(filterForm, ['values', 'agent']) || null
            const paymentType = _.get(filterForm, ['values', 'paymentType', 'value']) || null
            const division = _.get(filterForm, ['values', 'division']) || null

            filter.filterBy({
                [PENDING_PAYMENTS_FILTER_OPEN]: false,
                [PENDING_PAYMENTS_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [PENDING_PAYMENTS_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD'),
                [PENDING_PAYMENTS_FILTER_KEY.MARKET]: _.join(market, '-'),
                [PENDING_PAYMENTS_FILTER_KEY.AGENT]: _.join(agent, '-'),
                [PENDING_PAYMENTS_FILTER_KEY.DIVISION]: _.join(division, '-'),
                [PENDING_PAYMENTS_FILTER_KEY.CLIENT]: _.join(client, '-'),
                [PENDING_PAYMENTS_FILTER_KEY.PAYMENT_TYPE]: paymentType
            })
        },

        handleOpenUpdateDialog: props => (id) => {
            const {filter, dispatch, detail} = props

            hashHistory.push({
                pathname: sprintf(ROUTER.PENDING_PAYMENTS_ITEM_PATH, id),
                query: filter.getParams({[PENDING_PAYMENTS_UPDATE_DIALOG_OPEN]: true})
            })
            dispatch(reset('PendingPaymentsCreateForm'))
            if (_.get(detail, 'id') === id) {
                dispatch(pendingPaymentsItemFetchAction(id))
            }
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PENDING_PAYMENTS_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter} = props
            const pendingPaymentsId = _.toInteger(_.get(props, ['params', 'pendingPaymentsId']))
            return dispatch(pendingPaymentsUpdateAction(_.get(createForm, ['values']), pendingPaymentsId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[PENDING_PAYMENTS_UPDATE_DIALOG_OPEN]: false}))
                    dispatch(pendingPaymentsListFetchAction(filter))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        }
    })
)

const PendingPaymentsList = enhance((props) => {
    const {
        location,
        list,
        listLoading,
        detail,
        detailLoading,
        updateLoading,
        cashboxList,
        cashboxListLoading,
        filter,
        layout,
        convert,
        params
    } = props

    const openFilterDialog = toBoolean(_.get(location, ['query', PENDING_PAYMENTS_FILTER_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', PENDING_PAYMENTS_UPDATE_DIALOG_OPEN]))
    const fromDate = filter.getParam(PENDING_PAYMENTS_FILTER_KEY.FROM_DATE)
    const paymentType = filter.getParam(PENDING_PAYMENTS_FILTER_KEY.PAYMENT_TYPE)
    const client = filter.getParam(PENDING_PAYMENTS_FILTER_KEY.CLIENT)
    const market = filter.getParam(PENDING_PAYMENTS_FILTER_KEY.MARKET)
    const agent = filter.getParam(PENDING_PAYMENTS_FILTER_KEY.AGENT)
    const division = filter.getParam(PENDING_PAYMENTS_FILTER_KEY.DIVISION)
    const toDate = filter.getParam(PENDING_PAYMENTS_FILTER_KEY.TO_DATE)
    const detailId = _.toInteger(_.get(params, 'pendingPaymentsId'))

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
        initialValues: {},
        loading: detailLoading || updateLoading,
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
            paymentType: {
                value: paymentType
            },
            client: client && _.map(_.split(client, '-'), (item) => {
                return _.toNumber(item)
            }),
            market: market && _.map(_.split(market, '-'), (item) => {
                return _.toNumber(item)
            }),
            agent: agent && _.map(_.split(agent, '-'), (item) => {
                return _.toNumber(item)
            }),
            division: division && _.map(_.split(division, '-'), (item) => {
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
            <PendingPaymentsGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                confirmDialog={confirmDialog}
                updateDialog={updateDialog}
                filterDialog={filterDialog}
                convert={convert}
                cashboxData={cashboxData}
            />
        </Layout>
    )
})

export default PendingPaymentsList
