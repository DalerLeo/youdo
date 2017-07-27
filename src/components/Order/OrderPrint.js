import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import injectSheet from 'react-jss'
import _ from 'lodash'
import {compose} from 'recompose'
import Close from 'material-ui/svg-icons/navigation/close'
import CircularProgress from 'material-ui/CircularProgress'
import numberFormat from '../../helpers/numberFormat'
import dateFormat from '../../helpers/dateFormat'
import paymentTypeFormat from '../../helpers/paymentTypeFormat'
import dealTypeFormat from '../../helpers/dealTypeFormat'
import getConfig from '../../helpers/getConfig'

const enhance = compose(
    injectSheet({
        loader: {
            width: '100vw',
            height: '100vh',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        wrapper: {
            background: '#fff',
            width: '100%',
            height: '100%',
            zIndex: '999',
            overflowY: 'auto',
            boxSizing: 'border-box'
        },
        closeBtn: {
            position: 'absolute !important',
            top: '5px',
            right: '5px',
            opacity: '0'
        },
        item: {
            width: '100%',
            marginBottom: '30px',
            borderBottom: 'dashed 1px',
            '&:last-child': {
                borderBottom: 'none',
                marginBottom: '0'

            }
        },
        title: {
            display: 'flex',
            justifyContent: 'space-between',
            '& span': {
                fontWeight: 'bold',
                fontSize: '18px !important',
                marginBottom: '10px'
            },
            '& div': {
                fontSize: '11px',
                color: '#999',
                marginRight: '30px'
            }
        },
        info: {
            display: 'flex',
            justifyContent: 'space-between'
        },
        block: {
            display: 'flex',
            '& ul': {
                marginLeft: '40px',
                '&:first-child': {
                    marginLeft: '0',
                    fontWeight: '600'
                },
                '& li': {
                    lineHeight: '25px'
                }
            }
        },
        products: {
            marginTop: '10px',
            '& .row': {
                padding: '10px 0',
                borderBottom: '1px #efefef solid',
                '&:first-child': {
                    fontWeight: '600'
                },
                '& > div:last-child': {
                    textAlign: 'right'
                },
                '&:after': {
                    left: '0.5rem',
                    right: '0.5rem'
                }
            }
        },
        summary: {
            fontWeight: 'bold',
            padding: '10px 0',
            textAlign: 'right'
        }
    })
)

const OrderPrint = enhance((props) => {
    const {classes, printDialog, listPrintData} = props
    const loading = _.get(listPrintData, 'listPrintLoading')
    if (loading) {
        return (
            <div className={classes.loader}>
                <div>
                    <CircularProgress size={40} thickness={4}/>
                </div>
            </div>
        )
    }
    return (
        <div className={classes.wrapper}>
            <IconButton onTouchTap={printDialog.handleClosePrintDialog} className="printCloseBtn">
                <Close color="#666"/>
            </IconButton>
            {_.map(_.get(listPrintData, 'data'), (item) => {
                const id = _.get(item, 'id')
                const marketName = _.get(item, ['market', 'name'])
                const marketAddress = _.get(item, ['market', 'address'])
                const marketGuide = _.get(item, ['market', 'guide'])
                const marketPhone = _.get(item, ['market', 'phone'])
                const agent = _.get(item, ['user', 'firstName']) + ' ' + _.get(item, ['user', 'secondName'])
                const totalPrice = _.get(item, ['totalPrice'])
                const paymentDate = dateFormat(_.get(item, 'paymentDate'))
                const createdDate = dateFormat(_.get(item, 'createdDate'))
                const dateDelivery = dateFormat(_.get(item, 'dateDelivery'))
                const paymentType = paymentTypeFormat(_.get(item, 'paymentType'))
                const dealType = dealTypeFormat(_.get(item, 'dealType'))
                const currentCurrency = getConfig('PRIMARY_CURRENCY')

                return (
                    <div key={id} className="printItem">
                        <div className={classes.title}>
                            <span>Заказ № {id}</span>
                            <div>Добавлено: {createdDate}</div>
                        </div>
                        <div className={classes.info}>
                            <div className={classes.block}>
                                <ul>
                                    <li>Название магазина:</li>
                                    <li>Адрес:</li>
                                    <li>Ориентир:</li>
                                    <li>Телефон:</li>
                                    <li>Агент:</li>
                                </ul>
                                <ul>
                                    <li>{marketName}</li>
                                    <li>{marketAddress}</li>
                                    <li>{marketGuide}</li>
                                    <li>{marketPhone}</li>
                                    <li>{agent}</li>
                                </ul>
                            </div>
                            <div className={classes.block}>
                                <ul>
                                    <li>Тип сделки:</li>
                                    <li>Дата ожидаемой оплаты:</li>
                                    <li>Дата доставки:</li>
                                    <li>Тип оплаты:</li>
                                </ul>
                                <ul>
                                    <li>{dealType}</li>
                                    <li>{paymentDate}</li>
                                    <li>{dateDelivery}</li>
                                    <li>{paymentType}</li>
                                </ul>
                            </div>
                        </div>

                        <div className={classes.products}>
                            <Row>
                                <Col xs={1}>№</Col>
                                <Col xs={5}>Наименование</Col>
                                <Col xs={2}>Цена ({currentCurrency})</Col>
                                <Col xs={2}>Кол-во</Col>
                                <Col xs={2}>Сумма ({currentCurrency})</Col>
                            </Row>
                            {_.map(_.get(item, 'products'), (product) => {
                                const totalProductPrice = numberFormat(_.get(product, 'totalPrice'))
                                const productId = _.get(product, 'id')
                                const measurment = _.get(product, ['product', 'measurement', 'name'])
                                const name = _.get(product, ['product', 'name'])
                                const price = numberFormat(_.get(product, 'price'))
                                const amount = numberFormat(_.get(product, 'amount'), measurment)
                                return (
                                    <Row key={productId}>
                                        <Col xs={1}>{productId}</Col>
                                        <Col xs={5}>{name}</Col>
                                        <Col xs={2}>{price}</Col>
                                        <Col xs={2}>{amount}</Col>
                                        <Col xs={2}>{totalProductPrice}</Col>
                                    </Row>
                                )
                            })}
                            <div className={classes.summary}>Итого: {numberFormat(totalPrice)}</div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
})

export default OrderPrint
