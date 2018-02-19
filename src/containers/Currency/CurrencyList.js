import React from 'react'
import sprintf from 'sprintf'
import _ from 'lodash'
import {reset} from 'redux-form'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import * as ROUTER from '../../constants/routes'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {
    CURRENCY_CREATE_DIALOG_OPEN,
    CURRENCY_UPDATE_DIALOG_OPEN,
    CURRENCY_DELETE_DIALOG_OPEN,
    ADD_COURSE_DIALOG_OPEN,
    HISTORY_LIST_DIALOG,
    CurrencyGridList
} from '../../components/Currency'
import {
    courseCreateAction,
    currencyCreateAction,
    currencyUpdateAction,
    currencyListFetchAction,
    currencyDeleteAction,
    currencyItemFetchAction
} from '../../actions/currency'
import {openSnackbarAction} from '../../actions/snackbar'
import t from '../../helpers/translate'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['currency', 'item', 'data'])
        const detailLoading = _.get(state, ['currency', 'item', 'loading'])
        const createLoading = _.get(state, ['currency', 'create', 'loading'])
        const updateLoading = _.get(state, ['currency', 'update', 'loading'])
        const list = _.get(state, ['currency', 'list', 'data'])
        const listLoading = _.get(state, ['currency', 'list', 'loading'])
        const createForm = _.get(state, ['form', 'CurrencyCreateForm'])
        const courseForm = _.get(state, ['form', 'AddCourseForm'])
        const baseCreateForm = _.get(state, ['form', 'BaseCurrencyCreateForm'])
        const detailId = _.toInteger(_.get(props, ['params', 'currencyId']) || '-1')
        const detailFilter = filterHelper(detail, pathname, query)
        const filter = filterHelper(list, pathname, query)
        return {
            list,
            listLoading,
            detail,
            detailLoading,
            createLoading,
            updateLoading,
            filter,
            baseCreateForm,
            createForm,
            courseForm,
            detailId,
            detailFilter
        }
    }),
    withPropsOnChange((props, nextProps) => {
        const except = {
            openHistoryList: null
        }
        return props.list && props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
    }, ({dispatch, filter}) => {
        dispatch(currencyListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const currencyId = _.get(nextProps, ['params', 'currencyId'])
        return (currencyId && _.get(props, ['params', 'currencyId']) !== currencyId) ||
            props.detailFilter.filterRequest() !== nextProps.detailFilter.filterRequest()
    }, ({dispatch, params, detailFilter}) => {
        const currencyId = _.toInteger(_.get(params, 'currencyId'))
        currencyId && dispatch(currencyItemFetchAction(detailFilter, currencyId))
    }),

    withState('openConfirmDialog', 'setOpenConfirmDialog', false),

    withHandlers({
        handleActionEdit: props => () => {
            return null
        },

        handleOpenConfirmDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({pathname: sprintf(ROUTER.CURRENCY_ITEM_PATH, id), query: filter.getParams({[CURRENCY_DELETE_DIALOG_OPEN]: true})})
        },

        handleCloseConfirmDialog: props => () => {
            const {filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({[CURRENCY_DELETE_DIALOG_OPEN]: false})})
        },
        handleSendConfirmDialog: props => () => {
            const {dispatch, detailId, filter, location: {pathname}} = props
            dispatch(currencyDeleteAction(_.toNumber(detailId)))
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[CURRENCY_DELETE_DIALOG_OPEN]: false})})
                    dispatch(currencyListFetchAction(filter))
                    return dispatch(openSnackbarAction({message: t('Успешно удалено')}))
                })
                .catch(() => {
                    return dispatch(openSnackbarAction({message: t('Удаление невозможно из-за связи с другими данными')}))
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

        handleOpenCourseDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({pathname: sprintf(ROUTER.CURRENCY_ITEM_PATH, id), query: filter.getParams({[ADD_COURSE_DIALOG_OPEN]: true})})
        },

        handleCloseCourseDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ADD_COURSE_DIALOG_OPEN]: false})})
        },

        handleSubmitCourseDialog: props => () => {
            const {location: {pathname}, dispatch, courseForm, filter, params} = props
            const currency = _.get(params, 'currencyId')
            return dispatch(courseCreateAction(_.get(courseForm, ['values']), currency))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Курс обновлен')}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[ADD_COURSE_DIALOG_OPEN]: false})})
                    dispatch(currencyListFetchAction(filter))
                    dispatch(reset('AddCourseForm'))
                })
        },

        handleOpenCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CURRENCY_CREATE_DIALOG_OPEN]: true})})
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CURRENCY_CREATE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {location: {pathname}, dispatch, createForm, filter} = props

            return dispatch(currencyCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[CURRENCY_CREATE_DIALOG_OPEN]: false})})
                    dispatch(currencyListFetchAction(filter))
                })
        },

        handleOpenUpdateDialog: props => (id) => {
            const {dispatch, filter} = props
            hashHistory.push({pathname: sprintf(ROUTER.CURRENCY_ITEM_PATH, id), query: filter.getParams({[CURRENCY_UPDATE_DIALOG_OPEN]: true})})
            dispatch(currencyItemFetchAction(id))
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CURRENCY_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter, detailId} = props

            return dispatch(currencyUpdateAction(detailId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[CURRENCY_UPDATE_DIALOG_OPEN]: false}))
                    dispatch(currencyListFetchAction(filter))
                })
        },

        handleCurrencyClick: props => (id) => {
            const {filter} = props
            hashHistory.push({pathname: sprintf(ROUTER.CURRENCY_ITEM_PATH, _.toNumber(id)), query: filter.getParams({[HISTORY_LIST_DIALOG]: true})})
        },

        handleCloseDetailPopover: props => () => {
            const {filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({[HISTORY_LIST_DIALOG]: false})})
        }
    })
)

const CurrencyList = enhance((props) => {
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
        detailId,
        detailFilter
    } = props

    const openDeleteDialog = toBoolean(_.get(location, ['query', CURRENCY_DELETE_DIALOG_OPEN]))
    const openCreateDialog = toBoolean(_.get(location, ['query', CURRENCY_CREATE_DIALOG_OPEN]))
    const openCourseDialog = toBoolean(_.get(location, ['query', ADD_COURSE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', CURRENCY_UPDATE_DIALOG_OPEN]))
    const openHistoryListDialog = toBoolean(_.get(location, ['query', HISTORY_LIST_DIALOG]))

    const currencyDetailId = _.toInteger(_.get(params, 'currencyId'))

    const actionsDialog = {
        handleActionEdit: props.handleActionEdit,
        handleActionDelete: props.handleOpenDeleteDialog
    }

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
    const courseDialog = {
        initialValues: (() => {
            return {}
        })(),
        openCourseDialog,
        handleOpenCourseDialog: props.handleOpenCourseDialog,
        handleCloseCourseDialog: props.handleCloseCourseDialog,
        handleSubmitCourseDialog: props.handleSubmitCourseDialog
    }

    const confirmDialog = {
        openConfirmDialog: openDeleteDialog,
        handleOpenConfirmDialog: props.handleOpenConfirmDialog,
        handleCloseConfirmDialog: props.handleCloseConfirmDialog,
        handleSendConfirmDialog: props.handleSendConfirmDialog
    }

    const updateDialog = {

        initialValues: (() => {
            const currencyName = _.get(_.find((_.get(list, 'results')), {'id': detailId}), 'name')
            const currencyRate = _.get(_.find((_.get(list, 'results')), {'id': detailId}), ['rate', 'rate'])
            if (!currencyName || openCreateDialog) {
                return {}
            }
            return {
                name: currencyName,
                rate: currencyRate
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
        listLoading,
        handleCurrencyClick: props.handleCurrencyClick
    }

    const detailData = {
        id: currencyDetailId,
        data: detail,
        detailLoading,
        open: openHistoryListDialog,
        handleClose: props.handleCloseDetailPopover
    }

    return (
        <Layout {...layout}>
            <CurrencyGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                createDialog={createDialog}
                courseDialog={courseDialog}
                confirmDialog={confirmDialog}
                updateDialog={updateDialog}
                actionsDialog={actionsDialog}
                detailId={detailId}
                detailFilter={detailFilter}
            />
        </Layout>
    )
})

export default CurrencyList
