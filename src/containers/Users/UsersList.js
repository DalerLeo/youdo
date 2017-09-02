import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {reset} from 'redux-form'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {
    USERS_CREATE_DIALOG_OPEN,
    USERS_UPDATE_DIALOG_OPEN,
    USERS_DELETE_DIALOG_OPEN,
    USERS_FILTER_KEY,
    USERS_FILTER_OPEN,
    UsersGridList
} from '../../components/Users'
import {
    usersCreateAction,
    usersUpdateAction,
    usersListFetchAction,
    usersDeleteAction,
    usersItemFetchAction,
    userGroupListFetchAction
} from '../../actions/users'
import {stockListFetchAction} from '../../actions/stock'
import {marketTypeListFetchAction} from '../../actions/marketType'
import {openSnackbarAction} from '../../actions/snackbar'
import {openErrorAction} from '../../actions/error'
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['users', 'item', 'data'])
        const detailLoading = _.get(state, ['users', 'item', 'loading'])
        const createLoading = _.get(state, ['users', 'create', 'loading'])
        const updateLoading = _.get(state, ['users', 'update', 'loading'])
        const list = _.get(state, ['users', 'list', 'data'])
        const groupList = _.get(state, ['users', 'groupList', 'data'])
        const groupListLoading = _.get(state, ['users', 'groupList', 'loading'])
        const stockList = _.get(state, ['stock', 'list', 'data'])
        const stockListLoading = _.get(state, ['stock', 'list', 'loading'])
        const marketList = _.get(state, ['marketType', 'list', 'data'])
        const marketListLoading = _.get(state, ['marketType', 'list', 'loading'])
        const listLoading = _.get(state, ['users', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'UsersFilterForm'])
        const createForm = _.get(state, ['form', 'UsersCreateForm'])
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
            createForm,
            groupList,
            groupListLoading,
            stockList,
            stockListLoading,
            marketList,
            marketListLoading
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(usersListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const usersId = _.get(nextProps, ['params', 'usersId'])
        return usersId && _.get(props, ['params', 'usersId']) !== usersId
    }, ({dispatch, params}) => {
        const usersId = _.toInteger(_.get(params, 'usersId'))
        usersId && dispatch(usersItemFetchAction(usersId))
    }),

    withPropsOnChange((props, nextProps) => {
        const prevCreateDialog = _.get(props, ['location', 'query', USERS_CREATE_DIALOG_OPEN])
        const nextCreateDialog = _.get(nextProps, ['location', 'query', USERS_CREATE_DIALOG_OPEN])
        const prevUpdateDialog = _.get(props, ['location', 'query', USERS_UPDATE_DIALOG_OPEN])
        const nextUpdateDialog = _.get(nextProps, ['location', 'query', USERS_UPDATE_DIALOG_OPEN])
        return ((prevCreateDialog !== nextCreateDialog) || (prevUpdateDialog !== nextUpdateDialog)) &&
            (nextCreateDialog === 'true' || nextUpdateDialog === 'true') && props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(userGroupListFetchAction())
        dispatch(stockListFetchAction(filter))
        dispatch(marketTypeListFetchAction(filter))
    }),

    withHandlers({
        handleActionEdit: props => () => {
            return null
        },

        handleOpenConfirmDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.USERS_ITEM_PATH, id),
                query: filter.getParams({[USERS_DELETE_DIALOG_OPEN]: true})
            })
        },

        handleCloseConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[USERS_DELETE_DIALOG_OPEN]: false})})
        },
        handleSendConfirmDialog: props => () => {
            const {dispatch, detail, filter, location: {pathname}} = props
            dispatch(usersDeleteAction(detail.id))
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[USERS_DELETE_DIALOG_OPEN]: false})})
                    dispatch(usersListFetchAction(filter))
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Ошибка при удалении'}))
                })
        },

        handleOpenFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[USERS_FILTER_OPEN]: true})})
        },

        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[USERS_FILTER_OPEN]: false})})
        },

        handleClearFilterDialog: props => () => {
            const {location: {pathname}} = props
            hashHistory.push({pathname, query: {}})
        },

        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const manufacture = _.get(filterForm, ['values', 'manufacture', 'value']) || null
            const group = _.get(filterForm, ['values', 'group', 'value']) || null

            filter.filterBy({
                [USERS_FILTER_OPEN]: false,
                [USERS_FILTER_KEY.MANUFACTURE]: manufacture,
                [USERS_FILTER_KEY.GROUP]: group
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
            const {dispatch, location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[USERS_CREATE_DIALOG_OPEN]: true})})
            dispatch(reset('UsersCreateForm'))
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[USERS_CREATE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}} = props

            return dispatch(usersCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[USERS_CREATE_DIALOG_OPEN]: false})})
                    dispatch(usersListFetchAction(filter))
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
        },

        handleOpenUpdateDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.USERS_ITEM_PATH, id),
                query: filter.getParams({[USERS_UPDATE_DIALOG_OPEN]: true})
            })
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[USERS_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}} = props
            const usersId = _.toInteger(_.get(props, ['params', 'usersId']))
            return dispatch(usersUpdateAction(usersId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({
                        pathname,
                        query: filter.getParams({[USERS_UPDATE_DIALOG_OPEN]: false, 'passErr': false})
                    })
                    dispatch(usersListFetchAction(filter))
                })
        }
    })
)

const UsersList = enhance((props) => {
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
        params,
        groupList,
        groupListLoading,
        stockList,
        stockListLoading,
        marketList,
        marketListLoading
    } = props

    const openFilterDialog = toBoolean(_.get(location, ['query', USERS_FILTER_OPEN]))
    const openCreateDialog = toBoolean(_.get(location, ['query', USERS_CREATE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', USERS_UPDATE_DIALOG_OPEN]))
    const openConfirmDialog = toBoolean(_.get(location, ['query', USERS_DELETE_DIALOG_OPEN]))

    const manufacture = _.toInteger(filter.getParam(USERS_FILTER_KEY.MANUFACTURE))
    const group = _.toInteger(filter.getParam(USERS_FILTER_KEY.GROUP))
    const detailId = _.toInteger(_.get(params, 'usersId'))
    const showError = toBoolean(_.get(location, ['query', 'passErr']))

    const actionsDialog = {
        handleActionEdit: props.handleActionEdit,
        handleActionDelete: props.handleOpenDeleteDialog
    }

    const errorData = {
        errorText: 'Введены неправильные значения',
        show: showError
    }

    const isSelectedGroups = _.map(_.get(groupList, 'results'), (obj) => {
        const userSelectedGroups = _.find(_.get(detail, 'groups'), {'id': obj.id})
        const userSelectedGrId = _.get(userSelectedGroups, 'id')
        if (!openCreateDialog && userSelectedGrId === obj.id) {
            return {id: obj.id, selected: true}
        }
        return {id: obj.id, selected: false}
    })

    const isSelectedStocks = _.map(_.get(stockList, 'results'), (obj) => {
        const userSelectedStock = _.find(_.get(detail, 'stocks'), {'id': obj.id})
        if (!openCreateDialog && _.get(userSelectedStock, 'id') === obj.id) {
            return {id: obj.id, selected: true}
        }
        return {id: obj.id, selected: false}
    })

    const isSelectedMarkets = _.map(_.get(marketList, 'results'), (obj) => {
        const userSelectedMarkets = _.find(_.get(detail, 'types'), {'id': obj.id})
        if (!openCreateDialog && _.get(userSelectedMarkets, 'id') === obj.id) {
            return {id: obj.id, selected: true}
        }
        return {id: obj.id, selected: false}
    })

    const createDialog = {
        initialValues: (() => {
            return {
                groups: isSelectedGroups,
                stocks: isSelectedStocks,
                types: isSelectedMarkets
            }
        })(),
        createLoading,
        openCreateDialog,
        handleOpenCreateDialog: props.handleOpenCreateDialog,
        handleCloseCreateDialog: props.handleCloseCreateDialog,
        handleSubmitCreateDialog: props.handleSubmitCreateDialog,
        errorData
    }
    const confirmDialog = {
        confirmLoading: detailLoading,
        openConfirmDialog: openConfirmDialog,
        handleOpenConfirmDialog: props.handleOpenConfirmDialog,
        handleCloseConfirmDialog: props.handleCloseConfirmDialog,
        handleSendConfirmDialog: props.handleSendConfirmDialog
    }
    const updateDialog = {
        initialValues: (() => {
            if (!detail || openCreateDialog) {
                return {
                    groups: isSelectedGroups,
                    stocks: isSelectedStocks,
                    types: isSelectedMarkets
                }
            }

            return {
                username: _.get(detail, 'username'),
                firstName: _.get(detail, 'firstName'),
                secondName: _.get(detail, 'secondName'),
                phoneNumber: _.get(detail, 'phoneNumber'),
                groups: isSelectedGroups,
                stocks: isSelectedStocks,
                types: isSelectedMarkets,
                region: _.get(detail, 'region'),
                password: _.get(detail, 'password'),
                typeUser: _.get(detail, 'typeUser'),
                image: _.get(detail, 'image'),
                isActive: _.get(detail, 'isActive'),
                position: {value: _.get(detail, ['position', 'id'])}
            }
        })(),
        updateLoading: detailLoading || updateLoading,
        openUpdateDialog,
        handleOpenUpdateDialog: props.handleOpenUpdateDialog,
        handleCloseUpdateDialog: props.handleCloseUpdateDialog,
        handleSubmitUpdateDialog: props.handleSubmitUpdateDialog,
        errorData
    }
    const filterDialog = {
        initialValues: {
            manufacture: {
                value: manufacture
            },
            group: {
                value: group
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

    const groupListData = {
        data: _.get(groupList, 'results'),
        groupListLoading
    }
    const stockListData = {
        data: _.get(stockList, 'results'),
        stockListLoading
    }
    const marketTypeData = {
        data: _.get(marketList, 'results'),
        marketListLoading
    }

    return (
        <Layout {...layout}>
            <UsersGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                createDialog={createDialog}
                confirmDialog={confirmDialog}
                updateDialog={updateDialog}
                actionsDialog={actionsDialog}
                filterDialog={filterDialog}
                groupListData={groupListData}
                stockListData={stockListData}
                marketTypeData={marketTypeData}
            />
        </Layout>
    )
})

export default UsersList
