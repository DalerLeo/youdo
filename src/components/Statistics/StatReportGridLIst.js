import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row} from 'react-flexbox-grid'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import {ProductSearchField, DateToDateFieldCustom} from '../ReduxForm'
import StatSideMenu from './StatSideMenu'
import Search from 'material-ui/svg-icons/action/search'
import IconButton from 'material-ui/IconButton'
import CircularProgress from 'material-ui/CircularProgress'
import Excel from 'material-ui/svg-icons/av/equalizer'

export const STAT_REPORT_FILTER_KEY = {
    STOCK: 'stock',
    TYPE: 'type',
    PRODUCT: 'product'
}
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
            height: '100%',
            background: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '999',
            display: 'flex'
        },
        wrapper: {
            padding: '20px 30px',
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden'
        },
        form: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px #efefef solid',
            paddingBottom: '10px'
        },
        blocksWrapper: {
            display: 'flex',
            padding: '15px 0',
            '& > div': {
                width: '50%',
                '&:first-child': {
                    paddingRight: '15px'
                },
                '&:last-child': {
                    paddingLeft: '15px'
                }
            }
        },
        block: {
            marginBottom: '15px',
            '& > span': {
                fontWeight: 'bold'
            },
            '& ul': {
                border: '1px #efefef solid',
                marginTop: '15px',
                '& li': {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '15px',
                    lineHeight: '15px',
                    '&:nth-child(even)': {
                        background: '#f9f9f9'
                    },
                    '& > div': {
                        textAlign: 'right',
                        '& span': {
                            display: 'block',
                            position: 'relative',
                            '&:before': {
                                content: '"нал."',
                                position: 'absolute',
                                left: '-60px',
                                width: '50px'
                            },
                            '&:last-child:before': {
                                content: '"безнал."'
                            }
                        }
                    }
                }
            }
        },
        filter: {
            display: 'flex',
            alignItems: 'center',
            '& > div': {
                width: '140px!important',
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
        }
    }),
    reduxForm({
        form: 'StatReportFilterForm',
        enableReinitialize: true
    }),
)

const StatReportGridList = enhance((props) => {
    const {
        classes,
        listData,
        getDocument,
        handleSubmit,
        onSubmit
    } = props

    const listLoading = _.get(listData, 'listLoading')

    const iconStyle = {
        icon: {
            color: '#5d6474',
            width: 22,
            height: 22
        },
        button: {
            width: 40,
            height: 40,
            padding: 0
        }
    }

    const stock = (
        <div className={classes.block}>
            <span>Склад</span>
            <ul>
                <li>
                    <span>Сумма товаров на начало периода</span>
                    <span>25 000 000 UZS</span>
                </li>
                <li>
                    <span>Поступления на склад</span>
                    <span>15 000 000 UZS</span>
                </li>
                <li>
                    <span>Выдано со склада</span>
                    <span>20 000 000 UZS</span>
                </li>
                <li>
                    <span>Сумма товаров на конец периода</span>
                    <span>30 000 000 UZS</span>
                </li>
            </ul>
        </div>
    )

    const productRealisation = (
        <div className={classes.block}>
            <span>Реализация товара</span>
            <ul>
                <li>
                    <span>Стоимость проданного товара</span>
                    <span>25 000 000 UZS</span>
                </li>
                <li>
                    <span>Себистоимость товара</span>
                    <span>15 000 000 UZS</span>
                </li>
                <li>
                    <span>Доход от продаж</span>
                    <span>20 000 000 UZS</span>
                </li>
            </ul>
        </div>
    )

    const incomeOutcome = (
        <div className={classes.block}>
            <span>Доходы / Расходы</span>
            <ul>
                <li>
                    <span>Доход от продаж</span>
                    <span>25 000 000 UZS</span>
                </li>
                <li>
                    <span>Списанные товары</span>
                    <span>15 000 000 UZS</span>
                </li>
                <li>
                    <span>Прочие расходы фирмы</span>
                    <span>20 000 000 UZS</span>
                </li>
                <li>
                    <span>Прибыль фирмы</span>
                    <span>20 000 000 UZS</span>
                </li>
            </ul>
        </div>
    )

    const cashboxReports = (
        <div className={classes.block}>
            <span>Отчет по кассам</span>
            <ul>
                <li>
                    <span>Баланс <br/> на начало периода</span>
                    <div>
                        <span>5 000 000 UZS</span>
                        <span>15 000 000 UZS</span>
                    </div>
                </li>
                <li>
                    <span>Поступления</span>
                    <div>
                        <span>5 000 000 UZS</span>
                        <span>15 000 000 UZS</span>
                    </div>
                </li>
                <li>
                    <span>Списания</span>
                    <div>
                        <span>5 000 000 UZS</span>
                        <span>15 000 000 UZS</span>
                    </div>
                </li>
                <li>
                    <span>Баланс <br/> на конец периода</span>
                    <div>
                        <span>5 000 000 UZS</span>
                        <span>15 000 000 UZS</span>
                    </div>
                </li>
            </ul>
        </div>
    )

    const debtors = (
        <div className={classes.block}>
            <span>Задолжности</span>
            <ul>
                <li>
                    <span>Задолжности клиентов</span>
                    <span>25 000 000 UZS</span>
                </li>
                <li>
                    <span>Задолжности фирмы</span>
                    <span>15 000 000 UZS</span>
                </li>
            </ul>
        </div>
    )

    const page = (
        <div className={classes.mainWrapper}>
            <Row style={{margin: '0', height: '100%'}}>
                <div className={classes.leftPanel}>
                    <StatSideMenu currentUrl={ROUTES.STATISTICS_REPORT_URL}/>
                </div>
                <div className={classes.rightPanel}>
                    {listLoading
                        ? <div className={classes.loader}>
                            <CircularProgress size={40} thickness={4}/>
                        </div>
                        : <div className={classes.wrapper}>
                            <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                                <div className={classes.filter}>
                                    <Field
                                        className={classes.inputFieldCustom}
                                        name="date"
                                        component={DateToDateFieldCustom}
                                        label="Диапазон дат"
                                        fullWidth={true}/>
                                    <Field
                                        className={classes.inputFieldCustom}
                                        name="product"
                                        component={ProductSearchField}
                                        label="Товары"
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
                                   onClick={getDocument.handleGetDocument}>
                                    <Excel color="#fff"/> <span>Excel</span>
                                </a>
                            </form>
                            <div className={classes.blocksWrapper}>
                                <div>
                                    {stock}
                                    {productRealisation}
                                    {incomeOutcome}
                                </div>
                                <div>
                                    {cashboxReports}
                                    {debtors}
                                </div>
                            </div>
                        </div>}
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

StatReportGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object
}

export default StatReportGridList
