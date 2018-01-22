import PropTypes from 'prop-types'
import React from 'react'
import _ from 'lodash'
import {Row, Col} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {Field} from 'redux-form'
import Loader from '../../Loader'
import StatReturnDialog from './StatReturnDialog'
import StatSideMenu from '../StatSideMenu'
import DateToDateField from '../../ReduxForm/Basic/DateToDateField'
import Container from '../../Container/index'
import Pagination from '../../GridList/GridListNavPagination/index'
import OrderReturnStatusIcons from '../../Return/OrderReturnStatusIcons'
import NotFound from '../../Images/not-found.png'
import * as ROUTES from '../../../constants/routes'
import numberFormat from '../../../helpers/numberFormat'
import dateFormat from '../../../helpers/dateFormat'
import getConfig from '../../../helpers/getConfig'
import {StatisticsFilterExcel, StatisticsChart} from '../../Statistics'
import {
    ClientMultiSearchField,
    MarketMultiSearchField,
    UsersMultiSearchField,
    TextField,
    ProductMultiSearchField,
    ReturnStatusMultiSearch,
    ReturnTypeSearchField,
    DivisionMultiSearchField,
    PaymentTypeSearchField,
    CheckBox
} from '../../ReduxForm'
import t from '../../../helpers/translate'

export const STAT_RETURN_FILTER_KEY = {
    FROM_DATE: 'fromDate',
    TO_DATE: 'toDate',
    DIVISION: 'division',
    ORDER: 'order',
    TYPE: 'type',
    CLIENT: 'client',
    STATUS: 'status',
    INITIATOR: 'initiator',
    MARKET: 'market',
    CODE: 'code',
    PRODUCT: 'product',
    PAYMENT_TYPE: 'paymentType',
    EXCLUDE: 'exclude'
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
            padding: '0',
            height: '180px',
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
                margin: '0 -30px',
                padding: '0 30px',
                '&:hover': {
                    background: '#f2f5f8'
                },
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
                padding: '0 30px',
                '&:last-child:after': {
                    content: '""',
                    backgroundImage: 'none'
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
            '& > div:nth-child(odd)': {
                color: '#666'
            },
            '& > div:nth-child(even)': {
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '15px'
            }
        },
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center center',
            backgroundSize: '200px',
            padding: '200px 0 0',
            textAlign: 'center',
            fontSize: '13px',
            color: '#666',
            '& svg': {
                width: '50px !important',
                height: '50px !important',
                color: '#999 !important'
            }
        }
    })
)

const StatReturnGridList = enhance((props) => {
    const {
        classes,
        type,
        filter,
        onSubmit,
        listData,
        statReturnDialog,
        detailData,
        handleGetDocument,
        graphData,
        initialValues,
        hasMarket
    } = props

    const loading = _.get(listData, 'listLoading')
    const graphLoading = _.get(graphData, 'graphLoading')
    const divisionStatus = getConfig('DIVISIONS')
    const headerStyle = {
        backgroundColor: '#fff',
        fontWeight: '600',
        color: '#666'
    }

    const returnSum = _.sumBy(_.get(graphData, 'data'), (item) => {
        return _.toNumber(_.get(item, 'totalAmount'))
    })
    const returnedValue = _.map(_.get(graphData, 'data'), (item) => {
        return _.toNumber(_.get(item, 'totalAmount'))
    })

    const valueName = _.map(_.get(graphData, 'data'), (item) => {
        return _.get(item, 'date')
    })

    const headers = (
        <Row style={headerStyle} className="dottedList">
            <Col xs={1}>№</Col>
            <Col xs={2}>{t('От кого')}</Col>
            <Col xs={1}>{t('Заказ')}</Col>
            <Col xs={2}>{t('Склад')}</Col>
            <Col xs={2}>{t('Добавил')}</Col>
            <Col xs={1}>{t('Дата')}</Col>
            <Col xs={2} style={{justifyContent: 'flex-end'}}>{t('Сумма возврата')}</Col>
            <Col xs={1}>{t('Статус')}</Col>
        </Row>
    )

    const list = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const client = _.get(item, ['client', 'name']) || '-'
        const order = _.get(item, 'order') || '-'
        const stock = _.get(item, ['stock', 'name'])
        const currency = _.get(item, ['currency', 'name'])
        const user = _.get(item, ['createdBy', 'firstName']) + ' ' + _.get(item, ['createdBy', 'secondName']) || 'N/A'
        const createdDate = dateFormat(_.get(item, 'createdDate'))
        const totalPrice = numberFormat(_.get(item, 'totalPrice'), currency)
        const status = _.toInteger(_.get(item, 'status'))

        return (
            <Row className={classes.listWrapper} style={{cursor: 'pointer'}} key={id} onTouchTap={() => {
                statReturnDialog.handleOpenStatReturnDialog(id)
            }}>
                <Col xs={1}>{id}</Col>
                <Col xs={2}>{client}</Col>
                <Col xs={1}>{order}</Col>
                <Col xs={2}>{stock}</Col>
                <Col xs={2}>{user}</Col>
                <Col xs={1} style={{whiteSpace: 'nowrap'}}>{createdDate}</Col>
                <Col xs={2} style={{justifyContent: 'flex-end'}}>{totalPrice}</Col>
                <Col xs={1}>
                    <div className={classes.buttons}>
                        <OrderReturnStatusIcons status={status}/>
                    </div>
                </Col>
            </Row>
        )
    })

    const fields = (
        <div>
            <Field
                className={classes.inputFieldCustom}
                name="date"
                component={DateToDateField}
                label={t('Диапазон дат')}
                fullWidth={true}/>
            <Field
                className={classes.inputFieldCustom}
                name="order"
                component={TextField}
                label={'№ ' + t('Заказа')}/>
            <Field
                className={classes.inputFieldCustom}
                name="product"
                component={ProductMultiSearchField}
                label={t('Продукт')}/>
            {divisionStatus && <Field
                className={classes.inputFieldCustom}
                name="division"
                component={DivisionMultiSearchField}
                label={t('Организация')}/>}
            <Field
                className={classes.inputFieldCustom}
                name="paymentType"
                component={PaymentTypeSearchField}
                label={t('Тип оплаты')}/>
            <Field
                className={classes.inputFieldCustom}
                name="status"
                component={ReturnStatusMultiSearch}
                label={t('Статус')}/>
            <Field
                className={classes.inputFieldCustom}
                name="type"
                component={ReturnTypeSearchField}
                label={t('Тип')}/>
            <Field
                className={classes.inputFieldCustom}
                name="client"
                component={ClientMultiSearchField}
                label={t('Клиент')}/>
            {hasMarket &&
            <Field
                className={classes.inputFieldCustom}
                name="market"
                component={MarketMultiSearchField}
                label={t('Магазин')}/>}
            <Field
                className={classes.inputFieldCustom}
                name="initiator"
                component={UsersMultiSearchField}
                label={t('Инициатор')}/>
            <Field
                className={classes.inputFieldCustom}
                name="code"
                component={TextField}
                label={t('Код')}/>
            <Field
                className={classes.inputDateCustom}
                name="data"
                component={DateToDateField}
                label={t('Период создания')}/>
            <Field
                name="exclude"
                component={CheckBox}
                label={t('Исключить отмененные заказы')}/>

        </div>
    )

    const page = (
        <div className={classes.mainWrapper}>
            <Row style={{margin: '0', height: '100%'}}>
                <div className={classes.leftPanel}>
                    <StatSideMenu currentUrl={ROUTES.STATISTICS_RETURN_URL} filter={filter}/>
                </div>
                <div className={classes.rightPanel}>
                    <div className={classes.wrapper}>
                        <StatisticsFilterExcel
                            filter={filter}
                            fields={fields}
                            handleGetDocument={handleGetDocument}
                            handleSubmitFilterDialog={onSubmit}
                            initialValues={initialValues}
                            filterKeys={STAT_RETURN_FILTER_KEY}
                        />
                        {graphLoading
                        ? <div className={classes.graphLoader}>
                                <Loader size={0.75}/>
                            </div>
                        : <Row className={classes.diagram}>
                            <Col xs={3} className={classes.salesSummary}>
                                <div>{t('Общая сумма возврата')}</div>
                                <div>{numberFormat(returnSum, getConfig('PRIMARY_CURRENCY'))}</div>
                            </Col>
                            <Col xs={9}>
                                <StatisticsChart
                                    primaryText={t('Возврат')}
                                    primaryValues={returnedValue}
                                    tooltipTitle={valueName}
                                    height={180}
                                />
                            </Col>
                        </Row>}
                        <div className={classes.pagination}>
                            <div><b>{t('История возврата')}</b></div>
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
            </Row>
        </div>
    )

    return (
        <Container>
            {page}
            <StatReturnDialog
                loading={_.get(detailData, 'detailLoading')}
                detailData={detailData}
                open={statReturnDialog.openStatReturnDialog}
                onClose={statReturnDialog.handleCloseStatReturnDialog}
                filter={filter}
                type={type}/>
        </Container>
    )
})

StatReturnGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    statReturnDialog: PropTypes.shape({
        openStatReturnDialog: PropTypes.bool.isRequired,
        handleOpenStatReturnDialog: PropTypes.func.isRequired,
        handleCloseStatReturnDialog: PropTypes.func.isRequired
    }).isRequired
}

export default StatReturnGridList
