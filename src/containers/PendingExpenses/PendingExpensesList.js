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
    pendingExpensesListFetchAction,
    pendingExpensesItemFetchAction
} from '../../actions/pendingExpenses'
import {openErrorAction} from '../../actions/error'
import {openSnackbarAction} from '../../actions/snackbar'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['pendingExpenses', 'item', 'data'])
        const detailLoading = _.get(state, ['pendingExpenses', 'item', 'loading'])
        const createLoading = _.get(state, ['pendingExpenses', 'create', 'loading'])
        const updateLoading = _.get(state, ['pendingExpenses', 'update', 'loading'])
        const list = _.get(state, ['pendingExpenses', 'list', 'data'])
        const listLoading = _.get(state, ['pendingExpenses', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'PendingExpensesFilterForm'])
        const createForm = _.get(state, ['form', 'PendingExpensesCreateForm'])
        const filter = filterHelper(list, pathname, query)

        return {
            list,
            listLoading,
            detail,
            detailLoading,
            createLoading,
            updateLoading,
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

    withPropsOnChange((props, nextProps) => {
        const pendingExpensesId = _.get(nextProps, ['params', 'pendingExpensesId'])

        return pendingExpensesId && _.get(props, ['params', 'pendingExpensesId']) !== pendingExpensesId
    }, ({dispatch, params}) => {
        const pendingExpensesId = _.toInteger(_.get(params, 'pendingExpensesId'))
        pendingExpensesId && dispatch(pendingExpensesItemFetchAction(pendingExpensesId))
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
            const provider = _.get(filterForm, ['values', 'provider', 'value']) || null

            filter.filterBy({
                [PENDING_EXPENSES_FILTER_OPEN]: false,
                [PENDING_EXPENSES_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [PENDING_EXPENSES_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD'),
                [PENDING_EXPENSES_FILTER_KEY.TYPE]: type,
                [PENDING_EXPENSES_FILTER_KEY.PAYMENT_TYPE]: paymentType,
                [PENDING_EXPENSES_FILTER_KEY.PROVIDER]: provider
            })
        },

        handleOpenUpdateDialog: props => (id) => {
            const {filter} = props
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
            const {dispatch, createForm, filter, detail} = props

            return dispatch(pendingExpensesUpdateAction(detail, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[PENDING_EXPENSES_UPDATE_DIALOG_OPEN]: false}))
                    dispatch(pendingExpensesListFetchAction(filter))
                })
                .catch((error) => {
                    const errorWhole = _.map(error, (item, index) => {
                        return <p style={{marginBottom: '10px'}}>{(index !== 'non_field_errors' || _.isNumber(index)) && <b style={{textTransform: 'uppercase'}}>{index}:</b>} {item}</p>
                    })

                    dispatch(openErrorAction({
                        message: <div style={{padding: '0 30px'}}>
                            {errorWhole}
                        </div>
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
        detail,
        detailLoading,
        updateLoading,
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
    const detailId = _.toInteger(_.get(params, 'pendingExpensesId'))

    const confirmDialog = {
        openConfirmDialog: props.openConfirmDialog,
        handleOpenConfirmDialog: props.handleOpenConfirmDialog,
        handleCloseConfirmDialog: props.handleCloseConfirmDialog,
        handleSendConfirmDialog: props.handleSendConfirmDialog
    }

    const updateDialog = {
        initialValues: (() => {
            if (!detail || openUpdateDialog) {
                return {}
            }

            return {
                name: _.get(detail, 'name'),
                category: {
                    value: _.get(detail, 'category')
                },
                paymentType: {
                    value: _.get(detail, 'paymentType')
                },
                address: _.get(detail, 'address'),
                guide: _.get(detail, 'guide'),
                phone: _.get(detail, 'phone'),
                contactName: _.get(detail, 'contactName'),
                official: _.get(detail, 'official'),
                latLng: {
                    lat: _.get(detail, 'lat'),
                    lng: _.get(detail, 'lon')
                }
            }
        })(),
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
            },
            type: {
                value: type
            },
            paymentType: {
                value: paymentType
            },
            provider: {
                value: provider
            }
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

    const detailData = {
        id: detailId,
        data: detail,
        detailLoading
    }

    return (
        <Layout {...layout}>
            <PendingExpensesGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                confirmDialog={confirmDialog}
                updateDialog={updateDialog}
                filterDialog={filterDialog}
                csvDialog={csvDialog}
            />
        </Layout>
    )
})

export default PendingExpensesList
