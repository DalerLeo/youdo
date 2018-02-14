import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Loader from '../Loader'
import {Row, Col} from 'react-flexbox-grid'
import numberFormat from '../../helpers/numberFormat'
import dateFormat from '../../helpers/dateFormat'
import t from '../../helpers/translate'
import {Tabs, Tab} from 'material-ui/Tabs'
import * as TAB from '../../constants/orderTab'
import NotFound from '../Images/not-found.png'
import ToolTip from '../ToolTip'
import {Link} from 'react-router'
import * as ROUTES from '../../constants/routes'
import sprintf from 'sprintf'
import OrderReturnStatusIcons from '../Return/OrderReturnStatusIcons'

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
            width: 'calc(100% - 340px)',
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
                }
            }
        },
        returnAmount: {
            '& > div': {
                display: 'inline-block',
                background: '#ff9393',
                color: '#fff',
                fontWeight: '600',
                padding: '0 6px',
                margin: '0 3px',
                borderRadius: '2px'
            }
        },
        tabWrapper: {
            maxHeight: '400px',
            overflowY: 'auto',
            overflowX: 'hidden',
            paddingRight: '30px',
            paddingBottom: '20px',
            '& .row': {
                height: '50px',
                margin: '0 -30px',
                padding: '0 0 0 30px',
                '&:first-child:hover': {
                    background: 'inherit'
                },
                '&:hover': {
                    background: '#f2f5f8'
                }
            }
        },
        summary: {
            margin: '0 -30px 0',
            padding: '0 30px',
            fontWeight: '600',
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
            background: 'url(' + NotFound + ') no-repeat center 20px',
            backgroundSize: '185px',
            padding: '150px 0 30px',
            textAlign: 'center',
            color: '#999'
        },
        buttons: {
            display: 'flex',
            justifyContent: 'flex-end',
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
        returnDataLoading
    } = props

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

    const firstType = _.get(_.first(products), ['product', 'productType', 'id'])
    const firstMeasurement = _.get(_.first(products), ['product', 'measurement', 'name'])

    const totalProductPrice = _.sumBy(products, (item) => _.toNumber(_.get(item, 'totalPrice')))
    const wholeAmount = _.sumBy(products, (item) => _.toNumber(_.get(item, 'amount')))
    const wholeReturnAmount = _.sumBy(products, (item) => _.toNumber(_.get(item, 'returnAmount')))

    let commonMeasurement = false
    return (
        <div className={classes.rightSide}>
            <Tabs
                value={tab}
                className={classes.tab}
                inkBarStyle={{background: '#12aaeb', marginTop: '-2px', height: '2px'}}
                onChange={(value) => tabData.handleTabChange(value, id)}>
                <Tab
                    label={t('Список товаров')}
                    buttonStyle={tabStyle.button}
                    value={TAB.ORDER_TAB_PRODUCT_LIST}
                    disableTouchRipple={true}>
                    <div className={classes.tabContent}>
                        <div className={classes.tabWrapper}>
                            <Row className="dottedList">
                                <Col xs={4}>
                                    <span style={{marginRight: 10}}>№</span>
                                    <span>{t('Товар')}</span>
                                </Col>
                                <Col xs={2}>{t('Количество')}</Col>
                                <Col xs={2}>{t('Цена')} ({primaryCurrency})</Col>
                                <Col xs={2}>{t('Сумма')} ({primaryCurrency})</Col>
                                <Col xs={2}>{t('Скидка')} ({primaryCurrency})</Col>
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
                                const tooltipText = t('Количество возврата')
                                if (type === firstType) {
                                    commonMeasurement = true
                                }

                                return (
                                    <Row className="dottedList" key={index}>
                                        <Col xs={4}>
                                            <span style={{marginRight: 10, fontWeight: 600}}>{index + ONE}</span>
                                            <span>{productName} {stock ? <strong>({stock})</strong> : null}
                                            {isBonus && <strong className="greenFont"> ({t('бонус')})</strong>}</span>
                                        </Col>
                                        <Col xs={2}>
                                            {numberFormat(amount)}
                                            {(returnAmount > ZERO) &&
                                            <strong className={classes.returnAmount}>
                                                <ToolTip position="bottom" text={tooltipText}>-{returnAmount}</ToolTip>
                                            </strong>}
                                            {measurement}
                                        </Col>
                                        <Col xs={2}>{numberFormat(price)}</Col>
                                        <Col xs={2}>{numberFormat(productTotal)}</Col>
                                        <Col xs={2}>{isBonus ? '0' : discount}</Col>
                                    </Row>
                                )
                            })}
                        </div>
                        <Row className={classes.summary}>
                            <Col xs={4}>{commonMeasurement
                                ? <span>{t('Итого')}:</span>
                                : <span>{t('Общая сумма')} {primaryCurrency}</span>}
                            </Col>
                            {commonMeasurement
                                ? <Col xs={2}>
                                    {wholeAmount > ZERO && <span>{numberFormat(wholeAmount)}</span>}
                                    {wholeReturnAmount > ZERO && <span className={classes.returnAmount}><div>-{wholeReturnAmount}</div></span>}
                                    {firstMeasurement}
                                </Col>
                                : <Col xs={2}/>}
                            <Col xs={2}> </Col>
                            <Col xs={2}>{numberFormat(totalProductPrice)}</Col>
                            <Col xs={2}>{numberFormat(discountPrice)}</Col>
                        </Row>
                    </div>
                </Tab>

                <Tab
                    label={t('Возврат')}
                    buttonStyle={tabStyle.button}
                    value={TAB.ORDER_TAB_RETURN}
                    disableTouchRipple={true}>
                    {!_.isEmpty(returnData)
                        ? <div className={classes.tabContent}>
                            {!returnDataLoading ? <div className={classes.tabWrapper}>
                                    <Row className="dottedList">
                                        <Col xs={3} style={{textAlign: 'left'}}>{t('Причина возврата')}</Col>
                                        <Col xs={3} style={{textAlign: 'left'}}>{t('Склад')}</Col>
                                        <Col xs={2}>{t('Дата возврата')}</Col>
                                        <Col xs={3}>{t('Сумма')} ({primaryCurrency})</Col>
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
                                                        <OrderReturnStatusIcons status={status}/>
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
                            <div>{t('В данном заказе нет возвратов')}</div>
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
    cancelOrderReturnOpen: PropTypes.func
}

export default OrderDetailsRightSideTabs
