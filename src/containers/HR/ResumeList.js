import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {reset} from 'redux-form'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout/index'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {
    RESUME_CREATE_DIALOG_OPEN,
    RESUME_UPDATE_DIALOG_OPEN,
    ResumeGridList
} from '../../components/HR/Resume/index'
import {
    resumeCreateAction,
    resumeUpdateAction,
    resumeListFetchAction,
    resumeDeleteAction,
    resumeItemFetchAction
} from '../../actions/HR/resume'
import {openSnackbarAction} from '../../actions/snackbar'
import t from '../../helpers/translate'
import {RESUME_FILTER_KEY, RESUME_FILTER_OPEN} from '../../components/HR/Resume'
import {PRICE_FILTER_KEY} from '../../components/Price'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['resume', 'item', 'data'])
        const detailLoading = _.get(state, ['resume', 'item', 'loading'])
        const createLoading = _.get(state, ['resume', 'create', 'loading'])
        const updateLoading = _.get(state, ['resume', 'update', 'loading'])
        const list = _.get(state, ['resume', 'list', 'data'])
        const listLoading = _.get(state, ['resume', 'list', 'loading'])
        const createForm = _.get(state, ['form', 'ResumeCreateForm'])
        const filter = filterHelper(list, pathname, query)

        return {
            list,
            listLoading,
            detail,
            detailLoading,
            createLoading,
            updateLoading,
            filter,
            createForm
        }
    }),
    withState('openConfirmDialog', 'setOpenConfirmDialog', false),

    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(resumeListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const resumeId = _.get(nextProps, ['params', 'resumeId'])
        return resumeId && _.get(props, ['params', 'resumeId']) !== resumeId
    }, ({dispatch, params}) => {
        const resumeId = _.toInteger(_.get(params, 'resumeId'))
        resumeId && dispatch(resumeItemFetchAction(resumeId))
    }),

    withHandlers({
        handleOpenFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[RESUME_FILTER_OPEN]: true})})
        },

        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[RESUME_FILTER_OPEN]: false})})
        },

        handleClearFilterDialog: props => () => {
            const {location: {pathname}, dispatch} = props
            hashHistory.push({pathname, query: {}})
            dispatch(reset('ResumeFilterForm'))
        },

        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const typeParent = _.get(filterForm, ['values', 'typeParent', 'value']) || null
            const typeChild = _.get(filterForm, ['values', 'typeChild', 'value']) || null
            const measurement = _.get(filterForm, ['values', 'measurement']) || null
            const withoutNetCost = _.get(filterForm, ['values', 'withoutNetCost']) || null

            filter.filterBy({
                [RESUME_FILTER_OPEN]: false,
                [RESUME_FILTER_KEY.TYPE_PARENT]: typeParent,
                [RESUME_FILTER_KEY.TYPE_CHILD]: typeParent && typeChild,
                [RESUME_FILTER_KEY.MEASUREMENT]: _.join(measurement, '-'),
                [RESUME_FILTER_KEY.WITHOUT_NET_COST]: withoutNetCost
            })
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
            const {dispatch, detail, setOpenConfirmDialog, filter} = props
            dispatch(resumeDeleteAction(detail.id))
                .then(() => {
                    setOpenConfirmDialog(false)
                    dispatch(resumeListFetchAction(filter))
                    return dispatch(openSnackbarAction({message: t('Успешно удалено')}))
                })
                .catch(() => {
                    return dispatch(openSnackbarAction({message: t('Удаление невозможно из-за связи с другими данными')}))
                })
        },

        handleOpenCreateDialog: props => () => {
            const {dispatch, location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[RESUME_CREATE_DIALOG_OPEN]: true})})
            dispatch(reset('ResumeCreateForm'))
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[RESUME_CREATE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}} = props

            return dispatch(resumeCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[RESUME_CREATE_DIALOG_OPEN]: false})})
                    dispatch(resumeListFetchAction(filter))
                })
        },

        handleOpenUpdateDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.HR_RESUME_ITEM_PATH, id),
                query: filter.getParams({[RESUME_UPDATE_DIALOG_OPEN]: true})
            })
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[RESUME_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter} = props
            const resumeId = _.toInteger(_.get(props, ['params', 'resumeId']))

            return dispatch(resumeUpdateAction(resumeId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(resumeItemFetchAction(resumeId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[RESUME_UPDATE_DIALOG_OPEN]: false}))
                    dispatch(resumeListFetchAction(filter))
                })
        },

        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.HR_RESUME_LIST_URL, query: filter.getParams()})
        }
    })
)

const ResumeList = enhance((props) => {
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

    const openFilterDialog = toBoolean(_.get(location, ['query', RESUME_FILTER_OPEN]))
    const openCreateDialog = toBoolean(_.get(location, ['query', RESUME_CREATE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', RESUME_UPDATE_DIALOG_OPEN]))
    const detailId = _.toInteger(_.get(params, 'resumeId'))

    const typeParent = _.toNumber(_.get(location, ['query', PRICE_FILTER_KEY.TYPE_PARENT]))
    const typeChild = _.toNumber(_.get(location, ['query', PRICE_FILTER_KEY.TYPE_CHILD]))
    const measurement = _.get(location, ['query', PRICE_FILTER_KEY.MEASUREMENT])
    const withoutNetCost = toBoolean(_.get(location, ['query', PRICE_FILTER_KEY.WITHOUT_NET_COST]))

    const filterDialog = {
        initialValues: {
            typeParent: {value: typeParent},
            typeChild: {value: typeChild},
            measurement: measurement && _.map(_.split(measurement, '-'), (item) => {
                return _.toNumber(item)
            }),
            withoutNetCost: withoutNetCost
        },
        filterLoading: false,
        openFilterDialog,
        handleOpenFilterDialog: props.handleOpenFilterDialog,
        handleCloseFilterDialog: props.handleCloseFilterDialog,
        handleClearFilterDialog: props.handleClearFilterDialog,
        handleSubmitFilterDialog: props.handleSubmitFilterDialog
    }

    const confirmDialog = {
        openConfirmDialog: props.openConfirmDialog,
        handleOpenConfirmDialog: props.handleOpenConfirmDialog,
        handleCloseConfirmDialog: props.handleCloseConfirmDialog,
        handleSendConfirmDialog: props.handleSendConfirmDialog
    }

    const createDialog = {
        createLoading,
        openCreateDialog,
        handleOpenCreateDialog: props.handleOpenCreateDialog,
        handleCloseCreateDialog: props.handleCloseCreateDialog,
        handleSubmitCreateDialog: props.handleSubmitCreateDialog
    }

    const updateDialog = {
        initialValues: (() => {
            if (!detail || openCreateDialog) {
                return {
                    languages: [{}]
                }
            }
            return {}
        })(),
        updateLoading: detailLoading || updateLoading,
        openUpdateDialog,
        handleOpenUpdateDialog: props.handleOpenUpdateDialog,
        handleCloseUpdateDialog: props.handleCloseUpdateDialog,
        handleSubmitUpdateDialog: props.handleSubmitUpdateDialog
    }

    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }

    const detailData = {
        id: detailId,
        data: detail,
        detailLoading,
        handleCloseDetail: props.handleCloseDetail
    }

    return (
        <Layout {...layout}>
            <ResumeGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                filterDialog={filterDialog}
                createDialog={createDialog}
                confirmDialog={confirmDialog}
                updateDialog={updateDialog}
            />
        </Layout>
    )
})

export default ResumeList
