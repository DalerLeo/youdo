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
import {DELETE_DIALOG_OPEN} from '../../components/DeleteDialog'
import {
    PENDING_PAYMENTS_CREATE_DIALOG_OPEN,
    PENDING_PAYMENTS_UPDATE_DIALOG_OPEN,
    PENDING_PAYMENTS_FILTER_KEY,
    PENDING_PAYMENTS_FILTER_OPEN,
    PendingPaymentsGridList
} from '../../components/PendingPayments'
import {
    pendingPaymentsCreateAction,
    pendingPaymentsUpdateAction,
    pendingPaymentsListFetchAction,
    pendingPaymentsCSVFetchAction,
    pendingPaymentsDeleteAction,
    pendingPaymentsItemFetchAction
} from '../../actions/pendingPayments'

import {openSnackbarAction} from '../../actions/snackbar'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['pendingPayments', 'item', 'data'])
        const detailLoading = _.get(state, ['pendingPayments', 'item', 'loading'])
        const createLoading = _.get(state, ['pendingPayments', 'create', 'loading'])
        const updateLoading = _.get(state, ['pendingPayments', 'update', 'loading'])
        const list = _.get(state, ['pendingPayments', 'list', 'data'])
        const listLoading = _.get(state, ['pendingPayments', 'list', 'loading'])
        const csvData = _.get(state, ['pendingPayments', 'csv', 'data'])
        const csvLoading = _.get(state, ['pendingPayments', 'csv', 'loading'])
        const filterForm = _.get(state, ['form', 'PendingPaymentsFilterForm'])
        const createForm = _.get(state, ['form', 'PendingPaymentsCreateForm'])
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
        dispatch(pendingPaymentsListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const pendingPaymentsId = _.get(nextProps, ['params', 'pendingPaymentsId'])

        return pendingPaymentsId && _.get(props, ['params', 'pendingPaymentsId']) !== pendingPaymentsId
    }, ({dispatch, params}) => {
        const pendingPaymentsId = _.toInteger(_.get(params, 'pendingPaymentsId'))
        pendingPaymentsId && dispatch(pendingPaymentsItemFetchAction(pendingPaymentsId))
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

            dispatch(pendingPaymentsCSVFetchAction(props.filter))
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
            dispatch(pendingPaymentsDeleteAction(detail.id))
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .then(() => {
                    setOpenConfirmDialog(false)
                })
        },

        handleOpenFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PENDING_PAYMENTS_FILTER_OPEN]: true})})
        },

        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PENDING_PAYMENTS_FILTER_OPEN]: false})})
        },

        handleTabChange: props => (tab) => {
            const pendingPaymentsId = _.toInteger(_.get(props, ['params', 'pendingPaymentsId']))
            hashHistory.push({pathname: sprintf(ROUTER.PENDING_PAYMENTS_ITEM_TAB_PATH, pendingPaymentsId, tab)})
        },

        handleClearFilterDialog: props => () => {
            const {location: {pathname}} = props
            hashHistory.push({pathname, query: {}})
        },

        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const category = _.get(filterForm, ['values', 'category', 'value']) || null

            filter.filterBy({
                [PENDING_PAYMENTS_FILTER_OPEN]: false,
                [PENDING_PAYMENTS_FILTER_KEY.CATEGORY]: category
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
            hashHistory.push({pathname, query: filter.getParams({[PENDING_PAYMENTS_CREATE_DIALOG_OPEN]: true})})
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PENDING_PAYMENTS_CREATE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, filter} = props

            return dispatch(pendingPaymentsCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({query: filter.getParams({[PENDING_PAYMENTS_CREATE_DIALOG_OPEN]: false})})
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

            return dispatch(pendingPaymentsUpdateAction(pendingPaymentsId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(pendingPaymentsItemFetchAction(pendingPaymentsId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[PENDING_PAYMENTS_UPDATE_DIALOG_OPEN]: false}))
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
        createLoading,
        updateLoading,
        filter,
        layout,
        params
    } = props

    const openFilterDialog = toBoolean(_.get(location, ['query', PENDING_PAYMENTS_FILTER_OPEN]))
    const openCreateDialog = toBoolean(_.get(location, ['query', PENDING_PAYMENTS_CREATE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', PENDING_PAYMENTS_UPDATE_DIALOG_OPEN]))
    const openDeleteDialog = toBoolean(_.get(location, ['query', DELETE_DIALOG_OPEN]))
    const category = _.toInteger(filter.getParam(PENDING_PAYMENTS_FILTER_KEY.CATEGORY))
    const detailId = _.toInteger(_.get(params, 'pendingPaymentsId'))
    const tab = _.get(params, 'tab')

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
            category: {
                value: category
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

    const tabData = {
        tab,
        handleTabChange: props.handleTabChange
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
                tabData={tabData}
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

export default PendingPaymentsList
