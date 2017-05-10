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
    BRAND_CREATE_DIALOG_OPEN,
    BRAND_UPDATE_DIALOG_OPEN,
    BRAND_DELETE_DIALOG_OPEN,
    BrandGridList
} from '../../components/Brand'
import {
    brandCreateAction,
    brandUpdateAction,
    brandListFetchAction,
    brandCSVFetchAction,
    brandDeleteAction,
    brandItemFetchAction
} from '../../actions/brand'
import {openSnackbarAction} from '../../actions/snackbar'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['brand', 'item', 'data'])
        const detailLoading = _.get(state, ['brand', 'item', 'loading'])
        const createLoading = _.get(state, ['brand', 'create', 'loading'])
        const updateLoading = _.get(state, ['brand', 'update', 'loading'])
        const list = _.get(state, ['brand', 'list', 'data'])
        const listLoading = _.get(state, ['brand', 'list', 'loading'])
        const csvData = _.get(state, ['brand', 'csv', 'data'])
        const csvLoading = _.get(state, ['brand', 'csv', 'loading'])
        const createForm = _.get(state, ['form', 'BrandCreateForm'])
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
        dispatch(brandListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const brandId = _.get(nextProps, ['params', 'brandId'])

        return brandId && _.get(props, ['params', 'brandId']) !== brandId
    }, ({dispatch, params}) => {
        const brandId = _.toInteger(_.get(params, 'brandId'))
        brandId && dispatch(brandItemFetchAction(brandId))
    }),

    withState('openCSVDialog', 'setOpenCSVDialog', false),

    withHandlers({
        handleActionEdit: props => () => {
            return null
        },

        handleOpenCSVDialog: props => () => {
            const {dispatch, setOpenCSVDialog} = props
            setOpenCSVDialog(true)

            dispatch(brandCSVFetchAction(props.filter))
        },

        handleCloseCSVDialog: props => () => {
            const {setOpenCSVDialog} = props
            setOpenCSVDialog(false)
        },

        handleOpenConfirmDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.BRAND_ITEM_PATH, id),
                query: filter.getParams({[BRAND_DELETE_DIALOG_OPEN]: true})
            })
        },

        handleCloseConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[BRAND_DELETE_DIALOG_OPEN]: false})})
        },
        handleSendConfirmDialog: props => () => {
            const {dispatch, detail, filter, location: {pathname}} = props
            dispatch(brandDeleteAction(detail.id))
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[BRAND_DELETE_DIALOG_OPEN]: false})})
                    dispatch(brandListFetchAction(filter))
                })
        },

        handleOpenCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[BRAND_CREATE_DIALOG_OPEN]: true})})
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[BRAND_CREATE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}} = props

            return dispatch(brandCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[BRAND_CREATE_DIALOG_OPEN]: false})})
                    dispatch(brandListFetchAction(filter))
                })
        },

        handleOpenUpdateDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.BRAND_ITEM_PATH, id),
                query: filter.getParams({[BRAND_UPDATE_DIALOG_OPEN]: true})
            })
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[BRAND_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter} = props
            const brandId = _.toInteger(_.get(props, ['params', 'brandId']))

            return dispatch(brandUpdateAction(brandId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(brandItemFetchAction(brandId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[BRAND_UPDATE_DIALOG_OPEN]: false}))
                    dispatch(brandListFetchAction(filter))
                })
        }
    })
)

const BrandList = enhance((props) => {
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

    const openCreateDialog = toBoolean(_.get(location, ['query', BRAND_CREATE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', BRAND_UPDATE_DIALOG_OPEN]))
    const openConfirmDialog = toBoolean(_.get(location, ['query', BRAND_DELETE_DIALOG_OPEN]))

    const detailId = _.toInteger(_.get(params, 'brandId'))

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
            <BrandGridList
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

export default BrandList