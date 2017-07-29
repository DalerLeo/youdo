import React from 'react'
import _ from 'lodash'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import moment from 'moment'
import {connect} from 'react-redux'
import Layout from '../../components/Layout'
import {hashHistory} from 'react-router'
import filterHelper from '../../helpers/filter'
import {ORDER_DETAILS, ActivityWrapper, DAY, DATE, IMAGE} from '../../components/Activity'
import {
    activityOrderListFetchAction,
    activityOrderItemFetchAction,
    activityVisitListFetchAction,
    activityReportListFetchAction,
    activityReturnListFetchAction,
    activityPaymentListFetchAction,
    activityDeliveryListFetchAction,
    activityReportShowImageAction
} from '../../actions/activity'

const ZERO = 0
const ONE = 1
const currentDate = moment().format('YYYY-MM')
const today = _.toInteger(moment().format('D'))

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const orderList = _.get(state, ['activity', 'orderList', 'data'])
        const orderListLoading = _.get(state, ['activity', 'orderList', 'loading'])
        const visitList = _.get(state, ['activity', 'visitList', 'data'])
        const visitListLoading = _.get(state, ['activity', 'visitList', 'loading'])
        const reportList = _.get(state, ['activity', 'reportList', 'data'])
        const reportListLoading = _.get(state, ['activity', 'reportList', 'loading'])
        const reportImage = _.get(state, ['activity', 'reportImage', 'data'])
        const reportImageLoading = _.get(state, ['activity', 'reportImage', 'loading'])
        const returnList = _.get(state, ['activity', 'returnList', 'data'])
        const returnListLoading = _.get(state, ['activity', 'returnList', 'loading'])
        const paymentList = _.get(state, ['activity', 'paymentList', 'data'])
        const paymentListLoading = _.get(state, ['activity', 'paymentList', 'loading'])
        const deliveryList = _.get(state, ['activity', 'deliveryList', 'data'])
        const deliveryListLoading = _.get(state, ['activity', 'deliveryList', 'loading'])
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
            createForm,
            curDate
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const prevDay = _.get(props, ['location', 'query', DAY])
        const nextDay = _.get(nextProps, ['location', 'query', DAY])
        return (props.curDate !== nextProps.curDate) || (prevDay !== nextDay)
    }, ({dispatch, filter}) => {
        dispatch(activityOrderListFetchAction(filter))
        dispatch(activityVisitListFetchAction(filter))
        dispatch(activityReportListFetchAction(filter))
        dispatch(activityReturnListFetchAction(filter))
        dispatch(activityPaymentListFetchAction(filter))
        dispatch(activityDeliveryListFetchAction(filter))
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
        }
    })
)

const ActivityList = enhance((props) => {
    const {
        filter,
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
        detailLoading: orderItemLoading,
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

    const orderlistData = {
        data: _.get(orderList, 'results'),
        orderListLoading
    }

    const visitlistData = {
        data: _.get(visitList, 'results'),
        visitListLoading
    }

    const reportlistData = {
        data: _.get(reportList, 'results'),
        reportListLoading
    }

    const returnlistData = {
        data: _.get(returnList, 'results'),
        returnListLoading
    }

    const paymentlistData = {
        data: _.get(paymentList, 'results'),
        paymentListLoading
    }

    const deliverylistData = {
        data: _.get(deliveryList, 'results'),
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
