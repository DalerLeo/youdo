import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Row, Col} from 'react-flexbox-grid'
import numberFormat from '../../helpers/numberFormat'
import NotFound from '../Images/not-found.png'

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

const OrderStatDetailsRightSide = enhance((props) => {
    const {classes, data} = props

    const products = _.get(data, 'products')
    const primaryCurrency = _.get(data, ['currency', 'name'])
    const totalProductPrice = _.sumBy(products, (item) => {
        return _.toNumber(_.get(item, 'totalPrice'))
    })
    const totalDiscount = _.sumBy(products, (item) => {
        return _.toNumber(_.get(item, 'discountPrice'))
    })
    return (
        <div className={classes.rightSide}>
            <div className={classes.tabContent}>
                <div className={classes.tabWrapper}>
                    <Row className="dottedList">
                        <Col xs={4}>Товар</Col>
                        <Col xs={2}>Количество</Col>
                        <Col xs={2}>Цена {primaryCurrency}</Col>
                        <Col xs={2}>Сумма {primaryCurrency}</Col>
                        <Col xs={2}>Скидка ({primaryCurrency})</Col>

                    </Row>

                    {_.map(products, (item, index) => {
                        const product = _.get(item, 'product')
                        const productName = _.get(product, 'name')
                        const price = _.get(item, 'price')
                        const productTotal = _.get(item, 'totalPrice')
                        const amount = _.get(item, 'amount')
                        const measurement = _.get(product, ['measurement', 'name'])
                        const discount = _.get(item, 'discountPrice')
                        const isBonus = _.get(item, 'isBonus')

                        return (
                            <Row className="dottedList" key={index}>
                                <Col xs={4}>{productName} {isBonus && <strong className="greenFont">(бонус)</strong>}</Col>
                                <Col xs={2}>{numberFormat(amount)} {measurement}</Col>
                                <Col xs={2}>{numberFormat(price)}</Col>
                                <Col xs={2}>{numberFormat(productTotal)}</Col>
                                <Col xs={2}>{numberFormat(discount)}</Col>
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
        </div>
    )
})

OrderStatDetailsRightSide.propTypes = {
    data: PropTypes.any.isRequired

}

export default OrderStatDetailsRightSide
