import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../../constants/routes'
import Container from '../../Container/index'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {reduxForm, Field} from 'redux-form'
import {TextField, AgentSearchField} from '../../ReduxForm'
import DateToDateField from '../../ReduxForm/Basic/DateToDateField'
import StatSideMenu from '../StatSideMenu'
import LinearLoading from '../../LinearProgress/index'
import IconButton from 'material-ui/IconButton'
import CircularProgress from 'material-ui/CircularProgress'
import Chart from 'material-ui/svg-icons/action/timeline'
import Pagination from '../../GridList/GridListNavPagination/index'
import numberFormat from '../../../helpers/numberFormat'
import getConfig from '../../../helpers/getConfig'
import NotFound from '../../Images/not-found.png'
import {StatisticsFilterExcel, StatisticsChart} from '../../Statistics'

export const STAT_MARKET_FILTER_KEY = {
    SEARCH: 'search',
    USER: 'user',
    TO_DATE: 'toDate',
    FROM_DATE: 'fromDate'
}
const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            padding: '100px 0',
            margin: '0 !important',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        graphLoader: {
            padding: '50px 0',
            margin: '0 -30px',
            position: 'relative',
            '& > div': {
                background: 'transparent'
            }
        },
        sumLoader: {
            extend: 'loader',
            padding: '0',
            height: '75px'
        },
        mainWrapper: {
            background: '#fff',
            margin: '0 -28px',
            height: 'calc(100% + 28px)',
            boxShadow: 'rgba(0, 0, 0, 0.09) 0px -1px 6px, rgba(0, 0, 0, 0.10) 0px -1px 4px'
        },
        wrapper: {
            height: 'calc(100% - 40px)',
            padding: '20px 30px',
            '& > div:nth-child(2)': {
                marginTop: '10px'
            },
            '& .row': {
                margin: '0 !important'
            }
        },
        tableWrapper: {
            padding: '0 30px',
            margin: '0 -30px',
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
                        paddingRight: '0'
                    },
                    '& img': {
                        width: '35px',
                        height: '35px',
                        borderRadius: '4px',
                        marginRight: '10px'
                    }
                }
            },
            '& .dottedList': {
                padding: '0 30px',
                margin: '0 -30px !important',
                '& button': {
                    opacity: '0'
                },
                '&:hover': {
                    '& button': {
                        opacity: '1 !important'
                    }
                },
                '&:last-child:after': {
                    content: '""',
                    backgroundImage: 'none'
                }
            }
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
        excel: {
            background: '#71ce87',
            borderRadius: '2px',
            color: '#fff',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            padding: '5px 15px',
            '& svg': {
                width: '18px !important'
            }
        },
        form: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        filter: {
            display: 'flex',
            alignItems: 'center',
            '& > div': {
                width: '170px!important',
                position: 'relative',
                marginRight: '40px',
                '&:after': {
                    content: '""',
                    position: 'absolute',
                    right: '-20px',
                    height: '30px',
                    width: '1px',
                    top: '50%',
                    marginTop: '-15px',
                    background: '#efefef'
                },
                '&:last-child': {
                    '&:after': {
                        content: '""',
                        background: 'none'
                    }
                }
            }
        },
        leftPanel: {
            backgroundColor: '#f2f5f8',
            flexBasis: '250px',
            maxWidth: '250px'

        },
        rightPanel: {
            flexBasis: 'calc(100% - 250px)',
            maxWidth: 'calc(100% - 250px)',
            overflow: 'hidden',
            overflowY: 'auto',
            overflowX: 'hidden'
        },
        searchButton: {
            marginLeft: '-10px !important',
            '& div': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
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
        summary: {
            display: 'flex',
            borderTop: 'solid 1px #efefef',
            borderBottom: 'solid 1px #efefef',
            padding: '14px 0',
            color: '#666',
            '& > div': {
                marginRight: '60px',
                '& div': {
                    fontSize: '20px',
                    color: '#333',
                    fontWeight: '600'
                },
                '& span': {
                    display: 'block'
                }

            }
        },
        pagination: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            '& > div:first-child': {
                fontWeight: '600'
            }
        },
        details: {
            background: '#fefefe',
            position: 'relative',
            margin: '0 -30px',
            padding: '0 30px',
            '&:before': {
                content: '""',
                position: 'absolute',
                top: '-1px',
                left: '0',
                right: '0',
                background: '#efefef',
                height: '2px',
                zIndex: '9'
            },
            '&:after': {
                content: '""',
                position: 'absolute',
                bottom: '-1px',
                left: '0',
                right: '0',
                background: '#efefef',
                height: '2px',
                zIndex: '9'
            },
            '& .row': {
                position: 'relative'
            }
        },
        closeDetail: {
            position: 'absolute',
            cursor: 'pointer',
            top: '0',
            left: '-30px',
            right: '-30px',
            bottom: '0'
        }
    }),
    reduxForm({
        form: 'StatisticsFilterForm',
        enableReinitialize: true
    }),
)

const StatMarketGridList = enhance((props) => {
    const {
        listData,
        detailData,
        classes,
        filter,
        handleSubmitFilterDialog,
        initialValues,
        getDocument,
        handleSubmit
    } = props

    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const listLoading = _.get(listData, 'listLoading')
    const graphLoading = _.get(detailData, ['graphLoading'])
    const sumIncome = _.get(listData, ['sumData', 'income'])
    const sumFact = _.get(listData, ['sumData', 'fact'])
    const sumReturn = _.get(listData, ['sumData', 'returnSum'])
    const paid = _.get(listData, ['sumData', 'paid']) || ''
    const dept = _.get(listData, ['sumData', 'dept'])
    const sumLoading = _.get(listData, 'sumLoading')
    const headerStyle = {
        backgroundColor: '#fff',
        fontWeight: '600',
        color: '#666'
    }

    const amountValue = _.map(_.get(detailData, ['graphList']), (item) => {
        return _.toInteger(_.get(item, 'amount'))
    })
    const returnAmountValue = _.map(_.get(detailData, ['graphList']), (item) => {
        return _.toInteger(_.get(item, 'returnAmount'))
    })

    const valueName = _.map(_.get(detailData, ['graphList']), (item) => {
        return _.get(item, 'date')
    })

    const headers = (
        <Row style={headerStyle} className="dottedList">
            <Col xs={2}>Магазины</Col>
            <Col xs={2}>Клиенты</Col>
            <Col xs={2} style={{justifyContent: 'flex-end'}}>Продажи</Col>
            <Col xs={2} style={{justifyContent: 'flex-end'}}>Возвраты</Col>
            <Col xs={1} style={{justifyContent: 'flex-end'}}>Фактически</Col>
            <Col xs={1} style={{justifyContent: 'flex-end'}}>Оплачено</Col>
            <Col xs={1} style={{justifyContent: 'flex-end'}}>Долг</Col>
            <Col xs={1}>{null}</Col>
        </Row>
    )

    const list = _.map(_.get(listData, 'data'), (item, index) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const income = _.toNumber(_.get(item, 'income'))
        const actual = _.toNumber(_.get(item, 'actualSales'))
        const paidItem = _.get(item, 'paid') || '0 USD'
        const deptItem = _.get(item, 'dept') || '0 USD'
        const returns = _.toNumber(_.get(item, 'orderReturns'))
        const clientName = _.get(item, 'clientName')

        if (id === _.get(detailData, 'id')) {
            return (
                <div key={index} className={classes.details}>
                    <Row>
                        <Col xs={2}>{name}</Col>
                        <Col xs={2}>{clientName}</Col>
                        <Col xs={2} style={{justifyContent: 'flex-end'}}>{numberFormat(income, primaryCurrency)}</Col>
                        <Col xs={2} style={{justifyContent: 'flex-end'}}>{numberFormat(returns, primaryCurrency)}</Col>
                        <Col xs={1} style={{justifyContent: 'flex-end'}}>{numberFormat(actual, primaryCurrency)}</Col>
                        <Col xs={1} style={{justifyContent: 'flex-end'}}>{numberFormat(paidItem, primaryCurrency)}</Col>
                        <Col xs={1} style={{justifyContent: 'flex-end'}}>{numberFormat(deptItem, primaryCurrency)}</Col>
                        <div className={classes.closeDetail} onClick={detailData.handleCloseDetail}>{null}</div>
                        <Col xs={1}>{null}</Col>
                    </Row>
                    {graphLoading
                        ? <div className={classes.graphLoader}><LinearLoading/></div>
                        : <StatisticsChart
                            primaryValues={amountValue}
                            secondaryValues={returnAmountValue}
                            tooltipTitle={valueName}
                            primaryText="Продажи"
                            secondaryText="Возвраты"
                            height={180}
                        />
                    }
                </div>
            )
        }

        return (
            <Row key={index} className="dottedList">
                <Col xs={2}>
                    <span>{name}</span>
                </Col>
                <Col xs={2}>{clientName}</Col>
                <Col xs={2} style={{justifyContent: 'flex-end'}}>{numberFormat(income, primaryCurrency)}</Col>
                <Col xs={2} style={{justifyContent: 'flex-end'}}>{numberFormat(returns, primaryCurrency)}</Col>
                <Col xs={1} style={{justifyContent: 'flex-end'}}>{numberFormat(actual, primaryCurrency)}</Col>
                <Col xs={1} style={{justifyContent: 'flex-end'}}>{numberFormat(paid, primaryCurrency)}</Col>
                <Col xs={1} style={{justifyContent: 'flex-end'}}>{numberFormat(dept, primaryCurrency)}</Col>
                <Col xs={1} style={{justifyContent: 'flex-end', paddingRight: '0'}}>
                    <IconButton
                        onTouchTap={() => { detailData.handleOpenDetail(id) }}>
                        <Chart color="#12aaeb"/>
                    </IconButton>
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
                label="Диапазон дат"
                fullWidth={true}/>
            <Field
                name="user"
                component={AgentSearchField}
                className={classes.inputFieldCustom}
                label="Агент"
                fullWidth={true}
            />
        </div>
    )

    const page = (
        <div className={classes.mainWrapper}>
            <Row style={{margin: '0', height: '100%'}}>
                <div className={classes.leftPanel}>
                    <StatSideMenu currentUrl={ROUTES.STATISTICS_MARKET_URL} filter={filter}/>
                </div>
                <div className={classes.rightPanel}>
                    <div className={classes.wrapper}>
                        <StatisticsFilterExcel
                            filter={filter}
                            filterKeys={STAT_MARKET_FILTER_KEY}
                            handleSubmitFilterDialog={handleSubmitFilterDialog}
                            fields={fields}
                            initialValues={initialValues}
                            handleGetDocument={getDocument.handleGetDocument}
                        />
                        {sumLoading
                            ? <div className={classes.sumLoader}>
                                <CircularProgress size={40} thickness={4}/>
                            </div>
                            : <div className={classes.summary}>
                                <div>
                                    <span>Сумма от продаж</span>
                                    <div>{numberFormat(sumIncome, primaryCurrency)}</div>
                                </div>
                                <div>
                                    <span>Фактические продажи</span>
                                    <div>{numberFormat(sumFact, primaryCurrency)}</div>
                                </div>
                                <div>
                                    <span>Сумма возвратов</span>
                                    <div>{numberFormat(sumReturn, primaryCurrency)}</div>
                                </div>
                                <div>
                                    <span>Оплачено</span>
                                    <div>{numberFormat(paid, primaryCurrency)}</div>
                                </div>
                                <div>
                                    <span>Долг</span>
                                    <div>{numberFormat(dept, primaryCurrency)}</div>
                                </div>
                            </div>}
                        <div className={classes.pagination}>
                            <div>Продажи по магазинам в зоне</div>
                            <form onSubmit={handleSubmit(handleSubmitFilterDialog)}>
                                <Field
                                    className={classes.inputFieldCustom}
                                    name="search"
                                    component={TextField}
                                    hintText="Магазин"/>
                            </form>
                            <Pagination filter={filter}/>
                        </div>
                        {listLoading
                            ? <div className={classes.tableWrapper}>
                                <div className={classes.loader}>
                                    <CircularProgress thickness={4} size={40}/>
                                </div>
                            </div>
                            : <div className={classes.tableWrapper}>
                                {_.isEmpty(list) && !listLoading
                                    ? <div className={classes.emptyQuery}>
                                        <div>По вашему запросу ничего не найдено</div>
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
        </Container>
    )
})

StatMarketGridList.propTypes = {
    listData: PropTypes.object,
    detailData: PropTypes.object,
    statMarketDialog: PropTypes.shape({
        openStatMarketDialog: PropTypes.bool.isRequired,
        handleOpenStatMarketDialog: PropTypes.func.isRequired,
        handleCloseStatMarketDialog: PropTypes.func.isRequired
    }).isRequired
}

export default StatMarketGridList
