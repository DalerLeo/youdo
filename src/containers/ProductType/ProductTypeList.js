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
    PRODUCT_TYPE_CREATE_DIALOG_OPEN,
    PRODUCT_TYPE_UPDATE_DIALOG_OPEN,
    PRODUCT_TYPE_DELETE_DIALOG_OPEN,
    ProductTypeGridList
} from '../../components/ProductType'
import {
    productTypeCreateAction,
    productTypeUpdateAction,
    productTypeListFetchAction,
    productTypeCSVFetchAction,
    productTypeDeleteAction,
    productTypeItemFetchAction
} from '../../actions/productType'
import {openSnackbarAction} from '../../actions/snackbar'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['productType', 'item', 'data'])
        const detailLoading = _.get(state, ['productType', 'item', 'loading'])
        const createLoading = _.get(state, ['productType', 'create', 'loading'])
        const updateLoading = _.get(state, ['productType', 'update', 'loading'])
        const list = _.get(state, ['productType', 'list', 'data'])
        const listLoading = _.get(state, ['productType', 'list', 'loading'])
        const csvData = _.get(state, ['productType', 'csv', 'data'])
        const csvLoading = _.get(state, ['productType', 'csv', 'loading'])
        const createForm = _.get(state, ['form', 'ProductTypeCreateForm'])
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
        dispatch(productTypeListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const productTypeId = _.get(nextProps, ['params', 'productTypeId'])

        return productTypeId && _.get(props, ['params', 'productTypeId']) !== productTypeId
    }, ({dispatch, params}) => {
        const productTypeId = _.toInteger(_.get(params, 'productTypeId'))
        productTypeId && dispatch(productTypeItemFetchAction(productTypeId))
    }),

    withState('openCSVDialog', 'setOpenCSVDialog', false),

    withHandlers({
        handleActionEdit: props => () => {
            return null
        },

        handleOpenCSVDialog: props => () => {
            const {dispatch, setOpenCSVDialog} = props
            setOpenCSVDialog(true)

            dispatch(productTypeCSVFetchAction(props.filter))
        },

        handleCloseCSVDialog: props => () => {
            const {setOpenCSVDialog} = props
            setOpenCSVDialog(false)
        },

        handleOpenConfirmDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.PRODUCT_TYPE_ITEM_PATH, id),
                query: filter.getParams({[PRODUCT_TYPE_DELETE_DIALOG_OPEN]: true})
            })
        },

        handleCloseConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRODUCT_TYPE_DELETE_DIALOG_OPEN]: false})})
        },
        handleSendConfirmDialog: props => () => {
            const {dispatch, detail, filter, location: {pathname}} = props
            dispatch(productTypeDeleteAction(detail.id))
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[PRODUCT_TYPE_DELETE_DIALOG_OPEN]: false})})
                    dispatch(productTypeListFetchAction(filter))
                })
        },

        handleOpenCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRODUCT_TYPE_CREATE_DIALOG_OPEN]: true})})
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRODUCT_TYPE_CREATE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}} = props

            return dispatch(productTypeCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[PRODUCT_TYPE_CREATE_DIALOG_OPEN]: false})})
                    dispatch(productTypeListFetchAction(filter))
                })
        },

        handleOpenUpdateDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.PRODUCT_TYPE_ITEM_PATH, id),
                query: filter.getParams({[PRODUCT_TYPE_UPDATE_DIALOG_OPEN]: true})
            })
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRODUCT_TYPE_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter} = props
            const productTypeId = _.toInteger(_.get(props, ['params', 'productTypeId']))

            return dispatch(productTypeUpdateAction(productTypeId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(productTypeItemFetchAction(productTypeId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[PRODUCT_TYPE_UPDATE_DIALOG_OPEN]: false}))
                    dispatch(productTypeListFetchAction(filter))
                })
        }
    })
)

const ProductTypeList = enhance((props) => {
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

    const openCreateDialog = toBoolean(_.get(location, ['query', PRODUCT_TYPE_CREATE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', PRODUCT_TYPE_UPDATE_DIALOG_OPEN]))
    const openConfirmDialog = toBoolean(_.get(location, ['query', PRODUCT_TYPE_DELETE_DIALOG_OPEN]))

    const detailId = _.toInteger(_.get(params, 'productTypeId'))

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
            <ProductTypeGridList
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

export default ProductTypeList
