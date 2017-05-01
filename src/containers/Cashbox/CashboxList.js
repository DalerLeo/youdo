import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {DELETE_DIALOG_OPEN} from '../../components/DeleteDialog'
import {
    CASHBOX_CREATE_DIALOG_OPEN,
    CASHBOX_UPDATE_DIALOG_OPEN,
    CASHBOX_FILTER_KEY,
    CASHBOX_FILTER_OPEN,
    CashboxGridList
} from '../../components/Cashbox'
import {
    cashboxCreateAction,
    cashboxUpdateAction,
    cashboxListFetchAction,
    cashboxCSVFetchAction,
    cashboxDeleteAction,
    cashboxItemFetchAction
} from '../../actions/cashbox'
import {openSnackbarAction} from '../../actions/snackbar'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['cashbox', 'item', 'data'])
        const detailLoading = _.get(state, ['cashbox', 'item', 'loading'])
        const createLoading = _.get(state, ['cashbox', 'create', 'loading'])
        const updateLoading = _.get(state, ['cashbox', 'update', 'loading'])
        const list = _.get(state, ['cashbox', 'list', 'data'])
        const listLoading = _.get(state, ['cashbox', 'list', 'loading'])
        const csvData = _.get(state, ['cashbox', 'csv', 'data'])
        const csvLoading = _.get(state, ['cashbox', 'csv', 'loading'])
        const filterForm = _.get(state, ['form', 'CashboxFilterForm'])
        const createForm = _.get(state, ['form', 'CashboxCreateForm'])
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
        dispatch(cashboxListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const cashboxId = _.get(nextProps, ['params', 'cashboxId'])
        return cashboxId && _.get(props, ['params', 'cashboxId']) !== cashboxId
    }, ({dispatch, params}) => {
        const cashboxId = _.toInteger(_.get(params, 'cashboxId'))
        cashboxId && dispatch(cashboxItemFetchAction(cashboxId))
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

            dispatch(cashboxCSVFetchAction(props.filter))
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
            dispatch(cashboxDeleteAction(detail.id))
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Successful deleted'}))
                })
                .then(() => {
                    setOpenConfirmDialog(false)
                })
        },

        handleOpenFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CASHBOX_FILTER_OPEN]: true})})
        },

        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CASHBOX_FILTER_OPEN]: false})})
        },

        handleClearFilterDialog: props => () => {
            const {location: {pathname}} = props
            hashHistory.push({pathname, query: {}})
        },

        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null
            const category = _.get(filterForm, ['values', 'category', 'value']) || null

            filter.filterBy({
                [CASHBOX_FILTER_OPEN]: false,
                [CASHBOX_FILTER_KEY.CATEGORY]: category,
                [CASHBOX_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [CASHBOX_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')
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
            hashHistory.push({pathname, query: filter.getParams({[CASHBOX_CREATE_DIALOG_OPEN]: true})})
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CASHBOX_CREATE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, filter} = props

            return dispatch(cashboxCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Successful saved'}))
                })
                .then(() => {
                    hashHistory.push({query: filter.getParams({[CASHBOX_CREATE_DIALOG_OPEN]: false})})
                })
        },

        handleOpenUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CASHBOX_UPDATE_DIALOG_OPEN]: true})})
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CASHBOX_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter} = props
            const cashboxId = _.toInteger(_.get(props, ['params', 'cashboxId']))

            return dispatch(cashboxUpdateAction(cashboxId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(cashboxItemFetchAction(cashboxId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Successful saved'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[CASHBOX_UPDATE_DIALOG_OPEN]: false}))
                })
        }
    })
)

const CashboxList = enhance((props) => {
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

    const openFilterDialog = toBoolean(_.get(location, ['query', CASHBOX_FILTER_OPEN]))
    const openCreateDialog = toBoolean(_.get(location, ['query', CASHBOX_CREATE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', CASHBOX_UPDATE_DIALOG_OPEN]))
    const openDeleteDialog = toBoolean(_.get(location, ['query', DELETE_DIALOG_OPEN]))
    const category = _.toInteger(filter.getParam(CASHBOX_FILTER_KEY.CATEGORY))
    const fromDate = filter.getParam(CASHBOX_FILTER_KEY.FROM_DATE)
    const toDate = filter.getParam(CASHBOX_FILTER_KEY.TO_DATE)
    const detailId = _.toInteger(_.get(params, 'cashboxId'))

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
            <CashboxGridList
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

export default CashboxList
