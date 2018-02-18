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
import getConfig from '../../helpers/getConfig'
import t from '../../helpers/translate'

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
            overflowY: 'auto',
            '& header': {
                '& > div': {
                    fontSize: '14px',
                    marginBottom: '10px'
                }
            },
            '& .printItem': {
                borderBottom: 'none'
            }
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
            '& div:last-child': {
                fontSize: '12px',
                color: '#777',
                fontWeight: '600',
                marginRight: '30px'
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
                pageBreakInside: 'avoid',
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
        }

    })
)

const TabTransferDeliveryPrint = enhance((props) => {
    const {classes, deliveryDetailsData, currentDeliverer, dataRange, orders, orderNo} = props
    let measurementCheck = true
    const loading = _.get(deliveryDetailsData, 'deliveryDetailLoading')
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const startDay = dateFormat(_.get(dataRange, 'startDate'))
    const endDay = dateFormat(_.get(dataRange, 'endDate'))
    const deliveryMan = _.get(deliveryDetailsData, ['data', 'deliveryMan'])
    const stock = _.get(currentDeliverer, ['stock', 'name'])
    const firstMeasure = _.get(deliveryDetailsData, ['data', 'products', '0', 'measurement', 'name'])
    const totalCalPrice = _.sumBy(_.get(deliveryDetailsData, ['data', 'products']), (item) => {
        return _.toNumber(item.totalPrice)
    })
    const totalAmount = _.sumBy(_.get(deliveryDetailsData, ['data', 'products']), 'count')
    const deliveryManName = deliveryMan
        ? _.get(deliveryMan, 'firstName') + ' ' + _.get(deliveryMan, 'secondName')
        : t('Не определен')
    if (loading) {
        return (
            <div className={classes.loader}>
                <Loader size={0.75}/>
            </div>
        )
    }
    return (
        <div className={classes.wrapper}>
            <div className="printItem">
                <header>
                    <div className={classes.title}>
                        <div><strong>{t('Доставщик')}:</strong> <span>{deliveryManName}</span></div>
                        <div><strong>{startDay} - {endDay}</strong></div>
                    </div>
                    <div><strong>{t('Склад')}:</strong> <span>{stock}</span></div>
                    <div><strong>{t('Показаны товары по следующим заказам')} ( <strong>{orderNo}</strong> ):</strong> <span>{orders}</span></div>
                </header>
                <div className={classes.products}>
                    <Row>
                        <Col xs={3}>{t('Наименование')}</Col>
                        <Col xs={1}>{t('Код товара')}</Col>
                        <Col xs={3}>{t('Тип товара')}</Col>
                        <Col xs={2}>{t('Кол-во')}</Col>
                        <Col xs={2}>{t('Сумма')}</Col>
                    </Row>
                    {_.map(_.get(deliveryDetailsData, ['data', 'products']), (item) => {
                        const productId = _.get(item, 'id')
                        const measurment = _.get(item, ['measurement', 'name'])
                        const name = _.get(item, 'name')
                        const code = _.get(item, 'code')
                        const totalPrice = numberFormat(_.get(item, 'totalPrice'), primaryCurrency)
                        const type = _.get(item, ['type', 'name'])
                        const amount = numberFormat(_.get(item, 'count'), measurment)
                        if (measurementCheck) {
                            measurementCheck = (firstMeasure === measurment)
                        }

                        return (
                            <Row key={productId}>
                                <Col xs={3}>{name}</Col>
                                <Col xs={1}>{code}</Col>
                                <Col xs={3}>{type}</Col>
                                <Col xs={2}>{amount}</Col>
                                <Col xs={2}>{totalPrice}</Col>
                            </Row>
                        )
                    })}
                    <Row>
                        <Col xs={3}><span style={{fontWeight: '600'}}>{t('Итого')} :</span></Col>
                        <Col xs={1}></Col>
                        <Col xs={3}></Col>
                        <Col xs={2}>{measurementCheck ? <span style={{fontWeight: '600'}}>{numberFormat(totalAmount, firstMeasure)}</span> : null}</Col>
                        <Col xs={2}><span style={{fontWeight: '600'}}>{numberFormat(totalCalPrice, primaryCurrency)}</span></Col>
                    </Row>
                </div>
            </div>
            <IconButton onTouchTap={deliveryDetailsData.handleCloseDeliveryPrintDialog} className="printCloseBtn">
                <Close color="#666"/>
            </IconButton>
        </div>
    )
})

export default TabTransferDeliveryPrint
