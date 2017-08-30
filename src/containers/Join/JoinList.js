import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import filterHelper from '../../helpers/filter'
import * as JOIN_TAB from '../../constants/joinTab'
import toBoolean from '../../helpers/toBoolean'
import {
    JoinGridList,
    TAB, JOIN_CLIENT, JOIN_MARKET
} from '../../components/Join'
import {openSnackbarAction} from '../../actions/snackbar'
import {shopListFetchAction, shopJoinListFetchAction} from '../../actions/shop'
import {clientJoinListFetchAction, clientListFetchAction} from '../../actions/client'
import {joinMarketsAction, joinClientsAction} from '../../actions/join'
import {reset} from 'redux-form'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const marketsList = _.get(state, ['shop', 'listRepetition', 'data'])
        const marketsListLoading = _.get(state, ['shop', 'listRepetition', 'loading'])
        const marketsItem = _.get(state, ['shop', 'itemRepetition', 'data'])
        const marketsItemLoading = _.get(state, ['shop', 'itemRepetition', 'loading'])
        const clientsList = _.get(state, ['client', 'listRepetition', 'data'])
        const clientsListLoading = _.get(state, ['client', 'listRepetition', 'loading'])
        const clientsItem = _.get(state, ['client', 'itemRepetition', 'data'])
        const clientsItemLoading = _.get(state, ['client', 'itemRepetition', 'loading'])
        const joinLoading = _.get(state, ['join', 'joinMarkets', 'loading']) || _.get(state, ['join', 'joinClients', 'loading'])
        const createForm = _.get(state, ['form', 'JoinForm'])
        const marketFilter = filterHelper(marketsList, pathname, query)
        const clientFilter = filterHelper(clientsList, pathname, query)

        return {
            marketsList,
            marketsListLoading,
            marketsItem,
            marketsItemLoading,
            clientsList,
            clientsListLoading,
            clientsItem,
            clientsItemLoading,
            pathname,
            joinLoading,
            marketFilter,
            clientFilter,
            createForm
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const prevTab = _.get(props, ['location', 'query', 'tab']) || JOIN_TAB.JOIN_DEFAULT_TAB
        const nextTab = _.get(nextProps, ['location', 'query', 'tab']) || JOIN_TAB.JOIN_DEFAULT_TAB
        return (props.marketFilter.filterRequest() !== nextProps.marketFilter.filterRequest()) ||
            (props.clientFilter.filterRequest() !== nextProps.clientFilter.filterRequest()) ||
            (prevTab !== nextTab)
    }, ({dispatch, marketFilter, clientFilter, location}) => {
        const currentTab = _.get(location, ['query', 'tab']) || JOIN_TAB.JOIN_DEFAULT_TAB
        if (currentTab === JOIN_TAB.JOIN_TAB_MARKETS) {
            dispatch(shopListFetchAction(marketFilter))
        } else if (currentTab === JOIN_TAB.JOIN_TAB_CLIENTS) {
            dispatch(clientListFetchAction(clientFilter))
        }
    }),
    withPropsOnChange((props, nextProps) => {
        const prevPop = _.get(props, ['location', 'query', 'joinMarket'])
        const nextPop = _.get(nextProps, ['location', 'query', 'joinMarket'])
        const prevShop = _.get(props, ['location', 'query', 'joinClient'])
        const nextShop = _.get(nextProps, ['location', 'query', 'joinClient'])
        return ((prevPop !== nextPop && nextPop) || (prevShop !== nextShop && nextShop))
    }, ({dispatch, location}) => {
        const currentTab = _.get(location, ['query', 'tab']) || JOIN_TAB.JOIN_DEFAULT_TAB
        const currentId = _.get(location, ['query', 'joinMarket']) || _.get(location, ['query', 'joinClient'])
        if (currentTab === JOIN_TAB.JOIN_TAB_MARKETS && (currentId !== 'false' && currentId)) {
            dispatch(shopJoinListFetchAction(_.toNumber(currentId)))
        } else if (currentTab === JOIN_TAB.JOIN_TAB_CLIENTS && (currentId !== 'false' && currentId)) {
            dispatch(clientJoinListFetchAction(_.toNumber(currentId)))
        }
    }),

    withHandlers({
        handleTabChange: props => (tab) => {
            hashHistory.push({
                pathname: 'join',
                query: {[TAB]: tab}
            })
        },

        handleOpenJoinMarkets: props => (id) => {
            const {dispatch, location: {pathname}, marketFilter} = props
            hashHistory.push({pathname, query: marketFilter.getParams({[JOIN_MARKET]: id})})
            dispatch(reset('JoinForm'))
        },

        handleCloseJoinMarkets: props => () => {
            const {location: {pathname}, marketFilter} = props
            hashHistory.push({pathname, query: marketFilter.getParams({[JOIN_MARKET]: false})})
        },

        handleSubmitJoinMarkets: props => () => {
            const {dispatch, createForm, marketFilter, location: {pathname}} = props

            return dispatch(joinMarketsAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Данные успешно объединены'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: marketFilter.getParams({[JOIN_MARKET]: false})})
                    dispatch(shopListFetchAction(marketFilter))
                })
        },

        handleOpenJoinClients: props => (id) => {
            const {dispatch, location: {pathname}, clientFilter} = props
            hashHistory.push({pathname, query: clientFilter.getParams({[JOIN_CLIENT]: id})})
            dispatch(reset('JoinForm'))
        },

        handleCloseJoinClients: props => () => {
            const {location: {pathname}, clientFilter} = props
            hashHistory.push({pathname, query: clientFilter.getParams({[JOIN_CLIENT]: false})})
        },

        handleSubmitJoinClients: props => () => {
            const {dispatch, createForm, clientFilter, location: {pathname}} = props

            return dispatch(joinClientsAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Данные успешно объединены'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: clientFilter.getParams({[JOIN_CLIENT]: false})})
                    dispatch(clientListFetchAction(clientFilter))
                })
        }
    })
)

const JoinList = enhance((props) => {
    const {
        marketFilter,
        clientFilter,
        marketsList,
        marketsListLoading,
        marketsItem,
        marketsItemLoading,
        clientsList,
        clientsListLoading,
        clientsItem,
        clientsItemLoading,
        joinLoading,
        location,
        layout
    } =
    props

    const tab = _.get(location, ['query', TAB]) || JOIN_TAB.JOIN_DEFAULT_TAB
    const openJoinMarket = _.get(location, ['query', JOIN_MARKET])
    const openJoinClient = _.get(location, ['query', JOIN_CLIENT])

    const tabData = {
        tab,
        handleTabChange: props.handleTabChange
    }
    const marketsData = {
        data: _.get(marketsList, 'results'),
        marketsListLoading
    }
    const marketsItemData = {
        data: _.get(marketsItem, 'results'),
        marketsItemLoading
    }

    const clientsData = {
        data: _.get(clientsList, 'results'),
        clientsListLoading
    }
    const clientsItemData = {
        data: _.get(clientsItem, 'results'),
        clientsItemLoading
    }
    const joinMarketDialog = {
        initialValues: (() => {
            if (toBoolean(openJoinMarket)) {
                return {}
            }
            return {
                markets: _.map(marketsItem, (item) => {
                    return {
                        address: _.get(item, 'address'),
                        client: _.get(item, ['client', 'name']),
                        market: {
                            value: _.get(item, 'id'),
                            text: _.get(item, 'name')
                        }
                    }
                }),
                target: openJoinMarket
            }
        })(),
        joinLoading,
        marketsItemLoading,
        openJoinMarket: openJoinMarket || '',
        handleOpenJoinMarkets: props.handleOpenJoinMarkets,
        handleCloseJoinMarkets: props.handleCloseJoinMarkets,
        handleSubmitJoinMarkets: props.handleSubmitJoinMarkets
    }

    const joinClientDialog = {
        initialValues: (() => {
            if (toBoolean(openJoinMarket)) {
                return {}
            }
            return {
                clients: _.map(clientsItem, (item) => {
                    return {
                        client: {
                            value: _.get(item, 'id'),
                            text: _.get(item, 'name')
                        }
                    }
                }),
                target: openJoinClient
            }
        })(),
        clientsItemLoading,
        joinLoading,
        openJoinClient: openJoinClient || '',
        handleOpenJoinClients: props.handleOpenJoinClients,
        handleCloseJoinClients: props.handleCloseJoinClients,
        handleSubmitJoinClients: props.handleSubmitJoinClients
    }

    return (
        <Layout {...layout}>
            <JoinGridList
                marketFilter={marketFilter}
                clientFilter={clientFilter}
                tabData={tabData}
                marketsData={marketsData}
                marketsItemData={marketsItemData}
                clientsData={clientsData}
                clientsItemData={clientsItemData}
                joinMarketDialog={joinMarketDialog}
                joinClientDialog={joinClientDialog}
            />
        </Layout>
    )
})

export default JoinList
