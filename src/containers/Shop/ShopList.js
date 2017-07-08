import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
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
    imageCreateAction,
    shopUpdateAction,
    shopDeleteAction,
    shopItemFetchAction,
    shopListFetchAction,
    slideShowFetchAction
} from '../../actions/shop'
import {openSnackbarAction} from '../../actions/snackbar'

const ZERO = 0
const ONE = 1
const MINUS_ONE = -1
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
        const filterForm = _.get(state, ['form', 'ShopFilterForm'])
        const createForm = _.get(state, ['form', 'ShopCreateForm'])
        const mapForm = _.get(state, ['form', 'ShopMapForm'])
        const addPhotoForm = _.get(state, ['form', 'ShopAddPhotoForm', 'values'])
        const mapLocation = _.get(state, ['form', 'ShopMapForm', 'values', 'latLng'])
        const image = _.get(state, ['form', 'ShopAddPhotoForm', 'values', 'image'])
        const gallery = _.get(state, ['shop', 'gallery', 'data'])
        const galleryLoading = _.get(state, ['shop', 'gallery', 'loading'])
        const filter = filterHelper(list, pathname, query)

        return {
            list,
            listLoading,
            detail,
            detailLoading,
            createLoading,
            updateLoading,
            filter,
            filterForm,
            createForm,
            mapForm,
            mapLocation,
            addPhotoForm,
            image,
            gallery,
            galleryLoading
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

    withPropsOnChange((props, nextProps) => {
        const prevId = _.toNumber(_.get(props, ['location', 'query', 'openImagesDialog']))
        const nextId = _.toNumber(_.get(nextProps, ['location', 'query', 'openImagesDialog']))
        return prevId !== nextId && nextId > MINUS_ONE
    }, ({dispatch, location, detail}) => {
        const images = _.get(detail, 'images')
        const index = _.toNumber(_.get(location, ['query', 'openImagesDialog']))
        const imgId = _.toInteger(_.get(_.nth(images, index), 'id'))
        if (imgId > ZERO) {
            dispatch(slideShowFetchAction(imgId))
        }
    }),

    withState('openConfirmDialog', 'setOpenConfirmDialog', false),

    withHandlers({
        handleOpenConfirmDialog: props => () => {
            const {setOpenConfirmDialog} = props
            setOpenConfirmDialog(true)
        },

        handleCloseConfirmDialog: props => () => {
            const {setOpenConfirmDialog} = props
            setOpenConfirmDialog(false)
        },
        handleSendConfirmDialog: props => () => {
            const {dispatch, detail, filter, setOpenConfirmDialog} = props
            dispatch(shopDeleteAction(detail.id))
                .then(() => {
                    setOpenConfirmDialog(false)
                    dispatch(shopListFetchAction(filter))
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Ошибка при удалении'}))
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

        handleClearFilterDialog: props => () => {
            const {location: {pathname}} = props
            hashHistory.push({pathname, query: {}})
        },
        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const client = _.get(filterForm, ['values', 'client', 'value']) || null
            const marketType = _.get(filterForm, ['values', 'marketType', 'value']) || null

            filter.filterBy({
                [SHOP_FILTER_OPEN]: false,
                [SHOP_FILTER_KEY.CLIENT]: client,
                [SHOP_FILTER_KEY.MARKET_TYPE]: marketType
            })
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
            const {location: {pathname}, dispatch, createForm, mapLocation, filter} = props

            return dispatch(shopCreateAction(_.get(createForm, ['values']), mapLocation))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[SHOP_CREATE_DIALOG_OPEN]: false})})
                    dispatch(shopListFetchAction(filter))
                })
        },

        handleOpenSlideShowDialog: props => (index) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SHOP_SLIDESHOW_DIALOG_OPEN]: index})})
        },

        handleCloseSlideShowDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SHOP_SLIDESHOW_DIALOG_OPEN]: MINUS_ONE})})
        },

        handlePrevImage: props => (index, last) => {
            const {location: {pathname}, filter} = props
            let currentIndex = index
            let prevIndex = currentIndex - ONE
            if (prevIndex === MINUS_ONE) {
                currentIndex = last - ONE
                prevIndex = currentIndex
            }
            hashHistory.push({pathname, query: filter.getParams({[SHOP_SLIDESHOW_DIALOG_OPEN]: prevIndex})})
        },
        handleNextImage: props => (index, last) => {
            const {location: {pathname}, filter} = props
            let currentIndex = index
            let nextIndex = currentIndex + ONE
            if (nextIndex === last) {
                currentIndex = ZERO
                nextIndex = currentIndex
            }
            hashHistory.push({pathname, query: filter.getParams({[SHOP_SLIDESHOW_DIALOG_OPEN]: nextIndex})})
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
            const {location: {pathname}, dispatch, addPhotoForm, detail, filter} = props
            const shopId = _.get(detail, 'id')
            const imageId = _.get(addPhotoForm, 'image')

            return dispatch(imageCreateAction(imageId, shopId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Фотография добавлена'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[ADD_PHOTO_DIALOG_OPEN]: false})})
                    dispatch(shopItemFetchAction(shopId))
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
        mapLocation,
        gallery,
        galleryLoading
    } = props

    const openFilterDialog = toBoolean(_.get(location, ['query', SHOP_FILTER_OPEN]))
    const openCreateDialog = toBoolean(_.get(location, ['query', SHOP_CREATE_DIALOG_OPEN]))
    const openMapDialog = toBoolean(_.get(location, ['query', SHOP_MAP_DIALOG_OPEN]))
    const openUpdateMapDialog = toBoolean(_.get(location, ['query', SHOP_UPDATE_MAP_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', SHOP_UPDATE_DIALOG_OPEN]))
    const openDeleteDialog = toBoolean(_.get(location, ['query', DELETE_DIALOG_OPEN]))
    const openAddPhotoDialog = toBoolean(_.get(location, ['query', ADD_PHOTO_DIALOG_OPEN]))
    const openSlideShowDialog = _.toInteger(_.get(location, ['query', SHOP_SLIDESHOW_DIALOG_OPEN]) || MINUS_ONE) > MINUS_ONE
    const client = _.toInteger(filter.getParam(SHOP_FILTER_KEY.CLIENT))
    const marketType = filter.getParam(SHOP_FILTER_KEY.MARKET_TYPE)
    const detailId = _.toInteger(_.get(params, 'shopId'))

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
        gallery,
        galleryLoading,
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

    const navigationButtons = {
        handlePrevImage: props.handlePrevImage,
        handleNextImage: props.handleNextImage

    }
    const updateDialog = {
        initialValues: (() => {
            const NOT_ACTIVE = 2
            if (!detail || openCreateDialog) {
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
                    lat: _.get(detail, ['location', 'coordinates', '0']),
                    lng: _.get(detail, ['location', 'coordinates', '1'])
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
                value: client
            },
            marketType: {
                value: marketType
            }
        },
        filterLoading: false,
        openFilterDialog,
        handleOpenFilterDialog: props.handleOpenFilterDialog,
        handleCloseFilterDialog: props.handleCloseFilterDialog,
        handleClearFilterDialog: props.handleClearFilterDialog,
        handleSubmitFilterDialog: props.handleSubmitFilterDialog
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
                createDialog={createDialog}
                mapDialog={mapDialog}
                addPhotoDialog={addPhotoDialog}
                slideShowDialog={slideShowDialog}
                updateMapDialog={updateMapDialog}
                deleteDialog={deleteDialog}
                confirmDialog={confirmDialog}
                updateDialog={updateDialog}
                filterDialog={filterDialog}
                mapLocation={mapLocation}
                navigationButtons={navigationButtons}
            />
        </Layout>
    )
})

export default ShopList
