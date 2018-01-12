import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import _ from 'lodash'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import Available from 'material-ui/svg-icons/action/store'
import Canceled from 'material-ui/svg-icons/notification/do-not-disturb-alt'
import Delivered from 'material-ui/svg-icons/action/assignment-turned-in'
import Payment from 'material-ui/svg-icons/action/credit-card'
import InProcess from 'material-ui/svg-icons/device/access-time'
import Transfered from 'material-ui/svg-icons/maps/local-shipping'
import NotConfirmed from 'material-ui/svg-icons/alert/warning'
import InfoIcon from 'material-ui/svg-icons/action/info-outline'
import * as ROUTES from '../../../constants/routes'
import Container from '../../Container/index'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {Field} from 'redux-form'
import StatSideMenu from '../StatSideMenu'
import Pagination from '../../GridList/GridListNavPagination'
import numberFormat from '../../../helpers/numberFormat'
import StatSaleDialog from './SalesDialog'
import SalesInfoDialog from './SalesInfoDialog'
import {StatisticsFilterExcel, StatisticsChart} from '../../Statistics'
import Loader from '../../Loader'
import getConfig from '../../../helpers/getConfig'
import NotFound from '../../Images/not-found.png'
import ToolTip from '../../ToolTip'
import {
    DateToDateField,
    MarketMultiSearchField,
    ClientMultiSearchField,
    UsersMultiSearchField,
    DeptSearchField,
    ZoneMultiSearchField,
    DivisionMultiSearchField,
    DeliveryManMultiSearchField,
    ProductMultiSearchField,
    OrderStatusMultiSearchField,
    CheckBox
} from '../../ReduxForm'
import dateFormat from '../../../helpers/dateFormat'
import t from '../../../helpers/translate'

export const STAT_SALES_FILTER_KEY = {
    CLIENT: 'client',
    STATUS: 'status',
    PRODUCT: 'product',
    INITIATOR: 'initiator',
    SHOP: 'shop',
    DIVISION: 'division',
    DEPT: 'dept',
    FROM_DATE: 'fromDate',
    TO_DATE: 'toDate',
    DELIVERY_FROM_DATE: 'deliveryFromDate',
    DELIVERY_TO_DATE: 'deliveryToDate',
    DEADLINE_FROM_DATE: 'deadlineFromDate',
    DEADLINE_TO_DATE: 'deadlineToDate',
    ZONE: 'zone',
    ONLY_BONUS: 'onlyBonus',
    EXCLUDE: 'exclude',
    DELIVERY_MAN: 'deliveryMan'
}
const enhance = compose(
    injectSheet({
        mainWrapper: {
            background: '#fff',
            margin: '0 -28px',
            height: 'calc(100% + 28px)',
            boxShadow: 'rgba(0, 0, 0, 0.09) 0px -1px 6px, rgba(0, 0, 0, 0.10) 0px -1px 4px'
        },
        wrapper: {
            height: 'calc(100% - 40px)',
            padding: '20px 30px',
            '& .row': {
                marginLeft: '0',
                marginRight: '0'
            }
        },
        loader: {
            width: '100%',
            padding: '100px 0',
            background: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '999',
            display: 'flex'
        },
        graphLoader: {
            extend: 'loader',
            height: '180px',
            padding: '0',
            marginTop: '20px'
        },
        pagination: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px #efefef solid',
            borderBottom: '1px #efefef solid'
        },
        tableWrapper: {
            '& .row': {
                '&:after': {
                    bottom: '-1px'
                },
                '& > div': {
                    display: 'flex',
                    height: '50px',
                    alignItems: 'center',
                    '&:first-child': {
                        paddingLeft: '0'
                    },
                    '&:last-child': {
                        justifyContent: 'flex-end',
                        paddingRight: '0'
                    }
                }
            },
            '& .dottedList': {
                margin: '0 -30px',
                padding: '0 30px',
                '&:hover': {
                    background: '#f2f5f8'
                },
                '&:last-child:after': {
                    content: '""',
                    backgroundImage: 'none'
                }
            },
            '& .personImage': {
                borderRadius: '50%',
                overflow: 'hidden',
                height: '30px',
                minWidth: '30px',
                width: '30px',
                marginRight: '10px',
                '& img': {
                    display: 'flex',
                    height: '100%',
                    width: '100%'
                }
            }
        },
        balanceInfo: {
            padding: '15px 0'
        },
        balance: {
            paddingRight: '10px',
            fontSize: '24px!important',
            fontWeight: '600'
        },
        inputFieldCustom: {
            fontSize: '13px !important',
            height: '45px !important',
            marginTop: '7px',
            '& div': {
                fontSize: '13px !important'
            },
            '& label': {
                top: '20px !important',
                lineHeight: '5px !important'
            },
            '& input': {
                marginTop: '0 !important'
            }
        },
        balanceButtonWrap: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        leftPanel: {
            backgroundColor: '#f2f5f8',
            flexBasis: '250px',
            maxWidth: '250px'

        },
        rightPanel: {
            flexBasis: 'calc(100% - 250px)',
            maxWidth: 'calc(100% - 250px)',
            overflowY: 'auto',
            overflowX: 'hidden'
        },
        diagram: {
            marginTop: '20px',
            '& > div:first-child': {
                paddingLeft: '0'
            },
            '& > div:last-child': {
                paddingRight: '0'
            }
        },
        salesSummary: {
            position: 'relative'
        },
        mainSummary: {
            paddingBottom: '10px',
            marginBottom: '10px',
            borderBottom: '1px #efefef solid',
            position: 'relative',
            '& > div:nth-child(odd)': {
                color: '#666'
            },
            '& > div:nth-child(even)': {
                fontSize: '20px',
                fontWeight: '600'
            }
        },
        secondarySummary: {
            '& > div:nth-child(odd)': {
                color: '#666'
            },
            '& > div:nth-child(even)': {
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '10px'
            }
        },
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center center',
            backgroundSize: '200px',
            padding: '200px 0 0',
            textAlign: 'center',
            fontSize: '13px',
            color: '#666'
        },
        buttons: {
            display: 'flex',
            justifyContent: 'space-around'
        },
        infoButton: {
            position: 'absolute !important',
            right: '0',
            bottom: '8px'
        }
    })
)
const iconStyle = {
    icon: {
        color: '#666',
        width: 20,
        height: 20
    },
    button: {
        width: 30,
        height: 30,
        padding: 5,
        zIndex: 0
    }
}

const ZERO = 0
const TWO = 2
const THREE = 3
const StatSalesGridList = enhance((props) => {
    const {
        classes,
        filter,
        graphData,
        onSubmit,
        listData,
        statSaleDialog,
        detailData,
        initialValues,
        salesInfoDialog,
        setSalesInfoDialog,
        hasMarket,
        downloadDocuments,
        statsData
    } = props
    const statsLoading = _.get(statsData, 'loading')
    const graphLoading = _.get(graphData, 'graphLoading') || statsLoading
    const divisionStatus = _.get('DIVISION')

    const loading = _.get(listData, 'listLoading')
    const value = _.map(_.get(graphData, 'data'), (item) => {
        return _.toNumber(_.get(item, 'amountCash')) + _.toNumber(_.get(item, 'amountBank'))
    })
    const sum = _.sumBy(_.get(graphData, 'data'), (item) => {
        return _.toNumber(_.get(item, 'amountCash')) + _.toNumber(_.get(item, 'amountBank'))
    })
    const returnedValue = _.map(_.get(graphData, 'graphReturnList'), (item) => {
        return _.toNumber(_.get(item, 'totalAmount'))
    })
    const returnSum = _.sumBy(_.get(graphData, 'graphReturnList'), (item) => {
        return _.toNumber(_.get(item, 'totalAmount'))
    })
    const valueName = _.map(_.get(graphData, 'data'), (item) => {
        return _.get(item, 'date')
    })

    const headerStyle = {
        backgroundColor: '#fff',
        fontWeight: '600',
        color: '#666'
    }

    const headers = (
        <Row style={headerStyle} className="dottedList">
            <Col xs={1}>№ {t('Сделки')}</Col>
            <Col xs={2}>{t('Дата')}</Col>
            {hasMarket && <Col xs={2}>{t('Магазин')}</Col>}
            <Col xs={hasMarket ? TWO : THREE}>{t('Агент')}</Col>
            <Col xs={hasMarket ? TWO : THREE}>{t('Тип оплаты')}</Col>
            <Col xs={2} style={{justifyContent: 'flex-end'}}>{t('Сумма')}</Col>
            <Col xs={1} style={{justifyContent: 'flex-end'}}>{t('Cтатус')}</Col>
        </Row>
    )

    const currentCurrency = getConfig('PRIMARY_CURRENCY')
    const list = (
        _.map(_.get(listData, 'data'), (item) => {
            const status = _.toInteger(_.get(item, 'status'))
            const marketName = _.get(item, ['market', 'name'])
            const currency = _.get(item, ['currency', 'name'])
            const id = _.get(item, 'id')
            const createdDate = _.get(item, 'createdDate') ? moment(_.get(item, 'createdDate')).locale('ru').format('DD MMM YYYY HH:MM') : t('Не указана')
            const firstName = _.get(item, ['user', 'firstName'])
            const totalPrice = _.get(item, 'totalPrice')
            const totalBalance = _.get(item, 'totalBalance')
            const secondName = _.get(item, ['user', 'secondName '])
            const REQUESTED = 0
            const READY = 1
            const GIVEN = 2
            const DELIVERED = 3
            const CANCELED = 4
            const NOT_CONFIRMED = 5
            const now = moment().format('YYYY-MM-DD')
            const paymentDate = dateFormat(_.get(item, 'paymentDate'))
            const balanceToolTip = numberFormat(totalBalance, currentCurrency)
            const paymentType = _.get(item, 'paymentType') === 'cash' ? t('наличный') : t('банковский счет')
            const paymentDifference = moment(_.get(item, 'paymentDate')).diff(now, 'days')
            const PAY_PENDING = t('Оплата ожидается') + ': ' + paymentDate + '<br/>' + t('Ожидаемый платеж') + ': ' + balanceToolTip
            const PAY_DELAY = paymentDifference !== ZERO
                ? t('Оплата ожидалась') + ': ' + paymentDate + '<br/>' + t('Долг') + ': ' + balanceToolTip
                : t('Оплата ожидается сегодня') + '<br/>' + t('Сумма') + ': ' + balanceToolTip
            return (
                <Row key={id} className="dottedList" style={status === CANCELED ? {color: '#999', cursor: 'pointer'} : {cursor: 'pointer'}} onClick={() => { statSaleDialog.handleOpenStatSaleDialog(id) }}>
                    <Col xs={1}>{id}</Col>
                    <Col xs={2}>{createdDate}</Col>
                    {hasMarket && <Col xs={2}>{marketName}</Col>}
                    <Col xs={hasMarket ? TWO : THREE}>
                        <div>{firstName} {secondName}</div>
                    </Col>
                    <Col xs={hasMarket ? TWO : THREE}>{paymentType}</Col>
                    <Col xs={2} style={{justifyContent: 'flex-end'}}>{numberFormat(totalPrice, currency)}</Col>
                    <Col xs={1} style={{justifyContent: 'flex-end'}}>
                        <div className={classes.buttons}>
                            {(status === REQUESTED) ? <ToolTip position="bottom" text={t('В процессе')}>
                                    <IconButton
                                        disableTouchRipple={true}
                                        iconStyle={iconStyle.icon}
                                        style={iconStyle.button}
                                        touch={true}>
                                        <InProcess color="#f0ad4e"/>
                                    </IconButton>
                                </ToolTip>
                                : (status === READY) ? <ToolTip position="bottom" text={t('Есть на складе')}>
                                        <IconButton
                                            disableTouchRipple={true}
                                            iconStyle={iconStyle.icon}
                                            style={iconStyle.button}
                                            touch={true}>
                                            <Available color="#f0ad4e"/>
                                        </IconButton>
                                    </ToolTip>
                                    : (status === DELIVERED) ? <ToolTip position="bottom" text={t('Доставлен')}>
                                            <IconButton
                                                disableTouchRipple={true}
                                                iconStyle={iconStyle.icon}
                                                style={iconStyle.button}
                                                touch={true}>
                                                <Delivered color="#81c784"/>
                                            </IconButton>
                                        </ToolTip>
                                        : (status === GIVEN) ? <ToolTip position="bottom" text={t('Передан доставщику')}>
                                                <IconButton
                                                    disableTouchRipple={true}
                                                    iconStyle={iconStyle.icon}
                                                    style={iconStyle.button}
                                                    touch={true}>
                                                    <Transfered color="#f0ad4e"/>
                                                </IconButton>
                                            </ToolTip>
                                            : (status === CANCELED) ? <ToolTip position="bottom" text={t('Заказ отменен')}>
                                                    <IconButton
                                                        disableTouchRipple={true}
                                                        iconStyle={iconStyle.icon}
                                                        style={iconStyle.button}
                                                        touch={true}>
                                                        <Canceled color='#e57373'/>
                                                    </IconButton>
                                                </ToolTip>
                                                : (status === NOT_CONFIRMED) ? <ToolTip position="bottom" text={t('Не подтвержден')}>
                                                    <IconButton
                                                        disableTouchRipple={true}
                                                        iconStyle={iconStyle.icon}
                                                        style={iconStyle.button}
                                                        touch={true}>
                                                        <NotConfirmed color='#999'/>
                                                    </IconButton>
                                                </ToolTip> : null
                            }
                            {!(status === CANCELED) &&
                            <ToolTip position="bottom" text={(totalPrice > ZERO) && ((moment(_.get(item, 'paymentDate')).diff(now, 'days') <= ZERO))
                                ? PAY_DELAY
                                : ((totalBalance > ZERO) && moment(_.get(item, 'paymentDate')).diff(now, 'days') > ZERO)
                                    ? PAY_PENDING
                                    : totalBalance === ZERO ? t('Оплачено') : ''}>
                                <IconButton
                                    disableTouchRipple={true}
                                    iconStyle={iconStyle.icon}
                                    style={iconStyle.button}
                                    touch={true}>
                                    <Payment color={(totalBalance > ZERO) && (paymentDifference < ZERO)
                                        ? '#e57373'
                                        : paymentDifference === ZERO
                                            ? '#f0ad4e'
                                            : (totalBalance > ZERO) &&
                                            (paymentDifference > ZERO)
                                                ? '#B7BBB7'
                                                : (totalBalance === ZERO ? '#81c784' : '#B7BBB7')
                                    }/>
                                </IconButton>
                            </ToolTip>
                            }
                        </div>
                    </Col>
                </Row>
            )
        })

    )

    const fields = (
        <div>
            <Field name="client" className={classes.inputFieldCustom} component={ClientMultiSearchField} label={t('Клиент')}/>
            <Field name="deliveryMan" className={classes.inputFieldCustom} component={DeliveryManMultiSearchField} label={t('Доставщик')}/>
            <Field name="product" className={classes.inputFieldCustom} component={ProductMultiSearchField} label={t('Товар')}/>
            <Field name="status" className={classes.inputFieldCustom} component={OrderStatusMultiSearchField} label={t('Статус')}/>
            {hasMarket && <Field name="shop" className={classes.inputFieldCustom} component={MarketMultiSearchField} label={t('Магазин')}/>}
            {divisionStatus && <Field name="division" className={classes.inputFieldCustom} component={DivisionMultiSearchField} label={t('Организация')}/>}
            <Field name="initiator" className={classes.inputFieldCustom} component={UsersMultiSearchField} label={t('Инициатор')}/>
            <Field name="dept" className={classes.inputFieldCustom} component={DeptSearchField} label={t('Статус оплаты')}/>
            <Field name="zone" className={classes.inputFieldCustom} component={ZoneMultiSearchField} label={t('Зона')}/>
            <Field name="createdDate" className={classes.inputDateCustom} component={DateToDateField} label={t('Период создания')}/>
            <Field name="deliveryDate" className={classes.inputDateCustom} component={DateToDateField} label={t('Дата доставки')}/>
            <Field name="deadlineDate" className={classes.inputDateCustom} component={DateToDateField} label={t('Период изготовления')}/>
            <Field name="onlyBonus" component={CheckBox} label={t('Только бонусные заказы')}/>
            <Field name="exclude" component={CheckBox} label={t('Исключить отмененные заказы')}/>
        </div>
    )

    const page = (
            <div className={classes.mainWrapper}>
                <Row style={{margin: '0', height: '100%'}}>
                    <div className={classes.leftPanel}>
                        <StatSideMenu currentUrl={ROUTES.STATISTICS_SALES_URL} filter={filter}/>
                    </div>
                    <div className={classes.rightPanel}>
                        <div className={classes.wrapper}>
                            <StatisticsFilterExcel
                                filter={filter}
                                sales={true}
                                initialValues={initialValues}
                                fields={fields}
                                filterKeys={STAT_SALES_FILTER_KEY}
                                handleSubmitFilterDialog={onSubmit}
                                handleGetDocument={downloadDocuments}
                            />
                            <div>
                                {graphLoading
                                ? <div className={classes.graphLoader}>
                                    <Loader size={0.75}/>
                                </div>
                                : <Row className={classes.diagram}>
                                    <Col xs={3} className={classes.salesSummary}>
                                        <div className={classes.mainSummary}>
                                            <div>{t('Фактические продажи')}</div>
                                            <div>{numberFormat(sum - returnSum, getConfig('PRIMARY_CURRENCY'))}</div>
                                            <IconButton
                                                className={classes.infoButton}
                                                disableTouchRipple={true}
                                                iconStyle={iconStyle.icon}
                                                style={iconStyle.button}
                                                onMouseEnter={() => { setSalesInfoDialog(true) }}
                                                onMouseLeave={() => { setSalesInfoDialog(false) }}>
                                                <InfoIcon color="#666"/>
                                            </IconButton>
                                        </div>
                                        <div className={classes.secondarySummary}>
                                            <div>{t('Сумма продаж за период')}</div>
                                            <div>{numberFormat(sum, getConfig('PRIMARY_CURRENCY'))}</div>
                                            <div>{t('Сумма возврата за период')}</div>
                                            <div>{numberFormat(returnSum, getConfig('PRIMARY_CURRENCY'))}</div>
                                        </div>
                                        {salesInfoDialog &&
                                        <SalesInfoDialog statsData={statsData}/>}
                                    </Col>
                                    <Col xs={9}>
                                        <StatisticsChart
                                            merged={true}
                                            primaryValues={value}
                                            secondaryValues={returnedValue}
                                            mergedGraph={_.get(graphData, 'mergedGraph')}
                                            tooltipTitle={valueName}
                                            primaryText={t('Продажа')}
                                            secondaryText={t('Возврат')}
                                            height={180}
                                        />
                                    </Col>
                                </Row>}
                                <div className={classes.pagination}>
                                    <div><b>{t('История продаж')}</b></div>
                                    <Pagination filter={filter}/>
                                </div>
                                {loading
                                    ? <div className={classes.tableWrapper}>
                                        <div className={classes.loader}>
                                            <Loader size={0.75}/>
                                        </div>
                                    </div>
                                    : <div className={classes.tableWrapper}>
                                        {_.isEmpty(list) && !loading
                                            ? <div className={classes.emptyQuery}>
                                                <div>{t('По вашему запросу ничего не найдено')}</div>
                                            </div>
                                            : <div>
                                                {headers}
                                                {list}
                                            </div>}
                                    </div>}
                              </div>
                        </div>
                    </div>
                </Row>
            </div>
    )

    return (
        <Container>
            {page}
            <StatSaleDialog
                loading={_.get(detailData, 'detailLoading')}
                detailData={detailData}
                open={statSaleDialog.openStatSaleDialog}
                onClose={statSaleDialog.handleCloseStatSaleDialog}
                filter={filter}/>
        </Container>
    )
})

StatSalesGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    statSaleDialog: PropTypes.shape({
        openStatSaleDialog: PropTypes.bool.isRequired,
        handleOpenStatSaleDialog: PropTypes.func.isRequired,
        handleCloseStatSaleDialog: PropTypes.func.isRequired
    }).isRequired
}

export default StatSalesGridList
