import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Loader from '../Loader'
import {Row, Col} from 'react-flexbox-grid'
import numberFormat from '../../helpers/numberFormat'
import moduleFormat from '../../helpers/moduleFormat'
import {Tabs, Tab} from 'material-ui/Tabs'
import * as TAB from '../../constants/supplyTab'
import NotFound from '../Images/not-found.png'
import CloseIcon from 'material-ui/svg-icons/action/highlight-off'
import InfoIcon from 'material-ui/svg-icons/action/info-outline'
import IconButton from 'material-ui/IconButton'
import t from '../../helpers/translate'
import ToolTip from '../ToolTip'
import {
    ZERO,
    SUPPLY_PENDING
} from '../../constants/backendConstants'

const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            background: '#fff',
            height: '265px',
            marginTop: '1px',
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
                    wordWrap: 'break-word',
                    textAlign: 'left'
                },
                '& .redFont > div': {
                    display: 'inline-block',
                    background: '#ff9393',
                    color: '#fff',
                    fontWeight: '600',
                    padding: '0 6px',
                    borderRadius: '2px'
                },
                '&:first-child:hover': {
                    backgroundColor: 'unset'
                },
                '&:hover': {
                    backgroundColor: '#f2f5f8'
                }

            }
        },
        tabWrapper: {
            maxHeight: '548px',
            overflowY: 'auto',
            overflowX: 'hidden',
            paddingRight: '30px',
            '& .row': {
                height: '50px',
                padding: '0',
                paddingLeft: '5px'
            }
        },
        summary: {
            fontWeight: '600',
            marginTop: '20px',
            paddingRight: '30px',
            textAlign: 'right',
            whiteSpace: 'nowrap',
            paddingLeft: '5px',
            '&:hover': {
                backgroundColor: 'unset !important'
            }
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
        },
        listRow: {
            display: 'flex',
            height: '100%',
            minHeight: '50px',
            alignItems: 'center',
            padding: '5px 30px',
            margin: '0 -30px',
            position: 'relative',
            overflow: 'hidden',
            '& > div': {
                padding: '0 8px !important'
            },
            '& a': {
                color: '#12aaeb !important'
            }
        },
        flex: {
            display: 'flex',
            alignItems: 'center',
            '& svg': {
                marginLeft: '5px'
            }
        },
        right: {
            textAlign: 'right',
            justifyContent: 'flex-end'
        },
        green: {
            fontWeight: '600',
            color: '#81c784'
        },
        red: {
            fontWeight: '600',
            color: '#e57373'
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
        confirmExpenseDialog
    } = props

    const tab = _.get(tabData, 'tab')
    const id = _.get(data, 'id')
    const products = _.get(data, 'products')
    const currency = _.get(data, ['currency', 'name']) || 'N/A'
    const status = _.toInteger(_.get(data, 'status'))

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
    const wholeNotAccepted = status === SUPPLY_PENDING
        ? ZERO
        : wholeAmount - wholeDefectAmount - wholePostedAmount
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
                                <Col xs={4}>{t('Товар')}</Col>
                                <Col xs={1}>{t('Кол-во')}</Col>
                                <Col xs={1}>{t('Принято')}</Col>
                                <Col xs={1}>{t('Брак')}</Col>
                                <Col xs={1}>{t('Недостача')}</Col>
                                <Col xs={2} style={{textAlign: 'right'}}>{t('Стоимость')}</Col>
                                <Col xs={2} style={{textAlign: 'right'}}>{t('Итог')}</Col>
                            </Row>

                            {_.map(products, (item) => {
                                const product = _.get(item, 'product')
                                const productId = _.get(item, 'id')
                                const productName = _.get(product, 'name')
                                const cost = _.toNumber(_.get(item, 'cost'))
                                const amount = _.toNumber(_.get(item, 'amount'))
                                const itemPrice = cost / amount
                                const postedAmount = _.get(item, 'postedAmount')
                                const measurement = _.get(product, ['measurement', 'name'])
                                const defectAmount = _.toNumber(_.get(item, 'defectAmount'))
                                const notAccepted = amount - defectAmount - postedAmount
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
                                        <Col xs={1} className={notAccepted < ZERO ? classes.green : notAccepted > ZERO ? classes.red : ''}>
                                            {status === SUPPLY_PENDING
                                                ? numberFormat(ZERO, measurement)
                                                : notAccepted < ZERO
                                                    ? '+' + moduleFormat(notAccepted, measurement)
                                                    : numberFormat(notAccepted, measurement)
                                            }
                                        </Col>
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
                            <Col xs={4}>{t('Итого')}:</Col>
                            <Col xs={1}>{numberFormat(wholeAmount, wholeMeasurement)}</Col>
                            <Col xs={1}>{numberFormat(wholePostedAmount, wholeMeasurement)}</Col>
                            <Col xs={1}>{numberFormat(wholeDefectAmount, wholeMeasurement)}</Col>
                            <Col xs={1} className={wholeNotAccepted < ZERO ? classes.green : wholeNotAccepted > ZERO ? classes.red : ''}>
                                {wholeNotAccepted < ZERO
                                    ? '+' + moduleFormat(wholeNotAccepted, wholeMeasurement)
                                    : numberFormat(wholeNotAccepted, wholeMeasurement)}
                            </Col>
                            <Col xs={2}>{null}</Col>
                            <Col xs={2}>
                                <div style={{textAlign: 'right'}}>{numberFormat(wholeCost, currency)}</div>
                            </Col>
                        </Row>
                    </div>
                </Tab>

                <Tab label={t('Доп. расходы')} value={TAB.SUPPLY_TAB_EXPENSES} disableTouchRipple={true}>
                    {!_.isEmpty(_.get(expensesListData, 'data'))
                        ? <div className={classes.tabContent}>
                            {!_.get(expensesListData, 'supplyExpenseListLoading') ? <div className={classes.tabWrapper}>
                                    <Row className="dottedList">
                                        <Col xs={3}>{t('Описание')}</Col>
                                        <Col xs={2} className={classes.right}>{t('Продукт')}</Col>
                                        <Col xs={2} className={classes.right}>{t('Тип оплаты')}</Col>
                                        <Col xs={2} style={{textAlign: 'right'}}>{t('Сумма')}</Col>
                                        <Col xs={2} style={{textAlign: 'right'}}>{t('Оплачено')}</Col>
                                    </Row>
                                    {_.map(_.get(expensesListData, 'data'), (item) => {
                                        const expId = _.get(item, 'id')
                                        const expComment = _.get(item, 'comment')
                                        const bindToProvider = _.get(item, 'bindToProvider')
                                        const paymentType = _.get(item, 'paymentType') === 'cash' ? 'Наличный' : 'Банковский счет'
                                        const expCurrency = _.get(item, ['currency', 'name'])
                                        const expAmount = numberFormat(_.get(item, 'amount'), expCurrency)
                                        const expPaid = _.get(item, 'totalPaid') ? numberFormat(Math.abs(_.toNumber(_.get(item, 'totalPaid'))), expCurrency) : numberFormat(ZERO, expCurrency)
                                        const expProduct = _.get(_.find(products, {'id': _.get(item, 'supplyProduct')}), ['product', 'name'])
                                        return (
                                            <Row key={expId} className="dottedList">
                                                <Col xs={3}>{expComment}</Col>
                                                <Col xs={2} className={classes.right}>{expProduct || 'Общий расход'}</Col>
                                                <Col xs={2} className={classes.right}>{paymentType}</Col>
                                                <Col xs={2}>
                                                    <div className={classes.flex + ' ' + classes.right}>
                                                        {expAmount}
                                                        {bindToProvider &&
                                                        <ToolTip position={'left'} text={'Привязан к поставщику'}>
                                                            <InfoIcon style={iconStyle.icon}/>
                                                        </ToolTip>}
                                                    </div>
                                                </Col>
                                                <Col xs={2} className={classes.right}>{expPaid}</Col>
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
                                    })}
                                </div>
                                : <div className={classes.loader}>
                                    <div>
                                        <Loader size={0.75}/>
                                    </div>
                                </div>
                            }
                        </div>
                        : (!returnDataLoading && <div className={classes.emptyQuery}>
                            <div>{t('В данной поставке нет дополнительных раходов')}</div>
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
