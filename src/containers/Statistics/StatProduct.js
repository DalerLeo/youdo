import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import * as API from '../../constants/api'
import * as serializers from '../../serializers/Statistics/statProductSerializer'
import getDocuments from '../../helpers/getDocument'

import {StatProductGridList} from '../../components/Statistics'
import {STAT_PRODUCT_FILTER_KEY} from '../../components/Statistics/Products/StatProductGridList'
import {
    statProductListFetchAction
} from '../../actions/statProduct'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['statProduct', 'item', 'data'])
        const detailLoading = _.get(state, ['statProduct', 'item', 'loading'])
        const list = _.get(state, ['statProduct', 'list', 'data'])
        const listLoading = _.get(state, ['statProduct', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'StatisticsFilterForm'])
        const searchForm = _.get(state, ['form', 'StatProductForm'])
        const filter = filterHelper(list, pathname, query)
        const filterItem = filterHelper(list, pathname, query)
        return {
            list,
            listLoading,
            detail,
            detailLoading,
            filter,
            filterItem,
            filterForm,
            searchForm,
            pathname,
            query
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(statProductListFetchAction(filter))
    }),

    withHandlers({
        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props

            const search = _.get(filterForm, ['values', 'search']) || null
            const productType = _.get(filterForm, ['values', 'productType']) || null
            const productTypeChild = _.get(filterForm, ['values', 'productTypeChild', 'value']) || null
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null

            filter.filterBy({
                [STAT_PRODUCT_FILTER_KEY.SEARCH]: search,
                [STAT_PRODUCT_FILTER_KEY.PRODUCT_TYPE]: _.join(productType, '-'),
                [STAT_PRODUCT_FILTER_KEY.PRODUCT_TYPE_CHILD]: productTypeChild,
                [STAT_PRODUCT_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [STAT_PRODUCT_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')

            })
        },
        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.STATISTICS_LIST_URL, query: filter.getParams()})
        },
        handleSubmitSearch: props => () => {
            const {filter, location: {pathname}, searchForm} = props
            const term = _.get(searchForm, ['values', 'search'])
            hashHistory.push({pathname, query: filter.getParams({search: term})})
        },
        handleGetDocument: props => () => {
            const {filter} = props
            const params = serializers.listFilterSerializer(filter.getParams())
            getDocuments(API.STAT_PRODUCT_GET_DOCUMENT, params)
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
        location,
        params,
        query
    } = props
    const detailId = _.toInteger(_.get(params, 'statProductId'))
    const firstDayOfMonth = _.get(location, ['query', 'fromDate']) || moment().format('YYYY-MM-01')
    const lastDay = moment().daysInMonth()
    const lastDayOfMonth = _.get(location, ['query', 'toDate']) || moment().format('YYYY-MM-' + lastDay)
    const productType = !_.isNull(location, ['query', 'productType']) && _.toInteger(_.get(location, ['query', 'productType']))
    const productTypeChild = !_.isNull(location, ['query', 'productTypeChild']) && _.toInteger(_.get(location, ['query', 'productTypeChild']))
    const search = !_.isNull(_.get(location, ['query', 'search'])) ? _.get(location, ['query', 'search']) : null

    const filterForm = {
        initialValues: {
            search: search,
            productType: productType && _.map(_.split(productType, '-'), (item) => {
                return _.toNumber(item)
            }),
            productTypeChild: {
                value: productTypeChild
            },
            date: {
                fromDate: moment(firstDayOfMonth),
                toDate: moment(lastDayOfMonth)
            }
        }
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
    const getDocument = {
        handleGetDocument: props.handleGetDocument
    }
    return (
        <Layout {...layout}>
            <StatProductGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                handleSubmitFilterDialog={props.handleSubmitFilterDialog}
                getDocument={getDocument}
                filterForm={filterForm}
                initialValues={filterForm.initialValues}
                searchSubmit={props.handleSubmitSearch}
                pathname={_.get(location, 'pathname')}
                query={query}
            />
        </Layout>
    )
})

export default StatProductList
