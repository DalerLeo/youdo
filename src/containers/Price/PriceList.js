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
    PRICE_CREATE_DIALOG_OPEN,
    PRICE_SHOW_PHOTO_OPEN,
    PRICE_UPDATE_DIALOG_OPEN,
    PRICE_DELETE_DIALOG_OPEN,
    PRICE_FILTER_KEY,
    PRICE_FILTER_OPEN,
    PriceGridList
} from '../../components/Price'
import {
    priceCreateAction,
    priceUpdateAction,
    priceListFetchAction,
    priceCSVFetchAction,
    priceDeleteAction,
    priceItemFetchAction
} from '../../actions/price'

import {openSnackbarAction} from '../../actions/snackbar'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['price', 'item', 'data'])
        const detailLoading = _.get(state, ['price', 'item', 'loading'])
        const createLoading = _.get(state, ['price', 'create', 'loading'])
        const showBigImgLoading = _.get(state, ['price', 'item', 'loading'])
        const updateLoading = _.get(state, ['price', 'update', 'loading'])
        const list = _.get(state, ['price', 'list', 'data'])
        const listLoading = _.get(state, ['price', 'list', 'loading'])
        const csvData = _.get(state, ['price', 'csv', 'data'])
        const csvLoading = _.get(state, ['price', 'csv', 'loading'])
        const filterForm = _.get(state, ['form', 'PriceFilterForm'])
        const createForm = _.get(state, ['form', 'PriceCreateForm'])
        const filter = filterHelper(list, pathname, query)

        return {
            list,
            listLoading,
            detail,
            detailLoading,
            createLoading,
            showBigImgLoading,
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
        dispatch(priceListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const priceId = _.get(nextProps, ['params', 'priceId'])

        return priceId && _.get(props, ['params', 'priceId']) !== priceId
    }, ({dispatch, params, nextProps}) => {
        const priceId = _.toInteger(_.get(params, 'priceId'))
        priceId && !_.get(nextProps, PRICE_DELETE_DIALOG_OPEN) && dispatch(priceItemFetchAction(priceId))
    }),

    withState('openCSVDialog', 'setOpenCSVDialog', false),

    withHandlers({
        handleActionEdit: props => () => {
            return null
        },

        handleOpenCSVDialog: props => () => {
            const {dispatch, setOpenCSVDialog} = props
            setOpenCSVDialog(true)

            dispatch(priceCSVFetchAction(props.filter))
        },

        handleCloseCSVDialog: props => () => {
            const {setOpenCSVDialog} = props
            setOpenCSVDialog(false)
        },

        handleOpenConfirmDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.PRICE_ITEM_PATH, id),
                query: filter.getParams({[PRICE_DELETE_DIALOG_OPEN]: true})
            })
        },

        handleCloseConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRICE_DELETE_DIALOG_OPEN]: false})})
        },

        handleSendConfirmDialog: props => () => {
            const {dispatch, detail, filter, location: {pathname}} = props
            dispatch(priceDeleteAction(detail.id))
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[PRICE_DELETE_DIALOG_OPEN]: false})})
                    dispatch(priceListFetchAction(filter))
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Ошибка при удалении'}))
                })
        },

        handleOpenFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRICE_FILTER_OPEN]: true})})
        },

        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRICE_FILTER_OPEN]: false})})
        },

        handleClearFilterDialog: props => () => {
            const {location: {pathname}} = props
            hashHistory.push({pathname, query: {}})
        },

        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const type = _.get(filterForm, ['values', 'type', 'value']) || null
            const measurement = _.get(filterForm, ['values', 'measurement', 'value']) || null
            const brand = _.get(filterForm, ['values', 'brand', 'value']) || null

            filter.filterBy({
                [PRICE_FILTER_OPEN]: false,
                [PRICE_FILTER_KEY.TYPE]: type,
                [PRICE_FILTER_KEY.MEASUREMENT]: measurement,
                [PRICE_FILTER_KEY.BRAND]: brand
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
            hashHistory.push({pathname, query: filter.getParams({[PRICE_CREATE_DIALOG_OPEN]: true})})
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRICE_CREATE_DIALOG_OPEN]: false})})
        },

        handleOpenShowBigImg: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.PRICE_ITEM_PATH, id),
                query: filter.getParams({[PRICE_SHOW_PHOTO_OPEN]: true})
            })
        },

        handleCloseShowBigImg: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRICE_SHOW_PHOTO_OPEN]: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}} = props

            return dispatch(priceCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[PRICE_CREATE_DIALOG_OPEN]: false})})
                    dispatch(priceListFetchAction(filter))
                })
        },

        handleOpenUpdateDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.PRICE_ITEM_PATH, id),
                query: filter.getParams({[PRICE_UPDATE_DIALOG_OPEN]: true})
            })
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PRICE_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter} = props
            const priceId = _.toInteger(_.get(props, ['params', 'priceId']))

            return dispatch(priceUpdateAction(priceId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(priceItemFetchAction(priceId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[PRICE_UPDATE_DIALOG_OPEN]: false}))
                    dispatch(priceListFetchAction(filter))
                })
        }
    })
)

const PriceList = enhance((props) => {
    const {
        location,
        list,
        listLoading,
        detail,
        detailLoading,
        createLoading,
        showBigImgLoading,
        updateLoading,
        filter,
        layout,
        params
    } = props

    const openFilterDialog = toBoolean(_.get(location, ['query', PRICE_FILTER_OPEN]))
    const openCreateDialog = toBoolean(_.get(location, ['query', PRICE_CREATE_DIALOG_OPEN]))
    const openShowBigImg = toBoolean(_.get(location, ['query', PRICE_SHOW_PHOTO_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', PRICE_UPDATE_DIALOG_OPEN]))
    const openConfirmDialog = toBoolean(_.get(location, ['query', PRICE_DELETE_DIALOG_OPEN]))
    const category = _.toInteger(filter.getParam(PRICE_FILTER_KEY.CATEGORY))
    const detailId = _.toInteger(_.get(params, 'priceId'))
    const tab = _.get(params, 'tab')

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
    const showBigImg = {
        initialValues: (() => {
            if (!detail) {
                return {}
            }

            return {
                image: _.get(detail, 'image')
            }
        })(),
        showBigImgLoading,
        openShowBigImg,
        handleOpenShowBigImg: props.handleOpenShowBigImg,
        handleCloseShowBigImg: props.handleCloseShowBigImg
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
                name: _.get(detail, 'name'),
                type: {
                    value: _.get(detail, ['type', 'id'])
                },
                brand: {
                    value: _.get(detail, ['brand', 'id'])
                },
                measurement: {
                    value: _.get(detail, ['measurement', 'id'])
                },
                image: _.get(detail, 'image')
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

    const tabData = {
        tab,
        handleTabChange: props.handleTabChange
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
            <PriceGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                tabData={tabData}
                createDialog={createDialog}
                showBigImg={showBigImg}
                confirmDialog={confirmDialog}
                updateDialog={updateDialog}
                actionsDialog={actionsDialog}
                filterDialog={filterDialog}
                csvDialog={csvDialog}
            />
        </Layout>
    )
})

export default PriceList
