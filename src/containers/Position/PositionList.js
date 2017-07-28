import React from 'react'
import _ from 'lodash'
import {reset} from 'redux-form'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {
    POSITION_CREATE_DIALOG_OPEN,
    POSITION_UPDATE_DIALOG_OPEN,
    ADD_COURSE_DIALOG_OPEN,
    PositionGridList
} from '../../components/Position'
import {
    courseCreateAction,
    positionCreateAction,
    positionUpdateAction,
    positionListFetchAction,
    positionDeleteAction,
    positionItemFetchAction
} from '../../actions/position'
import {openSnackbarAction} from '../../actions/snackbar'

const ZERO = 0
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['position', 'item', 'data'])
        const detailLoading = _.get(state, ['position', 'item', 'loading'])
        const createLoading = _.get(state, ['position', 'create', 'loading'])
        const updateLoading = _.get(state, ['position', 'update', 'loading'])
        const list = _.get(state, ['position', 'list', 'data'])
        const listLoading = _.get(state, ['position', 'list', 'loading'])
        const createForm = _.get(state, ['form', 'PositionCreateForm'])
        const courseForm = _.get(state, ['form', 'AddCourseForm'])
        const baseCreateForm = _.get(state, ['form', 'BasePositionCreateForm'])
        const detailId = _.toInteger(_.get(props, ['params', 'positionId']) || '-1')
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
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(positionListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const positionId = _.get(nextProps, ['params', 'positionId'])
        return (positionId && _.get(props, ['params', 'positionId']) !== positionId) ||
            props.detailFilter.filterRequest() !== nextProps.detailFilter.filterRequest()
    }, ({dispatch, params, detailFilter}) => {
        const positionId = _.toInteger(_.get(params, 'positionId'))
        positionId && dispatch(positionItemFetchAction(detailFilter, positionId))
    }),

    withState('openConfirmDialog', 'setOpenConfirmDialog', false),

    withHandlers({
        handleActionEdit: props => () => {
            return null
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
            const {dispatch, detailId, filter, setOpenConfirmDialog} = props
            dispatch(positionDeleteAction(_.toNumber(detailId)))
                .then(() => {
                    setOpenConfirmDialog(false)
                    dispatch(positionListFetchAction(filter))
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Ошибка при удалении'}))
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
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ADD_COURSE_DIALOG_OPEN]: true})})
        },

        handleCloseCourseDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ADD_COURSE_DIALOG_OPEN]: false})})
        },

        handleSubmitCourseDialog: props => () => {
            const {location: {pathname}, dispatch, courseForm, filter, params} = props
            const position = _.get(params, 'positionId')
            return dispatch(courseCreateAction(_.get(courseForm, ['values']), position))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Курс обновлен'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[ADD_COURSE_DIALOG_OPEN]: false})})
                    dispatch(positionListFetchAction(filter))
                    dispatch(reset('AddCourseForm'))
                })
        },

        handleOpenCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[POSITION_CREATE_DIALOG_OPEN]: true})})
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[POSITION_CREATE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {location: {pathname}, dispatch, createForm, filter} = props

            return dispatch(positionCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[POSITION_CREATE_DIALOG_OPEN]: false})})
                    dispatch(positionListFetchAction(filter))
                })
        },

        handleOpenUpdateDialog: props => (id) => {
            const {dispatch, filter, location: {pathname}} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({[POSITION_UPDATE_DIALOG_OPEN]: true})
            })
            dispatch(positionItemFetchAction(id))
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname,
                query: filter.getParams({[POSITION_UPDATE_DIALOG_OPEN]: false})
            })
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter, detailId} = props

            return dispatch(positionUpdateAction(detailId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[POSITION_UPDATE_DIALOG_OPEN]: false}))
                    dispatch(positionListFetchAction(filter))
                })
        },

        handlePositionClick: props => (id) => {
            const {filter} = props
            hashHistory.push({pathname: sprintf(ROUTER.POSITION_ITEM_PATH, _.toNumber(id)), query: filter.getParams()})
        }
    })
)

const PositionList = enhance((props) => {
    const {
        location,
        list,
        listLoading,
        detail,
        detailLoading,
        createLoading,
        updateLoading,
        openConfirmDialog,
        filter,
        layout,
        params,
        detailId,
        detailFilter
    } = props

    const openCreateDialog = toBoolean(_.get(location, ['query', POSITION_CREATE_DIALOG_OPEN]))
    const openCourseDialog = toBoolean(_.get(location, ['query', ADD_COURSE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', POSITION_UPDATE_DIALOG_OPEN]))

    if (_.get(list, ['results']) && !_.get(params, 'positionId')) {
        const positionMiniId = _.get(_.nth(_.get(list, ['results']), ZERO), 'id')
        props.handlePositionClick(positionMiniId)
    }

    const positionDetailId = _.toInteger(_.get(params, 'positionId'))

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
            const positionName = _.get(_.find((_.get(list, 'results')), {'id': detailId}), 'name')
            const positionRate = _.get(_.find((_.get(list, 'results')), {'id': detailId}), 'rate')
            if (!positionName || openCreateDialog) {
                return {}
            }
            return {
                name: positionName,
                rate: positionRate
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
        handlePositionClick: props.handlePositionClick
    }

    const detailData = {
        id: positionDetailId,
        data: detail,
        detailLoading
    }

    return (
        <Layout {...layout}>
            <PositionGridList
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

export default PositionList
