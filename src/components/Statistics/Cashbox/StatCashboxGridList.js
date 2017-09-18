/* eslint-disable no-shadow */
import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row} from 'react-flexbox-grid'
import * as ROUTES from '../../../constants/routes'
import Container from '../../Container/index'
import CircularProgress from 'material-ui/CircularProgress'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {reduxForm, Field} from 'redux-form'
import {CashboxSearchField, DivisionSearchField} from '../../ReduxForm/index'
import DateToDateField from '../../ReduxForm/Basic/DateToDateField'
import StatSideMenu from '../StatSideMenu'
import Search from 'material-ui/svg-icons/action/search'
import IconButton from 'material-ui/IconButton'
import Excel from 'material-ui/svg-icons/av/equalizer'
import numberFormat from '../../../helpers/numberFormat.js'
import NotFound from '../../Images/not-found.png'
import CashboxDetails from './StatCashboxDetails'
import getConfig from '../../../helpers/getConfig'

const BANK = 1
const NEGATIVE = -1
export const STAT_CASHBOX_FILTER_KEY = {
    CASHBOX: 'cashbox',
    DIVISION: 'division',
    TO_DATE: 'toDate',
    FROM_DATE: 'fromDate'
}
const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            height: '100%',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
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
                marginTop: '10px',
                borderTop: '1px #efefef solid'
            },
            '& .row': {
                margin: '0 !important'
            }
        },
        cashboxWrapper: {
            display: 'flex',
            flexWrap: 'wrap',
            marginTop: '45px'
        },
        cashbox: {
            marginRight: '45px',
            width: 'calc((100% / 3) - 30px)',
            '&:nth-child(3n+3)': {
                margin: '0'
            }
        },
        cashboxTitle: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '5px',
            borderBottom: '1px #efefef solid',
            '& > div:first-child': {
                fontWeight: 'bold',
                '& a': {
                    fontWeight: 'inherit',
                    color: 'inherit'
                }
            },
            '& > div:last-child': {
                color: '#666'
            }
        },
        cashboxFooter: {
            extend: 'cashboxTitle',
            '& > div': {
                lineHeight: '15px'
            },
            '& > div:last-child': {
                color: '#333 !important',
                textAlign: 'right'
            }
        },
        cashboxBalance: {
            '& > div:first-child': {
                color: '#666',
                fontSize: '11px',
                fontWeight: '600 !important'
            }
        },
        avatar: {
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            overflow: 'hidden',
            '& img': {
                width: '100%',
                height: '100%'
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
                width: '170px !important',
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
                        display: 'none'
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
            position: 'relative'
        },
        searchButton: {
            marginLeft: '-10px !important',
            '& div': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }
        },
        balances: {
            padding: '20px 0'
        },
        balanceItem: {
            flexBasis: '25%',
            maxWidth: '25%',
            '& span': {
                color: '#666',
                marginBottom: '5px'
            },
            '& div': {
                fontSize: '24px',
                fontWeight: '600'
            },
            '&:last-child': {
                marginRight: '0'
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
        },
        tableRow: {
            '& td': {
                borderRight: '1px #efefef solid',
                textAlign: 'right'
            },
            '& td:nth-child(1)': {
                textAlign: 'left'
            },
            '&:nth-child(even)': {
                backgroundColor: '#f9f9f9'
            }
        },
        leftTable: {
            display: 'table',
            marginLeft: '-30px',
            width: '100%',
            '& > div': {
                '&:nth-child(even)': {
                    backgroundColor: '#f9f9f9'
                },
                display: 'table-row',
                height: '40px',
                '&:nth-child(2)': {
                    height: '39px'
                },
                '&:first-child': {
                    backgroundColor: 'white',
                    height: '41px',
                    '& span': {

                        padding: '10px 30px',
                        borderTop: '1px #efefef solid',
                        borderBottom: '1px #efefef solid'
                    }
                },
                '& span': {
                    display: 'table-cell',
                    verticalAlign: 'middle',
                    padding: '0 30px'
                }
            }
        },
        tableWrapper: {
            display: 'flex',
            margin: '0 -30px',
            paddingLeft: '30px',
            '& > div:first-child': {
                zIndex: '20',
                boxShadow: '5px 0 8px -3px #CCC',
                width: '255px'
            },
            '& > div:last-child': {
                width: 'calc(100% - 255px)',
                overflowX: 'auto',
                overflowY: 'hidden'
            }
        },
        tableBody: {
        },
        mainTable: {
            width: '100%',
            minWidth: '1200px',
            color: '#666',
            borderCollapse: 'collapse',
            '& tr, td': {
                height: '40px'
            },
            '& td': {
                padding: '0 20px',
                minWidth: '140px'
            }
        },
        title: {
            fontWeight: '600',
            '& tr, td': {
                border: '1px #efefef solid'
            }
        }
    }),
    reduxForm({
        form: 'StatCashboxFilterForm',
        enableReinitialize: true
    }),
)
let arr = []
for (let i = 0, t = 20; i < t; i++) {
    arr.push(Math.round(Math.random() * t))
}

const StatCashboxGridList = enhance((props) => {
    const {
        filter,
        listData,
        detailData,
        classes,
        getDocument,
        handleSubmitFilterDialog
    } = props
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const listLoading = _.get(listData, 'listLoading')
    const openDetails = _.get(listData, 'openDetails')
    const startBalance = _.get(listData, ['sumData', 'startBalance'])
    const endBalance = _.get(listData, ['sumData', 'endBalance'])
    const income = _.get(listData, ['sumData', 'income'])
    const expense = _.toNumber(_.get(listData, ['sumData', 'expenses'])) * NEGATIVE

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
    const tableLeft = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name') || 'No'
        return (
            <div key={id} style={{cursor: 'pointer'}} onClick={() => listData.handleOpenDetail(id)}><span>{name}</span></div>
        )
    })

    const tableList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const cashierFirstName = _.get(item, ['cashier', 'firstName'])
        const cashierSecondName = _.get(item, ['cashier', 'secondName'])
        const cashier = cashierFirstName + ' ' + cashierSecondName
        const type = _.toInteger(_.get(item, 'type')) === BANK ? 'банковский счет' : 'наличные'
        const currency = _.get(item, ['currency', 'name'])

        const endBalance = numberFormat(_.get(item, 'endBalance'), primaryCurrency)
        const startBalance = numberFormat(_.get(item, 'startBalance'), primaryCurrency)
        const income = numberFormat(_.get(item, 'income'), primaryCurrency)
        const expenses = numberFormat(_.get(item, 'expenses'), primaryCurrency)

        return (
            <tr key={id} className={classes.tableRow}>
                <td>{cashier}</td>
                <td>{type}</td>
                <td>{currency}</td>
                <td>{startBalance}</td>
                <td>{income}</td>
                <td>{expenses}</td>
                <td>{endBalance}</td>

            </tr>
        )
    })

    const page = (
        <div className={classes.mainWrapper}>
            <Row style={{margin: '0', height: '100%'}}>
                <div className={classes.leftPanel}>
                    <StatSideMenu currentUrl={ROUTES.STATISTICS_CASHBOX_URL}/>
                </div>
                <div className={classes.rightPanel}>
                     <div className={classes.wrapper}>
                            <form className={classes.form} onSubmit={handleSubmitFilterDialog}>
                                <div className={classes.filter}>
                                    <Field
                                        className={classes.inputFieldCustom}
                                        name="date"
                                        component={DateToDateField}
                                        label="Диапазон дат"
                                        fullWidth={true}/>
                                    <Field
                                        name="division"
                                        component={DivisionSearchField}
                                        className={classes.inputFieldCustom}
                                        label="Подразделение"
                                        fullWidth={true}
                                    />
                                    <Field
                                        className={classes.inputFieldCustom}
                                        name="cashbox"
                                        component={CashboxSearchField}
                                        label="Кассы"
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
                            {listLoading
                            ? <div className={classes.loader}>
                                 <CircularProgress size={40} thickness={4}/>
                              </div>
                            : _.isEmpty(tableList)
                                 ? <div className={classes.emptyQuery}>
                                     <div>По вашему запросу ничего не найдено</div>
                                   </div>
                                 : <div>
                                     <Row className={classes.balances}>
                                         <div className={classes.balanceItem}>
                                             <span>Баланс на начало периода</span>
                                             <div>{numberFormat(startBalance, primaryCurrency)}</div>
                                         </div>
                                         <div className={classes.balanceItem}>
                                             <span>Расход за период</span>
                                             <div>{numberFormat(expense, primaryCurrency)}</div>
                                         </div>
                                         <div className={classes.balanceItem}>
                                             <span>Приход за период</span>
                                             <div>{numberFormat(income, primaryCurrency)}</div>
                                         </div>
                                         <div className={classes.balanceItem}>
                                             <span>Баланс на конец периода</span>
                                             <div>{numberFormat(endBalance, primaryCurrency)}</div>
                                         </div>
                                     </Row>
                                        <div className={classes.tableWrapper}>
                                            <div className={classes.leftTable}>
                                                <div><span>Касса</span></div>
                                                {tableLeft}
                                            </div>
                                            <div>
                                                <table className={classes.mainTable}>
                                                    <tbody>
                                                    <tr className={classes.title}>
                                                        <td>Кассир</td>
                                                        <td>Тип</td>
                                                        <td>Валюта</td>
                                                        <td>Баланс на начало периода</td>
                                                        <td>Расход за период</td>
                                                        <td>Приход за период</td>
                                                        <td>Баланс на конец периода</td>
                                                    </tr>
                                                    {tableList}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                 </div>}
                        </div>

                    {openDetails && <CashboxDetails
                        filter={filter}
                        detailData={detailData}
                        listData={listData}
                        handleSubmitFilterDialog={_.get(detailData, 'handleSubmitDetailFilterDialog')}
                        getDocument={getDocument}
                    />}
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

StatCashboxGridList.propTypes = {
    filter: PropTypes.object,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    handleSubmitFilterDialog: PropTypes.func,
    getDocument: PropTypes.object
}

export default StatCashboxGridList
