import React from 'react'
import moment from 'moment'
import _ from 'lodash'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {
    CLIENT_BALANCE_INFO_DIALOG_OPEN,
    CLIENT_BALANCE_FILTER_KEY,
    CLIENT_BALANCE_FILTER_OPEN,
    ClientBalanceGridList
} from '../../components/ClientBalance'
import {
    clientBalanceListFetchAction,
    clientBalanceItemFetchAction
} from '../../actions/clientBalance'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['clientBalance', 'item', 'data'])
        const detailLoading = _.get(state, ['clientBalance', 'item', 'loading'])
        const list = _.get(state, ['clientBalance', 'list', 'data'])
        const listLoading = _.get(state, ['clientBalance', 'list', 'loading'])
        const filterForm = _.get(state, ['form', 'ClientBalanceFilterForm'])
        const searchForm = _.get(state, ['form', 'ClientBalanceForm'])
        const isSuperUser = _.get(state, ['authConfirm', 'data', 'isSuperuser'])

        const filter = filterHelper(list, pathname, query)
        const filterItem = filterHelper(detail, pathname, query, {'page': 'dPage', 'pageSize': 'dPageSize'})

        return {
            query,
            list,
            listLoading,
            detail,
            detailLoading,
            filter,
            filterItem,
            filterForm,
            isSuperUser,
            searchForm
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest() &&
            toBoolean(_.get(nextProps, ['location', 'query', CLIENT_BALANCE_INFO_DIALOG_OPEN])) === false
    }, ({dispatch, filter}) => {
        dispatch(clientBalanceListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const clientBalanceId = _.get(nextProps, ['params', 'clientBalanceId'])
        return clientBalanceId && (_.get(props, ['params', 'clientBalanceId']) !== clientBalanceId ||
            props.filterItem.filterRequest() !== nextProps.filterItem.filterRequest())
    }, ({dispatch, params, filterItem, location}) => {
        const clientBalanceId = _.toInteger(_.get(params, 'clientBalanceId'))
        const division = _.get(location, ['query', 'division'])
        const type = _.get(location, ['query', 'type'])
        clientBalanceId && dispatch(clientBalanceItemFetchAction(filterItem, clientBalanceId, division, type))
    }),

    withState('openConfirmDialog', 'setOpenConfirmDialog', false),

    withHandlers({
        handleOpenFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CLIENT_BALANCE_FILTER_OPEN]: true})})
        },

        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[CLIENT_BALANCE_FILTER_OPEN]: false})})
        },

        handleClearFilterDialog: props => () => {
            const {location: {pathname}} = props
            hashHistory.push({pathname, query: {}})
        },

        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const fromDate = _.get(filterForm, ['values', 'date', 'fromDate']) || null
            const toDate = _.get(filterForm, ['values', 'date', 'toDate']) || null

            filter.filterBy({
                [CLIENT_BALANCE_FILTER_OPEN]: false,
                [CLIENT_BALANCE_FILTER_KEY.FROM_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
                [CLIENT_BALANCE_FILTER_KEY.TO_DATE]: toDate && toDate.format('YYYY-MM-DD')
            })
        },

        handleOpenInfoDialog: props => (id, division, type) => {
            const {filterItem} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.STATISTICS_CLIENT_BALANCE_ITEM_PATH, id),
                query: filterItem.getParams({
                    [CLIENT_BALANCE_INFO_DIALOG_OPEN]: true,
                    'division': division,
                    'type': type
                })
            })
        },

        handleCloseInfoDialog: props => () => {
            const {location: {pathname}, filterItem} = props
            hashHistory.push({
                pathname,
                query: filterItem.getParams({
                    [CLIENT_BALANCE_INFO_DIALOG_OPEN]: false,
                    'dPage': null,
                    'dPageSize': null
                })
            })
        },
        handleSubmitSearch: props => () => {
            const {location: {pathname}, filter, searchForm} = props
            const term = _.get(searchForm, ['values', 'searching'])
            hashHistory.push({
                pathname, query: filter.getParams({search: term})
            })
        }
    })
)

const ClientBalanceList = enhance((props) => {
    const {
        location,
        list,
        listLoading,
        detail,
        detailLoading,
        filter,
        filterItem,
        layout,
        params
    } = props

    const openFilterDialog = toBoolean(_.get(location, ['query', CLIENT_BALANCE_FILTER_OPEN]))
    const openInfoDialog = toBoolean(_.get(location, ['query', CLIENT_BALANCE_INFO_DIALOG_OPEN]))
    const division = _.toNumber(_.get(location, ['query', 'division']))
    const type = _.get(location, ['query', 'type'])
    const fromDate = filter.getParam(CLIENT_BALANCE_FILTER_KEY.FROM_DATE)
    const toDate = filter.getParam(CLIENT_BALANCE_FILTER_KEY.TO_DATE)
    const detailId = _.toInteger(_.get(params, 'clientBalanceId'))

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
        handleOpenInfoDialog: props.handleOpenInfoDialog,
        handleCloseInfoDialog: props.handleCloseInfoDialog
    }

    const filterDialog = {
        initialValues: {
            date: {
                fromDate: fromDate && moment(fromDate, 'YYYY-MM-DD'),
                toDate: toDate && moment(toDate, 'YYYY-MM-DD')
            }
        },
        filterLoading: false,
        openFilterDialog,
        handleOpenFilterDialog: props.handleOpenFilterDialog,
        handleCloseFilterDialog: props.handleCloseFilterDialog,
        handleClearFilterDialog: props.handleClearFilterDialog,
        handleSubmitFilterDialog: props.handleSubmitFilterDialog
    }

    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }

    const detailData = {
        id: detailId,
        data: _.get(detail, 'results'),
        detailLoading
    }

    return (
        <Layout {...layout}>
            <ClientBalanceGridList
                stat={true}
                filter={filter}
                filterItem={filterItem}
                listData={listData}
                detailData={detailData}
                infoDialog={infoDialog}
                filterDialog={filterDialog}
                handleSubmitSearch={props.handleSubmitSearch}
            />
        </Layout>
    )
})

export default ClientBalanceList