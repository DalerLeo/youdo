import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import {connect} from 'react-redux'
import sprintf from 'sprintf'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import * as ROUTER from '../../constants/routes'
import {compose, withHandlers, withPropsOnChange} from 'recompose'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import * as serializers from '../../serializers/Statistics/statReturnSerializer'
import getDocuments from '../../helpers/getDocument'
import {StatReturnGridList, STAT_RETURN_DIALOG_OPEN} from '../../components/Statistics'
import {STAT_RETURN_FILTER_KEY} from '../../components/Statistics/Return/StatReturnGridList'
import * as API from '../../constants/api'
import {returnDataSumFetchAction} from '../../actions/statReturn'
import {returnListFetchAction, returnItemFetchAction} from '../../actions/return'
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['return', 'item', 'data'])
        const graphList = _.get(state, ['statReturn', 'list', 'data'])
        const graphLoading = _.get(state, ['statReturn', 'list', 'loading'])
        const detailLoading = _.get(state, ['return', 'item', 'loading'])
        const list = _.get(state, ['return', 'list', 'data'])
        const listLoading = _.get(state, ['return', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'StatisticsFilterForm'])
        const filter = filterHelper(list, pathname, query)
        return {
            query,
            list,
            listLoading,
            detail,
            detailLoading,
            filter,
            filterForm,
            graphList,
            graphLoading
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(returnListFetchAction(filter))
    }),
    withPropsOnChange((props, nextProps) => {
        return (props.query.fromDate !== nextProps.query.fromDate) ||
            (props.query.toDate !== nextProps.query.toDate) ||
            (props.query.division !== nextProps.query.division)
    }, ({dispatch, filter}) => {
        dispatch(returnDataSumFetchAction(filter))
    }),
    withPropsOnChange((props, nextProps) => {
        const returnId = _.get(nextProps, ['params', 'statReturnId'])
        return returnId && _.get(props, ['params', 'statReturnId']) !== returnId
    }, ({dispatch, params}) => {
        const returnId = _.toInteger(_.get(params, 'statReturnId'))
        returnId && dispatch(returnItemFetchAction(returnId))
    }),

    withHandlers({
        handleOpenStatReturnDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({pathname: sprintf(ROUTER.STATISTICS_RETURN_ITEM_PATH, id), query: filter.getParams({[STAT_RETURN_DIALOG_OPEN]: true})})
        },

        handleCloseStatReturnDialog: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.STATISTICS_RETURN_URL, query: filter.getParams({[STAT_RETURN_DIALOG_OPEN]: false})})
        },
        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null
            const division = _.get(filterForm, ['values', 'division']) || null

            filter.filterBy({
                [STAT_RETURN_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [STAT_RETURN_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD'),
                [STAT_RETURN_FILTER_KEY.DIVISION]: _.join(division, '-')

            })
        },
        handleGetDocument: props => () => {
            const {filter} = props
            const params = serializers.orderListFilterSerializer(filter.getParams())
            getDocuments(API.STAT_RETURN_GET_DOCUMENT, params)
        }
    })
)

const StatReturnList = enhance((props) => {
    const {
        location,
        list,
        listLoading,
        detail,
        detailLoading,
        filter,
        layout,
        returnData,
        params,
        graphList,
        graphLoading
    } = props

    const detailId = _.toInteger(_.get(params, 'statReturnId'))
    const openStatReturnDialog = toBoolean(_.get(location, ['query', STAT_RETURN_DIALOG_OPEN]))
    const firstDayOfMonth = _.get(location, ['query', 'fromDate']) || moment().format('YYYY-MM-01')
    const lastDay = moment().daysInMonth()
    const lastDayOfMonth = _.get(location, ['query', 'toDate']) || moment().format('YYYY-MM-' + lastDay)
    const division = !_.isNull(_.get(location, ['query', 'division'])) && _.get(location, ['query', 'division'])

    const listData = {
        data: _.get(list, 'results') || {},
        listLoading
    }
    const statReturnDialog = {
        openStatReturnDialog,
        handleCloseStatReturnDialog: props.handleCloseStatReturnDialog,
        handleOpenStatReturnDialog: props.handleOpenStatReturnDialog
    }
    const detailData = {
        id: detailId,
        data: detail || {},
        return: returnData || {},
        detailLoading,
        handleCloseDetail: props.handleCloseDetail
    }

    const filterForm = {
        initialValues: {
            division: division && _.map(_.split(division, '-'), (item) => {
                return _.toNumber(item)
            }),
            date: {
                fromDate: moment(firstDayOfMonth),
                toDate: moment(lastDayOfMonth)
            }
        }
    }

    const graphData = {
        data: graphList || {},
        graphLoading
    }
    const order = false

    return (
        <Layout {...layout}>
            <StatReturnGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                statReturnDialog={statReturnDialog}
                type={order}
                initialValues={filterForm.initialValues}
                filterForm={filterForm}
                onSubmit={props.handleSubmitFilterDialog}
                graphData={graphData}
                handleGetDocument={props.handleGetDocument}
            />
        </Layout>
    )
})

export default StatReturnList
