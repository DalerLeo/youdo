import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import {reset} from 'redux-form'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import getDocuments from '../../helpers/getDocument'
import {
    CLIENT_BALANCE_INFO_DIALOG_OPEN,
    CLIENT_BALANCE_FILTER_KEY,
    CLIENT_BALANCE_FILTER_OPEN,
    CLIENT_BALANCE_CREATE_DIALOG_OPEN,
    CLIENT_BALANCE_ADD_DIALOG_OPEN,
    CLIENT_BALANCE_SUPER_USER_OPEN,
    ClientBalanceGridList
} from '../../components/ClientBalance'
import {
    clientBalanceListFetchAction,
    clientBalanceItemFetchAction,
    clientBalanceCreateExpenseAction,
    clientAddAction,
    superUserAction,
    clientBalanceSumFetchAction
} from '../../actions/clientBalance'
import * as API from '../../constants/api'
import {openSnackbarAction} from '../../actions/snackbar'
import {openErrorAction} from '../../actions/error'
import * as serializers from '../../serializers/clientBalanceSerializer'

const ZERO = 0
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['clientBalance', 'item', 'data'])
        const detailLoading = _.get(state, ['clientBalance', 'item', 'loading'])
        const createLoading = _.get(state, ['clientBalance', 'create', 'loading'])
        const updateLoading = _.get(state, ['clientBalance', 'update', 'loading'])
        const updateTransactionLoading = _.get(state, ['clientBalance', 'updateAdmin', 'loading'])
        const list = _.get(state, ['clientBalance', 'list', 'data'])
        const listLoading = _.get(state, ['clientBalance', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'ClientBalanceFilterForm'])
        const createForm = _.get(state, ['form', 'ClientBalanceCreateForm'])
        const searchForm = _.get(state, ['form', 'ClientBalanceForm'])
        const updateForm = _.get(state, ['form', 'ClientBalanceUpdateForm'])
        const returnForm = _.get(state, ['form', 'ClientBalanceReturnForm'])
        const isSuperUser = _.get(state, ['authConfirm', 'data', 'isSuperuser'])
        const sum = _.get(state, ['clientBalance', 'sum', 'data'])
        const sumLoading = _.get(state, ['clientBalance', 'sum', 'loading'])

        const filter = filterHelper(list, pathname, query)
        const filterItem = filterHelper(detail, pathname, query, {'page': 'dPage', 'pageSize': 'dPageSize'})

        return {
            query,
            list,
            listLoading,
            detail,
            detailLoading,
            createLoading,
            updateLoading,
            filter,
            filterItem,
            filterForm,
            createForm,
            updateForm,
            returnForm,
            isSuperUser,
            updateTransactionLoading,
            searchForm,
            sum,
            sumLoading
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest() &&
            toBoolean(_.get(nextProps, ['location', 'query', CLIENT_BALANCE_INFO_DIALOG_OPEN])) === false
    }, ({dispatch, filter}) => {
        dispatch(clientBalanceListFetchAction(filter))
    }),
    withPropsOnChange((props, nextProps) => {
        return props.sum && !_.isEqual(props.sum, nextProps.sum) &&
            toBoolean(_.get(nextProps, ['location', 'query', CLIENT_BALANCE_INFO_DIALOG_OPEN])) === false
    }, ({dispatch, filter}) => {
        dispatch(clientBalanceSumFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const clientBalanceId = _.get(nextProps, ['params', 'clientBalanceId'])
        return clientBalanceId && (_.get(props, ['params', 'clientBalanceId']) !== clientBalanceId ||
            props.filterItem.filterRequest() !== nextProps.filterItem.filterRequest())
    }, ({dispatch, params, filterItem, location}) => {
        const clientBalanceId = _.toInteger(_.get(params, 'clientBalanceId'))
        const division = _.get(location, ['query', 'division'])
        const type = _.get(location, ['query', 'type'])
        clientBalanceId && dispatch(clientBalanceItemFetchAction(filterItem, clientBalanceId, division, type))
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
            hashHistory.push({pathname, query: {pageSize: '25'}})
        },

        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const paymentType = _.get(filterForm, ['values', 'paymentType', 'value']) || null
            const balanceType = _.get(filterForm, ['values', 'balanceType', 'value']) || null
            const division = _.get(filterForm, ['values', 'division', 'value']) || null

            filter.filterBy({
                [CLIENT_BALANCE_FILTER_OPEN]: false,
                [CLIENT_BALANCE_FILTER_KEY.PAYMENT_TYPE]: paymentType,
                [CLIENT_BALANCE_FILTER_KEY.BALANCE_TYPE]: balanceType,
                [CLIENT_BALANCE_FILTER_KEY.DIVISION]: division
            })
        },

        handleOpenInfoDialog: props => (id, division, type) => {
            const {filterItem} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.CLIENT_BALANCE_ITEM_PATH, id),
                query: filterItem.getParams({
                    [CLIENT_BALANCE_INFO_DIALOG_OPEN]: true,
                    'division': division,
                    'type': type
                })
            })
        },

        handleCloseInfoDialog: props => () => {
            const {location: {pathname}, filterItem} = props
            hashHistory.push({
                pathname,
                query: filterItem.getParams({
                    [CLIENT_BALANCE_INFO_DIALOG_OPEN]: false,
                    'dPage': null,
                    'dPageSize': null
                })
            })
        },
        handleOpenCreateDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.CLIENT_BALANCE_ITEM_PATH, id),
                query: filter.getParams({[CLIENT_BALANCE_CREATE_DIALOG_OPEN]: true})
            })
        },
        handleCloseCreateDialog: props => () => {
            const {dispatch, location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CLIENT_BALANCE_CREATE_DIALOG_OPEN]: false})})
            dispatch(reset('ClientBalanceCreateForm'))
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
                    dispatch(reset('ClientBalanceCreateForm'))
                }).catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },
        handleOpenAddDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.CLIENT_BALANCE_ITEM_PATH, id),
                query: filter.getParams({[CLIENT_BALANCE_ADD_DIALOG_OPEN]: true})
            })
        },
        handleCloseAddDialog: props => () => {
            const {dispatch, location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CLIENT_BALANCE_ADD_DIALOG_OPEN]: false})})
            dispatch(reset('ClientBalanceCreateForm'))
        },
        handleSubmitAddDialog: props => () => {
            const {dispatch, createForm, filter, params} = props
            const clientId = _.get(params, ['clientBalanceId'])
            return dispatch(clientAddAction(_.get(createForm, ['values']), clientId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({
                        pathname: ROUTER.CLIENT_BALANCE_LIST_URL,
                        query: filter.getParams({[CLIENT_BALANCE_ADD_DIALOG_OPEN]: false})
                    })
                    dispatch(clientBalanceListFetchAction(filter))
                    dispatch(reset('ClientBalanceCreateForm'))
                }).catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },
        handleSubmitSearch: props => () => {
            const {location: {pathname}, filter, searchForm} = props
            const term = _.get(searchForm, ['values', 'searching'])
            hashHistory.push({
                pathname, query: filter.getParams({search: term})
            })
        },
        handleOpenSuperUserDialog: props => (id) => {
            const {filter, location: {pathname}} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({[CLIENT_BALANCE_SUPER_USER_OPEN]: id})
            })
        },
        handleCloseSuperUserDialog: props => () => {
            const {dispatch, location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CLIENT_BALANCE_SUPER_USER_OPEN]: false})})
            dispatch(reset('ClientBalanceCreateForm'))
        },
        handleSubmitSuperUserDialog: props => () => {
            const {dispatch, updateForm, filter, filterItem, query, params, location: {pathname}, location} = props
            const clientId = _.toInteger(_.get(params, 'clientBalanceId'))
            const transId = _.toInteger(_.get(query, CLIENT_BALANCE_SUPER_USER_OPEN))
            const clientBalanceId = _.toInteger(_.get(params, 'clientBalanceId'))
            const division = _.get(location, ['query', 'division'])
            const type = _.get(location, ['query', 'type'])

            return dispatch(superUserAction(_.get(updateForm, 'values'), clientId, transId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({
                        pathname, query: filter.getParams({[CLIENT_BALANCE_SUPER_USER_OPEN]: false})
                    })
                    dispatch(clientBalanceListFetchAction(filter))
                    dispatch(clientBalanceItemFetchAction(filterItem, clientBalanceId, division, type))
                    dispatch(reset('ClientBalanceUpdateForm'))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },
        handleGetDocument: props => () => {
            const {filter} = props
            const params = serializers.listFilterSerializer(filter.getParams())
            getDocuments(API.CLIENT_BALANCE_GET_DOCUMENT, params)
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
        addLoading,
        filter,
        filterItem,
        layout,
        params,
        isSuperUser,
        updateTransactionLoading,
        sum,
        sumLoading
    } = props

    const openFilterDialog = toBoolean(_.get(location, ['query', CLIENT_BALANCE_FILTER_OPEN]))
    const openCreateDialog = toBoolean(_.get(location, ['query', CLIENT_BALANCE_CREATE_DIALOG_OPEN]))
    const openAddDialog = toBoolean(_.get(location, ['query', CLIENT_BALANCE_ADD_DIALOG_OPEN]))
    const openSuperUser = _.toInteger(_.get(location, ['query', CLIENT_BALANCE_SUPER_USER_OPEN])) > ZERO
    const openInfoDialog = toBoolean(_.get(location, ['query', CLIENT_BALANCE_INFO_DIALOG_OPEN]))
    const division = _.toNumber(_.get(location, ['query', 'division']))
    const type = _.get(location, ['query', 'type'])
    const paymentType = filter.getParam(CLIENT_BALANCE_FILTER_KEY.PAYMENT_TYPE)
    const balanceType = filter.getParam(CLIENT_BALANCE_FILTER_KEY.BALANCE_TYPE)
    const divisionValue = filter.getParam(CLIENT_BALANCE_FILTER_KEY.DIVISION)
    const detailId = _.toInteger(_.get(params, 'clientBalanceId'))

    const divisionInfo = _.find(_.get(list, ['results', '0', 'divisions']), (item) => {
        return _.get(item, 'id') === division
    })

    const getBalance = (payType) => {
        const balance = _.find(_.get(list, ['results']), (item) => {
            return _.get(item, 'id') === detailId
        })
        const div = _.find(_.get(balance, 'divisions'), (item) => {
            return _.get(item, 'id') === division
        })
        return _.get(div, payType)
    }

    const infoDialog = {
        updateLoading: detailLoading,
        openInfoDialog,
        division: divisionInfo,
        type: type === 'bank' ? ' переч.' : ' нал.',
        balance: getBalance(type),
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
    const addDialog = {
        addLoading,
        openAddDialog,
        handleOpenAddDialog: props.handleOpenAddDialog,
        handleCloseAddDialog: props.handleCloseAddDialog,
        handleSubmitAddDialog: props.handleSubmitAddDialog
    }
    const filterDialog = {
        initialValues: {
            paymentType: {
                value: paymentType
            },
            balanceType: {
                value: balanceType
            },
            division: {
                value: divisionValue
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
    const superUser = {
        isSuperUser,
        open: openSuperUser,
        loading: updateTransactionLoading,
        handleOpenSuperUserDialog: props.handleOpenSuperUserDialog,
        handleCloseSuperUserDialog: props.handleCloseSuperUserDialog,
        handleSubmitSuperUserDialog: props.handleSubmitSuperUserDialog
    }
    const getDocument = {
        handleGetDocument: props.handleGetDocument
    }
    const sumData = {
        sum,
        sumLoading
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
                addDialog={addDialog}
                filterDialog={filterDialog}
                onSubmit={props.handleSubmitFilterDialog}
                superUser={superUser}
                handleSubmitSearch={props.handleSubmitSearch}
                getDocument={getDocument}
                sumData={sumData}
                pathname={location.pathname}
                query={props.query}
            />
        </Layout>
    )
})

export default ClientBalanceList
