import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Loader from '../Loader'
import {Row, Col} from 'react-flexbox-grid'
import numberFormat from '../../helpers/numberFormat'
import dateFormat from '../../helpers/dateFormat'
import {Tabs, Tab} from 'material-ui/Tabs'
import * as TAB from '../../constants/orderTab'
import NotFound from '../Images/not-found.png'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import InProcess from 'material-ui/svg-icons/action/cached'
import IconButton from 'material-ui/IconButton'
import DoneIcon from 'material-ui/svg-icons/action/done-all'
import Canceled from 'material-ui/svg-icons/notification/do-not-disturb-alt'
import ToolTip from '../ToolTip'
import {Link} from 'react-router'
import * as ROUTES from '../../constants/routes'
import sprintf from 'sprintf'

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
                    textAlign: 'right',
                    '&:last-child': {
                        zIndex: '4'
                    }
                },
                '& > div:first-child': {
                    textAlign: 'left',
                    display: 'flex'
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
            maxHeight: '400px',
            overflowY: 'auto',
            overflowX: 'hidden',
            paddingRight: '30px',
            '& .row': {
                height: '50px',
                margin: '0 -30px',
                padding: '0 30px',
                '&:first-child:hover': {
                    background: 'inherit'
                },
                '&:hover': {
                    background: '#f2f5f8'
                }
            }
        },
        summary: {
            fontWeight: '600',
            marginTop: '20px',
            paddingRight: '30px',
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
            justifyContent: 'space-around',
            zIndex: '2'
        },
        link: {
            position: 'absolute',
            top: '0',
            bottom: '0',
            right: '0',
            left: '0',
            cursor: 'pointer'
        }
    })
)

const OrderDetailsRightSideTabs = enhance((props) => {
    const {
        classes,
        data,
        tabData,
        returnData,
        returnDataLoading,
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
    const tabStyle = {
        button: {
            textTransform: 'none'
        }
    }
    const ZERO = 0
    const ONE = 1
    const tab = _.get(tabData, 'tab')
    const id = _.get(data, 'id')
    const products = _.get(data, 'products')
    const discountPrice = _.get(data, 'discountPrice')
    const primaryCurrency = _.get(data, ['currency', 'name'])
    const firstType = _.get(products, ['0', 'product', 'productType', 'id'])
    const firstMeasurement = _.get(products, ['0', 'product', 'measurement', 'name'])
    const totalProductPrice = _.sumBy(products, (item) => {
        return _.toNumber(_.get(item, 'totalPrice'))
    })
    const wholeAmount = _.sumBy(products, (o) => {
        return _.toNumber(_.get(o, 'amount'))
    })
    let commonMeasurement = false
    return (
        <div className={classes.rightSide}>
            <Tabs
                value={tab}
                className={classes.tab}
                inkBarStyle={{background: '#12aaeb', marginTop: '-2px', height: '2px'}}
                onChange={(value) => tabData.handleTabChange(value, id)}>
                <Tab
                    label="Список товаров"
                    buttonStyle={tabStyle.button}
                    value={TAB.ORDER_TAB_PRODUCT_LIST}
                    disableTouchRipple={true}>
                    <div className={classes.tabContent}>
                        <div className={classes.tabWrapper}>
                            <Row className="dottedList">
                                <Col xs={4}>
                                    <span style={{marginRight: 10}}>№</span>
                                    <span>Товар</span>
                                </Col>
                                <Col xs={2}>Количество</Col>
                                <Col xs={2}>Цена ({primaryCurrency})</Col>
                                <Col xs={2}>Сумма ({primaryCurrency})</Col>
                                <Col xs={2}>Скидка ({primaryCurrency})</Col>
                            </Row>

                            {_.map(products, (item, index) => {
                                const product = _.get(item, 'product')
                                const productName = _.get(product, 'name')
                                const type = _.get(product, ['productType', 'id'])
                                const stock = _.get(item, ['stock', 'name'])
                                const price = _.get(item, 'price')
                                const productTotal = _.get(item, 'totalPrice')
                                const amount = _.toNumber(_.get(item, 'amount'))
                                const returnAmount = _.toNumber(_.get(item, 'returnAmount'))
                                const isBonus = _.get(item, 'isBonus')
                                const measurement = _.get(product, ['measurement', 'name'])
                                const discount = numberFormat(_.toNumber(_.get(item, 'discountPrice')) * _.toNumber(amount))
                                const tooltipText = 'Количество возврата'
                                if (type === firstType) {
                                    commonMeasurement = true
                                }

                                return (
                                    <Row className="dottedList" key={index}>
                                        <Col xs={4}>
                                            <span style={{marginRight: 10, fontWeight: 600}}>{index + ONE}</span>
                                            <span>{productName} {stock ? <strong>({stock})</strong> : null}
                                            {isBonus && <strong className="greenFont"> (бонус)</strong>}</span>
                                        </Col>
                                        <Col xs={2}>
                                            {numberFormat(amount)}&nbsp;
                                            {(returnAmount > ZERO) &&
                                            <span className="redFont">
                                                <ToolTip position="bottom" text={tooltipText}>-{returnAmount}</ToolTip>
                                            </span>} {measurement}
                                        </Col>
                                        <Col xs={2}>{numberFormat(price)}</Col>
                                        <Col xs={2}>{numberFormat(productTotal)}</Col>
                                        <Col xs={2}>{isBonus ? '0' : discount}</Col>
                                    </Row>
                                )
                            })}
                        </div>
                        <Row className={classes.summary}>
                            <Col xs={4}>{commonMeasurement ? <span>Итого:</span> : <span>Общая сумма {primaryCurrency}</span>}</Col>
                            {commonMeasurement
                                ? <Col xs={2}>{(wholeAmount > ZERO) && <span>{numberFormat(wholeAmount, firstMeasurement)}</span>}</Col>
                                : <Col xs={2}/>}
                            <Col xs={2}> </Col>
                            <Col xs={2}>{numberFormat(totalProductPrice)}</Col>
                            <Col xs={2}>{numberFormat(discountPrice)}</Col>
                        </Row>
                    </div>
                </Tab>

                <Tab
                    label="Возврат"
                    buttonStyle={tabStyle.button}
                    value={TAB.ORDER_TAB_RETURN}
                    disableTouchRipple={true}>
                    {!_.isEmpty(returnData)
                        ? <div className={classes.tabContent}>
                            {!returnDataLoading ? <div className={classes.tabWrapper}>
                                <Row className="dottedList">
                                    <Col xs={3} style={{textAlign: 'left'}}>Причина возврата</Col>
                                    <Col xs={3} style={{textAlign: 'left'}}>Склад</Col>
                                    <Col xs={2}>Дата возврата</Col>
                                    <Col xs={3}>Сумма ({primaryCurrency})</Col>
                                </Row>
                                {_.map(returnData, (item, index) => {
                                    const returnId = _.get(item, 'id')
                                    const comment = _.get(item, 'comment')
                                    const stock = _.get(item, ['stock', 'name'])
                                    const status = _.toNumber(_.get(item, 'status'))
                                    const dateReturn = dateFormat(_.get(item, 'createdDate'))
                                    const totalSum = numberFormat(_.get(item, 'totalPrice'))
                                    return (
                                        <Row className="dottedList" key={index}>
                                            <Link target={'_blank'}
                                                to={{pathname: sprintf(ROUTES.RETURN_ITEM_PATH, returnId), query: {search: returnId, exclude: false}}}
                                                className={classes.link}/>
                                            <Col style={{textAlign: 'left'}} xs={3}>{comment}</Col>
                                            <Col style={{textAlign: 'left'}} xs={3}>{stock}</Col>
                                            <Col xs={2}>{dateReturn}</Col>
                                            <Col xs={3}>{totalSum}</Col>
                                            <Col xs={1}>
                                                <div className={classes.buttons}>
                                                    {(status === PENDING || status === IN_PROGRESS)
                                                        ? <div className={classes.buttons}>
                                                            <ToolTip position="bottom" text="Ожидает">
                                                                <IconButton
                                                                    disableTouchRipple={true}
                                                                    iconStyle={iconStyle.icon}
                                                                    style={iconStyle.button}
                                                                    touch={true}>
                                                                    <InProcess color="#f0ad4e"/>
                                                                </IconButton>
                                                            </ToolTip>
                                                            <ToolTip position="bottom" text="Отменить">
                                                                <IconButton
                                                                    disableTouchRipple={true}
                                                                    iconStyle={iconStyle.icon}
                                                                    style={iconStyle.button}
                                                                    touch={true}
                                                                    onClick={() => { cancelOrderReturnOpen(returnId) }}>
                                                                    <DeleteIcon/>
                                                                </IconButton>
                                                            </ToolTip>
                                                        </div>
                                                        : (status === COMPLETED)
                                                            ? <ToolTip position="bottom" text="Завершен">
                                                                <IconButton
                                                                    disableTouchRipple={true}
                                                                    iconStyle={iconStyle.icon}
                                                                    style={iconStyle.button}
                                                                    touch={true}>
                                                                    <DoneIcon color="#81c784"/>
                                                                </IconButton>
                                                            </ToolTip>
                                                            : (status === CANCELLED)
                                                                ? <ToolTip position="bottom" text="Отменен">
                                                                    <IconButton
                                                                        disableTouchRipple={true}
                                                                        iconStyle={iconStyle.icon}
                                                                        style={iconStyle.button}
                                                                        touch={true}>
                                                                        <Canceled color='#e57373'/>
                                                                    </IconButton>
                                                                </ToolTip> : null}
                                                </div>
                                            </Col>
                                        </Row>
                                    )
                                })}
                            </div>
                                : <div className={classes.loader} style={{height: '265px', marginTop: '1px'}}>
                                    <div>
                                        <Loader size={0.75}/>
                                    </div>
                                </div>
                            }
                        </div>
                        : (!returnDataLoading && <div className={classes.emptyQuery}>
                            <div>В данном заказе нет возвратов</div>
                        </div>)}
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
    returnDataLoading: PropTypes.bool,
    cancelOrderReturnOpen: PropTypes.func.isRequired
}

export default OrderDetailsRightSideTabs
