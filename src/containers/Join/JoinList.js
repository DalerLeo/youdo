import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import filterHelper from '../../helpers/filter'
import * as JOIN_TAB from '../../constants/joinTab'
import {
    JoinGridList,
    TAB
} from '../../components/Join'
import {shopListFetchAction} from '../../actions/shop'
import {clientListFetchAction} from '../../actions/client'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const marketsList = _.get(state, ['shop', 'list', 'data'])
        const marketsListLoading = _.get(state, ['shop', 'list', 'loading'])
        const clientsList = _.get(state, ['client', 'list', 'data'])
        const clientsListLoading = _.get(state, ['client', 'list', 'loading'])
        const createLoading = _.get(state, ['join', 'create', 'loading'])
        const createForm = _.get(state, ['form', 'JoinCreateForm'])
        const marketFilter = filterHelper(marketsList, pathname, query)
        const clientFilter = filterHelper(clientsList, pathname, query)

        return {
            marketsList,
            marketsListLoading,
            clientsList,
            clientsListLoading,
            pathname,
            createLoading,
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

    withHandlers({
        handleTabChange: props => (tab) => {
            hashHistory.push({
                pathname: 'join',
                query: {[TAB]: tab}
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
        clientsList,
        clientsListLoading,
        location,
        layout
    } =
    props

    const tab = _.get(location, ['query', TAB]) || JOIN_TAB.JOIN_DEFAULT_TAB

    const tabData = {
        tab,
        handleTabChange: props.handleTabChange
    }

    const marketsData = {
        data: _.get(marketsList, 'results'),
        marketsListLoading
    }

    const clientsData = {
        data: _.get(clientsList, 'results'),
        clientsListLoading
    }

    return (
        <Layout {...layout}>
            <JoinGridList
                marketFilter={marketFilter}
                clientFilter={clientFilter}
                tabData={tabData}
                marketsData={marketsData}
                clientsData={clientsData}
                handleCheckedForm={props.handleCheckedForm}
            />
        </Layout>
    )
})

export default JoinList
