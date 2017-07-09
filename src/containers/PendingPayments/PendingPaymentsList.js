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

import {openSnackbarAction} from '../../actions/snackbar'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['pendingPayments', 'item', 'data'])
        const detailLoading = _.get(state, ['pendingPayments', 'item', 'loading'])
        const updateLoading = _.get(state, ['pendingPayments', 'update', 'loading'])
        const list = _.get(state, ['pendingPayments', 'list', 'data'])
        const listLoading = _.get(state, ['pendingPayments', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'PendingPaymentsFilterForm'])
        const createForm = _.get(state, ['form', 'PendingPaymentsCreateForm'])
        const filter = filterHelper(list, pathname, query)

        return {
            list,
            listLoading,
            detail,
            detailLoading,
            updateLoading,
            filter,
            filterForm,
            createForm
        }
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

            filter.filterBy({
                [PENDING_PAYMENTS_FILTER_OPEN]: false,
                [PENDING_PAYMENTS_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [PENDING_PAYMENTS_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')
            })
        },

        handleOpenUpdateDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.PENDING_PAYMENTS_ITEM_PATH, id),
                query: filter.getParams({[PENDING_PAYMENTS_UPDATE_DIALOG_OPEN]: true})
            })
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
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[PENDING_PAYMENTS_UPDATE_DIALOG_OPEN]: false}))
                    dispatch(pendingPaymentsListFetchAction(filter))
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
        filter,
        layout,
        params
    } = props

    const openFilterDialog = toBoolean(_.get(location, ['query', PENDING_PAYMENTS_FILTER_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', PENDING_PAYMENTS_UPDATE_DIALOG_OPEN]))
    const fromDate = filter.getParam(PENDING_PAYMENTS_FILTER_KEY.FROM_DATE)
    const toDate = filter.getParam(PENDING_PAYMENTS_FILTER_KEY.TO_DATE)
    const detailId = _.toInteger(_.get(params, 'pendingPaymentsId'))

    const confirmDialog = {
        openConfirmDialog: props.openConfirmDialog,
        handleOpenConfirmDialog: props.handleOpenConfirmDialog,
        handleCloseConfirmDialog: props.handleCloseConfirmDialog,
        handleSendConfirmDialog: props.handleSendConfirmDialog
    }

    const updateDialog = {
        initialValues: {},
        updateLoading: detailLoading || updateLoading,
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
            <PendingPaymentsGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                confirmDialog={confirmDialog}
                updateDialog={updateDialog}
                filterDialog={filterDialog}
            />
        </Layout>
    )
})

export default PendingPaymentsList
