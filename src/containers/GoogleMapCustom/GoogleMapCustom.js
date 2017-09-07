import React from 'react'
import _ from 'lodash'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import {connect} from 'react-redux'
import sprintf from 'sprintf'
import * as ROUTER from '../../constants/routes'
import {reset} from 'redux-form'
import Layout from '../../components/Layout'
import {hashHistory} from 'react-router'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import ZonesWrapper from '../../components/GoogleMapCustom/ZonesWrapper'
import {ADD_ZONE, UPDATE_ZONE, DELETE_ZONE, TOGGLE_INFO, BIND_AGENT, CONFIRM_DIALOG, DRAW} from '../../components/Zones'
import {
    zoneCreateAction,
    zoneUpdateAction,
    zoneDeleteAction,
    zoneListFetchAction,
    zoneListSearchFetchAction,
    zoneStatisticsFetchAction,
    zoneItemFetchAction,
    zoneBindAgentAction,
    zoneUnbindAgentAction
} from '../../actions/zones'
import {openSnackbarAction} from '../../actions/snackbar'
const ZERO = 0
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const list = _.get(state, ['zone', 'list', 'data'])
        const listLoading = _.get(state, ['zone', 'list', 'loading'])
        const createLoading = _.get(state, ['zone', 'create', 'loading'])
        const updateLoading = _.get(state, ['zone', 'update', 'loading'])
        const detail = _.get(state, ['zone', 'item', 'data'])
        const detailLoading = _.get(state, ['zone', 'item', 'loading'])
        const stat = _.get(state, ['zone', 'statistics', 'data'])
        const statLoading = _.get(state, ['zone', 'statistics', 'loading'])
        const createForm = _.get(state, ['form', 'ZoneCreateForm', 'values'])
        const zoneBindForm = _.get(state, ['form', 'ZoneBindAgentForm', 'values'])
        const bindAgentLoading = _.get(state, ['zone', 'bindAgent', 'loading'])
        const filter = filterHelper(list, pathname, query)
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
            createForm,
            zoneBindForm,
            bindAgentLoading,
            filter
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(zoneListFetchAction(filter))
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
        const prevSearch = _.get(props, ['query', 'search'])
        const nextSearch = _.get(nextProps, ['query', 'search'])
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

        handleSubmitAddZone: props => () => {
            const {location: {pathname}, dispatch, createForm, filter} = props

            return dispatch(zoneCreateAction(createForm))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Зона успешно добавлена'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[ADD_ZONE]: false, [TOGGLE_INFO]: true})})
                    dispatch(zoneListFetchAction(filter))
                    dispatch(zoneStatisticsFetchAction(filter))
                })
        },

        handleOpenUpdateZone: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf('/googleMap/%d/', id),
                query: filter.getParams({[UPDATE_ZONE]: true, [TOGGLE_INFO]: false})
            })
        },

        handleCloseUpdateZone: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[UPDATE_ZONE]: false})})
        },

        handleSubmitUpdateZone: props => () => {
            const {location: {pathname}, dispatch, createForm, filter} = props
            const zoneId = _.toInteger(_.get(props, ['params', 'zoneId']))

            return dispatch(zoneUpdateAction(zoneId, createForm))
                .then(() => {
                    return dispatch(zoneItemFetchAction(zoneId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Зона успешно изменена'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[UPDATE_ZONE]: false, [TOGGLE_INFO]: true})})
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
        },
        handleOpenDraw: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[DRAW]: true})})
        },
        handleCloseDraw: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[DRAW]: false})})
        }
    })
)

const Zones = enhance((props) => {
    const {
        filter,
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
        bindAgentLoading
    } = props

    const openAddZone = toBoolean(_.get(location, ['query', ADD_ZONE]))
    const openUpdateZone = toBoolean(_.get(location, ['query', UPDATE_ZONE]))
    const openBindAgent = toBoolean(_.get(location, ['query', BIND_AGENT]))
    const openDraw = toBoolean(_.get(location, ['query', DRAW]))
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
    const draw = {
        openDraw,
        handleOpenDraw: props.handleOpenDraw,
        handleCloseDraw: props.handleCloseDraw
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

    const statData = {
        data: stat,
        statLoading
    }

    const detailData = {
        openDetail,
        id: detailId,
        data: detail,
        detailLoading
    }

    const toggle = {
        openToggle,
        handleExpandInfo: props.handleExpandInfo,
        handleCollapseInfo: props.handleCollapseInfo
    }

    return (
        <Layout {...layout}>
            <ZonesWrapper
                draw={draw}
                filter={filter}
                listData={listData}
                statData={statData}
                addZone={addZone}
                updateZone={updateZone}
                toggle={toggle}
                detailData={detailData}
                bindAgent={bindAgent}
                unbindAgent={unbindAgent}
                deleteZone={deleteZone}
            />
        </Layout>
    )
})

export default Zones

