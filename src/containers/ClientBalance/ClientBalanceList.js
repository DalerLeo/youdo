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
    CLIENT_BALANCE_INFO_DIALOG_OPEN,
    CLIENT_BALANCE_FILTER_KEY,
    CLIENT_BALANCE_FILTER_OPEN,
    CLIENT_BALANCE_CREATE_DIALOG_OPEN,
    ClientBalanceGridList
} from '../../components/ClientBalance'
import {
    clientBalanceListFetchAction,
    clientBalanceItemFetchAction,
    clientBalanceCreateExpenseAction
} from '../../actions/clientBalance'
import {openSnackbarAction} from '../../actions/snackbar'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['clientBalance', 'item', 'data'])
        const detailLoading = _.get(state, ['clientBalance', 'item', 'loading'])
        const createLoading = _.get(state, ['clientBalance', 'create', 'loading'])
        const updateLoading = _.get(state, ['clientBalance', 'update', 'loading'])
        const list = _.get(state, ['clientBalance', 'list', 'data'])
        const listLoading = _.get(state, ['clientBalance', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'ClientBalanceFilterForm'])
        const createForm = _.get(state, ['form', 'ClientBalanceCreateForm'])
        const filter = filterHelper(list, pathname, query)
        const filterItem = filterHelper(detail, pathname, query, {'page': 'dPage', 'pageSize': 'dPageSize'})

        return {
            list,
            listLoading,
            detail,
            detailLoading,
            createLoading,
            updateLoading,
            filter,
            filterItem,
            filterForm,
            createForm
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest() &&
            toBoolean(_.get(nextProps, ['location', 'query', CLIENT_BALANCE_INFO_DIALOG_OPEN])) === false
    }, ({dispatch, filter}) => {
        dispatch(clientBalanceListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const clientBalanceId = _.get(nextProps, ['params', 'clientBalanceId'])
        return clientBalanceId && (_.get(props, ['params', 'clientBalanceId']) !== clientBalanceId ||
            props.filterItem.filterRequest() !== nextProps.filterItem.filterRequest())
    }, ({dispatch, params, filterItem, location}) => {
        const clientBalanceId = _.toInteger(_.get(params, 'clientBalanceId'))
        const type = _.get(location, ['query', 'type'])
        clientBalanceId && dispatch(clientBalanceItemFetchAction(filterItem, clientBalanceId, type))
    }),

    withState('openConfirmDialog', 'setOpenConfirmDialog', false),

    withHandlers({
        handleOpenFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CLIENT_BALANCE_FILTER_OPEN]: true})})
        },

        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CLIENT_BALANCE_FILTER_OPEN]: false})})
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
                [CLIENT_BALANCE_FILTER_OPEN]: false,
                [CLIENT_BALANCE_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [CLIENT_BALANCE_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')
            })
        },

        handleOpenInfoDialog: props => (id, type) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.CLIENT_BALANCE_ITEM_PATH, id),
                query: filter.getParams({[CLIENT_BALANCE_INFO_DIALOG_OPEN]: true, 'type': type})
            })
        },

        handleCloseInfoDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CLIENT_BALANCE_INFO_DIALOG_OPEN]: false, 'dPage': null, 'dPageSize': null})})
        },
        handleOpenCreateDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.CLIENT_BALANCE_ITEM_PATH, id),
                query: filter.getParams({[CLIENT_BALANCE_CREATE_DIALOG_OPEN]: true})
            })
        },
        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CLIENT_BALANCE_CREATE_DIALOG_OPEN]: false})})
        },
        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}, params} = props
            const clientId = _.get(params, ['clientBalanceId'])
            return dispatch(clientBalanceCreateExpenseAction(_.get(createForm, ['values']), clientId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({
                        pathname,
                        query: filter.getParams({[CLIENT_BALANCE_CREATE_DIALOG_OPEN]: false})
                    })
                    dispatch(clientBalanceListFetchAction(filter))
                })
        }
    })
)

const ClientBalanceList = enhance((props) => {
    const {
        location,
        list,
        listLoading,
        detail,
        detailLoading,
        createLoading,
        filter,
        filterItem,
        layout,
        params
    } = props

    const openFilterDialog = toBoolean(_.get(location, ['query', CLIENT_BALANCE_FILTER_OPEN]))
    const openCreateDialog = toBoolean(_.get(location, ['query', CLIENT_BALANCE_CREATE_DIALOG_OPEN]))
    const openInfoDialog = toBoolean(_.get(location, ['query', CLIENT_BALANCE_INFO_DIALOG_OPEN]))
    const type = _.toNumber(_.get(location, ['query', 'type']))
    const fromDate = filter.getParam(CLIENT_BALANCE_FILTER_KEY.FROM_DATE)
    const toDate = filter.getParam(CLIENT_BALANCE_FILTER_KEY.TO_DATE)
    const detailId = _.toInteger(_.get(params, 'clientBalanceId'))

    const infoDialog = {
        updateLoading: detailLoading,
        openInfoDialog,
        type: type,
        handleOpenInfoDialog: props.handleOpenInfoDialog,
        handleCloseInfoDialog: props.handleCloseInfoDialog
    }

    const createDialog = {
        createLoading,
        openCreateDialog,
        handleOpenCreateDialog: props.handleOpenCreateDialog,
        handleCloseCreateDialog: props.handleCloseCreateDialog,
        handleSubmitCreateDialog: props.handleSubmitCreateDialog
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
        data: _.get(detail, 'results'),
        detailLoading
    }

    return (
        <Layout {...layout}>
            <ClientBalanceGridList
                filter={filter}
                filterItem={filterItem}
                listData={listData}
                detailData={detailData}
                infoDialog={infoDialog}
                createDialog={createDialog}
                filterDialog={filterDialog}
            />
        </Layout>
    )
})

export default ClientBalanceList
