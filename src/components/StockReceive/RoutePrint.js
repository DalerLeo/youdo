import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import injectSheet from 'react-jss'
import _ from 'lodash'
import {compose} from 'recompose'
import Close from 'material-ui/svg-icons/navigation/close'
import Loader from '../Loader'
import numberFormat from '../../helpers/numberFormat'
import dateFormat from '../../helpers/dateFormat'
import paymentTypeFormat from '../../helpers/paymentTypeFormat'

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
            padding: '50px',
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
                    lineHeight: '25px'
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

const RoutePrint = enhance((props) => {
    const {classes, printRouteDialog, listPrintData, currentDeliverer, deliveryManName, beginDate, endDate} = props
    const loading = _.get(listPrintData, 'listPrintLoading')
    if (loading) {
        return (
            <div className={classes.loader}>
                <Loader size={0.75}/>
            </div>
        )
    }
    return (
        <div className={classes.wrapper}>
            <div className={classes.info}>
                <div className={classes.block}>
                    <ul>
                        <li>Агент: </li>
                        <li>Склад: </li>
                    </ul>
                    <ul>
                        <li>{deliveryManName}</li>
                        <li>{currentDeliverer.stock.name}</li>
                    </ul>
                </div>
                <div className={classes.block}>
                    <ul>
                        <li>c {beginDate} по {endDate}</li>
                    </ul>
                </div>
            </div>
            <div className={classes.products}>
                <Row className="printItem">
                    <Col xs={1}>№</Col>
                    <Col xs={2}>Агент</Col>
                    <Col xs={2}>Магазин</Col>
                    <Col xs={2}>Адрес</Col>
                    <Col xs={1}>Сумма (USD)</Col>
                    <Col xs={2}>Тип оплаты</Col>
                    <Col xs={2}>Дата ожидаемой оплаты</Col>
                </Row>
                {_.map(_.get(listPrintData, 'data'), (item) => {
                    const totalPrice = numberFormat(_.get(item, 'totalPrice'))
                    const id = _.get(item, 'id')
                    const market = _.get(item, ['market', 'name'])
                    const address = _.get(item, ['market', 'address'])
                    const agent = _.get(item, ['user', 'firstName']) + ' ' + _.get(item, ['user', 'secondName'])
                    const paymentType = numberFormat(_.get(item, 'paymentType'))
                    const date = dateFormat(_.get(item, 'paymentDate'))

                    return (
                        <Row key={id} className="printItem">
                            <Col xs={1}>{id}</Col>
                            <Col xs={2}>{agent}</Col>
                            <Col xs={2}>{market}</Col>
                            <Col xs={2}>{address}</Col>
                            <Col xs={1}>{totalPrice}</Col>
                            <Col xs={2}>{paymentTypeFormat(paymentType)}</Col>
                            <Col xs={2}>{date}</Col>
                        </Row>
                    )
                })}
            </div>
            <IconButton onTouchTap={printRouteDialog.handleClosePrintRouteDialog} className="printCloseBtn">
                <Close color="#666"/>
            </IconButton>
        </div>
    )
})

export default RoutePrint
