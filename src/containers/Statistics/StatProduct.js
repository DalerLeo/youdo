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
import {STAT_PRODUCT_FILTER_KEY, PRODUCT} from '../../components/Statistics/Products/StatProductGridList'
import {
    statProductListFetchAction,
    statProductSumDatFetchAction,
    statProductTypeListFetchAction
} from '../../actions/statProduct'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['statProduct', 'item', 'data'])
        const detailLoading = _.get(state, ['statProduct', 'item', 'loading'])
        const productList = _.get(state, ['statProduct', 'productList', 'data'])
        const productListLoading = _.get(state, ['statProduct', 'productList', 'loading'])
        const productSum = _.get(state, ['statProduct', 'productSum', 'data'])
        const productSumLoading = _.get(state, ['statProduct', 'productSum', 'loading'])
        const productTypeList = _.get(state, ['statProduct', 'productTypeList', 'data'])
        const productTypeListLoading = _.get(state, ['statProduct', 'productTypeList', 'loading'])
        const filterForm = _.get(state, ['form', 'StatisticsFilterForm'])
        const searchForm = _.get(state, ['form', 'StatProductForm'])
        const filter = filterHelper(productList, pathname, query)
        const filterProductType = filterHelper(productTypeList, pathname, query)
        const filterItem = filterHelper(productList, pathname, query)
        return {
            productList,
            productListLoading,
            productSum,
            productSumLoading,
            productTypeList,
            productTypeListLoading,
            detail,
            detailLoading,
            filter,
            filterProductType,
            filterItem,
            filterForm,
            searchForm,
            pathname,
            query
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        const toggle = filter.getParam('toggle') || PRODUCT
        return toggle === PRODUCT
            ? dispatch(statProductListFetchAction(filter))
            : dispatch(statProductTypeListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const except = {
            page: null,
            pageSize: null,
            search: null,
            ordering: null
        }
        return props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
    }, ({dispatch, filter}) => {
        dispatch(statProductSumDatFetchAction(filter))
    }),

    withHandlers({
        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props

            const search = _.get(filterForm, ['values', 'search']) || null
            const client = _.get(filterForm, ['values', 'client']) || null
            const productType = _.get(filterForm, ['values', 'productType', 'value']) || null
            const productTypeChild = _.get(filterForm, ['values', 'productTypeChild', 'value']) || null
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null

            filter.filterBy({
                [STAT_PRODUCT_FILTER_KEY.SEARCH]: search,
                [STAT_PRODUCT_FILTER_KEY.PRODUCT_TYPE]: (productType),
                [STAT_PRODUCT_FILTER_KEY.CLIENT]: _.join(client, '-'),
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
            const {filter, location: {query}} = props
            const toggle = _.get(query, 'toggle') || PRODUCT
            const params = serializers.listFilterSerializer(filter.getParams())
            return toggle === PRODUCT
                ? getDocuments(API.STAT_PRODUCT_GET_DOCUMENT, params)
                : getDocuments(API.STAT_PRODUCT_TYPE_GET_DOCUMENT, params)
        },
        handleGetChilds: props => (id) => {
            const {dispatch, filterProductType} = props
            return dispatch(statProductTypeListFetchAction(filterProductType, id))
        },
        handleResetChilds: props => () => {
            const {dispatch, filterProductType} = props
            return dispatch(statProductTypeListFetchAction(filterProductType))
        }
    })
)

const StatProductList = enhance((props) => {
    const {
        productList,
        productListLoading,
        productSum,
        productSumLoading,
        productTypeList,
        productTypeListLoading,
        detail,
        detailLoading,
        filter,
        filterProductType,
        layout,
        location,
        params,
        query
    } = props
    const detailId = _.toInteger(_.get(params, 'statProductId'))
    const firstDayOfMonth = _.get(location, ['query', 'fromDate']) || moment().format('YYYY-MM-01')
    const lastDay = moment().daysInMonth()
    const lastDayOfMonth = _.get(location, ['query', 'toDate']) || moment().format('YYYY-MM-' + lastDay)
    const client = filter.getParam(STAT_PRODUCT_FILTER_KEY.CLIENT)
    const productType = !_.isNull(location, ['query', 'productType']) && _.toInteger(_.get(location, ['query', 'productType']))
    const productTypeChild = !_.isNull(location, ['query', 'productTypeChild']) && _.toInteger(_.get(location, ['query', 'productTypeChild']))
    const search = !_.isNull(_.get(location, ['query', 'search'])) ? _.get(location, ['query', 'search']) : null
    const toggle = filter.getParam('toggle') || PRODUCT

    const filterForm = {
        initialValues: {
            search: search,
            client: client && _.map(_.split(client, '-'), (item) => {
                return _.toNumber(item)
            }),
            productType: {value: productType},
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
        data: toggle === PRODUCT ? _.get(productList, 'results') : _.get(productTypeList, 'results'),
        listLoading: toggle === PRODUCT ? productListLoading : productTypeListLoading
    }

    const sumData = productSum
    const sumDataLoading = productSumLoading

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
                filter={toggle === PRODUCT ? filter : filterProductType}
                listData={listData}
                detailData={detailData}
                handleSubmitFilterDialog={props.handleSubmitFilterDialog}
                getDocument={getDocument}
                filterForm={filterForm}
                initialValues={filterForm.initialValues}
                searchSubmit={props.handleSubmitSearch}
                pathname={_.get(location, 'pathname')}
                query={query}
                sumData={sumData}
                sumDataLoading={sumDataLoading}
                handleGetChilds={props.handleGetChilds}
                handleResetChilds={props.handleResetChilds}
            />
        </Layout>
    )
})

export default StatProductList
