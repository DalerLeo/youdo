import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import getDocuments from '../../helpers/getDocument'
import * as API from '../../constants/api'
import * as serializers from '../../serializers/Statistics/statProviderSerializer'
import moment from 'moment'

import {
    StatProviderGridList,
    STAT_PROVIDER_DIALOG_OPEN,
    STAT_PROVIDER_INFO_DIALOG_OPEN,
    BEGIN_DATE,
    END_DATE
} from '../../components/Statistics'
import {STAT_PROVIDER_FILTER_KEY} from '../../components/Statistics/Providers/ProviderGridList'
import {
    statProviderListFetchAction,
    statProviderSummaryFetchAction,
    statProviderItemFetchAction,
    statProviderDetailFetchAction
} from '../../actions/statProvider'
const STAT = true
const defaultDate = moment().format('YYYY-MM-DD')
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['statProvider', 'item', 'data'])
        const detailLoading = _.get(state, ['statProvider', 'item', 'loading'])
        const list = _.get(state, ['statProvider', 'list', 'data'])
        const listLoading = _.get(state, ['statProvider', 'list', 'loading'])
        const summary = _.get(state, ['statProvider', 'sum', 'data'])
        const summaryLoading = _.get(state, ['statProvider', 'sum', 'loading'])
        const filterForm = _.get(state, ['form', 'StatisticsFilterForm'])
        const infoForm = _.get(state, ['form', 'ProviderBalanceForm'])
        const info = _.get(state, ['statProvider', 'detail', 'data'])
        const infoLoading = _.get(state, ['statProvider', 'detail', 'loading'])
        const filter = filterHelper(list, pathname, query)
        const filterItem = filterHelper(detail, pathname, query, {'page': 'dPage', 'pageSize': 'dPageSize'})
        const beginDate = _.get(query, BEGIN_DATE) || defaultDate
        const endDate = _.get(query, END_DATE) || defaultDate

        return {
            pathname,
            list,
            listLoading,
            summary,
            summaryLoading,
            detail,
            detailLoading,
            filter,
            query,
            filterForm,
            infoForm,
            info,
            infoLoading,
            filterItem,
            beginDate,
            endDate
        }
    }),
    withPropsOnChange((props, nextProps) => {
        const except = {
            openInfoDialog: null,
            dPage: null,
            dPageSize: null
        }
        return props.list && props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
    }, ({dispatch, filter}) => {
        dispatch(statProviderListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const ID = _.get(props, ['params', 'statProviderId'])
        const nextID = _.get(nextProps, ['params', 'statProviderId'])
        return ID !== nextID && nextID
    }, ({dispatch, params}) => {
        const providerID = _.toInteger(_.get(params, 'statProviderId'))
        providerID && dispatch(statProviderDetailFetchAction(providerID))
    }),

    withPropsOnChange((props, nextProps) => {
        const except = {
            openInfoDialog: null,
            dPage: null,
            dPageSize: null,
            search: null,
            page: null,
            pageSize: null
        }
        return props.list && props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
    }, ({dispatch, filter}) => {
        dispatch(statProviderSummaryFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const ID = _.get(props, ['params', 'statProviderId'])
        const nextID = _.get(nextProps, ['params', 'statProviderId'])
        const division = _.get(props, ['infoForm', 'values', 'division', 'value'])
        const nextDivision = _.get(nextProps, ['infoForm', 'values', 'division', 'value'])
        const currency = _.get(props, ['infoForm', 'values', 'currency', 'value'])
        const nextCurrency = _.get(nextProps, ['infoForm', 'values', 'currency', 'value'])
        const type = _.get(props, ['infoForm', 'values', 'paymentType', 'value'])
        const nextType = _.get(nextProps, ['infoForm', 'values', 'paymentType', 'value'])
        return (ID !== nextID && nextID) ||
            (currency !== nextCurrency && nextCurrency) ||
            (division !== nextDivision && nextDivision) ||
            (type !== nextType && nextType) ||
            (props.filterItem.filterRequest() !== nextProps.filterItem.filterRequest())
    }, ({dispatch, params, filterItem, infoForm}) => {
        const clientBalanceId = _.toInteger(_.get(params, 'statProviderId'))
        const division = _.get(infoForm, ['values', 'division', 'value'])

        const currency = _.get(infoForm, ['values', 'currency', 'value'])
        const type = _.get(infoForm, ['values', 'paymentType', 'value'])
        clientBalanceId && dispatch(statProviderItemFetchAction(filterItem, clientBalanceId, division, currency, type))
    }),

    withHandlers({
        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const search = _.get(filterForm, ['values', 'search']) || null
            const paymentType = _.get(filterForm, ['values', 'paymentType', 'value']) || null
            const balanceType = _.get(filterForm, ['values', 'balanceType', 'value']) || null
            const toDate = _.get(filterForm, ['values', 'createdDate', 'toDate']) || null
            const fromDate = _.get(filterForm, ['values', 'createdDate', 'fromDate']) || null
            filter.filterBy({
                [STAT_PROVIDER_FILTER_KEY.SEARCH]: search,
                [STAT_PROVIDER_FILTER_KEY.PAYMENT_TYPE]: paymentType,
                [STAT_PROVIDER_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [STAT_PROVIDER_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD'),
                [STAT_PROVIDER_FILTER_KEY.BALANCE_TYPE]: balanceType

            })
        },
        handleGetDocument: props => () => {
            const {filter} = props
            const params = serializers.listFilterSerializer(filter.getParams())
            getDocuments(API.STAT_PROVIDER_GET_DOCUMENT, params)
        },

        handleOpenInfoDialog: props => (id) => {
            const {filterItem} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.STATISTICS_PROVIDERS_ITEM_PATH, id),
                query: filterItem.getParams({
                    [STAT_PROVIDER_INFO_DIALOG_OPEN]: true
                })
            })
        },

        handleCloseInfoDialog: props => () => {
            const {location: {pathname}, filterItem} = props
            hashHistory.push({
                pathname,
                query: filterItem.getParams({
                    [STAT_PROVIDER_INFO_DIALOG_OPEN]: false,
                    'dPage': null,
                    'dPageSize': null
                })
            })
        }
    })
)

const StatProviderList = enhance((props) => {
    const {
        pathname,
        location,
        list,
        listLoading,
        summary,
        summaryLoading,
        info,
        infoLoading,
        detail,
        detailLoading,
        filter,
        layout,
        filterItem,
        beginDate,
        endDate,
        params
    } = props

    const openStatProviderDialog = toBoolean(_.get(location, ['query', STAT_PROVIDER_DIALOG_OPEN]))
    const openInfoDialog = toBoolean(_.get(location, ['query', STAT_PROVIDER_INFO_DIALOG_OPEN]))
    const detailId = _.toInteger(_.get(params, 'statProviderId'))
    const division = !_.isNull(_.get(location, ['query', 'division'])) && _.toInteger(_.get(location, ['query', 'division']))
    const search = !_.isNull(_.get(location, ['query', 'search'])) ? _.get(location, ['query', 'search']) : null
    const type = _.get(location, ['query', 'type'])
    const paymentType = filter.getParam(STAT_PROVIDER_FILTER_KEY.PAYMENT_TYPE)
    const balanceType = filter.getParam(STAT_PROVIDER_FILTER_KEY.BALANCE_TYPE)
    const firstDayOfMonth = _.get(location, ['query', 'fromDate']) || moment().format('YYYY-MM-01')
    const lastDay = moment().daysInMonth()
    const lastDayOfMonth = _.get(location, ['query', 'toDate']) || moment().format('YYYY-MM-' + lastDay)

    const divisionInfo = _.find(_.get(list, ['results', '0', 'divisions']), (item) => {
        return _.get(item, 'id') === division
    })

    const getBalance = (payType) => {
        const balance = _.find(_.get(list, ['results']), (item) => {
            return _.get(item, 'id') === detailId
        })
        const div = _.find(_.get(balance, 'divisions'), (item) => {
            return _.get(item, 'id') === division
        })
        return _.get(div, payType)
    }

    const infoDialog = {
        updateLoading: detailLoading,
        openInfoDialog,
        division: divisionInfo,
        type: type === 'bank' ? ' переч.' : ' нал.',
        balance: getBalance(type),
        info,
        infoLoading,
        handleOpenInfoDialog: props.handleOpenInfoDialog,
        handleCloseInfoDialog: props.handleCloseInfoDialog
    }

    const statProviderDialog = {
        openStatProviderDialog,
        handleCloseStatProviderDialog: props.handleCloseStatProviderDialog,
        handleOpenStatProviderDialog: props.handleOpenStatProviderDialog
    }
    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }
    const summaryData = {
        data: summary,
        loading: summaryLoading
    }
    const providerDetail = _.filter(_.get(list, 'results'), (item) => {
        return _.get(item, 'id') === detailId
    })
    const detailData = {
        filter: filterItem,
        id: detailId,
        data: detail,
        providerDetail,
        detailLoading,
        handleCloseDetail: props.handleCloseDetail,
        beginDate,
        endDate

    }
    const getDocument = {
        handleGetDocument: props.handleGetDocument
    }
    const initialValues = {
        search: search,
        paymentType: {
            value: paymentType
        },
        balanceType: {
            value: balanceType
        },
        createdDate: {
            fromDate: moment(firstDayOfMonth),
            toDate: moment(lastDayOfMonth)
        }
    }

    return (
        <Layout {...layout}>
            <StatProviderGridList
                filter={filter}
                handleSubmitFilterDialog={props.handleSubmitFilterDialog}
                listData={listData}
                summaryData={summaryData}
                detailData={detailData}
                statProviderDialog={statProviderDialog}
                getDocument={getDocument}
                initialValues={initialValues}
                pathname={pathname}
                infoDialog={infoDialog}
                stat={STAT}
            />
        </Layout>
    )
})

export default StatProviderList
