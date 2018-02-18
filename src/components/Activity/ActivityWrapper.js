import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import LinearProgress from '../LinearProgress'
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
import t from '../../helpers/translate'
import {
    ACTIVITY_VISIT,
    ACTIVITY_ORDER,
    ACTIVITY_REPORT,
    ACTIVITY_ORDER_RETURN,
    ACTIVITY_PAYMENT,
    ACTIVITY_DELIVERY
} from '../../constants/backendConstants'

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
            height: 'calc(100vh - 145px)'
        },
        linearProgress: {
            position: 'absolute',
            margin: '0 -30px',
            left: '0',
            right: '0',
            '& > div': {
                background: 'transparent',
                height: '3px'
            }
        },
        horizontal: {
            display: 'flex',
            position: 'relative',
            height: 'calc(100% + 26px)',
            margin: '0 -30px',
            padding: '0 30px',
            overflowX: 'auto',
            overflowY: 'hidden',
            zIndex: '2',
            '& > div': {
                minWidth: '330px',
                '& > div:last-child': {
                    position: 'relative',
                    animation: 'tubeFadeIn 500ms ease'
                }
            }
        },
        block: {
            paddingRight: '20px'
        },
        tubeLoaderWrapper: {
            paddingTop: '54px'
        },
        tubeLoader: {
            background: '#fefefe',
            borderRadius: '2px',
            width: '300px',
            height: '112px',
            marginBottom: '10px',
            position: 'relative',
            overflow: 'hidden',
            animation: 'unset !important',
            '& > div': {
                animation: 'tubeAnimation 1.25s ease infinite',
                background: 'linear-gradient(to right, #ffffff 0%, #f2f5f8 50%, #ffffff 100%)',
                opacity: '0.25',
                transition: 'all 300ms ease',
                position: 'absolute',
                filter: 'blur(3px)',
                left: '0',
                top: '0',
                bottom: '0',
                width: '60px',
                fallbacks: [
                    {background: '-moz-linear-gradient(left, #ffffff 0%, #f2f5f8 50%, #ffffff 100%)'},
                    {background: '-webkit-linear-gradient(left, #ffffff 0%, #f2f5f8 50%, #ffffff 100%)'}
                ]
            }
        },
        '@keyframes tubeAnimation': {
            '0%': {left: '0', opacity: '0.25'},
            '50%': {opacity: '1'},
            '100%': {left: '100%', opacity: '0.25'}
        },
        '@keyframes tubeFadeIn': {
            '0%': {top: '50px', opacity: '0'},
            '100%': {top: '0', opacity: '1'}
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
        handleClickDay,
        loading
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

    const emptyQuery = (orderListEmpty && visitListEmpty && reportListEmpty && returnListEmpty && paymentListEmpty && deliveryListEmpty)
    const tubeLoader = null

    const tubeWrapper = (
        <div className={classes.tubeWrapper}>
            {loading && <div className={classes.linearProgress}><LinearProgress/></div>}
            <div className={classes.horizontal}>
                {orderlistLoading && loading
                    ? tubeLoader
                    : <ActivityOrder
                        handleLoadMoreItems={_.get(orderlistData, 'handleLoadMoreItems')}
                        summary={_.get(summaryData, ['data', ACTIVITY_ORDER])}
                        summaryLoading={_.get(summaryData, 'summaryListLoading')}
                        orderlistData={orderlistData}
                        orderDetails={orderDetails}/>}
                {visitlistLoading && loading
                    ? tubeLoader
                    : <ActivityVisit
                        handleLoadMoreItems={_.get(visitlistData, 'handleLoadMoreItems')}
                        summary={_.get(summaryData, ['data', ACTIVITY_VISIT])}
                        summaryLoading={_.get(summaryData, 'summaryListLoading')}
                        visitlistData={visitlistData}/>}
                {reportlistLoading && loading
                    ? tubeLoader
                    : <ActivityReport
                        handleLoadMoreItems={_.get(reportlistData, 'handleLoadMoreItems')}
                        summary={_.get(summaryData, ['data', ACTIVITY_REPORT])}
                        summaryLoading={_.get(summaryData, 'summaryListLoading')}
                        reportImageData={reportImageData}
                        reportlistData={reportlistData}/>}
                {returnlistLoading && loading
                    ? tubeLoader
                    : <ActivityReturn
                        handleLoadMoreItems={_.get(returnlistData, 'handleLoadMoreItems')}
                        summary={_.get(summaryData, ['data', ACTIVITY_ORDER_RETURN])}
                        summaryLoading={_.get(summaryData, 'summaryListLoading')}
                        returnListData={returnlistData}/>}
                {paymentlistLoading && loading
                    ? tubeLoader
                    : <ActivityPayment
                        handleLoadMoreItems={_.get(paymentlistData, 'handleLoadMoreItems')}
                        summary={_.get(summaryData, ['data', ACTIVITY_PAYMENT])}
                        summaryLoading={_.get(summaryData, 'summaryListLoading')}
                        paymentlistData={paymentlistData}/>}
                {deliverylistLoading && loading
                    ? tubeLoader
                    : <ActivityDelivery
                        handleLoadMoreItems={_.get(deliverylistData, 'handleLoadMoreItems')}
                        summary={_.get(summaryData, ['data', ACTIVITY_DELIVERY])}
                        summaryLoading={_.get(summaryData, 'summaryListLoading')}
                        deliverylistData={deliverylistData}/>}
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
                {(emptyQuery && !(loading)
                    ? <div className={classes.emptyQuery}>
                        <div>{t('По вашему запросу ничего не найдено')}...</div>
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
