import React from 'react'
import _ from 'lodash'
import reset from 'redux-form'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {
    CURRENCY_CREATE_DIALOG_OPEN,
    CURRENCY_UPDATE_DIALOG_OPEN,
    CURRENCY_DELETE_DIALOG_OPEN,
    ADD_COURSE_DIALOG_OPEN,
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

const MINUS_ONE = -1
const ZERO = 0
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
        const csvData = _.get(state, ['currency', 'csv', 'data'])
        const csvLoading = _.get(state, ['currency', 'csv', 'loading'])
        const createForm = _.get(state, ['form', 'CurrencyCreateForm'])
        const courseForm = _.get(state, ['form', 'AddCourseForm'])
        const baseCreateForm = _.get(state, ['form', 'BaseCurrencyCreateForm'])
        const detailId = _.toInteger(_.get(props, ['location', 'query', 'detailId']) || '-1')
        const detailFilter = filterHelper(detail, pathname, query)
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
            baseCreateForm,
            createForm,
            courseForm,
            detailId,
            detailFilter
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
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

    withState('openCSVDialog', 'setOpenCSVDialog', false),
    withState('openConfirmDialog', 'setOpenConfirmDialog', false),

    withHandlers({
        handleActionEdit: props => () => {
            return null
        },

        handleCloseCSVDialog: props => () => {
            const {setOpenCSVDialog} = props
            setOpenCSVDialog(false)
        },

        handleOpenConfirmDialog: props => (id) => {
            const {filter, location: {pathname}} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({[CURRENCY_DELETE_DIALOG_OPEN]: true, 'detailId': id})
            })
        },

        handleCloseConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({[CURRENCY_DELETE_DIALOG_OPEN]: false, 'detailId': MINUS_ONE})
            })
        },
        handleSendConfirmDialog: props => () => {
            const {dispatch, detailId, filter, location: {pathname}} = props
            dispatch(currencyDeleteAction(_.toNumber(detailId)))
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .then(() => {
                    hashHistory.push({
                        pathname,
                        query: filter.getParams({[CURRENCY_DELETE_DIALOG_OPEN]: false, 'detailId': MINUS_ONE})
                    })
                    dispatch(currencyListFetchAction(filter))
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

        handleOpenCourseDialog: props => () => {
            const {location: {pathname}, filter, dispatch} = props
            dispatch(reset('AddCourseForm'))
            hashHistory.push({pathname, query: filter.getParams({[ADD_COURSE_DIALOG_OPEN]: true})})
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
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[ADD_COURSE_DIALOG_OPEN]: false})})
                    dispatch(currencyListFetchAction(filter))
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
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[CURRENCY_CREATE_DIALOG_OPEN]: false})})
                    dispatch(currencyListFetchAction(filter))
                })
        },

        handleOpenUpdateDialog: props => (id) => {
            const {dispatch, filter, location: {pathname}} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({[CURRENCY_UPDATE_DIALOG_OPEN]: true, 'detailId': id})
            })
            dispatch(currencyItemFetchAction(id))
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({[CURRENCY_UPDATE_DIALOG_OPEN]: false, 'detailId': MINUS_ONE})
            })
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter, detailId} = props

            return dispatch(currencyUpdateAction(detailId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(currencyItemFetchAction(detailId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[CURRENCY_UPDATE_DIALOG_OPEN]: false}))
                })
        },

        handleCurrencyClick: props => (id) => {
            const {filter} = props
            hashHistory.push({pathname: sprintf(ROUTER.CURRENCY_ITEM_PATH, _.toNumber(id)), query: filter.getParams()})
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

    const openCreateDialog = toBoolean(_.get(location, ['query', CURRENCY_CREATE_DIALOG_OPEN]))
    const openCourseDialog = toBoolean(_.get(location, ['query', ADD_COURSE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', CURRENCY_UPDATE_DIALOG_OPEN]))
    const openConfirmDialog = toBoolean(_.get(location, ['query', CURRENCY_DELETE_DIALOG_OPEN]))

    if (_.get(list, ['results']) && !_.get(params, 'currencyId')) {
        const currencyMiniId = _.get(_.nth(_.get(list, ['results']), ZERO), 'id')
        props.handleCurrencyClick(currencyMiniId)
    }

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
        openConfirmDialog: openConfirmDialog,
        handleOpenConfirmDialog: props.handleOpenConfirmDialog,
        handleCloseConfirmDialog: props.handleCloseConfirmDialog,
        handleSendConfirmDialog: props.handleSendConfirmDialog
    }

    const updateDialog = {
        initialValues: (() => {
            const currencyName = _.get(_.find((_.get(list, 'results')), {'id': detailId}), 'name')
            const currencyRate = _.get(_.find((_.get(list, 'results')), {'id': detailId}), 'rate')
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
        handleCurrencyClick: props.handleCurrencyClick
    }

    const detailData = {
        id: currencyDetailId,
        data: detail,
        detailLoading
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
                csvDialog={csvDialog}
                detailId={detailId}
                detailFilter={detailFilter}
            />
        </Layout>
    )
})

export default CurrencyList
