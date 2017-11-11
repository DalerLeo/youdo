import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import CircularProgress from 'material-ui/CircularProgress'
import {Row, Col} from 'react-flexbox-grid'
import numberFormat from '../../helpers/numberFormat'
import {Tabs, Tab} from 'material-ui/Tabs'
import * as TAB from '../../constants/supplyTab'
import NotFound from '../Images/not-found.png'
import getConfig from '../../helpers/getConfig'
import CloseIcon from 'material-ui/svg-icons/action/highlight-off'
import dateFormat from '../../helpers/dateFormat'
import IconButton from 'material-ui/IconButton'

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
            maxHeight: '400px',
            overflowY: 'auto',
            overflowX: 'hidden',
            paddingRight: '30px',
            '& .row': {
                height: '50px',
                padding: '0'
            }
        },
        summary: {
            fontWeight: '600',
            marginTop: '20px',
            paddingRight: '30px',
            textAlign: 'right',
            whiteSpace: 'nowrap'
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
                height: '2px !important'
            },
            '& button': {
                textTransform: 'none !important'
            }
        },
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center center',
            backgroundSize: '200px',
            padding: '200px 0 0',
            textAlign: 'center',
            color: '#999'
        },
        buttons: {
            display: 'flex',
            justifyContent: 'space-around'
        },
        expenseSum: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end'
        }
    })
)

const iconStyle = {
    button: {
        width: 44,
        height: 44,
        padding: 12
    },
    icon: {
        color: '#666',
        width: 22,
        height: 22
    }
}

const SupplyDetailsRightSideTabs = enhance((props) => {
    const {
        classes,
        data,
        tabData,
        returnDataLoading,
        expensesListData,
        paidData,
        confirmExpenseDialog
    } = props

    const ZERO = 0
    const tab = _.get(tabData, 'tab')
    const id = _.get(data, 'id')
    const products = _.get(data, 'products')
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const currency = _.get(data, ['currency', 'name']) || 'N/A'

    const wholeAmount = _.sumBy(products, (o) => {
        return _.toNumber(_.get(o, 'amount'))
    })
    const wholePostedAmount = _.sumBy(products, (o) => {
        return _.toNumber(_.get(o, 'postedAmount'))
    })
    const wholeDefectAmount = _.sumBy(products, (o) => {
        return _.toNumber(_.get(o, 'defectAmount'))
    })
    const wholeCost = _.sumBy(products, (o) => {
        return _.toNumber(_.get(o, 'cost'))
    })
    const wholeNotAccepted = wholeAmount - wholePostedAmount - wholeDefectAmount
    const wholeMeasurement = _.get(_.first(products), ['product', 'measurement', 'name'])
    return (
        <div className={classes.rightSide}>
            <Tabs
                value={tab}
                className={classes.tab}
                onChange={(value) => tabData.handleTabChange(value, id)}>
                <Tab label="Список товаров" value={TAB.SUPPLY_TAB_PRODUCT_LIST} disableTouchRipple={true}>
                    <div className={classes.tabContent}>
                        <div className={classes.tabWrapper}>
                            <Row className="dottedList">
                                <Col xs={4}>Товар</Col>
                                <Col xs={1}>Кол-во</Col>
                                <Col xs={1}>Принято</Col>
                                <Col xs={1}>Брак</Col>
                                <Col xs={1}>Недостача</Col>
                                <Col xs={2} style={{textAlign: 'right'}}>Стоимость</Col>
                                <Col xs={2} style={{textAlign: 'right'}}>Итог</Col>
                            </Row>

                            {_.map(products, (item) => {
                                const product = _.get(item, 'product')
                                const productId = _.get(product, 'id')
                                const productName = _.get(product, 'name')
                                const cost = _.toNumber(_.get(item, 'cost'))
                                const amount = _.toNumber(_.get(item, 'amount'))
                                const itemPrice = cost / amount
                                const postedAmount = _.get(item, 'postedAmount')
                                const measurement = _.get(product, ['measurement', 'name'])
                                const defectAmount = _.toNumber(_.get(item, 'defectAmount'))
                                const notAccepted = postedAmount + defectAmount < amount ? numberFormat(amount - defectAmount - postedAmount, measurement) : numberFormat(ZERO, measurement)
                                return (
                                    <Row className="dataInfo dottedList" key={productId}>
                                        <Col xs={4}>{productName}</Col>
                                        <Col xs={1}>{numberFormat(amount, measurement)}</Col>
                                        <Col xs={1}>{numberFormat(postedAmount, measurement)}</Col>
                                        <Col xs={1}>
                                            {(defectAmount > ZERO) ? <span
                                                    className={classes.defect}>{numberFormat(defectAmount, measurement)}</span>
                                                : <span>{numberFormat(defectAmount, measurement)}</span>}
                                        </Col>
                                        <Col xs={1}>{notAccepted}</Col>
                                        <Col xs={2}>
                                            <div style={{textAlign: 'right'}}>{numberFormat(itemPrice, currency)}</div>
                                        </Col>
                                        <Col xs={2}>
                                            <div style={{textAlign: 'right'}}>{numberFormat(cost, currency)}</div>
                                        </Col>
                                    </Row>
                                )
                            })}
                        </div>
                        <Row className={classes.summary}>
                            <Col xs={4}>Итого:</Col>
                            <Col xs={1}>{numberFormat(wholeAmount, wholeMeasurement)}</Col>
                            <Col xs={1}>{numberFormat(wholePostedAmount, wholeMeasurement)}</Col>
                            <Col xs={1}>{numberFormat(wholeDefectAmount, wholeMeasurement)}</Col>
                            <Col xs={1}>{numberFormat(wholeNotAccepted, wholeMeasurement)}</Col>
                            <Col xs={2}></Col>
                            <Col xs={2}>
                                <div style={{textAlign: 'right'}}>{wholeCost} {currency}</div>
                            </Col>
                        </Row>
                    </div>
                </Tab>

                <Tab label="Доп. расходы" value={TAB.SUPPLY_TAB_EXPENSES} disableTouchRipple={true}>
                    {!_.isEmpty(_.get(expensesListData, 'data'))
                        ? <div className={classes.tabContent}>
                            {!_.get(expensesListData, 'supplyExpenseListLoading') ? <div className={classes.tabWrapper}>
                                    <Row className="dottedList">
                                        <Col xs={2}>Описание</Col>
                                        <Col xs={3} style={{textAlign: 'left'}}>Продукт</Col>
                                        <Col xs={2} style={{textAlign: 'left'}}>Тип оплаты</Col>
                                        <Col xs={2} style={{textAlign: 'right'}}>Сумма</Col>
                                        <Col xs={2} style={{textAlign: 'right'}}>Оплачено</Col>
                                    </Row>
                                    {
                                        _.map(_.get(expensesListData, 'data'), (item) => {
                                            const expId = _.get(item, 'id')
                                            const expComment = _.get(item, 'comment')
                                            const paymentType = _.get(item, 'paymentType') === 'cash' ? 'Наличный' : 'Банковский счет'
                                            const expCurrency = _.get(item, ['currency', 'name'])
                                            const expAmount = numberFormat(_.get(item, 'amount'), expCurrency)
                                            const expPaid = _.get(item, 'totalPaid') ? numberFormat(Math.abs(_.toNumber(_.get(item, 'totalPaid'))), expCurrency) : numberFormat(ZERO, expCurrency)
                                            const expProduct = _.get(_.find(products, {'id': _.get(item, 'supplyProduct')}), ['product', 'name'])
                                            return (
                                                <Row key={expId} className="dottedList">
                                                    <Col xs={2}>{expComment}</Col>
                                                    <Col xs={3} style={{textAlign: 'left'}}>{expProduct || 'Общий расход'}</Col>
                                                    <Col xs={2} style={{textAlign: 'left'}}>{paymentType}</Col>
                                                    <Col xs={2} style={{textAlign: 'right'}}>{expAmount}</Col>
                                                    <Col xs={2} style={{textAlign: 'right'}}>{expPaid}</Col>
                                                    <Col xs={1} className={classes.expenseSum}>
                                                        <IconButton
                                                            disableTouchRipple={true}
                                                            style={iconStyle.button}
                                                            iconStyle={iconStyle.icon}
                                                            onTouchTap={() => {
                                                                confirmExpenseDialog.handleOpenConfirmExpenseDialog(expId)
                                                            }}>
                                                            <CloseIcon/>
                                                        </IconButton>
                                                    </Col>
                                                </Row>
                                            )
                                        })
                                    }
                                </div>
                                : <div className={classes.loader} style={{height: '265px', marginTop: '1px'}}>
                                    <div>
                                        <CircularProgress size={40} thickness={4}/>
                                    </div>
                                </div>
                            }
                        </div>
                        : (!returnDataLoading && <div className={classes.emptyQuery}>
                            <div>В данной поставке нет дополнительных раходов</div>
                        </div>)}
                </Tab>
                <Tab label="Оплаты" value={TAB.SUPPLY_TAB_PAID} disableTouchRipple={true}>
                    {!_.isEmpty(_.get(paidData, 'data'))
                        ? <div className={classes.tabContent}>
                            {!_.get(paidData, 'loading') ? <div className={classes.tabWrapper}>
                                    <Row className="dottedList">
                                        <Col xs={1}>№</Col>
                                        <Col xs={3}>Касса</Col>
                                        <Col xs={3}>Описание</Col>
                                        <Col xs={2}>Дата</Col>
                                        <Col xs={3}>Сумма</Col>
                                    </Row>
                                    {_.map(_.get(paidData, 'data'), (item) => {
                                        const zero = 0
                                        const paidId = _.get(item, 'id')
                                        const comment = _.get(item, 'comment') || 'N/A'
                                        const type = _.get(item, 'amount') || 'N/A'
                                        const cashbox = _.get(item, ['cashbox', 'name'])
                                        const amount = _.toNumber(_.get(item, 'amount'))
                                        const internal = _.toNumber(_.get(item, 'internalAmount'))
                                        const date = dateFormat(_.get(item, 'date'), true)
                                        const currentCurrency = _.get(_.find(_.get(paidData, 'data'), {'id': cashbox}), ['currency', 'name'])
                                        const rate = _.toInteger(amount / internal)
                                        return (
                                            <Row key={paidId} className="dottedList">
                                                <Col xs={1}>{paidId}</Col>
                                                <Col xs={3}>{cashbox}</Col>
                                                <Col xs={3}>{comment}</Col>
                                                <Col xs={2}>{date}</Col>
                                                <Col xs={3} style={{
                                                    textAlign: 'right'
                                                }}
                                                     className={type >= zero ? classes.green : classes.red}>
                                                    {numberFormat(amount, currentCurrency)}
                                                    {(currentCurrency !== primaryCurrency) &&
                                                    <div>{numberFormat(internal, primaryCurrency)}
                                                        {internal !== ZERO &&
                                                        <span style={{
                                                            fontSize: 11,
                                                            color: '#333',
                                                            fontWeight: 600
                                                        }}> ({rate})</span>}</div>}
                                                </Col>
                                            </Row>
                                        )
                                    })
                                    }
                                </div>
                                : <div className={classes.loader} style={{height: '265px', marginTop: '1px'}}>
                                    <div>
                                        <CircularProgress size={40} thickness={4}/>
                                    </div>
                                </div>
                            }
                        </div>
                        : (!returnDataLoading && <div className={classes.emptyQuery}>
                            <div>В данной поставке не произведено оплат</div>
                        </div>)}
                </Tab>
            </Tabs>
        </div>
    )
})

SupplyDetailsRightSideTabs.propTypes = {
    returnListData: PropTypes.object,
    tabData: PropTypes.shape({
        tab: PropTypes.string.isRequired,
        handleTabChange: PropTypes.func.isRequired
    }).isRequired,
    data: PropTypes.object.isRequired,
    returnData: PropTypes.array,
    returnDataLoading: PropTypes.bool
}

export default SupplyDetailsRightSideTabs
