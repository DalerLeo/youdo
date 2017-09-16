import React from 'react'
import moment from 'moment'
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
import {
    CLIENT_BALANCE_INFO_DIALOG_OPEN,
    CLIENT_BALANCE_FILTER_KEY,
    CLIENT_BALANCE_FILTER_OPEN,
    CLIENT_BALANCE_CREATE_DIALOG_OPEN,
    CLIENT_BALANCE_ADD_DIALOG_OPEN,
    CLIENT_BALANCE_SUPER_USER_OPEN,
    CLIENT_BALANCE_RETURN_DIALOG_OPEN,
    ClientBalanceGridList
} from '../../components/ClientBalance'
import {
    clientBalanceListFetchAction,
    clientBalanceItemFetchAction,
    clientBalanceCreateExpenseAction,
    clientAddAction,
    clientBalanceReturnAction,
    superUserAction
} from '../../actions/clientBalance'
import {openSnackbarAction} from '../../actions/snackbar'
import {openErrorAction} from '../../actions/error'

const MINUS_ONE = -1
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
            searchForm
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
                    const errorWhole = _.map(error, (item, index) => {
                        return <p style={{marginBottom: '10px'}}>{(index !== 'non_field_errors' || _.isNumber(index)) && <b style={{textTransform: 'uppercase'}}>{index}:</b>} {item}</p>
                    })
                    dispatch(openErrorAction({
                        message: <div style={{padding: '0 30px'}}>
                            {errorWhole}
                        </div>
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
                    const errorWhole = _.map(error, (item, index) => {
                        return <p style={{marginBottom: '10px'}}>{(index !== 'non_field_errors' || _.isNumber(index)) && <b style={{textTransform: 'uppercase'}}>{index}:</b>} {item}</p>
                    })
                    dispatch(openErrorAction({
                        message: <div style={{padding: '0 30px'}}>
                            {errorWhole}
                        </div>
                    }))
                })
        },
        handleOpenClientReturnDialog: props => (id) => {
            const {dispatch, location: {pathname}, filter} = props
            dispatch(reset('ClientBalanceReturnForm'))
            hashHistory.push({
                pathname,
                query: filter.getParams({[CLIENT_BALANCE_RETURN_DIALOG_OPEN]: id})
            })
        },
        handleSubmitSearch: props => () => {
            const {location: {pathname}, filter, searchForm} = props
            const term = _.get(searchForm, ['values', 'searching'])
            hashHistory.push({
                pathname, query: filter.getParams({search: term})
            })
        },
        handleCloseClientReturnDialog: props => () => {
            const {dispatch, location: {pathname}, filter} = props
            dispatch(reset('ClientBalanceReturnForm'))
            hashHistory.push({pathname, query: filter.getParams({[CLIENT_BALANCE_RETURN_DIALOG_OPEN]: MINUS_ONE})})
        },
        handleSubmitClientReturnDialog: props => () => {
            const {location: {pathname}, dispatch, returnForm, filter} = props
            const id = _.toInteger(_.get(props, ['location', 'query', 'openClientReturnDialog']))
            return dispatch(clientBalanceReturnAction(_.get(returnForm, ['values']), id))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({
                        pathname,
                        query: filter.getParams({[CLIENT_BALANCE_RETURN_DIALOG_OPEN]: MINUS_ONE})
                    })
                    dispatch(clientBalanceListFetchAction(filter))
                    dispatch(reset('ClientBalanceReturnForm'))
                }).catch((error) => {
                    const errorWhole = _.map(error, (item, index) => {
                        return <p style={{marginBottom: '10px'}}>{(index !== 'non_field_errors' || _.isNumber(index)) && <b style={{textTransform: 'uppercase'}}>{index}:</b>} {item}</p>
                    })
                    dispatch(openErrorAction({
                        message: <div style={{padding: '0 30px'}}>
                            {errorWhole}
                        </div>
                    }))
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
                    const errorWhole = _.map(error, (item, index) => {
                        return <p key={index} style={{marginBottom: '10px'}}>{(index !== 'non_field_errors' || _.isNumber(index)) && <b style={{textTransform: 'uppercase'}}>{index}:</b>} {item}</p>
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
        updateTransactionLoading
    } = props

    const openFilterDialog = toBoolean(_.get(location, ['query', CLIENT_BALANCE_FILTER_OPEN]))
    const openCreateDialog = toBoolean(_.get(location, ['query', CLIENT_BALANCE_CREATE_DIALOG_OPEN]))
    const openAddDialog = toBoolean(_.get(location, ['query', CLIENT_BALANCE_ADD_DIALOG_OPEN]))
    const openSuperUser = _.toInteger(_.get(location, ['query', CLIENT_BALANCE_SUPER_USER_OPEN])) > ZERO
    const openInfoDialog = toBoolean(_.get(location, ['query', CLIENT_BALANCE_INFO_DIALOG_OPEN]))
    const openClientReturnDialog = _.get(location, ['query', CLIENT_BALANCE_RETURN_DIALOG_OPEN])
    const division = _.toNumber(_.get(location, ['query', 'division']))
    const type = _.get(location, ['query', 'type'])
    const fromDate = filter.getParam(CLIENT_BALANCE_FILTER_KEY.FROM_DATE)
    const toDate = filter.getParam(CLIENT_BALANCE_FILTER_KEY.TO_DATE)
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

    const clientReturnDialog = {
        openClientReturnDialog,
        handleOpenClientReturnDialog: props.handleOpenClientReturnDialog,
        handleCloseClientReturnDialog: props.handleCloseClientReturnDialog,
        handleSubmitClientReturnDialog: props.handleSubmitClientReturnDialog
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
    const superUser = {
        isSuperUser,
        open: openSuperUser,
        loading: updateTransactionLoading,
        handleOpenSuperUserDialog: props.handleOpenSuperUserDialog,
        handleCloseSuperUserDialog: props.handleCloseSuperUserDialog,
        handleSubmitSuperUserDialog: props.handleSubmitSuperUserDialog
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
                clientReturnDialog={clientReturnDialog}
                superUser={superUser}
                handleSubmitSearch={props.handleSubmitSearch}
            />
        </Layout>
    )
})

export default ClientBalanceList
