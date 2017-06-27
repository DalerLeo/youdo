import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
import * as SHOP from '../../constants/shop'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {DELETE_DIALOG_OPEN} from '../../components/DeleteDialog'
import {
    SHOP_CREATE_DIALOG_OPEN,
    SHOP_UPDATE_DIALOG_OPEN,
    SHOP_FILTER_KEY,
    SHOP_FILTER_OPEN,
    SHOP_MAP_DIALOG_OPEN,
    SHOP_UPDATE_MAP_DIALOG_OPEN,
    ADD_PHOTO_DIALOG_OPEN,
    SHOP_SLIDESHOW_DIALOG_OPEN,
    ShopGridList
} from '../../components/Shop'
import {
    shopCreateAction,
    shopUpdateAction,
    shopCSVFetchAction,
    shopDeleteAction,
    shopItemFetchAction,
    shopListFetchAction
} from '../../actions/shop'
import {openSnackbarAction} from '../../actions/snackbar'

const ZERO = 0
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['shop', 'item', 'data'])
        const detailLoading = _.get(state, ['shop', 'item', 'loading'])
        const createLoading = _.get(state, ['shop', 'create', 'loading'])
        const updateLoading = _.get(state, ['shop', 'update', 'loading'])
        const list = _.get(state, ['shop', 'list', 'data'])
        const listLoading = _.get(state, ['shop', 'list', 'loading'])
        const csvData = _.get(state, ['shop', 'csv', 'data'])
        const csvLoading = _.get(state, ['shop', 'csv', 'loading'])
        const filterForm = _.get(state, ['form', 'ShopFilterForm'])
        const createForm = _.get(state, ['form', 'ShopCreateForm'])
        const mapForm = _.get(state, ['form', 'ShopMapForm'])
        const mapLocation = _.get(state, ['form', 'ShopMapForm', 'values', 'latLng'])
        const image = _.get(state, ['form', 'ShopAddPhotoForm', 'values', 'image'])
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
            createForm,
            mapForm,
            mapLocation,
            image
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(shopListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const prevId = _.get(props, ['params', 'shopId'])
        const nextId = _.get(nextProps, ['params', 'shopId'])
        return prevId !== nextId
    }, ({dispatch, params}) => {
        const shopId = _.toInteger(_.get(params, 'shopId'))
        if (shopId > ZERO) {
            dispatch(shopItemFetchAction(shopId))
        }
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

            dispatch(shopCSVFetchAction(props.filter))
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
            dispatch(shopDeleteAction(detail.id))
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .then(() => {
                    setOpenConfirmDialog(false)
                })
        },

        handleOpenFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SHOP_FILTER_OPEN]: true})})
        },

        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SHOP_FILTER_OPEN]: false})})
        },

        handleTabChange: props => (tab) => {
            const shopId = _.toInteger(_.get(props, ['params', 'shopId']))
            hashHistory.push({pathname: sprintf(ROUTER.SHOP_ITEM_TAB_PATH, shopId, tab)})
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
                [SHOP_FILTER_OPEN]: false,
                [SHOP_FILTER_KEY.CATEGORY]: category,
                [SHOP_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [SHOP_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')
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
            hashHistory.push({pathname, query: filter.getParams({[SHOP_CREATE_DIALOG_OPEN]: true})})
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SHOP_CREATE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, mapLocation, filter} = props

            return dispatch(shopCreateAction(_.get(createForm, ['values']), mapLocation))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({query: filter.getParams({[SHOP_CREATE_DIALOG_OPEN]: false})})
                })
        },

        handleOpenSlideShowDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SHOP_SLIDESHOW_DIALOG_OPEN]: true})})
        },

        handleCloseSlideShowDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SHOP_SLIDESHOW_DIALOG_OPEN]: false})})
        },

        handleOpenAddPhotoDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ADD_PHOTO_DIALOG_OPEN]: true})})
        },

        handleCloseAddPhotoDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ADD_PHOTO_DIALOG_OPEN]: false})})
        },

        handleSubmitAddPhotoDialog: props => () => {
            const {dispatch, createForm, mapLocation, image, filter} = props

            return dispatch(shopCreateAction(_.get(createForm, ['values']), mapLocation, image))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({query: filter.getParams({[ADD_PHOTO_DIALOG_OPEN]: false})})
                })
        },

        handleOpenMapDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SHOP_MAP_DIALOG_OPEN]: true})})
        },

        handleCloseMapDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SHOP_MAP_DIALOG_OPEN]: false})})
        },

        handleSubmitMapDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SHOP_MAP_DIALOG_OPEN]: false})})
        },

        handleOpenMapUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SHOP_UPDATE_MAP_DIALOG_OPEN]: true})})
        },

        handleCloseMapUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SHOP_UPDATE_MAP_DIALOG_OPEN]: false})})
        },

        handleSubmitMapUpdateDialog: props => () => {
            const {dispatch, mapForm, filter} = props
            const shopId = _.toInteger(_.get(props, ['params', 'shopId']))

            return dispatch(shopUpdateAction(shopId, _.get(mapForm, ['values'])))
                .then(() => {
                    return dispatch(shopItemFetchAction(shopId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[SHOP_UPDATE_MAP_DIALOG_OPEN]: false}))
                })
        },

        handleOpenUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SHOP_UPDATE_DIALOG_OPEN]: true})})
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SHOP_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter} = props
            const shopId = _.toInteger(_.get(props, ['params', 'shopId']))

            return dispatch(shopUpdateAction(shopId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(shopItemFetchAction(shopId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[SHOP_UPDATE_DIALOG_OPEN]: false}))
                })
        },

        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.SHOP_LIST_URL, query: filter.getParam()})
        }
    })
)

const ShopList = enhance((props) => {
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
        mapLocation
    } = props

    const openFilterDialog = toBoolean(_.get(location, ['query', SHOP_FILTER_OPEN]))
    const openCreateDialog = toBoolean(_.get(location, ['query', SHOP_CREATE_DIALOG_OPEN]))
    const openMapDialog = toBoolean(_.get(location, ['query', SHOP_MAP_DIALOG_OPEN]))
    const openUpdateMapDialog = toBoolean(_.get(location, ['query', SHOP_UPDATE_MAP_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', SHOP_UPDATE_DIALOG_OPEN]))
    const openDeleteDialog = toBoolean(_.get(location, ['query', DELETE_DIALOG_OPEN]))
    const openAddPhotoDialog = toBoolean(_.get(location, ['query', ADD_PHOTO_DIALOG_OPEN]))
    const openSlideShowDialog = toBoolean(_.get(location, ['query', SHOP_SLIDESHOW_DIALOG_OPEN]))
    const category = _.toInteger(filter.getParam(SHOP_FILTER_KEY.CATEGORY))
    const fromDate = filter.getParam(SHOP_FILTER_KEY.FROM_DATE)
    const toDate = filter.getParam(SHOP_FILTER_KEY.TO_DATE)
    const detailId = _.toInteger(_.get(params, 'shopId'))
    const tab = _.get(params, 'tab') || SHOP.DEFAULT_TAB

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

    const addPhotoDialog = {
        openAddPhotoDialog,
        handleOpenAddPhotoDialog: props.handleOpenAddPhotoDialog,
        handleCloseAddPhotoDialog: props.handleCloseAddPhotoDialog,
        handleSubmitAddPhotoDialog: props.handleSubmitAddPhotoDialog
    }

    const slideShowDialog = {
        openSlideShowDialog,
        handleOpenSlideShowDialog: props.handleOpenSlideShowDialog,
        handleCloseSlideShowDialog: props.handleCloseSlideShowDialog
    }

    const mapDialog = {
        openMapDialog,
        handleOpenMapDialog: props.handleOpenMapDialog,
        handleCloseMapDialog: props.handleCloseMapDialog,
        handleSubmitMapDialog: props.handleSubmitMapDialog
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
            const NOT_ACTIVE = 2
            if (!detail) {
                return {}
            }
            const status = _.get(detail, 'status')
            let isActive = 1
            if (status === false) {
                isActive = NOT_ACTIVE
            }

            return {
                name: _.get(detail, 'name'),
                address: _.get(detail, 'address'),
                client: {
                    value: _.get(detail, ['client', 'id']),
                    text: _.get(detail, ['client', 'name'])
                },
                contactName: _.get(detail, 'contactName'),
                frequency: {
                    value: _.toNumber(_.get(detail, 'visitFrequency'))
                },
                guide: _.get(detail, 'guide'),
                phone: _.get(detail, 'phone'),
                latLng: {
                    lat: _.get(detail, 'lat'),
                    lng: _.get(detail, 'lon')
                },
                marketType: {
                    value: _.get(detail, ['marketType', 'id']),
                    text: _.get(detail, ['marketType', 'name'])
                },
                status: {
                    value: isActive
                }
            }
        })(),
        updateLoading: detailLoading || updateLoading,
        openUpdateDialog,
        handleOpenUpdateDialog: props.handleOpenUpdateDialog,
        handleCloseUpdateDialog: props.handleCloseUpdateDialog,
        handleSubmitUpdateDialog: props.handleSubmitUpdateDialog
    }

    const updateMapDialog = {
        initialValues: (() => {
            if (!mapLocation) {
                return {}
            }
            return {
                latLng: {
                    lat: _.get(mapLocation, 'lat'),
                    lng: _.get(mapLocation, 'lng')
                }
            }
        })(),
        openUpdateMapDialog,
        handleOpenMapUpdateDialog: props.handleOpenMapUpdateDialog,
        handleCloseMapUpdateDialog: props.handleCloseMapUpdateDialog,
        handleSubmitMapUpdateDialog: props.handleSubmitMapUpdateDialog
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
        detailLoading,
        handleCloseDetail: props.handleCloseDetail
    }

    return (
        <Layout {...layout}>
            <ShopGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                tabData={tabData}
                createDialog={createDialog}
                mapDialog={mapDialog}
                addPhotoDialog={addPhotoDialog}
                slideShowDialog={slideShowDialog}
                updateMapDialog={updateMapDialog}
                deleteDialog={deleteDialog}
                confirmDialog={confirmDialog}
                updateDialog={updateDialog}
                actionsDialog={actionsDialog}
                filterDialog={filterDialog}
                csvDialog={csvDialog}
                mapLocation={mapLocation}
            />
        </Layout>
    )
})

export default ShopList
