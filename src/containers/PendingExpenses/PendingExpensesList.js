import React from 'react'
import moment from 'moment'
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
    PENDING_EXPENSES_UPDATE_DIALOG_OPEN,
    PENDING_EXPENSES_FILTER_KEY,
    PENDING_EXPENSES_FILTER_OPEN,
    PendingExpensesGridList
} from '../../components/PendingExpenses'
import {
    pendingExpensesUpdateAction,
    pendingExpensesListFetchAction
} from '../../actions/pendingExpenses'
import {openErrorAction} from '../../actions/error'
import {openSnackbarAction} from '../../actions/snackbar'
import {reset} from 'redux-form'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const createLoading = _.get(state, ['pendingExpenses', 'create', 'loading'])
        const list = _.get(state, ['pendingExpenses', 'list', 'data'])
        const listLoading = _.get(state, ['pendingExpenses', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'PendingExpensesFilterForm'])
        const createForm = _.get(state, ['form', 'PendingExpensesCreateForm'])
        const filter = filterHelper(list, pathname, query)

        return {
            list,
            listLoading,
            createLoading,
            filter,
            filterForm,
            createForm
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(pendingExpensesListFetchAction(filter))
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

            filter.filterBy({
                [PENDING_EXPENSES_FILTER_OPEN]: false,
                [PENDING_EXPENSES_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [PENDING_EXPENSES_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD'),
                [PENDING_EXPENSES_FILTER_KEY.TYPE]: type,
                [PENDING_EXPENSES_FILTER_KEY.PAYMENT_TYPE]: paymentType,
                [PENDING_EXPENSES_FILTER_KEY.PROVIDER]: _.join(provider, '-'),
                [PENDING_EXPENSES_FILTER_KEY.SUPPLY]: _.join(supply, '-')
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

        handleSubmitUpdateDialog: props => (detail) => {
            const {dispatch, createForm, filter} = props
            return dispatch(pendingExpensesUpdateAction(detail, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
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
    const detailId = _.toInteger(_.get(params, 'pendingExpensesId'))

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
            provider: provider && _.map(_.split(provider, '-'), (item) => {
                return _.toNumber(item)
            }),
            supply: supply && _.map(_.split(supply, '-'), (item) => {
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
            />
        </Layout>
    )
})

export default PendingExpensesList
