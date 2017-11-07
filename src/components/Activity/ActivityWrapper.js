import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import Loader from '../Loader'
import Paper from 'material-ui/Paper'
import NotFound from '../Images/not-found.png'
import ActivityCalendar from './ActivityCalendar'
import ActivityOrderDetails from '../Statistics/Sales/SalesDialog'
import ReportImage from '../Product/ProductShowPhotoDialog'
import ActivityOrder from './ActivityOrder'
import ActivityVisit from './ActivityVisit'
import ActivityReport from './ActivityReport'
import ActivityReturn from './ActivityReturn'
import ActivityPayment from './ActivityPayment'
import ActivityDelivery from './ActivityDelivery'

const enhance = compose(
    injectSheet({
        loader: {
            minWidth: '100%',
            height: 'calc(100% - 75px)',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        wrapper: {
            height: 'calc(100% - 32px)',
            margin: '0 -28px'
        },
        tubeWrapper: {
            padding: '0 30px 25px',
            marginTop: '10px',
            height: 'calc(100vh - 145px)'
        },
        horizontal: {
            display: 'flex',
            position: 'relative',
            height: 'calc(100% + 16px)',
            margin: '0 -30px',
            padding: '0 30px',
            overflowX: 'auto',
            zIndex: '2'
        },
        block: {
            paddingRight: '20px'
        },
        horizontalScroll: {
            position: 'fixed',
            height: '25px',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: '0',
            transform: 'rotate(180deg)'
        },
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center center',
            backgroundSize: '200px',
            padding: '230px 0 50px',
            width: '300px',
            margin: 'auto',
            textAlign: 'center',
            fontSize: '13px',
            color: '#999 !important'
        }
    })
)

const VISIT = 1
const ORDER = 2
const REPORT = 3
const ORDER_RETURN = 4
const PAYMENT = 5
const DELIVERY = 6

const ActivityWrapper = enhance((props) => {
    const {
        summaryData,
        orderlistData,
        classes,
        orderDetails,
        visitlistData,
        reportlistData,
        reportImageData,
        returnlistData,
        paymentlistData,
        deliverylistData,
        calendar,
        handleClickDay
    } = props

    const orderlistLoading = _.get(orderlistData, 'orderListLoading')
    const visitlistLoading = _.get(visitlistData, 'visitListLoading')
    const reportlistLoading = _.get(reportlistData, 'reportListLoading')
    const returnlistLoading = _.get(returnlistData, 'returnListLoading')
    const paymentlistLoading = _.get(paymentlistData, 'paymentListLoading')
    const deliverylistLoading = _.get(deliverylistData, 'deliveryListLoading')

    const orderListEmpty = _.isEmpty(_.get(orderlistData, 'data'))
    const visitListEmpty = _.isEmpty(_.get(visitlistData, 'data'))
    const reportListEmpty = _.isEmpty(_.get(reportlistData, 'data'))
    const returnListEmpty = _.isEmpty(_.get(returnlistData, 'data'))
    const paymentListEmpty = _.isEmpty(_.get(paymentlistData, 'data'))
    const deliveryListEmpty = _.isEmpty(_.get(deliverylistData, 'data'))

    const megaLoading = (orderlistLoading && visitlistLoading && reportlistLoading && returnlistLoading && paymentlistLoading && deliverylistLoading)
    const emptyQuery = (orderListEmpty && visitListEmpty && reportListEmpty && returnListEmpty && paymentListEmpty && deliveryListEmpty)

    const tubeWrapper = (
        <div className={classes.tubeWrapper}>
            <div className={classes.horizontal}>
                <ActivityOrder
                    handleLoadMoreItems={_.get(orderlistData, 'handleLoadMoreItems')}
                    summary={_.get(summaryData, ['data', ORDER])}
                    summaryLoading={_.get(summaryData, 'summaryListLoading')}
                    orderlistData={orderlistData}
                    orderDetails={orderDetails}/>
                <ActivityVisit
                    handleLoadMoreItems={_.get(visitlistData, 'handleLoadMoreItems')}
                    summary={_.get(summaryData, ['data', VISIT])}
                    summaryLoading={_.get(summaryData, 'summaryListLoading')}
                    visitlistData={visitlistData}/>
                <ActivityReport
                    handleLoadMoreItems={_.get(reportlistData, 'handleLoadMoreItems')}
                    summary={_.get(summaryData, ['data', REPORT])}
                    summaryLoading={_.get(summaryData, 'summaryListLoading')}
                    reportImageData={reportImageData}
                    reportlistData={reportlistData}/>
                <ActivityReturn
                    handleLoadMoreItems={_.get(returnlistData, 'handleLoadMoreItems')}
                    summary={_.get(summaryData, ['data', ORDER_RETURN])}
                    summaryLoading={_.get(summaryData, 'summaryListLoading')}
                    returnListData={returnlistData}/>
                <ActivityPayment
                    handleLoadMoreItems={_.get(paymentlistData, 'handleLoadMoreItems')}
                    summary={_.get(summaryData, ['data', PAYMENT])}
                    summaryLoading={_.get(summaryData, 'summaryListLoading')}
                    paymentlistData={paymentlistData}/>
                <ActivityDelivery
                    handleLoadMoreItems={_.get(deliverylistData, 'handleLoadMoreItems')}
                    summary={_.get(summaryData, ['data', DELIVERY])}
                    summaryLoading={_.get(summaryData, 'summaryListLoading')}
                    deliverylistData={deliverylistData}/>
            </div>
            <Paper className={classes.horizontalScroll} zDepth={1}> </Paper>
        </div>
    )

    return (
        <Container>
            <SubMenu url={ROUTES.ACTIVITY_LIST_URL}/>

            <div className={classes.wrapper}>
                <ActivityCalendar
                    calendar={calendar}
                    handleClickDay={handleClickDay}/>
                {megaLoading
                    ? <div className={classes.loader}>
                        <Loader size={0.75}/>
                    </div>
                    : (emptyQuery && !(orderlistLoading || visitlistLoading || reportlistLoading || returnlistLoading || paymentlistLoading || deliverylistLoading)
                        ? <div className={classes.emptyQuery}>
                            <div>По вашему запросу ничего не найдено...</div>
                        </div>
                        : tubeWrapper)}
            </div>

            <ActivityOrderDetails
                open={orderDetails.openOrderDetails}
                loading={orderDetails.orderItemLoading}
                onClose={orderDetails.handleCloseOrderDetails}
                detailData={orderDetails}
            />
            <ReportImage
                open={reportImageData.openReportImage}
                loading={reportImageData.reportImageLoading}
                onClose={reportImageData.handleCloseReportImage}
                detailData={reportImageData.imageData}
            />
        </Container>
    )
})

ActivityWrapper.PropTypes = {
    orderlistData: PropTypes.object,
    visitlistData: PropTypes.object,
    reportlistData: PropTypes.object,
    returnlistData: PropTypes.object,
    paymentlistData: PropTypes.object,
    deliverylistData: PropTypes.object,
    orderDetails: PropTypes.shape({
        openOrderDetails: PropTypes.bool.isRequired,
        orderItemLoading: PropTypes.bool.isRequired,
        handleOpenOrderDetails: PropTypes.func.isRequired,
        handleCloseOrderDetails: PropTypes.func.isRequired,
        data: PropTypes.object
    }).isRequired,
    reportImageData: PropTypes.shape({
        imageData: PropTypes.object.isRequired,
        openReportImage: PropTypes.bool.isRequired,
        handleOpenReportImage: PropTypes.func.isRequired,
        handleCloseReportImage: PropTypes.func.isRequired
    }).isRequired
}

export default ActivityWrapper
