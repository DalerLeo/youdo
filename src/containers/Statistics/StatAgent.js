import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'

import {
    StatAgentGridList,
    STAT_AGENT_DIALOG_OPEN
} from '../../components/Statistics'
import {
    statAgentListFetchAction,
    statAgentItemFetchAction
} from '../../actions/statAgent'

const ZERO = 0

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['statAgent', 'item', 'data'])
        const detailLoading = _.get(state, ['statAgent', 'item', 'loading'])
        const list = _.get(state, ['statAgent', 'list', 'data'])
        const listLoading = _.get(state, ['statAgent', 'list', 'loading'])
        const filter = filterHelper(list, pathname, query)
        return {
            list,
            listLoading,
            detail,
            detailLoading,
            filter,
            query
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(statAgentListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const statAgentId = _.get(nextProps, ['params', 'statAgentId']) || ZERO
        return statAgentId > ZERO && _.get(props, ['params', 'statAgentId']) !== statAgentId
    }, ({dispatch, params}) => {
        const statAgentId = _.toInteger(_.get(params, 'statAgentId'))
        if (statAgentId > ZERO) {
            dispatch(statAgentItemFetchAction(statAgentId))
        }
    }),

    withHandlers({
        handleOpenStatAgentDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STAT_AGENT_DIALOG_OPEN]: true})})
        },

        handleCloseStatAgentDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[STAT_AGENT_DIALOG_OPEN]: false})})
        },
        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.STATISTICS_LIST_URL, query: filter.getParam()})
        }
    })
)

const StatAgentList = enhance((props) => {
    const {
        location,
        list,
        listLoading,
        detail,
        detailLoading,
        filter,
        layout,
        params
    } = props

    const openStatAgentDialog = toBoolean(_.get(location, ['query', STAT_AGENT_DIALOG_OPEN]))
    const detailId = _.toInteger(_.get(params, 'statAgentId'))

    const statAgentDialog = {
        openStatAgentDialog,
        handleCloseStatAgentDialog: props.handleCloseStatAgentDialog,
        handleOpenStatAgentDialog: props.handleOpenStatAgentDialog
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
            <StatAgentGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                statAgentDialog={statAgentDialog}
            />
        </Layout>
    )
})

export default StatAgentList
