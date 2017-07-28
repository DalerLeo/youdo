import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import moment from 'moment'
import numberFormat from '../../helpers/numberFormat'
import getConfig from '../../helpers/getConfig'
import paymentTypeFormat from '../../helpers/paymentTypeFormat'
import CircularProgress from 'material-ui/CircularProgress'
import Paper from 'material-ui/Paper'
import NotFound from '../Images/not-found.png'
import ActivityCalendar from './ActivityCalendar'
import ActivityOrderDetails from '../Statistics/StatSaleDialog'

const enhance = compose(
    injectSheet({
        loader: {
            minWidth: '300px',
            height: '300px',
            marginRight: '30px',
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
            backgroundSize: '150px',
            padding: '185px 0 20px',
            width: '300px',
            margin: 'auto',
            textAlign: 'center',
            fontSize: '13px',
            color: '#999 !important',
            '& svg': {
                width: '50px !important',
                height: '50px !important',
                color: '#999 !important'
            }
        }
    })
)

const dateFormat = (date, defaultText) => {
    return (date) ? moment(date).locale('ru').format('DD MMM, YYYY - HH:mm') : defaultText
}

const ActivityWrapper = enhance((props) => {
    const currentCurrency = getConfig('PRIMARY_CURRENCY')
    const {
        orderlistData,
        classes,
        orderDetails,
        calendar,
        handleClickDay
    } = props
    const orderlistLoading = _.get(orderlistData, 'orderListLoading')
    const orderList = _.map(_.get(orderlistData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const clientName = _.get(item, ['client', 'name'])
        const createdDate = dateFormat(_.get(item, 'createdDate'))
        const orderPrice = numberFormat(_.get(item, 'totalPrice'), currentCurrency)
        const marketName = _.get(item, ['market', 'name'])
        const paymentType = paymentTypeFormat(_.get(item, 'paymentType'))

        return (
            <Paper key={id} zDepth={1} className={classes.tube} onClick={() => { orderDetails.handleOpenOrderDetails(id) }}>
                <div className={classes.tubeTitle}>
                    <span>{clientName}</span>
                    <div className={classes.statusGreen}> </div>
                </div>
                <div className={classes.tubeTime}>{createdDate}</div>
                <div className={classes.tubeInfo}>Сделка №{id} с магазина "{marketName}" на сумму {orderPrice}
                    ({paymentType})
                </div>
            </Paper>
        )
    })

    const tubeWrapper = (
        <div className={classes.tubeWrapper}>
            <div className={classes.horizontal}>
                {(!_.isEmpty(orderList)) ? (orderlistLoading
                    ? <div className={classes.loader}>
                        <CircularProgress size={40} thickness={4}/>
                    </div>
                    : <div className={classes.block}>
                        <div className={classes.blockTitle}>Визиты и сделки</div>
                        <div className={classes.blockItems}>
                            {orderList}
                        </div>
                    </div>)
                    : ''}
                <div className={classes.block}>
                    <div className={classes.blockTitle}>Отчеты</div>
                    <div className={classes.blockItems}>
                        <Paper zDepth={1} className={classes.tube}>
                            <div className={classes.tubeTitle}>
                                <span>Хабибулло Насруллоев</span>
                                <div className={classes.statusRed}></div>
                            </div>
                            <div className={classes.tubeTime}>10 Апр, 2017 - 09:10</div>
                            <div className={classes.tubeImg}>
                                <div><img src="http://pulson.ru/wp-content/uploads/2012/05/headache590.jpg" alt=""/>
                                </div>
                            </div>
                            <div className={classes.tubeInfo}>Отчет № 121312. Комментарий от
                                мерчендайзера
                            </div>
                        </Paper>
                        <Paper zDepth={1} className={classes.tube}>
                            <div className={classes.tubeTitle}>
                                <span>Хабибулло Насруллоев</span>
                                <div className={classes.statusRed}></div>
                            </div>
                            <div className={classes.tubeTime}>10 Апр, 2017 - 09:10</div>
                            <div className={classes.tubeImgDouble}>
                                <div><img src="http://pulson.ru/wp-content/uploads/2012/05/headache590.jpg" alt=""/>
                                </div>
                                <div><img src="http://pulson.ru/wp-content/uploads/2012/05/headache590.jpg" alt=""/>
                                </div>
                            </div>
                            <div className={classes.tubeInfo}>Отчет № 121312. Комментарий от
                                мерчендайзера
                            </div>
                        </Paper>
                    </div>
                </div>
                <div className={classes.block}>
                    <div className={classes.blockTitle}>Доставка</div>
                    <div className={classes.blockItems}>
                        <Paper zDepth={1} className={classes.tube}>
                            <div className={classes.tubeTitle}>
                                <span>Хабибулло Насруллоев</span>
                                <div className={classes.statusGreen}></div>
                            </div>
                            <div className={classes.tubeTime}>10 Апр, 2017 - 09:10</div>
                            <div className={classes.tubeInfo}>Заключение сделки (Z-025852) с название
                                магазина или наименование клиента.
                            </div>
                        </Paper>
                        <Paper zDepth={1} className={classes.tube}>
                            <div className={classes.tubeTitle}>
                                <span>Хабибулло Насруллоев</span>
                                <div className={classes.statusGreen}></div>
                            </div>
                            <div className={classes.tubeTime}>10 Апр, 2017 - 09:10</div>
                            <div className={classes.tubeInfo}>Заключение сделки (Z-025852) с название
                                магазина или наименование клиента.
                            </div>
                        </Paper>
                    </div>
                </div>
                <div className={classes.block}>
                    <div className={classes.blockTitle}>Сбор денег</div>
                    <div className={classes.blockItems}>
                        <Paper zDepth={1} className={classes.tube}>
                            <div className={classes.tubeTitle}>
                                <span>Хабибулло Насруллоев</span>
                                <div className={classes.statusGreen}></div>
                            </div>
                            <div className={classes.tubeTime}>10 Апр, 2017 - 09:10</div>
                            <div className={classes.tubeInfo}>Заключение сделки (Z-025852) с название
                                магазина или наименование клиента.
                            </div>
                        </Paper>
                        <Paper zDepth={1} className={classes.tube}>
                            <div className={classes.tubeTitle}>
                                <span>Хабибулло Насруллоев</span>
                                <div className={classes.statusGreen}></div>
                            </div>
                            <div className={classes.tubeTime}>10 Апр, 2017 - 09:10</div>
                            <div className={classes.tubeInfo}>Заключение сделки (Z-025852) с название
                                магазина или наименование клиента.
                            </div>
                        </Paper>
                    </div>
                </div>
                <div className={classes.block}>
                    <div className={classes.blockTitle}>Визиты и сделки</div>
                    <div className={classes.blockItems}>
                        <Paper zDepth={1} className={classes.tube}>
                            <div className={classes.tubeTitle}>
                                <span>Хабибулло Насруллоев</span>
                                <div className={classes.statusGreen}></div>
                            </div>
                            <div className={classes.tubeTime}>10 Апр, 2017 - 09:10</div>
                            <div className={classes.tubeInfo}>Заключение сделки (Z-025852) с название
                                магазина или наименование клиента.
                            </div>
                        </Paper>
                        <Paper zDepth={1} className={classes.tube}>
                            <div className={classes.tubeTitle}>
                                <span>Хабибулло Насруллоев</span>
                                <div className={classes.statusGreen}></div>
                            </div>
                            <div className={classes.tubeTime}>10 Апр, 2017 - 09:10</div>
                            <div className={classes.tubeInfo}>Заключение сделки (Z-025852) с название
                                магазина или наименование клиента.
                            </div>
                        </Paper>
                    </div>
                </div>
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
                {tubeWrapper}
            </div>

            <ActivityOrderDetails
                open={orderDetails.openOrderDetails}
                loading={orderDetails.orderItemLoading}
                onClose={orderDetails.handleCloseOrderDetails}
                detailData={orderDetails}
            />
        </Container>
    )
})

ActivityWrapper.PropTypes = {
    orderlistData: PropTypes.object,
    orderDetails: PropTypes.shape({
        openOrderDetails: PropTypes.bool.isRequired,
        orderItemLoading: PropTypes.bool.isRequired,
        handleOpenOrderDetails: PropTypes.func.isRequired,
        handleCloseOrderDetails: PropTypes.func.isRequired,
        data: PropTypes.object
    }).isRequired
}

export default ActivityWrapper
