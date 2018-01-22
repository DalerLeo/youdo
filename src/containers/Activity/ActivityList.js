import React from 'react'
import _ from 'lodash'
import {
    compose,
    withPropsOnChange,
    withHandlers,
    withState,
    lifecycle
} from 'recompose'
import moment from 'moment'
import {connect} from 'react-redux'
import Layout from '../../components/Layout'
import {hashHistory} from 'react-router'
import filterHelper from '../../helpers/filter'
import {ORDER_DETAILS, ActivityWrapper, DAY, DATE, IMAGE} from '../../components/Activity'
import {
    VISIT,
    ORDER,
    REPORT,
    ORDER_RETURN,
    PAYMENT,
    DELIVERY,
    activityOrderListFetchAction,
    activityOrderItemFetchAction,
    activityVisitListFetchAction,
    activityReportListFetchAction,
    activityReturnListFetchAction,
    activityPaymentListFetchAction,
    activityDeliveryListFetchAction,
    activityReportShowImageAction,
    activitySummaryListFetchAction
} from '../../actions/activity'

const ZERO = 0
const ONE = 1
const currentDate = moment().format('YYYY-MM')
const today = _.toInteger(moment().format('D'))

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const orderList = _.get(state, ['activity', 'orderList', 'data', 'results'])
        const orderListLoading = _.isUndefined(_.get(state, ['activity', 'orderList', 'data', 'results'])) ? true : _.get(state, ['activity', 'orderList', 'loading'])
        const visitList = _.get(state, ['activity', 'visitList', 'data', 'results'])
        const visitListLoading = _.isUndefined(_.get(state, ['activity', 'visitList', 'data', 'results'])) ? true : _.get(state, ['activity', 'visitList', 'loading'])
        const reportList = _.get(state, ['activity', 'reportList', 'data', 'results'])
        const reportListLoading = _.isUndefined(_.get(state, ['activity', 'reportList', 'data', 'results'])) ? true : _.get(state, ['activity', 'reportList', 'loading'])
        const reportImage = _.get(state, ['activity', 'reportImage', 'data'])
        const reportImageLoading = _.get(state, ['activity', 'reportImage', 'loading'])
        const returnList = _.get(state, ['activity', 'returnList', 'data', 'results'])
        const returnListLoading = _.isUndefined(_.get(state, ['activity', 'returnList', 'data', 'results'])) ? true : _.get(state, ['activity', 'returnList', 'loading'])
        const paymentList = _.get(state, ['activity', 'paymentList', 'data', 'results'])
        const paymentListLoading = _.isUndefined(_.get(state, ['activity', 'paymentList', 'data', 'results'])) ? true : _.get(state, ['activity', 'paymentList', 'loading'])
        const deliveryList = _.get(state, ['activity', 'deliveryList', 'data', 'results'])
        const deliveryListLoading = _.isUndefined(_.get(state, ['activity', 'deliveryList', 'data', 'results'])) ? true : _.get(state, ['activity', 'deliveryList', 'loading'])
        const summaryList = _.get(state, ['activity', 'summary', 'data'])
        const summaryListLoading = _.get(state, ['activity', 'summary', 'loading'])
        const orderItem = _.get(state, ['activity', 'orderItem', 'data'])
        const orderItemLoading = _.get(state, ['activity', 'orderItem', 'loading'])
        const createForm = _.get(state, ['form', 'ActivityCreateForm', 'values'])
        const curDate = _.get(query, 'date') || currentDate
        const filter = filterHelper(orderList, pathname, query)
        return {
            filter,
            query,
            pathname,
            orderList,
            orderListLoading,
            orderItem,
            orderItemLoading,
            visitList,
            visitListLoading,
            reportList,
            reportListLoading,
            reportImage,
            reportImageLoading,
            returnList,
            returnListLoading,
            paymentList,
            paymentListLoading,
            deliveryList,
            deliveryListLoading,
            summaryList,
            summaryListLoading,
            createForm,
            curDate
        }
    }),
    withState('orderData', 'updateOrderData', []),
    withState('visitData', 'updateVisitData', []),
    withState('reportData', 'updateReportData', []),
    withState('returnData', 'updateReturnData', []),
    withState('paymentData', 'updatePaymentData', []),
    withState('deliveryData', 'updateDeliveryData', []),

    withState('loading', 'setLoading', false),
    withPropsOnChange((props, nextProps) => {
        const prevDay = _.get(props, ['location', 'query', DAY])
        const nextDay = _.get(nextProps, ['location', 'query', DAY])
        return (props.curDate !== nextProps.curDate) || (prevDay !== nextDay)
    }, ({dispatch, filter, setLoading}) => {
        dispatch(activitySummaryListFetchAction(filter))
            .then(() => {
                dispatch(activityOrderListFetchAction(filter))
                    .then(() => {
                        dispatch(activityVisitListFetchAction(filter))
                            .then(() => {
                                dispatch(activityReportListFetchAction(filter))
                                    .then(() => {
                                        dispatch(activityReturnListFetchAction(filter))
                                            .then(() => {
                                                dispatch(activityPaymentListFetchAction(filter))
                                                    .then(() => {
                                                        dispatch(activityDeliveryListFetchAction(filter))
                                                            .then(() => {
                                                                setLoading(false)
                                                            })
                                                    })
                                            })
                                    })
                            })
                    })
            })
    }),

    withPropsOnChange((props, nextProps) => {
        const prevDetail = _.get(props, ['location', 'query', ORDER_DETAILS])
        const nextDetail = _.get(nextProps, ['location', 'query', ORDER_DETAILS])
        return prevDetail !== nextDetail && nextDetail > ZERO
    }, ({dispatch, location}) => {
        const orderId = _.toInteger(_.get(location, ['query', ORDER_DETAILS]))
        if (orderId > ZERO) {
            dispatch(activityOrderItemFetchAction(orderId))
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const prevImage = _.get(props, ['location', 'query', IMAGE])
        const nextImage = _.get(nextProps, ['location', 'query', IMAGE])
        return prevImage !== nextImage && nextImage > ZERO
    }, ({dispatch, location}) => {
        const imageId = _.toInteger(_.get(location, ['query', IMAGE]))
        if (imageId > ZERO) {
            dispatch(activityReportShowImageAction(imageId))
        }
    }),

    withHandlers({
        handlePrevMonth: props => () => {
            const {location: {pathname}, filter, curDate} = props
            const prevMonth = moment(curDate).subtract(ONE, 'month')
            const dateForURL = prevMonth.format('YYYY-MM')
            hashHistory.push({pathname, query: filter.getParams({[DATE]: dateForURL})})
        },

        handleNextMonth: props => () => {
            const {location: {pathname}, filter, curDate} = props
            const nextMonth = moment(curDate).add(ONE, 'month')
            const dateForURL = nextMonth.format('YYYY-MM')
            hashHistory.push({pathname, query: filter.getParams({[DATE]: dateForURL})})
        },

        handleClickDay: props => (day) => {
            const {location, location: {pathname}, filter} = props
            const date = _.get(location, ['query', DATE])
            hashHistory.push({pathname, query: filter.getParams({[DAY]: day, [DATE]: date})})
        },

        handleOpenOrderDetails: props => (id) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ORDER_DETAILS]: id})})
        },

        handleCloseOrderDetails: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ORDER_DETAILS]: ZERO})})
        },

        handleOpenReportImage: props => (id) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[IMAGE]: id})})
        },

        handleCloseReportImage: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[IMAGE]: ZERO})})
        },

        handleLoadMoreItems: props => (type, page) => {
            const {dispatch, filter} = props
            switch (type) {
                case VISIT: dispatch(activityVisitListFetchAction(filter, page))
                    break
                case ORDER: dispatch(activityOrderListFetchAction(filter, page))
                    break
                case REPORT: dispatch(activityReportListFetchAction(filter, page))
                    break
                case ORDER_RETURN: dispatch(activityReturnListFetchAction(filter, page))
                    break
                case PAYMENT: dispatch(activityPaymentListFetchAction(filter, page))
                    break
                case DELIVERY: dispatch(activityDeliveryListFetchAction(filter, page))
                    break
                default: dispatch(null)
            }
        }
    }),
    lifecycle({
        componentWillMount () {
            const setLoading = _.get(this, ['props', 'setLoading'])
            const updateOrderData = _.get(this, ['props', 'updateOrderData'])
            const updateVisitData = _.get(this, ['props', 'updateVisitData'])
            const updateReportData = _.get(this, ['props', 'updateReportData'])
            const updateReturnData = _.get(this, ['props', 'updateReturnData'])
            const updatePaymentData = _.get(this, ['props', 'updatePaymentData'])
            const updateDeliveryData = _.get(this, ['props', 'updateDeliveryData'])
            setLoading(true)
            updateOrderData([])
            updateVisitData([])
            updateReportData([])
            updateReturnData([])
            updatePaymentData([])
            updateDeliveryData([])
        },
        componentWillReceiveProps (props) {
            const {
                // ORDER
                updateOrderData,
                orderData,
                orderList,
                orderListLoading,
                // VISIT
                updateVisitData,
                visitData,
                visitList,
                visitListLoading,
                // REPORT
                updateReportData,
                reportData,
                reportList,
                reportListLoading,
                // RETURN
                updateReturnData,
                returnData,
                returnList,
                returnListLoading,
                // PAYMENT
                updatePaymentData,
                paymentData,
                paymentList,
                paymentListLoading,
                // DELIVERY
                updateDeliveryData,
                deliveryData,
                deliveryList,
                deliveryListLoading,
                // CHANGE DATE
                setLoading
            } = props
            const orderLoading = _.get(this, ['props', 'orderListLoading'])
            const visitLoading = _.get(this, ['props', 'visitListLoading'])
            const reportLoading = _.get(this, ['props', 'reportListLoading'])
            const returnLoading = _.get(this, ['props', 'returnListLoading'])
            const paymentLoading = _.get(this, ['props', 'paymentListLoading'])
            const deliveryLoading = _.get(this, ['props', 'deliveryListLoading'])
            if (orderLoading !== orderListLoading && orderListLoading === false) {
                updateOrderData(_.union(orderData, orderList))
            }
            if (visitLoading !== visitListLoading && visitListLoading === false) {
                updateVisitData(_.union(visitData, visitList))
            }
            if (reportLoading !== reportListLoading && reportListLoading === false) {
                updateReportData(_.union(reportData, reportList))
            }
            if (returnLoading !== returnListLoading && returnListLoading === false) {
                updateReturnData(_.union(returnData, returnList))
            }
            if (paymentLoading !== paymentListLoading && paymentListLoading === false) {
                updatePaymentData(_.union(paymentData, paymentList))
            }
            if (deliveryLoading !== deliveryListLoading && deliveryListLoading === false) {
                updateDeliveryData(_.union(deliveryData, deliveryList))
            }
            const prevDay = _.get(this, ['props', 'location', 'query', DAY])
            const nextDay = _.get(props, ['location', 'query', DAY])
            if ((this.props.curDate !== props.curDate) || (prevDay !== nextDay)) {
                setLoading(true)
                updateOrderData([])
                updateVisitData([])
                updateReportData([])
                updateReturnData([])
                updatePaymentData([])
                updateDeliveryData([])
            }
        }
    })
)

const ActivityList = enhance((props) => {
    const {
        filter,
        orderListLoading,
        orderItem,
        orderItemLoading,
        visitListLoading,
        reportListLoading,
        reportImage,
        reportImageLoading,
        returnListLoading,
        paymentListLoading,
        deliveryListLoading,
        summaryList,
        summaryListLoading,
        location,
        layout,
        loading
    } = props

    const openOrderDetails = _.toInteger(_.get(location, ['query', ORDER_DETAILS]) || ZERO) > ZERO
    const openReportImage = _.toInteger(_.get(location, ['query', IMAGE]) || ZERO) > ZERO
    const orderId = _.toInteger(_.get(location, ['query', ORDER_DETAILS]))
    const selectedDay = _.toInteger(_.get(location, ['query', DAY]) || today)
    const selectedDate = _.get(location, ['query', DATE]) || currentDate

    const orderDetails = {
        id: orderId,
        openOrderDetails,
        orderItemLoading,
        data: orderItem,
        handleOpenOrderDetails: props.handleOpenOrderDetails,
        handleCloseOrderDetails: props.handleCloseOrderDetails
    }

    const reportImageData = {
        imageData: {
            data: {image: reportImage}
        },
        reportImageLoading,
        openReportImage,
        handleOpenReportImage: props.handleOpenReportImage,
        handleCloseReportImage: props.handleCloseReportImage
    }

    const summaryData = {
        data: summaryList,
        summaryListLoading
    }

    const orderlistData = {
        data: _.get(props, 'orderData'),
        handleLoadMoreItems: props.handleLoadMoreItems,
        orderListLoading
    }

    const visitlistData = {
        data: _.get(props, 'visitData'),
        handleLoadMoreItems: props.handleLoadMoreItems,
        visitListLoading
    }

    const reportlistData = {
        data: _.get(props, 'reportData'),
        handleLoadMoreItems: props.handleLoadMoreItems,
        reportListLoading
    }

    const returnlistData = {
        data: _.get(props, 'returnData'),
        handleLoadMoreItems: props.handleLoadMoreItems,
        returnListLoading
    }

    const paymentlistData = {
        data: _.get(props, 'paymentData'),
        handleLoadMoreItems: props.handleLoadMoreItems,
        paymentListLoading
    }

    const deliverylistData = {
        data: _.get(props, 'deliveryData'),
        handleLoadMoreItems: props.handleLoadMoreItems,
        deliveryListLoading
    }

    const calendar = {
        selectedDay: selectedDay,
        selectedDate: selectedDate,
        handlePrevMonth: props.handlePrevMonth,
        handleNextMonth: props.handleNextMonth
    }
    return (
        <Layout {...layout}>
            <ActivityWrapper
                filter={filter}
                summaryData={summaryData}
                orderlistData={orderlistData}
                orderDetails={orderDetails}
                visitlistData={visitlistData}
                reportlistData={reportlistData}
                reportImageData={reportImageData}
                returnlistData={returnlistData}
                paymentlistData={paymentlistData}
                deliverylistData={deliverylistData}
                handleClickDay={props.handleClickDay}
                calendar={calendar}
                loading={loading}
            />
        </Layout>
    )
})

export default ActivityList
