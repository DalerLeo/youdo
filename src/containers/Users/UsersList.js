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
    USERS_CREATE_DIALOG_OPEN,
    USERS_UPDATE_DIALOG_OPEN,
    USERS_FILTER_KEY,
    USERS_FILTER_OPEN,
    UsersGridList
} from '../../components/Users'
import {
    usersCreateAction,
    usersUpdateAction,
    usersListFetchAction,
    usersCSVFetchAction,
    usersDeleteAction,
    usersItemFetchAction
} from '../../actions/users'
import {openSnackbarAction} from '../../actions/snackbar'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['users', 'item', 'data'])
        const detailLoading = _.get(state, ['users', 'item', 'loading'])
        const createLoading = _.get(state, ['users', 'create', 'loading'])
        const updateLoading = _.get(state, ['users', 'update', 'loading'])
        const list = _.get(state, ['users', 'list', 'data'])
        const listLoading = _.get(state, ['users', 'list', 'loading'])
        const csvData = _.get(state, ['users', 'csv', 'data'])
        const csvLoading = _.get(state, ['users', 'csv', 'loading'])
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
        dispatch(usersListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const usersId = _.get(nextProps, ['params', 'usersId'])
        return usersId && _.get(props, ['params', 'usersId']) !== usersId
    }, ({dispatch, params}) => {
        const usersId = _.toInteger(_.get(params, 'usersId'))
        usersId && dispatch(usersItemFetchAction(usersId))
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

            dispatch(usersCSVFetchAction(props.filter))
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
            dispatch(usersDeleteAction(detail.id))
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Successful deleted'}))
                })
                .then(() => {
                    setOpenConfirmDialog(false)
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
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null
            const category = _.get(filterForm, ['values', 'category', 'value']) || null

            filter.filterBy({
                [USERS_FILTER_OPEN]: false,
                [USERS_FILTER_KEY.CATEGORY]: category,
                [USERS_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [USERS_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')
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
            hashHistory.push({pathname, query: filter.getParams({[USERS_CREATE_DIALOG_OPEN]: true})})
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[USERS_CREATE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, filter} = props

            return dispatch(usersCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Successful saved'}))
                })
                .then(() => {
                    hashHistory.push({query: filter.getParams({[USERS_CREATE_DIALOG_OPEN]: false})})
                })
        },

        handleOpenUpdateDialog: props => (id) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[USERS_UPDATE_DIALOG_OPEN]: true})})
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[USERS_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter} = props
            const usersId = _.toInteger(_.get(props, ['params', 'usersId']))

            return dispatch(usersUpdateAction(usersId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(usersItemFetchAction(usersId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Successful saved'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[USERS_UPDATE_DIALOG_OPEN]: false}))
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
        params
    } = props

    const openFilterDialog = toBoolean(_.get(location, ['query', USERS_FILTER_OPEN]))
    const openCreateDialog = toBoolean(_.get(location, ['query', USERS_CREATE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', USERS_UPDATE_DIALOG_OPEN]))
    const openDeleteDialog = toBoolean(_.get(location, ['query', DELETE_DIALOG_OPEN]))
    const category = _.toInteger(filter.getParam(USERS_FILTER_KEY.CATEGORY))
    const fromDate = filter.getParam(USERS_FILTER_KEY.FROM_DATE)
    const toDate = filter.getParam(USERS_FILTER_KEY.TO_DATE)
    const detailId = _.toInteger(_.get(params, 'usersId'))

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
                username: _.get(detail, 'username'),
                firstName: _.get(detail, 'firstName'),
                secondName: _.get(detail, 'secondName'),
                phoneNumber: _.get(detail, 'phoneNumber'),
                region: _.get(detail, 'region'),
                password: _.get(detail, 'password'),
                typeUser: _.get(detail, 'typeUser'),
                email: _.get(detail, 'email')
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
            <UsersGridList
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

export default UsersList
