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
import {
    EXPENSIVE_CATEGORY_CREATE_DIALOG_OPEN,
    EXPENSIVE_CATEGORY_UPDATE_DIALOG_OPEN,
    EXPENSIVE_CATEGORY_DELETE_DIALOG_OPEN,
    ExpensiveCategoryGridList
} from '../../components/ExpensiveCategory'
import {
    expensiveCategoryCreateAction,
    expensiveCategoryUpdateAction,
    expensiveCategoryListFetchAction,
    expensiveCategoryCSVFetchAction,
    expensiveCategoryDeleteAction,
    expensiveCategoryItemFetchAction
} from '../../actions/expensiveCategory'
import {openSnackbarAction} from '../../actions/snackbar'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['expensiveCategory', 'item', 'data'])
        const detailLoading = _.get(state, ['expensiveCategory', 'item', 'loading'])
        const createLoading = _.get(state, ['expensiveCategory', 'create', 'loading'])
        const updateLoading = _.get(state, ['expensiveCategory', 'update', 'loading'])
        const list = _.get(state, ['expensiveCategory', 'list', 'data'])
        const listLoading = _.get(state, ['expensiveCategory', 'list', 'loading'])
        const csvData = _.get(state, ['expensiveCategory', 'csv', 'data'])
        const csvLoading = _.get(state, ['expensiveCategory', 'csv', 'loading'])
        const createForm = _.get(state, ['form', 'ExpensiveCategoryCreateForm'])
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
            createForm
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(expensiveCategoryListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const expensiveCategoryId = _.get(nextProps, ['params', 'expensiveCategoryId'])
        return expensiveCategoryId && _.get(props, ['params', 'expensiveCategoryId']) !== expensiveCategoryId
    }, ({dispatch, params}) => {
        const expensiveCategoryId = _.toInteger(_.get(params, 'expensiveCategoryId'))
        expensiveCategoryId && dispatch(expensiveCategoryItemFetchAction(expensiveCategoryId))
    }),

    withState('openCSVDialog', 'setOpenCSVDialog', false),

    withHandlers({
        handleActionEdit: props => () => {
            return null
        },

        handleOpenCSVDialog: props => () => {
            const {dispatch, setOpenCSVDialog} = props
            setOpenCSVDialog(true)

            dispatch(expensiveCategoryCSVFetchAction(props.filter))
        },

        handleCloseCSVDialog: props => () => {
            const {setOpenCSVDialog} = props
            setOpenCSVDialog(false)
        },

        handleOpenConfirmDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.EXPENSIVE_CATEGORY_ITEM_PATH, id),
                query: filter.getParams({[EXPENSIVE_CATEGORY_DELETE_DIALOG_OPEN]: true})
            })
        },

        handleCloseConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[EXPENSIVE_CATEGORY_DELETE_DIALOG_OPEN]: false})})
        },
        handleSendConfirmDialog: props => () => {
            const {dispatch, detail, filter, location: {pathname}} = props
            dispatch(expensiveCategoryDeleteAction(detail.id))
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[EXPENSIVE_CATEGORY_DELETE_DIALOG_OPEN]: false})})
                    dispatch(expensiveCategoryListFetchAction(filter))
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
            hashHistory.push({pathname, query: filter.getParams({[EXPENSIVE_CATEGORY_CREATE_DIALOG_OPEN]: true})})
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[EXPENSIVE_CATEGORY_CREATE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}} = props

            return dispatch(expensiveCategoryCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[EXPENSIVE_CATEGORY_CREATE_DIALOG_OPEN]: false})})
                    dispatch(expensiveCategoryListFetchAction(filter))
                })
        },

        handleOpenUpdateDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.EXPENSIVE_CATEGORY_ITEM_PATH, id),
                query: filter.getParams({[EXPENSIVE_CATEGORY_UPDATE_DIALOG_OPEN]: true})
            })
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[EXPENSIVE_CATEGORY_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter} = props
            const expensiveCategoryId = _.toInteger(_.get(props, ['params', 'expensiveCategoryId']))

            return dispatch(expensiveCategoryUpdateAction(expensiveCategoryId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(expensiveCategoryItemFetchAction(expensiveCategoryId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[EXPENSIVE_CATEGORY_UPDATE_DIALOG_OPEN]: false}))
                })
        }
    })
)

const ExpensiveCategoryList = enhance((props) => {
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

    const openCreateDialog = toBoolean(_.get(location, ['query', EXPENSIVE_CATEGORY_CREATE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', EXPENSIVE_CATEGORY_UPDATE_DIALOG_OPEN]))
    const openConfirmDialog = toBoolean(_.get(location, ['query', EXPENSIVE_CATEGORY_DELETE_DIALOG_OPEN]))

    const detailId = _.toInteger(_.get(params, 'expensiveCategoryId'))

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

    const updateDialog = {
        initialValues: (() => {
            if (!detail) {
                return {}
            }
            return {
                name: _.get(detail, 'name')
            }
        })(),
        updateLoading: detailLoading || updateLoading,
        openUpdateDialog,
        handleOpenUpdateDialog: props.handleOpenUpdateDialog,
        handleCloseUpdateDialog: props.handleCloseUpdateDialog,
        handleSubmitUpdateDialog: props.handleSubmitUpdateDialog
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
            <ExpensiveCategoryGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                createDialog={createDialog}
                confirmDialog={confirmDialog}
                updateDialog={updateDialog}
                actionsDialog={actionsDialog}
                csvDialog={csvDialog}
            />
        </Layout>
    )
})

export default ExpensiveCategoryList
