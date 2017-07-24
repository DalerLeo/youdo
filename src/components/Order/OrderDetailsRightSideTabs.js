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
                width: '350px !important',
                paddingRight: 'calc(100% - 400px)',
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
        }
    })
)

const OrderDetailsRightSideTabs = enhance((props) => {
    const {classes,
        data,
        returnDataLoading,
        itemReturnDialog,
        tabData,
        returnData
    } = props

    const tab = _.get(tabData, 'tab')
    const id = _.get(data, 'id')
    const products = _.get(data, 'products')
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    let totalProductPrice = _.toNumber('0')
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
                                <Col xs={6}>Товар</Col>
                                <Col xs={2}>Количество</Col>
                                <Col xs={2}>Цена {primaryCurrency}</Col>
                                <Col xs={2}>Сумма {primaryCurrency}</Col>
                            </Row>

                            {_.map(products, (item, index) => {
                                const product = _.get(item, 'product')
                                const productName = _.get(product, 'name')
                                const price = _.get(item, 'price')
                                const productTotal = _.get(item, 'totalPrice')
                                const amount = _.get(item, 'amount')
                                const measurement = _.get(product, ['measurement', 'name'])
                                totalProductPrice += _.toNumber(productTotal)

                                return (
                                    <Row className="dottedList" key={index}>
                                        <Col xs={6}>{productName}</Col>
                                        <Col xs={2}>{numberFormat(amount)} {measurement}</Col>
                                        <Col xs={2}>{numberFormat(price)}</Col>
                                        <Col xs={2}>{numberFormat(productTotal)}</Col>
                                    </Row>
                                )
                            })}
                        </div>
                        <div className={classes.summary}>Общая сумма товаров: {numberFormat(totalProductPrice)} {primaryCurrency}</div>
                    </div>
                </Tab>

                <Tab label="Возврат" value={TAB.ORDER_TAB_RETURN}>
                    {!_.isEmpty(returnData)
                    ? <div className={classes.tabContent}>
                        {!returnDataLoading ? <div className={classes.tabWrapper}>
                            <Row className="dottedList">
                                <Col xs={2}>Код</Col>
                                <Col xs={6} style={{textAlign: 'left'}}>Причина возврата</Col>
                                <Col xs={2}>Дата возврата</Col>
                                <Col xs={2}>Сумма {primaryCurrency}</Col>
                            </Row>
                            {_.map(returnData, (item, index) => {
                                const returnId = _.get(item, 'id')
                                const comment = _.get(item, 'comment')
                                const dateReturn = moment(_.get(item, 'createdDate')).format('DD.MM.YYYY')
                                const totalSum = numberFormat(_.get(item, 'totalPrice'))
                                return (
                                    <Row className="dottedList" key={index}>
                                        <Col xs={2}><a
                                            onClick={() => { itemReturnDialog.handleOpenItemReturnDialog(returnId) }}
                                            className={classes.link}>
                                            {returnId}
                                        </a>
                                        </Col>
                                        <Col style={{textAlign: 'left'}} xs={6}>{comment}</Col>
                                        <Col xs={2}>{dateReturn}</Col>
                                        <Col xs={2}>{totalSum}</Col>
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

                <Tab label="Исполнение" value={TAB.ORDER_TAB_PERFORMANCE}>3</Tab>
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
    returnDataLoading: PropTypes.bool
}

export default OrderDetailsRightSideTabs
