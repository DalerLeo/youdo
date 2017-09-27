import _ from 'lodash'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../../constants/routes'
import Container from '../../Container/index'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import {TextField, DivisionSearchField} from '../../ReduxForm/index'
import StatSideMenu from '../StatSideMenu'
import Search from 'material-ui/svg-icons/action/search'
import IconButton from 'material-ui/IconButton'
import CircularProgress from 'material-ui/CircularProgress'
import List from 'material-ui/svg-icons/action/list'
import ArrowDown from 'material-ui/svg-icons/navigation/arrow-drop-down-circle'
import Excel from 'material-ui/svg-icons/av/equalizer'
import Pagination from '../../GridList/GridListNavPagination/index'
import numberFormat from '../../../helpers/numberFormat'
import getConfig from '../../../helpers/getConfig'
import StatSaleDialog from '../Sales/SalesDialog'
import NotFound from '../../Images/not-found.png'

export const STAT_DEBTORS_FILTER_KEY = {
    DIVISION: 'division',
    SEARCH: 'search'
}

const ZERO = 0

const enhance = compose(
    injectSheet({
        mainWrapper: {
            background: '#fff',
            margin: '0 -28px',
            height: 'calc(100% + 28px)',
            boxShadow: 'rgba(0, 0, 0, 0.09) 0px -1px 6px, rgba(0, 0, 0, 0.10) 0px -1px 4px'
        },
        loader: {
            width: '100%',
            padding: '100px 0',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        wrapper: {
            height: 'calc(100% - 40px)',
            padding: '20px 30px',
            '& .row': {
                marginLeft: '0',
                marginRight: '0'
            }
        },
        debtors: {
            display: 'flex',
            margin: '15px 0',
            '& > div': {
                marginRight: '60px',
                '& span': {
                    color: '#666',
                    marginBottom: '5px'
                },
                '& div': {
                    fontSize: '24px',
                    fontWeight: '600'
                }
            }
        },
        pagination: {
            display: 'flex',
            alignItems: 'center',
            marginTop: '10px',
            justifyContent: 'space-between',
            borderTop: '1px #efefef solid',
            borderBottom: '1px #efefef solid'
        },
        tableWrapper: {
            height: 'calc(100% - 169px)',
            overflowY: 'auto',
            overflowX: 'hidden',
            margin: '0 -30px !important',
            '& .row': {
                padding: '0 30px',
                '&:after': {
                    bottom: '-1px'
                },
                '& > div': {
                    display: 'flex',
                    height: '50px',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    '&:first-child': {
                        justifyContent: 'flex-start'
                    }
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
        headers: {
            backgroundColor: '#fff',
            fontWeight: '600',
            color: '#666',
            '& > div': {
                height: '40px !important'
            }
        },
        list: {
            '&:nth-child(even)': {
                background: '#f9f9f9'
            },
            '&:last-child:after': {
                content: '""',
                backgroundImage: 'none'
            }
        },
        expandedList: {
            extend: 'list',
            borderTop: '1px #dadada solid',
            borderBottom: '1px #dadada solid',
            '& > div': {
                fontWeight: 'bold'
            }
        },
        detail: {
            width: '100%',
            fontWeight: '400 !important',
            display: 'block !important',
            borderTop: '1px #efefef solid',
            '& .dottedList': {
                '& > div': {
                    padding: '0 5px'
                },
                '& > div:nth-child(2)': {
                    justifyContent: 'flex-start'
                },
                '&:last-child:after': {
                    display: 'none'
                }
            }
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
        form: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        filter: {
            display: 'flex',
            alignItems: 'center',
            '& > div': {
                width: '300px !important',
                position: 'relative',
                marginRight: '40px',
                '&:last-child': {
                    margin: '0'
                },
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
                '&:last-child:after': {
                    display: 'none'
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
            overflow: 'hidden'
        },
        searchButton: {
            marginLeft: '-10px !important',
            '& div': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
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
        diagram: {
            marginTop: '30px'
        },
        salesSummary: {
            '& > div:first-child': {
                color: '#666'
            },
            '& > div:last-child': {
                fontSize: '24px',
                fontWeight: '600'
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
    }),
    reduxForm({
        form: 'StatDebtorsFilterForm',
        enableReinitialize: true
    }),
)

const StatDebtorsGridList = enhance((props) => {
    const {
        classes,
        filter,
        listData,
        detailData,
        handleSubmitFilterDialog,
        statDebtorsDialog,
        handleOpenCloseDetail,
        getDocument
    } = props

    const iconStyle = {
        icon: {
            color: '#5d6474',
            width: 24,
            height: 24
        },
        button: {
            width: 40,
            height: 40,
            padding: 0
        }
    }

    const listLoading = _.get(listData, 'listLoading')
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const headers = (
        <Row className={classes.headers}>
            <Col xs={5}>Клиент</Col>
            <Col xs={3}>Просроченные ({primaryCurrency})</Col>
            <Col xs={3}>Ожидаемые ({primaryCurrency})</Col>
        </Row>
    )

    const detailList = _.map(_.get(detailData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const createdDate = moment(_.get(item, 'createdDate')).format(('DD.MM.YYYY'))
        const totalPrice = numberFormat(_.get(item, 'totalPrice'), primaryCurrency)
        const totalBalance = numberFormat(_.get(item, 'totalBalance'), primaryCurrency)
        const paymentType = _.get(item, 'paymentType')
        const totalExpected = numberFormat(_.toInteger(_.get(item, 'totalPrice')) - _.toInteger(_.get(item, 'totalBalance')), primaryCurrency)
        return (
            <Row key={id} className="dottedList">
                <div style={{flexBasis: '9%', maxWidth: '9%'}}>{id}</div>
                <div style={{flexBasis: '21%', maxWidth: '21%'}}>{createdDate}</div>
                <div style={{flexBasis: '14%', maxWidth: '14%'}}>{(paymentType === '0') ? 'Нал.' : 'Переч.'}</div>
                <div style={{flexBasis: '19%', maxWidth: '19%'}}>{totalPrice}</div>
                <div style={{flexBasis: '15%', maxWidth: '15%'}}>{totalBalance}</div>
                <div style={{flexBasis: '15%', maxWidth: '15%'}}>{totalExpected}</div>
                <div style={{flexBasis: '7%', maxWidth: '7%', paddingRight: '0'}}>
                    <IconButton
                        onTouchTap={() => { statDebtorsDialog.handleOpenStatDebtorsDialog(id) }}>
                        <List color="#12aaeb"/>
                    </IconButton>
                </div>
            </Row>
        )
    })

    const list = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, ['client', 'id'])
        const client = _.get(item, ['client', 'name'])
        const deptSum = numberFormat(_.get(item, 'debtSum'), getConfig('PRIMARY_CURRENCY'))
        const expectSum = numberFormat(_.get(item, 'expectSum'), getConfig('PRIMARY_CURRENCY'))
        if (_.get(detailData, 'openDetailId') === id) {
            return (
                <div key={id} className={classes.expandedList}>
                    <Row>
                        <Col xs={5}>{client}</Col>
                        <Col xs={3}>{deptSum}</Col>
                        <Col xs={3}>{expectSum}</Col>
                        <Col xs={1} style={{paddingRight: '0'}}>
                            <IconButton
                                style={{transform: 'rotate(180deg)'}}
                                disableTouchRipple={true}
                                onTouchTap={() => { handleOpenCloseDetail.handleCloseDetail(id) }}>
                                <ArrowDown color="#12aaeb"/>
                            </IconButton>
                        </Col>
                    </Row>
                    <div className={classes.detail}>
                        <Row className="dottedList">
                            <div style={{flexBasis: '9%', maxWidth: '9%'}}>№ заказа</div>
                            <div style={{flexBasis: '21%', maxWidth: '21%'}}>Ожидаемая дата платежа</div>
                            <div style={{flexBasis: '14%', maxWidth: '14%'}}>Тип оплаты</div>
                            <div style={{flexBasis: '19%', maxWidth: '19%'}}>Сумма заказа ({primaryCurrency})</div>
                            <div style={{flexBasis: '15%', maxWidth: '15%'}}>Оплачено ({primaryCurrency})</div>
                            <div style={{flexBasis: '15%', maxWidth: '15%'}}>Долг ({primaryCurrency})</div>
                            <div style={{flexBasis: '7%', maxWidth: '7%', paddingRight: '0'}}>
                            </div>
                        </Row>
                        {_.get(detailData, 'detailLoading')
                            ? <div style={{textAlign: 'center'}}>
                                <CircularProgress size={40} thickness={4} />
                            </div>
                            : detailList}
                    </div>
                </div>)
        }
        return (
            <Row key={id} className={classes.list}>
                <Col xs={5}>{client}</Col>
                <Col xs={3}>{deptSum}</Col>
                <Col xs={3}>{expectSum}</Col>
                <Col xs={1} style={{paddingRight: '0'}}>
                    <IconButton
                        disableTouchRipple={true}
                        onTouchTap={() => { handleOpenCloseDetail.handleOpenDetail(id) }}>
                        <ArrowDown color="#12aaeb"/>
                    </IconButton>
                </Col>
            </Row>
        )
    })

    const countDebtors = _.get(listData, ['statData', 'debtors'])
    const deptSum = numberFormat(_.get(listData, ['statData', 'debtsSum']), getConfig('PRIMARY_CURRENCY'))
    const expectSum = numberFormat(_.get(listData, ['statData', 'expectSum']), getConfig('PRIMARY_CURRENCY'))
    const page = (
        <div className={classes.mainWrapper}>
            <Row style={{margin: '0', height: '100%'}}>
                <div className={classes.leftPanel}>
                    <StatSideMenu currentUrl={ROUTES.STATISTICS_DEBTORS_URL}/>
                </div>
                <div className={classes.rightPanel}>
                    <div className={classes.wrapper}>
                        <form className={classes.form} onSubmit={handleSubmitFilterDialog}>
                            <div className={classes.filter}>
                                <Field
                                    name="division"
                                    component={DivisionSearchField}
                                    className={classes.inputFieldCustom}
                                    label="Подразделение"
                                    fullWidth={true}
                                />
                                <Field
                                    className={classes.inputFieldCustom}
                                    name="search"
                                    component={TextField}
                                    label="Имя клиента"
                                    fullWidth={true}/>

                                <IconButton
                                    className={classes.searchButton}
                                    iconStyle={iconStyle.icon}
                                    style={iconStyle.button}
                                    type="submit">
                                    <Search/>
                                </IconButton>
                            </div>
                            <a className={classes.excel}
                               onClick = {getDocument.handleGetDocument}>
                                <Excel color="#fff"/> <span>Excel</span>
                            </a>
                        </form>
                        {listLoading
                            ? <div className={classes.loader}>
                                <CircularProgress size={40} thickness={4} />
                            </div>
                            : (_.isEmpty(list) && !listLoading)
                                ? <div className={classes.emptyQuery}>
                                    <div>По вашему запросу ничего не найдено</div>
                                </div>
                                : <div>
                                    <div className={classes.debtors}>
                                        <div>
                                            <span>Всего должников</span>
                                            <div>{countDebtors} клиентов</div>
                                        </div>
                                        <div>
                                            <span>Просроченные платежи</span>
                                            <div>{deptSum}</div>
                                        </div>
                                        <div>
                                            <span>Ожидаемые поступления</span>
                                            <div>{expectSum}</div>
                                        </div>
                                    </div>
                                    <div className={classes.pagination}>
                                        <div><b>Отчет по задолжностям</b></div>
                                        <Pagination filter={filter}/>
                                    </div>
                                    <div className={classes.tableWrapper}>
                                        {headers}
                                        {list}
                                    </div>
                                  </div>
                        }
                    </div>
                </div>
            </Row>
        </div>
    )
    const data = {
        data: _.get(detailData, ['detailOrder']),
        id: _.get(detailData, 'openDetailId')
    }
    return (
        <Container>
            {page}
            <StatSaleDialog
                loading={_.get(detailData, 'detailOrderLoading')}
                detailData={data}
                open={_.get(statDebtorsDialog, 'openStatDebtorsDialog') !== ZERO}
                onClose={statDebtorsDialog.handleCloseStatDebtorsDialog}
                filter={filter}
                type={false}/>
        </Container>
    )
})

StatDebtorsGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    statDebtorsDialog: PropTypes.shape({
        openStatDebtorsDialog: PropTypes.number.isRequired,
        handleCloseStatDebtorsDialog: PropTypes.func.isRequired,
        handleOpenStatDebtorsDialog: PropTypes.func.isRequired
    }).isRequired
}

export default StatDebtorsGridList
