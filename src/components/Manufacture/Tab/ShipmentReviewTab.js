import React from 'react'
import _ from 'lodash'
import t from '../../../helpers/translate'
import Loader from '../../Loader'
import numberFormat from '../../../helpers/numberFormat'
import {Row, Col} from 'react-flexbox-grid'
const ShipmentReview = (props) => {
    const {data, loading, classes} = props

    const productsLoading = _.get(loading, 'productsLoading')
    const materialsLoading = _.get(loading, 'materialsLoading')

    const materials = _.map(_.filter(_.get(data, 'materials'), (item) => {
        return !_.get(item, 'isDefect')
    }), (item, index) => {
        const measurement = _.get(item, ['measurement', 'name'])
        const product = _.get(item, ['product', 'name'])
        const amount = _.get(item, 'totalAmount')
        return (
            <Row key={index} className={classes.productReview}>
                <Col xs={6}>{product}</Col>
                <Col xs={6}>{numberFormat(amount, measurement)}</Col>
            </Row>
        )
    })

    const products = _.map(_.get(data, 'groupedProducts'), (item, index) => {
        const productName = _.get(_.find(_.get(data, 'products'), (obj) => {
            return _.toInteger(obj.product.id) === _.toInteger(index)
        }), ['product', 'name'])
        const totalAmount = _.sumBy(item, (o) => _.toNumber(_.get(o, 'totalAmount')))
        const totalMeasurement = _.get(_.first(item), ['measurement', 'name'])
        const defected = _.filter(item, (o) => _.get(o, 'isDefect'))
        const defectedAmount = _.get(_.first(defected), 'totalAmount')

        return (
            <Row key={index} className={classes.productReview}>
                <Col xs={6}>{productName}</Col>
                <Col xs={2}>{numberFormat(totalAmount, totalMeasurement)}</Col>
                <Col xs={2}>{_.map(_.filter(item, (o) => {
                    return !_.get(o, 'isDefect')
                }), (o, i) => {
                    const measurement = _.get(o, ['measurement', 'name'])
                    const amount = _.get(o, 'totalAmount')
                    return (
                        <span key={index + '_' + i}>{numberFormat(amount, measurement)}</span>
                    )
                })}</Col>
                <Col xs={2}>
                    {_.isEmpty(defected) ? numberFormat('0', totalMeasurement) : numberFormat(defectedAmount, totalMeasurement)}
                </Col>
            </Row>
        )
    })

    return (
        <div className={classes.flexReview}>
            <div className={classes.productsBlock}>
                <Row className={classes.flexTitle}>
                    <Col xs={6}><h4>{t('Произведено')}</h4></Col>
                    <Col xs={2}><h4>{t('Всего')}</h4></Col>
                    <Col xs={2}><h4>{t('Ок')}</h4></Col>
                    <Col xs={2}><h4>{t('Брак')}</h4></Col>
                </Row>
                {productsLoading
                    ? <div className={classes.miniLoader}>
                        <Loader size={0.75}/>
                    </div>
                    : !_.isEmpty(products)
                        ? products
                        : <div className={classes.emptyQuery}>
                            <div>{t('Продукции еще не произведены')}</div>
                        </div>}
            </div>
            <div className={classes.productsBlock}>
                <Row className={classes.flexTitle}>
                    <Col xs={6}><h4>{t('Затраченное сырье')}</h4></Col>
                    <Col xs={2}><h4>{t('Кол-во')}</h4></Col>
                </Row>
                {materialsLoading
                    ? <div className={classes.miniLoader}>
                        <Loader size={0.75}/>
                    </div>
                    : !_.isEmpty(materials)
                        ? materials
                        : <div className={classes.emptyQuery}>
                            <div>{t('Не затрачено сырья')}</div>
                        </div>}
            </div>
        </div>
    )
}

export default ShipmentReview
