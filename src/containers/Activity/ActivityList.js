import React from 'react'
import _ from 'lodash'
import {compose, withPropsOnChange, withHandlers, withState} from 'recompose'
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
        const orderListLoading = _.get(state, ['activity', 'orderList', 'loading'])
        const visitList = _.get(state, ['activity', 'visitList', 'data', 'results'])
        const visitListLoading = _.get(state, ['activity', 'visitList', 'loading'])
        const reportList = _.get(state, ['activity', 'reportList', 'data', 'results'])
        const reportListLoading = _.get(state, ['activity', 'reportList', 'loading'])
        const reportImage = _.get(state, ['activity', 'reportImage', 'data'])
        const reportImageLoading = _.get(state, ['activity', 'reportImage', 'loading'])
        const returnList = _.get(state, ['activity', 'returnList', 'data', 'results'])
        const returnListLoading = _.get(state, ['activity', 'returnList', 'loading'])
        const paymentList = _.get(state, ['activity', 'paymentList', 'data', 'results'])
        const paymentListLoading = _.get(state, ['activity', 'paymentList', 'loading'])
        const deliveryList = _.get(state, ['activity', 'deliveryList', 'data', 'results'])
        const deliveryListLoading = _.get(state, ['activity', 'deliveryList', 'loading'])
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

    withPropsOnChange((props, nextProps) => {
        const prevDay = _.get(props, ['location', 'query', DAY])
        const nextDay = _.get(nextProps, ['location', 'query', DAY])
        return (props.curDate !== nextProps.curDate) || (prevDay !== nextDay)
    }, ({dispatch, filter, updateOrderData, updateVisitData, updateReportData, updateReturnData, updatePaymentData, updateDeliveryData}) => {
        updateOrderData([])
        updateVisitData([])
        updateReportData([])
        updateReturnData([])
        updatePaymentData([])
        updateDeliveryData([])
        dispatch(activityOrderListFetchAction(filter))
        dispatch(activityVisitListFetchAction(filter))
        dispatch(activityReportListFetchAction(filter))
        dispatch(activityReturnListFetchAction(filter))
        dispatch(activityPaymentListFetchAction(filter))
        dispatch(activityDeliveryListFetchAction(filter))
        dispatch(activitySummaryListFetchAction(filter))
    }),

    // ORDER LIST
    withPropsOnChange((props, nextProps) => {
        const prevLoading = _.get(props, 'orderListLoading')
        const nextLoading = _.get(nextProps, 'orderListLoading')
        return prevLoading !== nextLoading && nextLoading === false
    }, ({orderData, orderList, updateOrderData}) => {
        updateOrderData(_.union(orderData, orderList))
    }),
    // VISIT LIST
    withPropsOnChange((props, nextProps) => {
        const prevLoading = _.get(props, 'visitListLoading')
        const nextLoading = _.get(nextProps, 'visitListLoading')
        return prevLoading !== nextLoading && nextLoading === false
    }, ({visitData, visitList, updateVisitData}) => {
        updateVisitData(_.union(visitData, visitList))
    }),
    // REPORT LIST
    withPropsOnChange((props, nextProps) => {
        const prevLoading = _.get(props, 'reportListLoading')
        const nextLoading = _.get(nextProps, 'reportListLoading')
        return prevLoading !== nextLoading && nextLoading === false
    }, ({reportData, reportList, updateReportData}) => {
        updateReportData(_.union(reportData, reportList))
    }),
    // RETURN LIST
    withPropsOnChange((props, nextProps) => {
        const prevLoading = _.get(props, 'returnListLoading')
        const nextLoading = _.get(nextProps, 'returnListLoading')
        return prevLoading !== nextLoading && nextLoading === false
    }, ({returnData, returnList, updateReturnData}) => {
        updateReturnData(_.union(returnData, returnList))
    }),
    // PAYMENT LIST
    withPropsOnChange((props, nextProps) => {
        const prevLoading = _.get(props, 'paymentListLoading')
        const nextLoading = _.get(nextProps, 'paymentListLoading')
        return prevLoading !== nextLoading && nextLoading === false
    }, ({paymentData, paymentList, updatePaymentData}) => {
        updatePaymentData(_.union(paymentData, paymentList))
    }),
    // DELIVERY LIST
    withPropsOnChange((props, nextProps) => {
        const prevLoading = _.get(props, 'deliveryListLoading')
        const nextLoading = _.get(nextProps, 'deliveryListLoading')
        return prevLoading !== nextLoading && nextLoading === false
    }, ({deliveryData, deliveryList, updateDeliveryData}) => {
        updateDeliveryData(_.union(deliveryData, deliveryList))
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
        layout
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
            />
        </Layout>
    )
})

export default ActivityList
