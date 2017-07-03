import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import moment from 'moment'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import Layout from '../../components/Layout'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {setItemAction} from '../../components/ReduxForm/Provider/ProviderSearchField'
import {
    PRICES_CREATE_DIALOG_OPEN,
    PRICES_UPDATE_DIALOG_OPEN,
    PRICES_FILTER_KEY,
    PRICES_FILTER_OPEN,
    PRICES_DELETE_DIALOG_OPEN,
    PricesGridList
} from '../../components/Prices'
import {
    pricesCreateAction,
    pricesUpdateAction,
    pricesListFetchAction,
    pricesCSVFetchAction,
    pricesDeleteAction,
    pricesItemFetchAction
} from '../../actions/prices'

import {openSnackbarAction} from '../../actions/snackbar'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['prices', 'item', 'data'])
        const detailLoading = _.get(state, ['prices', 'item', 'loading'])
        const createLoading = _.get(state, ['prices', 'create', 'loading'])
        const updateLoading = _.get(state, ['prices', 'update', 'loading'])
        const list = _.get(state, ['prices', 'list', 'data'])
        const listLoading = _.get(state, ['prices', 'list', 'loading'])
        const csvData = _.get(state, ['prices', 'csv', 'data'])
        const csvLoading = _.get(state, ['prices', 'csv', 'loading'])
        const filterForm = _.get(state, ['form', 'PricesFilterForm'])
        const createForm = _.get(state, ['form', 'PricesCreateForm'])
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
        dispatch(pricesListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const pricesId = _.get(nextProps, ['params', 'pricesId'])
        return pricesId && _.get(props, ['params', 'pricesId']) !== pricesId
    }, ({dispatch, params}) => {
        const pricesId = _.toInteger(_.get(params, 'pricesId'))
        pricesId && dispatch(pricesItemFetchAction(pricesId))
    }),

    withHandlers({
        handleActionEdit: props => () => {
            return null
        },

        handleOpenCSVDialog: props => () => {
            const {dispatch, setOpenCSVDialog} = props
            setOpenCSVDialog(true)

            dispatch(pricesCSVFetchAction(props.filter))
        },

        handleCloseCSVDialog: props => () => {
            const {setOpenCSVDialog} = props
            setOpenCSVDialog(false)
        },

        handleOpenConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRICES_DELETE_DIALOG_OPEN]: true})})
        },
        handleCloseConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRICES_DELETE_DIALOG_OPEN]: false})})
        },
        handleSendConfirmDialog: props => () => {
            const {dispatch, location: {pathname}, filter, params} = props
            const detailId = _.toNumber(_.get(params, 'pricesId'))
            dispatch(pricesDeleteAction(detailId))
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно отменено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[PRICES_DELETE_DIALOG_OPEN]: false})})
                    dispatch(pricesListFetchAction(filter))
                })
        },

        handleOpenFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRICES_FILTER_OPEN]: true})})
        },

        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRICES_FILTER_OPEN]: false})})
        },

        handleClearFilterDialog: props => () => {
            const {location: {pathname}} = props
            hashHistory.push({pathname, query: {}})
        },

        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const beginFromDate = _.get(filterForm, ['values', 'beginDate', 'fromDate']) || null
            const beginToDate = _.get(filterForm, ['values', 'beginDate', 'toDate']) || null
            const tillFromDate = _.get(filterForm, ['values', 'tillFromDate', 'fromDate']) || null
            const tillToDate = _.get(filterForm, ['values', 'tillToDate', 'toDate']) || null

            filter.filterBy({
                [PRICES_FILTER_OPEN]: false,
                [PRICES_FILTER_KEY.BEGIN_FROM_DATE]: beginFromDate && beginFromDate.format('YYYY-MM-DD'),
                [PRICES_FILTER_KEY.BEGIN_TO_DATE]: beginToDate && beginToDate.format('YYYY-MM-DD'),
                [PRICES_FILTER_KEY.TILL_FROM_DATE]: tillFromDate && tillFromDate.format('YYYY-MM-DD'),
                [PRICES_FILTER_KEY.TILL_TO_DATE]: tillToDate && tillToDate.format('YYYY-MM-DD')
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
            const {location: {pathname}, filter, dispatch} = props
            hashHistory.push({pathname, query: filter.getParams({[PRICES_CREATE_DIALOG_OPEN]: true})})
            dispatch(setItemAction(null, false))
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRICES_CREATE_DIALOG_OPEN]: false})})
        },
        handleSubmitCreateDialog: props => () => {
            const {location: {pathname}, dispatch, createForm, filter} = props
            return dispatch(pricesCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[PRICES_CREATE_DIALOG_OPEN]: false})})
                    dispatch(pricesListFetchAction(filter))
                })
        },

        handleOpenUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRICES_UPDATE_DIALOG_OPEN]: true})})
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRICES_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter} = props
            const pricesId = _.toInteger(_.get(props, ['params', 'pricesId']))

            return dispatch(pricesUpdateAction(pricesId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(pricesItemFetchAction(pricesId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[PRICES_UPDATE_DIALOG_OPEN]: false}))
                    dispatch(pricesListFetchAction(filter))
                })
        },
        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.PRICES_LIST_URL, query: filter.getParam()})
        },

        handleClickDetail: props => (id) => {
            hashHistory.push({pathname: sprintf(ROUTER.PRICES_ITEM_PATH, id), query: {}})
        }
    })
)

const PricesList = enhance((props) => {
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

    const openFilterDialog = toBoolean(_.get(location, ['query', PRICES_FILTER_OPEN]))
    const openCreateDialog = toBoolean(_.get(location, ['query', PRICES_CREATE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', PRICES_UPDATE_DIALOG_OPEN]))
    const openConfirmDialog = toBoolean(_.get(location, ['query', PRICES_DELETE_DIALOG_OPEN]))
    const beginFromDate = filter.getParam(PRICES_FILTER_KEY.BEGIN_FROM_DATE)
    const beginToDate = filter.getParam(PRICES_FILTER_KEY.BEGIN_TO_DATE)
    const tillFromDate = filter.getParam(PRICES_FILTER_KEY.TILL_FROM_DATE)
    const tillToDate = filter.getParam(PRICES_FILTER_KEY.TILL_TO_DATE)
    const detailId = _.get(params, 'pricesId')

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

    const confirmDialog = {
        openConfirmDialog: openConfirmDialog,
        handleOpenConfirmDialog: props.handleOpenConfirmDialog,
        handleCloseConfirmDialog: props.handleCloseConfirmDialog,
        handleSendConfirmDialog: props.handleSendConfirmDialog
    }
    const forUpdateProducts = _.map(_.get(detail, 'products'), (item) => {
        return {
            product: {
                value: {
                    id: _.get(item, ['product', 'id']),
                    name: _.get(item, ['product', 'name']),
                    measurement: _.get(item, ['product', 'measurement'])
                }
            },
            amount: _.get(item, 'amount')
        }
    })
    const updateDialog = {
        initialValues: (() => {
            if (!detail || openCreateDialog) {
                return {}
            }
            return {
                name: _.get(detail, 'name'),
                discount: _.get(detail, 'discount'),
                beginDate: moment(_.get(detail, ['beginDate'])).toDate(),
                tillDate: moment(_.get(detail, ['tillDate'])).toDate(),
                products: forUpdateProducts
            }
        })(),
        updateLoading: updateLoading,
        openUpdateDialog,
        handleOpenUpdateDialog: props.handleOpenUpdateDialog,
        handleCloseUpdateDialog: props.handleCloseUpdateDialog,
        handleSubmitUpdateDialog: props.handleSubmitUpdateDialog
    }

    const filterDialog = {
        initialValues: {
            beginDate: {
                fromDate: beginFromDate && moment(beginFromDate, 'YYYY-MM-DD'),
                toDate: beginToDate && moment(beginToDate, 'YYYY-MM-DD')
            },
            tillDate: {
                fromDate: tillFromDate && moment(tillFromDate, 'YYYY-MM-DD'),
                toDate: tillToDate && moment(tillToDate, 'YYYY-MM-DD')
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
        listLoading,
        handleClickDetail: props.handleClickDetail
    }
    const detailData = {
        id: detailId,
        data: detail,
        detailLoading,
        handleCloseDetail: props.handleCloseDetail
    }

    return (
        <Layout {...layout}>
            <PricesGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                createDialog={createDialog}
                confirmDialog={confirmDialog}
                updateDialog={updateDialog}
                actionsDialog={actionsDialog}
                filterDialog={filterDialog}
                csvDialog={csvDialog}
            />
        </Layout>
    )
})

export default PricesList
