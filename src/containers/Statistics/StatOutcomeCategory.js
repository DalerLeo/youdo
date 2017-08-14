import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import {connect} from 'react-redux'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import filterHelper from '../../helpers/filter'
import {StatOutcomeCategoryGridList} from '../../components/Statistics'
import {STAT_OUTCOME_CATEGORY_FILTER_KEY} from '../../components/Statistics/StatOutcomeCategoryGridList'
import {
    statOutcomeCategoryListFetchAction,
    statOutcomeCategoryItemFetchAction,
    getDocumentAction
} from '../../actions/statOutcomeCategory'

const ZERO = 0

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['statOutcomeCategory', 'item', 'data'])
        const detailLoading = _.get(state, ['statOutcomeCategory', 'item', 'loading'])
        const list = _.get(state, ['statOutcomeCategory', 'list', 'data'])
        const listLoading = _.get(state, ['statOutcomeCategory', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'StatOutcomeCategoryFilterForm'])
        const filter = filterHelper(list, pathname, query)
        const filterItem = filterHelper(detail, pathname, query)
        return {
            list,
            listLoading,
            detail,
            detailLoading,
            filter,
            query,
            filterForm,
            filterItem
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest() &&
            (!_.get(props, ['params', 'statOutcomeCategoryId'])) &&
            (!_.get(nextProps, ['params', 'statOutcomeCategoryId']))
    }, ({dispatch, filter}) => {
        dispatch(statOutcomeCategoryListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const statOutcomeCategoryId = _.get(nextProps, ['params', 'statOutcomeCategoryId']) || ZERO
        return statOutcomeCategoryId > ZERO && _.get(props, ['params', 'statOutcomeCategoryId']) !== statOutcomeCategoryId
    }, ({dispatch, params, filter, filterItem}) => {
        const statOutcomeCategoryId = _.toInteger(_.get(params, 'statOutcomeCategoryId'))
        if (statOutcomeCategoryId > ZERO) {
            dispatch(statOutcomeCategoryItemFetchAction(filter, filterItem, statOutcomeCategoryId))
        }
    }),

    withHandlers({
        handleSubmitFilterDialog: props => (event) => {
            event.preventDefault()
            const {filter, filterForm} = props

            const division = _.get(filterForm, ['values', 'division', 'value']) || null
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null
            filter.filterBy({
                [STAT_OUTCOME_CATEGORY_FILTER_KEY.DIVISION]: division,
                [STAT_OUTCOME_CATEGORY_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [STAT_OUTCOME_CATEGORY_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')

            })
        },
        handleGetDocument: props => () => {
            const {dispatch, filter} = props
            return dispatch(getDocumentAction(filter))
        }
    })
)

const StatOutcomeCategoryList = enhance((props) => {
    const {
        list,
        listLoading,
        detail,
        detailLoading,
        filter,
        layout,
        filterItem,
        filterForm,
        location,
        params
    } = props

    const detailId = _.toInteger(_.get(params, 'statOutcomeCategoryId'))
    const firstDayOfMonth = _.get(location, ['query', 'fromDate']) || moment().format('YYYY-MM-01')
    const lastDay = moment().daysInMonth()
    const lastDayOfMonth = _.get(location, ['query', 'toDate']) || moment().format('YYYY-MM-' + lastDay)

    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }
    const outcomeCategoryDetail = _.filter(_.get(list, 'results'), (item) => {
        return _.get(item, 'id') === detailId
    })
    const filterDateRange = {
        'fromDate': _.get(filterForm, ['values', 'date', 'fromDate']) || null,
        'toDate': _.get(filterForm, ['values', 'date', 'toDate']) || null
    }
    const detailData = {
        filter: filterItem,
        id: detailId,
        data: detail,
        outcomeCategoryDetail,
        detailLoading,
        handleCloseDetail: props.handleCloseDetail,
        filterDateRange

    }
    const getDocument = {
        handleGetDocument: props.handleGetDocument
    }
    const initialValues = {
        date: {
            fromDate: moment(firstDayOfMonth),
            toDate: moment(lastDayOfMonth)
        }
    }

    return (
        <Layout {...layout}>
            <StatOutcomeCategoryGridList
                filter={filter}
                handleSubmitFilterDialog={props.handleSubmitFilterDialog}
                listData={listData}
                detailData={detailData}
                getDocument={getDocument}
                initialValues={initialValues}
                filterForm={filterForm}
            />
        </Layout>
    )
})

export default StatOutcomeCategoryList
