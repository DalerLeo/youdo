import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {reset} from 'redux-form'
import {openSnackbarAction} from '../../actions/snackbar'
import {openErrorAction} from '../../actions/error'

import {
    RemainderGridList,
    REMAINDER_TRANSFER_DIALOG_OPEN,
    REMAINDER_FILTER_OPEN,
    REMAINDER_FILTER_KEY,
    REMAINDER_DISCARD_DIALOG_OPEN
} from '../../components/Remainder'
import {
    remainderListFetchAction,
    remainderItemFetchAction,
    remainderTransferAction,
    remainderDiscardAction
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
        const searchForm = _.get(state, ['form', 'RemainderSearchForm'])
        const transferForm = _.get(state, ['form', 'RemainderTransferForm'])
        const discardForm = _.get(state, ['form', 'RemainderDiscardForm'])
        const filter = filterHelper(list, pathname, query)
        const filterItem = filterHelper(detail, pathname, query, {'page': 'dPage', 'pageSize': 'dPageSize'})

        return {
            list,
            listLoading,
            detail,
            detailLoading,
            filter,
            filterForm,
            transferForm,
            discardForm,
            searchForm,
            filterItem
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
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[REMAINDER_FILTER_OPEN]: false})})
        },
        handleClearFilterDialog: props => () => {
            const {location: {pathname}} = props
            hashHistory.push({pathname, query: {}})
        },
        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const type = _.get(filterForm, ['values', 'type', 'value']) || null
            const stock = _.get(filterForm, ['values', 'stock', 'value']) || null
            const status = _.get(filterForm, ['values', 'status', 'value']) || null
            filter.filterBy({
                [REMAINDER_FILTER_OPEN]: false,
                [REMAINDER_FILTER_KEY.TYPE]: type,
                [REMAINDER_FILTER_KEY.STOCK]: stock,
                [REMAINDER_FILTER_KEY.STATUS]: status
            })
        },
        handleSubmitSearch: props => () => {
            const {filter, searchForm} = props
            const search = _.get(searchForm, ['values', 'search']) || null
            filter.filterBy({
                'search': search
            })
        },
        handleOpenTransferDialog: props => () => {
            const {location: {pathname}, filter, dispatch} = props
            dispatch(reset('RemainderTransferForm'))
            hashHistory.push({pathname, query: filter.getParams({[REMAINDER_TRANSFER_DIALOG_OPEN]: true})})
        },
        handleCloseTransferDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[REMAINDER_TRANSFER_DIALOG_OPEN]: false})})
        },
        handleSubmitTransferDialog: props => () => {
            const {location: {pathname}, dispatch, transferForm, filter} = props
            return dispatch(remainderTransferAction(_.get(transferForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно отправлено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[REMAINDER_TRANSFER_DIALOG_OPEN]: false})})
                    dispatch(remainderListFetchAction(filter))
                })
                .catch((error) => {
                    const fromStock = _.get(error, ['from_stock', '0']) ? 'Выберите склад' : ''
                    const toStock = _.get(error, ['to_stock', '0']) ? 'Выберите склад для отправки' : ''
                    const err1 = _.get(error, ['non_field_errors']) || ''
                    const err2 = (
                                    <div>
                                        <div>{fromStock}</div>
                                        <div>{toStock}</div>
                                        <div>{err1}</div>
                                    </div>
                                )
                    dispatch(openErrorAction({
                        message: <div>{err2}</div>
                    }))
                })
        },
        handleOpenDiscardDialog: props => () => {
            const {location: {pathname}, filter, dispatch} = props
            dispatch(reset('RemainderDiscardForm'))
            hashHistory.push({pathname, query: filter.getParams({[REMAINDER_DISCARD_DIALOG_OPEN]: true})})
        },
        handleCloseDiscardDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[REMAINDER_DISCARD_DIALOG_OPEN]: false})})
        },
        handleSubmitDiscardDialog: props => () => {
            const {location: {pathname}, dispatch, discardForm, filter} = props
            return dispatch(remainderDiscardAction(_.get(discardForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно списано'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[REMAINDER_DISCARD_DIALOG_OPEN]: false})})
                    dispatch(remainderListFetchAction(filter))
                })
                .catch((error) => {
                    const amountError = _.get(error, ['products', '0'])
                    let errorText = 'Заполните все поля!'
                    if (amountError) {
                        errorText = 'Недостаточно товаров на складе'
                    }
                    dispatch(openErrorAction({
                        message: <div>{errorText}</div>
                    }))
                })
        },
        handleResetFilter: props => () => {
            const {dispatch, location: {pathname}} = props
            dispatch(reset('RemainderFilterForm'))
            hashHistory.push({pathname})
        },
        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.REMAINDER_LIST_URL, query: filter.getParams()})
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
        params,
        filterItem
    } = props

    const stock = _.toInteger(filter.getParam(REMAINDER_FILTER_KEY.STOCK))
    const type = _.toInteger(filter.getParam(REMAINDER_FILTER_KEY.TYPE))
    const status = filter.getParam(REMAINDER_FILTER_KEY.STATUS)
    const openFilterDialog = toBoolean(_.get(location, ['query', REMAINDER_FILTER_OPEN]))
    const openTransferDialog = toBoolean(_.get(location, ['query', REMAINDER_TRANSFER_DIALOG_OPEN]))
    const openDiscardDialog = toBoolean(_.get(location, ['query', REMAINDER_DISCARD_DIALOG_OPEN]))
    const detailId = _.toInteger(_.get(params, 'remainderId'))

    const filterDialog = {
        initialValues: {
            stock: {
                value: stock
            },
            type: {
                value: type
            },
            status: {
                value: status
            }
        },
        openFilterDialog: openFilterDialog,
        handleOpenFilterDialog: props.handleOpenFilterDialog,
        handleCloseFilterDialog: props.handleCloseFilterDialog,
        handleSubmitFilterDialog: props.handleSubmitFilterDialog,
        handleClearFilterDialog: props.handleClearFilterDialog
    }

    const discardDialog = {
        openDiscardDialog,
        handleOpenDiscardDialog: props.handleOpenDiscardDialog,
        handleCloseDiscardDialog: props.handleCloseDiscardDialog,
        handleSubmitDiscardDialog: props.handleSubmitDiscardDialog
    }
    const transferDialog = {
        openTransferDialog: openTransferDialog,
        handleOpenTransferDialog: props.handleOpenTransferDialog,
        handleCloseTransferDialog: props.handleCloseTransferDialog,
        handleSubmitTransferDialog: props.handleSubmitTransferDialog
    }
    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }

    const currentRow = _.filter(_.get(list, 'results'), (item) => {
        return _.get(item, 'id') === detailId
    })

    const detailData = {
        id: detailId,
        data: detail,
        detailLoading,
        currentRow
    }

    return (
        <Layout {...layout}>
            <RemainderGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                filterDialog={filterDialog}
                handleCloseDetail={props.handleCloseDetail}
                transferDialog={transferDialog}
                resetFilter={props.handleResetFilter}
                discardDialog={discardDialog}
                searchSubmit={props.handleSubmitSearch}
                filterItem={filterItem}
            />
        </Layout>
    )
})

export default RemainderList
