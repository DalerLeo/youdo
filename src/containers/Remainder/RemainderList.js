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
    RemainderGridList,
    REMAINDER_FILTER_OPEN,
    REMAINDER_FILTER_KEY
} from '../../components/Remainder'
import {
    remainderListFetchAction,
    remainderItemFetchAction
} from '../../actions/remainder'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['remainder', 'item', 'data'])
        const detailLoading = _.get(state, ['remainder', 'item', 'loading'])
        const list = _.get(state, ['remainder', 'list', 'data'])
        const listLoading = _.get(state, ['remainder', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'RemainderFilterForm'])
        const filter = filterHelper(list, pathname, query)

        return {
            list,
            listLoading,
            detail,
            detailLoading,
            filter,
            filterForm
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(remainderListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const remainderId = _.get(nextProps, ['params', 'remainderId'])
        return remainderId && _.get(props, ['params', 'remainderId']) !== remainderId
    }, ({dispatch, params, filter}) => {
        const remainderId = _.toInteger(_.get(params, 'remainderId'))
        remainderId && dispatch(remainderItemFetchAction(remainderId, filter))
    }),
    withHandlers({
        handleOpenFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[REMAINDER_FILTER_OPEN]: true})})
        },
        handleCloseFilterDialog: props => () => {
            const {location: {pathname}} = props
            hashHistory.push({pathname})
        },
        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const biggerThan = _.get(filterForm, ['values', 'biggerThan']) || null
            const lessThan = _.get(filterForm, ['values', 'lessThan']) || null
            const productType = _.get(filterForm, ['values', 'productType', 'value']) || null
            const stock = _.get(filterForm, ['values', 'stock', 'value']) || null
            const defective = _.get(filterForm, ['values', 'defective']) || null
            const outDated = _.get(filterForm, ['values', 'outDated']) || null
            const current = _.get(filterForm, ['values', 'current']) || null

            filter.filterBy({
                [REMAINDER_FILTER_OPEN]: false,
                [REMAINDER_FILTER_KEY.PRODUCT_TYPE]: productType,
                [REMAINDER_FILTER_KEY.STOCK]: stock,
                [REMAINDER_FILTER_KEY.BIGGER_THAN]: biggerThan,
                [REMAINDER_FILTER_KEY.LESS_THAN]: lessThan,
                [REMAINDER_FILTER_KEY.DEFECTIVE]: defective,
                [REMAINDER_FILTER_KEY.OUT_DATED]: outDated,
                [REMAINDER_FILTER_KEY.CURRENT]: current
            })
        },
        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.REMAINDER_LIST_URL, query: filter.getParam()})
        }
    })
)

const RemainderList = enhance((props) => {
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

    const openFilterDialog = toBoolean(_.get(location, ['query', REMAINDER_FILTER_OPEN]))

    const detailId = _.toInteger(_.get(params, 'remainderId'))
    const filterDialog = {
        openFilterDialog: openFilterDialog,
        handleOpenFilterDialog: props.handleOpenFilterDialog,
        handleCloseFilterDialog: props.handleCloseFilterDialog
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
            <RemainderGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                filterDialog={filterDialog}
            />
        </Layout>
    )
})

export default RemainderList
