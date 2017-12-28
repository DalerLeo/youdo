import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import moment from 'moment'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {
    CLIENT_TRANSACTION_DELETE_DIALOG_OPEN,
    CLIENT_TRANSACTION_FILTER_KEY,
    CLIENT_TRANSACTION_FILTER_OPEN,
    ClientTransactionGridList
} from '../../components/ClientTransaction'
import {
    clientTransactionListFetchAction,
    clientTransactionDeleteAction
} from '../../actions/clientTransaction'
import {openSnackbarAction} from '../../actions/snackbar'

const ZERO = 0
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['clientTransaction', 'item', 'data'])
        const detailLoading = _.get(state, ['clientTransaction', 'item', 'loading'])
        const list = _.get(state, ['clientTransaction', 'list', 'data'])
        const listLoading = _.get(state, ['clientTransaction', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'ClientTransactionFilterForm'])
        const filter = filterHelper(list, pathname, query)
        return {
            list,
            listLoading,
            detail,
            detailLoading,
            filter,
            filterForm
        }
    }),

    withPropsOnChange((props, nextProps) => {
        return (props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()) ||
            (_.get(props, ['params', 'clientTransactionId']) !== _.get(nextProps, ['params', 'clientTransactionId']))
    }, ({dispatch, filter, params}) => {
        const clientId = _.toInteger(_.get(params, 'clientTransactionId'))
        dispatch(clientTransactionListFetchAction(filter, clientId === ZERO ? null : clientId))
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
                pathname: sprintf(ROUTER.CLIENT_TRANSACTION_ITEM_PATH, id),
                query: filter.getParams({[CLIENT_TRANSACTION_DELETE_DIALOG_OPEN]: true})
            })
        },

        handleCloseConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CLIENT_TRANSACTION_DELETE_DIALOG_OPEN]: false})})
        },
        handleExpenseConfirmDialog: props => () => {
            const {dispatch, detail, filter, location: {pathname}, clientId} = props
            dispatch(clientTransactionDeleteAction(detail.id))
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .then(() => {
                    hashHistory.push({
                        pathname,
                        query: filter.getParams({[CLIENT_TRANSACTION_DELETE_DIALOG_OPEN]: false})
                    })
                    dispatch(clientTransactionListFetchAction(filter, clientId))
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
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null
            const type = _.get(filterForm, ['values', 'type', 'value']) || null
            const categoryExpense = _.get(filterForm, ['values', 'categoryExpense', 'value']) || null

            filter.filterBy({
                [CLIENT_TRANSACTION_FILTER_OPEN]: false,
                [CLIENT_TRANSACTION_FILTER_KEY.TYPE]: type,
                [CLIENT_TRANSACTION_FILTER_KEY.CATEGORY_EXPENSE]: categoryExpense,
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
        detail,
        detailLoading,
        filter,
        layout,
        params
    } = props

    const openFilterDialog = toBoolean(_.get(location, ['query', CLIENT_TRANSACTION_FILTER_OPEN]))
    const openConfirmDialog = toBoolean(_.get(location, ['query', CLIENT_TRANSACTION_DELETE_DIALOG_OPEN]))

    const categoryExpense = _.toInteger(filter.getParam(CLIENT_TRANSACTION_FILTER_KEY.CATEGORY_EXPENSE))
    const type = _.toInteger(filter.getParam(CLIENT_TRANSACTION_FILTER_KEY.TYPE))
    const fromDate = filter.getParam(CLIENT_TRANSACTION_FILTER_KEY.FROM_DATE)
    const toDate = filter.getParam(CLIENT_TRANSACTION_FILTER_KEY.TO_DATE)
    const detailId = _.toInteger(_.get(params, 'clientTransactionId'))

    const actionsDialog = {
        handleActionEdit: props.handleActionEdit,
        handleActionDelete: props.handleOpenDeleteDialog
    }

    const confirmDialog = {
        open: openConfirmDialog,
        handleOpenConfirmDialog: props.handleOpenConfirmDialog,
        handleCloseConfirmDialog: props.handleCloseConfirmDialog,
        handleExpenseConfirmDialog: props.handleExpenseConfirmDialog
    }

    const filterDialog = {
        initialValues: {
            category: categoryExpense && _.map(_.split(categoryExpense, '-'), (item) => {
                return _.toNumber(item)
            }),
            type: {
                value: type
            },
            date: {
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

    const detailData = {
        id: detailId,
        data: detail,
        detailLoading
    }

    return (
        <Layout {...layout}>
            <ClientTransactionGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                confirmDialog={confirmDialog}
                actionsDialog={actionsDialog}
                filterDialog={filterDialog}
            />
        </Layout>
    )
})

export default ClientTransactionList
