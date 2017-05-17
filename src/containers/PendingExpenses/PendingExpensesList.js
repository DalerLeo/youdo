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
import {DELETE_DIALOG_OPEN} from '../../components/DeleteDialog'
import {
    PENDING_EXPENSES_CREATE_DIALOG_OPEN,
    PENDING_EXPENSES_UPDATE_DIALOG_OPEN,
    PENDING_EXPENSES_FILTER_KEY,
    PENDING_EXPENSES_FILTER_OPEN,
    PendingExpensesGridList
} from '../../components/PendingExpenses'
import {
    pendingExpensesCreateAction,
    pendingExpensesUpdateAction,
    pendingExpensesListFetchAction,
    pendingExpensesCSVFetchAction,
    pendingExpensesDeleteAction,
    pendingExpensesItemFetchAction
} from '../../actions/pendingExpenses'

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
        const csvData = _.get(state, ['pendingExpenses', 'csv', 'data'])
        const csvLoading = _.get(state, ['pendingExpenses', 'csv', 'loading'])
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
            csvData,
            csvLoading,
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

    withState('openCSVDialog', 'setOpenCSVDialog', false),
    withState('openConfirmDialog', 'setOpenConfirmDialog', false),

    withHandlers({
        handleActionEdit: props => () => {
            return null
        },

        handleOpenCSVDialog: props => () => {
            const {dispatch, setOpenCSVDialog} = props
            setOpenCSVDialog(true)

            dispatch(pendingExpensesCSVFetchAction(props.filter))
        },

        handleCloseCSVDialog: props => () => {
            const {setOpenCSVDialog} = props
            setOpenCSVDialog(false)
        },

        handleOpenConfirmDialog: props => () => {
            const {setOpenConfirmDialog} = props
            setOpenConfirmDialog(true)
        },

        handleCloseConfirmDialog: props => () => {
            const {setOpenConfirmDialog} = props
            setOpenConfirmDialog(false)
        },
        handleSendConfirmDialog: props => () => {
            const {dispatch, detail, setOpenConfirmDialog} = props
            dispatch(pendingExpensesDeleteAction(detail.id))
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .then(() => {
                    setOpenConfirmDialog(false)
                })
        },

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

            filter.filterBy({
                [PENDING_EXPENSES_FILTER_OPEN]: false,
                [PENDING_EXPENSES_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [PENDING_EXPENSES_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')
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
            hashHistory.push({pathname, query: filter.getParams({[PENDING_EXPENSES_CREATE_DIALOG_OPEN]: true})})
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PENDING_EXPENSES_CREATE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, filter} = props

            return dispatch(pendingExpensesCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({query: filter.getParams({[PENDING_EXPENSES_CREATE_DIALOG_OPEN]: false})})
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
            const {dispatch, createForm, filter} = props
            const pendingExpensesId = _.toInteger(_.get(props, ['params', 'pendingExpensesId']))

            return dispatch(pendingExpensesUpdateAction(pendingExpensesId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(pendingExpensesItemFetchAction(pendingExpensesId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[PENDING_EXPENSES_UPDATE_DIALOG_OPEN]: false}))
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
        createLoading,
        updateLoading,
        filter,
        layout,
        params
    } = props

    const openFilterDialog = toBoolean(_.get(location, ['query', PENDING_EXPENSES_FILTER_OPEN]))
    const openCreateDialog = toBoolean(_.get(location, ['query', PENDING_EXPENSES_CREATE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', PENDING_EXPENSES_UPDATE_DIALOG_OPEN]))
    const openDeleteDialog = toBoolean(_.get(location, ['query', DELETE_DIALOG_OPEN]))
    const fromDate = filter.getParam(PENDING_EXPENSES_FILTER_KEY.FROM_DATE)
    const toDate = filter.getParam(PENDING_EXPENSES_FILTER_KEY.TO_DATE)
    const detailId = _.toInteger(_.get(params, 'pendingExpensesId'))

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

    const deleteDialog = {
        openDeleteDialog,
        handleOpenDeleteDialog: props.handleOpenDeleteDialog,
        handleCloseDeleteDialog: props.handleCloseDeleteDialog
    }

    const confirmDialog = {
        openConfirmDialog: props.openConfirmDialog,
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
                name: _.get(detail, 'name'),
                category: {
                    value: _.get(detail, 'category')
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
                createDialog={createDialog}
                deleteDialog={deleteDialog}
                confirmDialog={confirmDialog}
                updateDialog={updateDialog}
                actionsDialog={actionsDialog}
                filterDialog={filterDialog}
                csvDialog={csvDialog}
            />
        </Layout>
    )
})

export default PendingExpensesList
