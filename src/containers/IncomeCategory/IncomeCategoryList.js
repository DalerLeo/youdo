import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import {reset} from 'redux-form'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {
    INCOME_CATEGORY_CREATE_DIALOG_OPEN,
    INCOME_CATEGORY_UPDATE_DIALOG_OPEN,
    INCOME_CATEGORY_DELETE_DIALOG_OPEN,
    IncomeCategoryGridList
} from '../../components/IncomeCategory'
import {
    incomeCategoryCreateAction,
    incomeCategoryUpdateAction,
    incomeCategoryListFetchAction,
    incomeCategoryDeleteAction,
    incomeCategoryItemFetchAction,
    optionsListFetchAction
} from '../../actions/incomeCategory'
import {openSnackbarAction} from '../../actions/snackbar'
import t from '../../helpers/translate'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['incomeCategory', 'item', 'data'])
        const detailLoading = _.get(state, ['incomeCategory', 'item', 'loading'])
        const createLoading = _.get(state, ['incomeCategory', 'create', 'loading'])
        const updateLoading = _.get(state, ['incomeCategory', 'update', 'loading'])
        const list = _.get(state, ['incomeCategory', 'list', 'data'])
        const listLoading = _.get(state, ['incomeCategory', 'list', 'loading'])
        const optionsList = _.get(state, ['incomeCategory', 'options', 'data'])
        const optionsListLoading = _.get(state, ['incomeCategory', 'options', 'loading'])
        const createForm = _.get(state, ['form', 'IncomeCategoryCreateForm'])
        const filter = filterHelper(list, pathname, query)

        return {
            list,
            listLoading,
            detail,
            detailLoading,
            createLoading,
            updateLoading,
            optionsList,
            optionsListLoading,
            filter,
            createForm
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(incomeCategoryListFetchAction(filter))
        dispatch(optionsListFetchAction())
    }),

    withPropsOnChange((props, nextProps) => {
        const incomeCategoryId = _.get(nextProps, ['params', 'incomeCategoryId'])
        return incomeCategoryId && _.get(props, ['params', 'incomeCategoryId']) !== incomeCategoryId
    }, ({dispatch, params}) => {
        const incomeCategoryId = _.toInteger(_.get(params, 'incomeCategoryId'))
        incomeCategoryId && dispatch(incomeCategoryItemFetchAction(incomeCategoryId))
    }),
    withPropsOnChange((props, nextProps) => {
        const prevCreateDialog = toBoolean(_.get(props, ['location', 'query', INCOME_CATEGORY_CREATE_DIALOG_OPEN]))
        const nextCreateDialog = toBoolean(_.get(nextProps, ['location', 'query', INCOME_CATEGORY_CREATE_DIALOG_OPEN]))
        const prevUpdateDialog = toBoolean(_.get(props, ['location', 'query', INCOME_CATEGORY_UPDATE_DIALOG_OPEN]))
        const nextUpdateDialog = toBoolean(_.get(nextProps, ['location', 'query', INCOME_CATEGORY_UPDATE_DIALOG_OPEN]))
        return (prevCreateDialog !== nextCreateDialog || prevUpdateDialog !== nextUpdateDialog) &&
            (nextUpdateDialog === true || nextCreateDialog === true)
    }, ({dispatch, location}) => {
        const createDialogDialog = toBoolean(_.get(location, ['query', INCOME_CATEGORY_UPDATE_DIALOG_OPEN]))
        const updateDialogDialog = toBoolean(_.get(location, ['query', INCOME_CATEGORY_UPDATE_DIALOG_OPEN]))

        if (createDialogDialog || updateDialogDialog) {
            dispatch(optionsListFetchAction())
        }
    }),

    withHandlers({
        handleActionEdit: () => {
            return null
        },

        handleOpenConfirmDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.INCOME_CATEGORY_ITEM_PATH, id),
                query: filter.getParams({[INCOME_CATEGORY_DELETE_DIALOG_OPEN]: true})
            })
        },

        handleCloseConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[INCOME_CATEGORY_DELETE_DIALOG_OPEN]: false})})
        },
        handleSendConfirmDialog: props => () => {
            const {dispatch, detail, filter, location: {pathname}} = props
            dispatch(incomeCategoryDeleteAction(detail.id))
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[INCOME_CATEGORY_DELETE_DIALOG_OPEN]: false})})
                    dispatch(incomeCategoryListFetchAction(filter))
                    return dispatch(openSnackbarAction({message: t('Успешно удалено')}))
                })
                .catch(() => {
                    return dispatch(openSnackbarAction({message: t('Ошибка при удалении')}))
                })
        },

        handleOpenCreateDialog: props => () => {
            const {dispatch, location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[INCOME_CATEGORY_CREATE_DIALOG_OPEN]: true})})
            dispatch(reset('IncomeCategoryCreateForm'))
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[INCOME_CATEGORY_CREATE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}} = props

            return dispatch(incomeCategoryCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[INCOME_CATEGORY_CREATE_DIALOG_OPEN]: false})})
                    dispatch(incomeCategoryListFetchAction(filter))
                })
        },

        handleOpenUpdateDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.INCOME_CATEGORY_ITEM_PATH, id),
                query: filter.getParams({[INCOME_CATEGORY_UPDATE_DIALOG_OPEN]: true})
            })
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[INCOME_CATEGORY_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter} = props
            const incomeCategoryId = _.toInteger(_.get(props, ['params', 'incomeCategoryId']))

            return dispatch(incomeCategoryUpdateAction(incomeCategoryId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[INCOME_CATEGORY_UPDATE_DIALOG_OPEN]: false}))
                    dispatch(incomeCategoryListFetchAction(filter))
                })
        }
    })
)

const IncomeCategoryList = enhance((props) => {
    const {
        location,
        list,
        listLoading,
        detail,
        detailLoading,
        createLoading,
        updateLoading,
        optionsList,
        optionsListLoading,
        filter,
        layout,
        params
    } = props

    const openCreateDialog = toBoolean(_.get(location, ['query', INCOME_CATEGORY_CREATE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', INCOME_CATEGORY_UPDATE_DIALOG_OPEN]))
    const openConfirmDialog = toBoolean(_.get(location, ['query', INCOME_CATEGORY_DELETE_DIALOG_OPEN]))

    const detailId = _.toInteger(_.get(params, 'incomeCategoryId'))

    const createDialog = {
        initialValues: (() => {
            return {}
        })(),
        createLoading,
        openCreateDialog,
        handleOpenCreateDialog: props.handleOpenCreateDialog,
        handleCloseCreateDialog: props.handleCloseCreateDialog,
        handleSubmitCreateDialog: props.handleSubmitCreateDialog
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
                return {}
            }
            return {
                name: _.get(detail, 'name'),
                showOptions: !_.isEmpty(_.get(detail, 'options')),
                options: _.first(_.get(detail, 'options'))

            }
        })(),
        updateLoading: detailLoading || updateLoading,
        openUpdateDialog,
        handleOpenUpdateDialog: props.handleOpenUpdateDialog,
        handleCloseUpdateDialog: props.handleCloseUpdateDialog,
        handleSubmitUpdateDialog: props.handleSubmitUpdateDialog
    }

    const listData = {
        data: _.get(list, 'results'),
        options: _.get(optionsList, 'results'),
        listLoading,
        optionsListLoading
    }

    const detailData = {
        id: detailId,
        data: detail,
        detailLoading
    }

    return (
        <Layout {...layout}>
            <IncomeCategoryGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                createDialog={createDialog}
                confirmDialog={confirmDialog}
                updateDialog={updateDialog}
            />
        </Layout>
    )
})

export default IncomeCategoryList
