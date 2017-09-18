import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import CircularProgress from 'material-ui/CircularProgress'
import Paper from 'material-ui/Paper'
import NotFound from '../Images/not-found.png'
import ActivityCalendar from './ActivityCalendar'
import ActivityOrderDetails from '../Statistics/Sales/StatSaleDialog'
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

const ActivityWrapper = enhance((props) => {
    const {
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
                    orderlistData={orderlistData}
                    orderDetails={orderDetails}/>
                <ActivityVisit
                    visitlistData={visitlistData}/>
                <ActivityReport
                    reportImageData={reportImageData}
                    reportlistData={reportlistData}/>
                <ActivityReturn
                    returnListData={returnlistData}/>
                <ActivityPayment
                    paymentlistData={paymentlistData}/>
                <ActivityDelivery
                    deliverylistData={deliverylistData}/>
            </div>
            <Paper className={classes.horizontalScroll}>
            </Paper>
        </div>
    )

    return (
        <Container>
            <SubMenu url={ROUTES.ACTIVITY_LIST_URL}/>

            <div className={classes.wrapper}>
                <ActivityCalendar
                    calendar={calendar}
                    handleClickDay={handleClickDay}
                />
                {megaLoading
                    ? <div className={classes.loader}>
                        <CircularProgress size={40} thickness={4}/>
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
