import React from 'react'
import _ from 'lodash'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import {connect} from 'react-redux'
import {reset} from 'redux-form'
import Layout from '../../components/Layout'
import {hashHistory} from 'react-router'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {ZonesWrapper, ADD_ZONE, UPDATE_ZONE, DELETE_ZONE, TOGGLE_INFO, BIND_AGENT, CONFIRM_DIALOG, ZONE_ID} from '../../components/Zones'
import {
    zoneCustomCreateAction,
    zoneCustomUpdateAction,
    zoneDeleteAction,
    zoneListFetchAction,
    zoneListSearchFetchAction,
    zoneStatisticsFetchAction,
    zoneItemFetchAction,
    zoneBindAgentAction,
    zoneUnbindAgentAction,
    shopListFetchAction,
    marketsLocationFetchAction
} from '../../actions/zones'
import {openSnackbarAction} from '../../actions/snackbar'
const ZERO = 0
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const list = _.get(state, ['zone', 'list', 'data'])
        const listLoading = _.get(state, ['zone', 'list', 'loading'])
        const marketsLocation = _.get(state, ['tracking', 'markets', 'data'])
        const marketsLocationLoading = _.get(state, ['tracking', 'markets', 'loading'])
        const createLoading = _.get(state, ['zone', 'create', 'loading'])
        const updateLoading = _.get(state, ['zone', 'update', 'loading'])
        const detail = _.get(state, ['zone', 'item', 'data'])
        const detailLoading = _.get(state, ['zone', 'item', 'loading'])
        const shopList = _.get(state, ['shop', 'list', 'data'])
        const shopListLoading = _.get(state, ['shop', 'list', 'loading'])
        const stat = _.get(state, ['zone', 'statistics', 'data'])
        const statLoading = _.get(state, ['zone', 'statistics', 'loading'])
        const createForm = _.get(state, ['form', 'ZoneCreateForm', 'values'])
        const zoneBindForm = _.get(state, ['form', 'ZoneBindAgentForm', 'values'])
        const bindAgentLoading = _.get(state, ['zone', 'bindAgent', 'loading'])
        const filter = filterHelper(list, pathname, query)
        const shopFilter = filterHelper(shopList, pathname, query)
        return {
            query,
            pathname,
            list,
            listLoading,
            createLoading,
            updateLoading,
            stat,
            statLoading,
            detail,
            detailLoading,
            shopList,
            shopListLoading,
            createForm,
            zoneBindForm,
            bindAgentLoading,
            filter,
            shopFilter,
            marketsLocation,
            marketsLocationLoading
        }
    }),
    withPropsOnChange((props, nextProps) => {
        const except = {
            page: null,
            openInfo: null
        }
        return props.list && props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
    }, ({dispatch, filter}) => {
        dispatch(zoneListFetchAction(filter))
        dispatch(marketsLocationFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const except = {
            page: null,
            openInfo: null,
            search: null
        }
        return props.list && props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
    }, ({dispatch, filter}) => {
        dispatch(zoneStatisticsFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const prevId = _.get(props, ['params', 'zoneId'])
        const nextId = _.get(nextProps, ['params', 'zoneId'])
        return prevId !== nextId
    }, ({dispatch, params}) => {
        const zoneId = _.toInteger(_.get(params, 'zoneId'))
        if (zoneId > ZERO) {
            dispatch(zoneItemFetchAction(zoneId))
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const prevId = _.get(props, ['params', 'zoneId'])
        const nextId = _.get(nextProps, ['params', 'zoneId'])
        const prevPage = _.get(props, ['location', 'query', 'page'])
        const nextPage = _.get(nextProps, ['location', 'query', 'page'])
        return (prevId !== nextId) || (prevPage !== nextPage)
    }, ({dispatch, params, shopFilter}) => {
        const zoneId = _.toInteger(_.get(params, 'zoneId'))
        if (zoneId > ZERO) {
            dispatch(shopListFetchAction(zoneId, shopFilter))
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const prevSearch = _.get(props, ['locatioin', 'query', 'search'])
        const nextSearch = _.get(nextProps, ['locatioin', 'query', 'search'])
        return prevSearch !== nextSearch
    }, ({dispatch, query}) => {
        const search = _.get(query, 'search')
        dispatch(zoneListSearchFetchAction(search))
    }),

    withHandlers({
        handleOpenConfirmDialog: props => (id) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CONFIRM_DIALOG]: id})})
        },

        handleCloseConfirmDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CONFIRM_DIALOG]: ZERO})})
        },
        handleSendConfirmDialog: props => () => {
            const {dispatch, location, location: {pathname}, filter, params} = props
            const detailId = _.toInteger(_.get(params, 'zoneId'))
            const agentId = _.toInteger(_.get(location, ['query', CONFIRM_DIALOG]))
            dispatch(zoneUnbindAgentAction(detailId, agentId))
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[CONFIRM_DIALOG]: ZERO})})
                    dispatch(zoneItemFetchAction(detailId))
                    return dispatch(openSnackbarAction({message: 'Агент откреплен из зоны'}))
                })
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Ошибка'}))
                })
        },

        handleOpenDeleteZone: props => (id) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[DELETE_ZONE]: id})})
        },

        handleCloseDeleteZone: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[DELETE_ZONE]: ZERO})})
        },
        handleSendDeleteZone: props => () => {
            const {dispatch, location, location: {pathname}, filter} = props
            const zoneId = _.toInteger(_.get(location, ['query', DELETE_ZONE]))
            dispatch(zoneDeleteAction(zoneId))
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[DELETE_ZONE]: ZERO})})
                    dispatch(zoneListFetchAction(filter))
                    return dispatch(openSnackbarAction({message: 'Зона успешно удалена'}))
                })
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Ошибка при удалении'}))
                })
        },

        handleExpandInfo: props => () => {
            const {location: {pathname}, dispatch, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TOGGLE_INFO]: true})})

            return dispatch(zoneStatisticsFetchAction(filter))
        },

        handleCollapseInfo: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TOGGLE_INFO]: false})})
        },

        handleOpenAddZone: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ADD_ZONE]: true, [TOGGLE_INFO]: false})})
        },

        handleCloseAddZone: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ADD_ZONE]: false})})
        },

        handleSubmitAddZone: props => (points) => {
            const {location: {pathname}, dispatch, createForm, filter} = props
            return dispatch(zoneCustomCreateAction(_.get(createForm, ['zoneName']), points))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Зона успешно добавлена'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[ADD_ZONE]: false, [TOGGLE_INFO]: true, [ZONE_ID]: null})})
                    dispatch(zoneListFetchAction(filter))
                    dispatch(zoneStatisticsFetchAction(filter))
                })
        },

        handleOpenUpdateZone: props => (id) => {
            const {filter, location: {pathname}} = props
            hashHistory.push({
                pathname, query: filter.getParams({[UPDATE_ZONE]: true, [TOGGLE_INFO]: false, [ZONE_ID]: id})
            })
        },

        handleCloseUpdateZone: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[UPDATE_ZONE]: false, [ZONE_ID]: null})})
        },

        handleSubmitUpdateZone: props => (data) => {
            const {location: {pathname, query}, dispatch, createForm, filter} = props
            const zoneId = _.toNumber(_.get(query, ZONE_ID))
            const title = _.get(createForm, ['zoneName']) || _.get(data, 'title')
            return dispatch(zoneCustomUpdateAction(zoneId, title, _.get(data, 'points')))
                .then(() => {
                    return dispatch(zoneItemFetchAction(zoneId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Зона успешно изменена'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[UPDATE_ZONE]: false, [TOGGLE_INFO]: true, [ZONE_ID]: null})})
                })
        },

        handleOpenBindAgent: props => () => {
            const {location: {pathname}, filter, dispatch} = props
            hashHistory.push({pathname, query: filter.getParams({[BIND_AGENT]: true})})
            dispatch(reset('ZoneBindAgentForm'))
        },

        handleCloseBindAgent: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[BIND_AGENT]: false})})
        },

        handleSubmitBindAgent: props => () => {
            const {location: {pathname}, dispatch, zoneBindForm, filter, params} = props
            const zoneId = _.toInteger(_.get(params, 'zoneId'))

            return dispatch(zoneBindAgentAction(zoneId, zoneBindForm))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Агент закреплен'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[BIND_AGENT]: false})})
                    dispatch(zoneItemFetchAction(zoneId))
                })
        }
    })
)

const Zones = enhance((props) => {
    const {
        filter,
        shopFilter,
        list,
        listLoading,
        createLoading,
        updateLoading,
        location,
        layout,
        params,
        stat,
        statLoading,
        detail,
        detailLoading,
        bindAgentLoading,
        shopList,
        shopListLoading,
        marketsLocation,
        marketsLocationLoading
    } = props

    const openAddZone = toBoolean(_.get(location, ['query', ADD_ZONE]))
    const openUpdateZone = toBoolean(_.get(location, ['query', UPDATE_ZONE]))
    const openBindAgent = toBoolean(_.get(location, ['query', BIND_AGENT]))
    const zoneId = _.get(location, ['query', ZONE_ID]) ? _.toNumber(_.get(location, ['query', ZONE_ID])) : ZERO
    const openDeleteZone = _.toInteger(_.get(location, ['query', DELETE_ZONE]) || ZERO) > ZERO
    const openToggle = toBoolean(_.get(location, ['query', TOGGLE_INFO]))
    const openConfirmDialog = _.toInteger(_.get(location, ['query', CONFIRM_DIALOG]) || ZERO) > ZERO
    const openDetail = _.toInteger(_.get(params, 'zoneId'))
    const detailId = _.toInteger(_.get(params, 'zoneId'))

    const addZone = {
        openAddZone,
        createLoading,
        handleOpenAddZone: props.handleOpenAddZone,
        handleCloseAddZone: props.handleCloseAddZone,
        handleSubmitAddZone: props.handleSubmitAddZone
    }

    const updateZone = {
        initialValues: (() => {
            if (!detail || openAddZone) {
                return {}
            }

            return {
                zoneName: _.get(detail, ['properties', 'title'])
            }
        })(),
        openUpdateZone,
        updateLoading,
        handleOpenUpdateZone: props.handleOpenUpdateZone,
        handleCloseUpdateZone: props.handleCloseUpdateZone,
        handleSubmitUpdateZone: props.handleSubmitUpdateZone
    }

    const bindAgent = {
        openBindAgent,
        bindAgentLoading,
        handleOpenBindAgent: props.handleOpenBindAgent,
        handleCloseBindAgent: props.handleCloseBindAgent,
        handleSubmitBindAgent: props.handleSubmitBindAgent
    }

    const unbindAgent = {
        openConfirmDialog,
        handleOpenConfirmDialog: props.handleOpenConfirmDialog,
        handleCloseConfirmDialog: props.handleCloseConfirmDialog,
        handleSendConfirmDialog: props.handleSendConfirmDialog
    }

    const deleteZone = {
        openDeleteZone,
        handleOpenDeleteZone: props.handleOpenDeleteZone,
        handleCloseDeleteZone: props.handleCloseDeleteZone,
        handleSendDeleteZone: props.handleSendDeleteZone
    }

    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }
    const marketsData = {
        data: marketsLocation,
        marketsLocationLoading
    }

    const statData = {
        data: stat,
        statLoading
    }

    const detailData = {
        openDetail,
        id: detailId,
        data: detail,
        detailLoading,
        zoneId,
        shop: {
            marketsCount: _.get(shopList, 'count'),
            data: _.get(shopList, 'results'),
            shopListLoading
        }
    }

    const toggle = {
        openToggle,
        handleExpandInfo: props.handleExpandInfo,
        handleCollapseInfo: props.handleCollapseInfo
    }

    return (
        <Layout {...layout}>
            <ZonesWrapper
                filter={filter}
                shopFilter={shopFilter}
                listData={listData}
                statData={statData}
                addZone={addZone}
                updateZone={updateZone}
                toggle={toggle}
                detailData={detailData}
                bindAgent={bindAgent}
                unbindAgent={unbindAgent}
                deleteZone={deleteZone}
                marketsData={marketsData}
            />
        </Layout>
    )
})

export default Zones
