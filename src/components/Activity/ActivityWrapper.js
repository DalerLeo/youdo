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
        padding: {
            padding: '20px 30px'
        },
        addButton: {
            '& button': {
                backgroundColor: '#275482 !important'
            }
        },
        addButtonWrapper: {
            position: 'absolute',
            top: '10px',
            right: '0',
            marginBottom: '0px'
        },
        tubeWrapper: {
            padding: '0 30px 25px',
            marginTop: '10px',
            height: 'calc(100% - 85px)'
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
        blockTitle: {
            padding: '15px 0',
            fontWeight: 'bold'
        },
        blockItems: {
            overflowY: 'auto',
            height: 'calc(100% - 80px)',
            paddingRight: '10px'
        },
        tube: {
            padding: '20px 15px',
            marginBottom: '10px',
            width: '300px',
            cursor: 'pointer',
            transition: 'box-shadow 125ms ease-out !important',
            '&:hover': {
                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 10px, rgba(0, 0, 0, 0.23) 0px 3px 10px !important'
            }
        },
        tubeTitle: {
            fontWeight: '600',
            display: 'flex',
            justifyContent: 'space-between'
        },
        tubeTime: {
            fontSize: '10px',
            color: '#999'
        },
        status: {
            borderRadius: '2px',
            height: '4px',
            width: '30px'
        },
        statusGreen: {
            extend: 'status',
            background: '#92ce95'
        },
        statusRed: {
            extend: 'status',
            background: '#e57373'
        },
        tubeImg: {
            marginTop: '10px',
            '& img': {
                width: '100%',
                display: 'block',
                cursor: 'pointer'
            }
        },
        tubeImgDouble: {
            extend: 'tubeImg',
            display: 'flex',
            justifyContent: 'space-between',
            '& > div': {
                width: 'calc(50% - 4px)',
                position: 'relative',
                '&:after': {
                    content: '""',
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    padding: '2px 8px',
                    color: '#fff',
                    background: '#333',
                    opacity: '0.8',
                    fontSize: '11px',
                    fontWeight: '600'
                },
                '&:first-child:after': {
                    content: '"до"'
                },
                '&:last-child:after': {
                    content: '"после"'
                }
            }
        },
        tubeInfo: {
            marginTop: '10px',
            lineHeight: '15px'
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

    let megaLoading = false
    if (orderlistLoading &&
        visitlistLoading &&
        reportlistLoading &&
        returnlistLoading &&
        paymentlistLoading &&
        deliverylistLoading) {
        megaLoading = true
    }
    let emptyQuery = false
    if (orderListEmpty && visitListEmpty && reportListEmpty && returnListEmpty && paymentListEmpty && deliveryListEmpty) {
        emptyQuery = true
    }

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
                    : (!emptyQuery
                        ? tubeWrapper
                        : <div className={classes.emptyQuery}>
                            <div>По вашему запросу ничего не найдено...</div>
                        </div>)}
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
