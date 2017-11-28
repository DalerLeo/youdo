import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import injectSheet from 'react-jss'
import _ from 'lodash'
import {compose} from 'recompose'
import Close from 'material-ui/svg-icons/navigation/close'
import Loader from '../Loader'
import numberFormat from '../../helpers/numberFormat'
import dateTimeFormat from '../../helpers/dateTimeFormat'
import getConfig from '../../helpers/getConfig'

const ONE = 1
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
            fontSize: '14px',
            width: '100%',
            height: '100%',
            zIndex: '999',
            overflowY: 'auto'
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
            '& div:last-child': {
                fontSize: '12px',
                color: '#777',
                fontWeight: '600',
                marginRight: '30px'
            }
        },
        info: {
            display: 'flex',
            justifyContent: 'space-between'
        },
        block: {
            display: 'flex',
            fontWeight: '600',
            '& ul': {
                marginLeft: '40px',
                '&:first-child': {
                    marginLeft: '0',
                    fontWeight: 'bold'
                },
                '& li': {
                    lineHeight: '25px',
                    minHeight: '25px'
                }
            }
        },
        products: {
            marginTop: '10px',
            width: '100%',
            display: 'table',
            borderCollapse: 'collapse',
            position: 'relative',
            '& .row': {
                height: '25px',
                border: '1px #555 solid',
                display: 'table-row',
                '&:first-child': {
                    fontWeight: 'bold'
                },
                '& > div': {
                    verticalAlign: 'middle',
                    display: 'table-cell',
                    border: '1px #555 solid'
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
            height: '35px !important',
            fontWeight: 'bold',
            padding: '10px 0 0',
            border: 'none !important',
            '& > div': {
                border: 'none!important'
            }

        },
        sign: {
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '20px',
            '& span': {
                borderBottom: 'solid 1px',
                width: '100px',
                marginLeft: '20px'
            }
        },
        kerasys: {
            fontWeight: '600',
            fontSize: '20px'
        }

    })
)

const OrderPrint = enhance((props) => {
    const {classes, printDialog, listPrintData} = props
    const loading = _.get(listPrintData, 'listPrintLoading')
    let formattedAmount = true
    if (loading) {
        return (
            <div className={classes.loader}>
                <div>
                    <Loader size={0.75}/>
                </div>
            </div>
        )
    }
    return (
        <div className={classes.wrapper}>
            {_.map(_.get(listPrintData, 'data'), (item) => {
                const ORDER = 1
                const id = _.get(item, 'id')
                const marketName = _.get(item, ['market', 'name']) || 'Не указано'
                const marketAddress = _.get(item, ['market', 'address']) || 'Не указан'
                const marketGuide = _.get(item, ['market', 'guide']) || 'Не указан'
                const marketPhone = _.get(item, ['market', 'phone']) || 'Не указан'
                const user = _.get(item, ['createdBy', 'firstName']) + ' ' + _.get(item, ['createdBy', 'secondName'])
                const createdDate = dateTimeFormat(_.get(item, 'createdDate'))
                const stock = _.get(item, ['stock', 'name'])
                const client = _.get(item, ['client', 'name'])
                const order = _.get(item, 'order')
                const comment = _.get(item, 'comment')
                const primaryCurrency = _.get(item, ['currency', 'name'])
                const totalPrice = numberFormat(_.get(item, 'totalPrice'), primaryCurrency)
                const type = _.toInteger(_.get(item, 'type'))
                const firstMeasure = _.get(item, ['returnedProducts', '0', 'product', 'measurement', 'name'])
                const totalAmount = _.sumBy(_.get(item, 'returnedProducts'), (o) => {
                    return _.toNumber(_.get(o, 'amount'))
                })

                return (
                    <div key={id} className="printItem">
                        <div className={classes.title}>
                            <span>Возврат № {id}</span>
                            {getConfig('COMPANY_NAME') ? <div className={classes.kerasys}>{getConfig('COMPANY_NAME')}</div> : null}
                            <div>Добавлено: {createdDate}</div>
                        </div>
                        <div className={classes.info}>
                            {(type === ORDER)
                            ? <div className={classes.block}>
                                <ul>
                                    <li>Название магазина:</li>
                                    <li>Адрес:</li>
                                    <li>Ориентир:</li>
                                    <li>Телефон:</li>
                                    <li>Добавил:</li>
                                </ul>
                                <ul>
                                    <li>{marketName}</li>
                                    <li>{marketAddress}</li>
                                    <li>{marketGuide}</li>
                                    <li>{marketPhone}</li>
                                    <li>{user}</li>
                                </ul>
                            </div>
                            : <div className={classes.block}>
                                    <ul>
                                        <li>Клиент:</li>
                                        <li>Добавил:</li>
                                    </ul>
                                    <ul>
                                        <li>{client}</li>
                                        <li>{user}</li>
                                    </ul>
                                </div>}
                            <div className={classes.block}>
                                <ul>
                                    <li>Склад:</li>
                                    {order && <li>Заказ:</li>}
                                    <li>Комментарий к возврату:</li>
                                </ul>
                                <ul>
                                    <li>{stock}</li>
                                    {order && <li>{order}</li>}
                                    <li>{comment}</li>
                                </ul>
                            </div>
                        </div>

                        <div className={classes.products}>
                            <Row>
                                <Col xs={1}>№</Col>
                                <Col xs={4}>Наименование</Col>
                                <Col xs={1}>Код</Col>
                                <Col xs={2}>Кол-во</Col>
                                <Col xs={2}>Цена ({primaryCurrency})</Col>
                                <Col xs={2}>Сумма ({primaryCurrency})</Col>
                            </Row>
                            {_.map(_.get(item, 'returnedProducts'), (product, index) => {
                                const productId = _.get(product, 'id')
                                const code = _.get(product, ['product', 'code'])
                                const name = _.get(product, ['product', 'name'])
                                const measurement = _.get(product, ['product', 'measurement', 'name'])
                                const price = _.toNumber(_.get(product, 'price'))
                                const amount = _.toNumber(_.get(product, 'amount'))
                                const totalProductPrice = numberFormat(price * amount)
                                if (formattedAmount) {
                                    formattedAmount = (firstMeasure === measurement)
                                }
                                return (
                                    <Row key={productId}>
                                        <Col xs={1}>{index + ONE}</Col>
                                        <Col xs={4}>{name}</Col>
                                        <Col xs={1}>{code}</Col>
                                        <Col xs={2}>{numberFormat(amount, measurement)}</Col>
                                        <Col xs={2}>{price}</Col>
                                        <Col xs={2}>{totalProductPrice}</Col>
                                    </Row>
                                )
                            })}
                            <Row className={classes.summary}>
                                <Col xs={1}></Col>
                                <Col xs={1}></Col>
                                <Col xs={4}></Col>
                                <Col xs={2}>{formattedAmount && 'Итого: ' + numberFormat(totalAmount, firstMeasure)}</Col>
                                <Col xs={2}></Col>
                                <Col xs={2}>Итого: {totalPrice}</Col>
                            </Row>
                        </div>
                        <div className={classes.sign}>Подпись клиента:<span> </span></div>

                    </div>
                )
            })}
            <IconButton onTouchTap={printDialog.handleClosePrintDialog} className="printCloseBtn">
                <Close color="#666"/>
            </IconButton>
        </div>
    )
})

export default OrderPrint
