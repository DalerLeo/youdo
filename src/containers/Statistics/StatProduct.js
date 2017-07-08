import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'

import {StatProductGridList} from '../../components/Statistics'
import {
    statProductListFetchAction,
    statProductItemFetchAction
} from '../../actions/statProduct'

const ZERO = 0

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['statProduct', 'item', 'data'])
        const detailLoading = _.get(state, ['statProduct', 'item', 'loading'])
        const list = _.get(state, ['statProduct', 'list', 'data'])
        const listLoading = _.get(state, ['statProduct', 'list', 'loading'])
        const filter = filterHelper(list, pathname, query)
        return {
            list,
            listLoading,
            detail,
            detailLoading,
            filter
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(statProductListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const statProductId = _.get(nextProps, ['params', 'statProductId']) || ZERO
        return statProductId > ZERO && _.get(props, ['params', 'statProductId']) !== statProductId
    }, ({dispatch, params}) => {
        const statProductId = _.toInteger(_.get(params, 'statProductId'))
        if (statProductId > ZERO) {
            dispatch(statProductItemFetchAction(statProductId))
        }
    }),

    withHandlers({

        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.STATISTICS_LIST_URL, query: filter.getParam()})
        }
    })
)

const StatProductList = enhance((props) => {
    const {
        list,
        listLoading,
        detail,
        detailLoading,
        filter,
        layout,
        params
    } = props
    const detailId = _.toInteger(_.get(params, 'statProductId'))

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
            <StatProductGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
            />
        </Layout>
    )
})

export default StatProductList
