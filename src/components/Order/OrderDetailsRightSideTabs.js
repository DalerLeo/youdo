import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import CircularProgress from 'material-ui/CircularProgress'
import {Row, Col} from 'react-flexbox-grid'
import moment from 'moment'
import numberFormat from '../../helpers/numberFormat'
import {Tabs, Tab} from 'material-ui/Tabs'
import * as TAB from '../../constants/orderTab'
import NotFound from '../Images/not-found.png'
import getConfig from '../../helpers/getConfig'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import InProcess from 'material-ui/svg-icons/action/cached'
import IconButton from 'material-ui/IconButton'
import DoneIcon from 'material-ui/svg-icons/action/done-all'
import Canceled from 'material-ui/svg-icons/notification/do-not-disturb-alt'

import Tooltip from '../ToolTip'

const PENDING = 0
const IN_PROGRESS = 1
const COMPLETED = 2
const CANCELLED = 3

const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            background: '#fff',
            height: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        rightSide: {
            width: 'calc(100% - 320px)',
            padding: '0 30px 20px'
        },
        tabContent: {
            '& .row:first-child': {
                fontWeight: '600'
            },
            '& .row': {
                '& > div': {
                    textAlign: 'right'
                },
                '& > div:first-child': {
                    textAlign: 'left'
                },
                '& .redFont > div': {
                    display: 'inline-block',
                    background: '#ff9393',
                    color: '#fff',
                    fontWeight: '600',
                    padding: '0 6px',
                    borderRadius: '2px'
                }
            }
        },
        tabWrapper: {
            maxHeight: '441px',
            overflowY: 'auto',
            overflowX: 'hidden',
            paddingRight: '30px'
        },
        summary: {
            fontWeight: '600',
            marginTop: '20px',
            paddingRight: '30px',
            textTransform: 'uppercase',
            textAlign: 'right'
        },
        tab: {
            marginBottom: '0',
            width: '100%',
            '& > div': {
                paddingRight: 'calc(100% - 250px)',
                background: 'transparent !important'
            },
            '& > div:first-child': {
                borderBottom: '1px #f2f5f8 solid'
            },
            '& > div:last-child': {
                width: '100% !important',
                padding: '0'
            },
            '& > div:nth-child(2) > div': {
                marginTop: '0px !important',
                marginBottom: '-1px',
                backgroundColor: '#12aaeb !important',
                height: '1px !important'
            },
            '& button': {
                color: '#333 !important',
                backgroundColor: '#fefefe !important'
            },
            '& button > span:first-line': {
                color: '#a6dff7'
            },
            '& button div div': {
                textTransform: 'initial'
            }
        },
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center center',
            backgroundSize: '215px',
            padding: '215px 0 0',
            textAlign: 'center',
            color: '#999'
        },
        buttons: {
            display: 'flex',
            justifyContent: 'space-around'
        }
    })
)

const OrderDetailsRightSideTabs = enhance((props) => {
    const {classes,
        data,
        returnDataLoading,
        itemReturnDialog,
        tabData,
        returnData,
        cancelOrderReturnOpen
    } = props

    const iconStyle = {
        icon: {
            color: '#666',
            width: 20,
            height: 20
        },
        button: {
            width: 30,
            height: 30,
            padding: 0,
            zIndex: 0
        }
    }
    const ZERO = 0
    const tab = _.get(tabData, 'tab')
    const id = _.get(data, 'id')
    const products = _.get(data, 'products')
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    let totalProductPrice = _.toNumber('0')
    let totalDiscount = _.toNumber('0')
    return (
        <div className={classes.rightSide}>
            <Tabs
                value={tab}
                className={classes.tab}
                onChange={(value) => tabData.handleTabChange(value, id)}>
                <Tab label="Список товаров" value={TAB.ORDER_TAB_PRODUCT_LIST}>
                    <div className={classes.tabContent}>
                        <div className={classes.tabWrapper}>
                            <Row className="dottedList">
                                <Col xs={4}>Товар</Col>
                                <Col xs={2}>Количество</Col>
                                <Col xs={2}>Цена ({primaryCurrency})</Col>
                                <Col xs={2}>Сумма ({primaryCurrency})</Col>
                                <Col xs={2}>Скидка ({primaryCurrency})</Col>
                            </Row>

                            {_.map(products, (item, index) => {
                                const product = _.get(item, 'product')
                                const productName = _.get(product, 'name')
                                const price = _.get(item, 'price')
                                const productTotal = _.get(item, 'totalPrice')
                                const amount = _.get(item, 'amount')
                                const returnAmount = _.toNumber(_.get(item, 'returnAmount'))
                                const isBonus = _.get(item, 'isBonus')
                                const measurement = _.get(product, ['measurement', 'name'])
                                const discount = numberFormat(_.toInteger(_.get(item, 'discountPrice')) * _.toInteger(amount))
                                const tooltipText = 'Количество возврата'
                                totalProductPrice += _.toNumber(productTotal)
                                totalDiscount += _.toNumber(discount)

                                return (
                                    <Row className="dottedList" key={index}>
                                        <Col xs={4}>{productName} {isBonus && <strong className="greenFont">(бонус)</strong>}</Col>
                                        <Col xs={2}>
                                            {numberFormat(amount)}
                                            {(returnAmount > ZERO) &&
                                                <span className="redFont">
                                                    <Tooltip position="bottom" text={tooltipText}>-{returnAmount}</Tooltip>
                                                </span>} {measurement}
                                        </Col>
                                        <Col xs={2}>{numberFormat(price)}</Col>
                                        <Col xs={2}>{numberFormat(productTotal)}</Col>
                                        <Col xs={2}>{discount}</Col>
                                    </Row>
                                )
                            })}
                        </div>
                        <Row className={classes.summary}>
                            <Col xs={4}>ОБЩАЯ СУММА ({primaryCurrency}):</Col>
                            <Col xs={4}> </Col>
                            <Col xs={2}>{numberFormat(totalProductPrice)}</Col>
                            <Col xs={2}>{numberFormat(totalDiscount)}</Col>
                        </Row>
                    </div>
                </Tab>

                <Tab label="Возврат" value={TAB.ORDER_TAB_RETURN}>
                    {!_.isEmpty(returnData)
                    ? <div className={classes.tabContent}>
                        {!returnDataLoading ? <div className={classes.tabWrapper}>
                            <Row className="dottedList">
                                <Col xs={1}>Код</Col>
                                <Col xs={6} style={{textAlign: 'left'}}>Причина возврата</Col>
                                <Col xs={2}>Дата возврата</Col>
                                <Col xs={2}>Сумма {primaryCurrency}</Col>

                            </Row>
                            {_.map(returnData, (item, index) => {
                                const returnId = _.get(item, 'id')
                                const comment = _.get(item, 'comment')
                                const status = _.toNumber(_.get(item, 'status'))
                                const dateReturn = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY')
                                const totalSum = numberFormat(_.get(item, 'totalPrice'))
                                return (
                                    <Row className="dottedList" key={index}>
                                        <Col xs={1}><a
                                            onClick={() => { itemReturnDialog.handleOpenItemReturnDialog(returnId) }}
                                            className={classes.link}>
                                            {returnId}
                                        </a>
                                        </Col>
                                        <Col style={{textAlign: 'left'}} xs={6}>{comment}</Col>
                                        <Col xs={2}>{dateReturn}</Col>
                                        <Col xs={2}>{totalSum}</Col>
                                        <Col xs={1}>
                                            <div className={classes.buttons}>
                                                {(status === PENDING || status === IN_PROGRESS)
                                                    ? <div className={classes.buttons}>
                                                        <Tooltip position="bottom" text="Ожидает">
                                                            <IconButton
                                                                disableTouchRipple={true}
                                                                iconStyle={iconStyle.icon}
                                                                style={iconStyle.button}
                                                                touch={true}>
                                                                <InProcess color="#f0ad4e"/>
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip position="bottom" text="Отменить">
                                                            <IconButton
                                                                disableTouchRipple={true}
                                                                iconStyle={iconStyle.icon}
                                                                style={iconStyle.button}
                                                                touch={true}
                                                                onClick={() => { cancelOrderReturnOpen(returnId) }} >
                                                                <DeleteIcon/>
                                                            </IconButton>
                                                        </Tooltip>
                                                        </div>
                                                        : (status === COMPLETED)
                                                            ? <Tooltip position="bottom" text="Завершен">
                                                                <IconButton
                                                                    disableTouchRipple={true}
                                                                    iconStyle={iconStyle.icon}
                                                                    style={iconStyle.button}
                                                                    touch={true}>
                                                                    <DoneIcon color="#81c784"/>
                                                                </IconButton>
                                                              </Tooltip>
                                                        : (status === CANCELLED)
                                                            ? <Tooltip position="bottom" text="Отменен">
                                                                <IconButton
                                                                    disableTouchRipple={true}
                                                                    iconStyle={iconStyle.icon}
                                                                    style={iconStyle.button}
                                                                    touch={true}>
                                                                    <Canceled color='#e57373'/>
                                                                </IconButton>
                                                              </Tooltip> : null}
                                            </div>
                                        </Col>

                                    </Row>
                                )
                            })}
                        </div>
                            : <div className={classes.loader} style={{height: '265px', marginTop: '1px'}}>
                                <div>
                                    <CircularProgress size={40} thickness={4}/>
                                </div>
                            </div>
                        }
                    </div>
                        : <div className={classes.emptyQuery}>
                            <div>В данном заказе нет возвратов</div>
                        </div>}
                </Tab>
            </Tabs>
        </div>
    )
})

OrderDetailsRightSideTabs.propTypes = {
    returnListData: PropTypes.object,
    tabData: PropTypes.shape({
        tab: PropTypes.string.isRequired,
        handleTabChange: PropTypes.func.isRequired
    }).isRequired,
    data: PropTypes.object.isRequired,
    returnData: PropTypes.array,
    itemReturnDialog: PropTypes.shape({
        returnDialogLoading: PropTypes.bool.isRequired,
        openOrderItemReturnDialog: PropTypes.bool.isRequired,
        handleOpenItemReturnDialog: PropTypes.func.isRequired,
        handleCloseItemReturnDialog: PropTypes.func.isRequired
    }).isRequired,
    returnDataLoading: PropTypes.bool,
    cancelOrderReturnOpen: PropTypes.func.isRequired
}

export default OrderDetailsRightSideTabs
