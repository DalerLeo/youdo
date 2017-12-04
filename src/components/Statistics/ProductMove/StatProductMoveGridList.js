import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row} from 'react-flexbox-grid'
import * as ROUTES from '../../../constants/routes'
import Container from '../../Container/index'
import injectSheet from 'react-jss'
import {compose, withState, lifecycle} from 'recompose'
import {Field, reduxForm} from 'redux-form'
import {connect} from 'react-redux'
import ordering from '../../../helpers/ordering'
import horizontalScroll from '../../../helpers/horizontalScroll'
import {
    DateToDateField,
    StockSearchField,
    ProductTypeParentSearchField,
    ProductTypeChildSearchField,
    TextField
} from '../../ReduxForm/index'
import StatSideMenu from '../StatSideMenu'
import Loader from '../../Loader'
import Pagination from '../../GridList/GridListNavPagination/index'
import numberFormat from '../../../helpers/numberFormat.js'
import getConfig from '../../../helpers/getConfig'
import NotFound from '../../Images/not-found.png'
import {StatisticsFilterExcel} from '../../Statistics'
import ArrowUpIcon from 'material-ui/svg-icons/navigation/arrow-upward'
import ArrowDownIcon from 'material-ui/svg-icons/navigation/arrow-downward'

export const STAT_PRODUCT_MOVE_FILTER_KEY = {
    FROM_DATE: 'fromDate',
    TO_DATE: 'toDate',
    STOCK: 'stock',
    TYPE_PARENT: 'typeParent',
    TYPE: 'type',
    SEARCH: 'search'
}

const enhance = compose(
    injectSheet({
        loader: {
            position: 'absolute',
            top: '0',
            left: '-30px',
            right: '-30px',
            bottom: '0',
            padding: '100px 0',
            background: '#fff',
            zIndex: '30'
        },
        summaryLoader: {
            width: '100%',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            padding: '0'
        },
        mainWrapper: {
            background: '#fff',
            margin: '0 -28px',
            height: 'calc(100% + 28px)',
            boxShadow: 'rgba(0, 0, 0, 0.09) 0px -1px 6px, rgba(0, 0, 0, 0.10) 0px -1px 4px'
        },
        wrapper: {
            WebkitTransition: 'all 500ms ease',
            padding: '20px 30px 0',
            display: 'flex',
            flexDirection: 'column',
            '& .row': {
                margin: '0 !important'
            }
        },
        container: {
            position: 'relative'
        },
        tableWrapper: {
            display: 'flex',
            margin: '0 -30px',
            paddingLeft: '30px',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '200px',
            '& > div:first-child': {
                zIndex: '20',
                boxShadow: '5px 0 8px -3px #ccc',
                width: '350px'
            },
            '& > div:last-child': {
                width: 'calc(100% - 320px)',
                overflowX: 'auto',
                overflowY: 'hidden'
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
            overflowY: 'auto'
        },
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center center',
            backgroundSize: '200px',
            padding: '200px 0 0',
            textAlign: 'center',
            fontSize: '13px',
            color: '#666'
        },
        pointer: {
            cursor: 'pointer'
        },
        summary: {
            padding: '30px 0'
        },
        summaryWrapper: {
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            '& > div': {
                '& > div:nth-child(odd)': {
                    color: '#666'
                },
                '& > div:nth-child(even)': {
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '10px',
                    '& > span': {
                        fontWeight: '500',
                        fontSize: '13px'

                    }
                },
                '& > div:last-child': {
                    marginBottom: '0'
                },
                '&:last-child': {
                    textAlign: 'right'
                }
            }
        },
        pagination: {
            display: 'flex',
            justifyContent: 'space-between',
            margin: '10px -30px 0',
            padding: '0 30px',
            borderTop: '1px #efefef solid',
            alignItems: 'center',
            '& > div:first-child': {
                fontWeight: '600'
            }
        },
        borderRight: {
            borderRight: 'solid 1px #efefef'
        },
        tableBody: {
            '& > tr:first-child > td:first-child': {
                width: '125px'
            },
            '& tr:first-child > td:first-child': {
                verticalAlign: 'bottom',
                padding: '0 30px 15px'
            }
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
        },
        icon: {
            color: '#666 !important',
            height: '15px !important'
        },
        subTitle: {
            extend: 'title',
            '& td:nth-child(odd)': {
                borderRight: 'none'
            },
            '& td:nth-child(even)': {
                borderLeft: 'none',
                textAlign: 'right'
            },
            '& > td': {
                cursor: 'pointer'
            }
        },
        leftTable: {
            color: '#666',
            display: 'table',
            marginLeft: '-30px',
            width: '100%',
            '& > div': {
                '&:nth-child(odd)': {
                    backgroundColor: '#f9f9f9'
                },
                display: 'table-row',
                height: '40px',
                '&:nth-child(2)': {
                    height: '39px'
                },
                '&:first-child': {
                    backgroundColor: 'white',
                    height: '81px',
                    verticalAlign: 'bottom',
                    '& span': {
                        fontWeight: '600',
                        verticalAlign: 'bottom',
                        padding: '15px 30px',
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
        tableRow: {
            '& td:nth-child(odd)': {
                borderRight: '1px #efefef solid',
                textAlign: 'right'
            },
            '& td:nth-child(1)': {
                textAlign: 'left'
            },
            '&:nth-child(even)': {
                backgroundColor: '#f9f9f9'
            }
        }

    }),
    reduxForm({
        form: 'StatisticsFilterForm',
        enableReinitialize: true
    }),
    connect((state) => {
        const typeParent = _.get(state, ['form', 'StatisticsFilterForm', 'values', 'typeParent'])
        return {
            typeParent
        }
    }),
    withState('currentRow', 'setCurrentRow', null),
    lifecycle({
        componentDidMount () {
            const horizontalTable = this.refs.horizontalTable
            horizontalScroll(horizontalTable)
        }
    })
)
const listHeader = [
    {
        sorting: true,
        name: 'startRemainderAmount',
        title: 'Кол-во'
    },
    {
        sorting: true,
        name: 'startRemainderCost',
        title: 'Стоимость'
    },
    {
        sorting: true,
        name: 'receivedAmount',
        title: 'Кол-во'
    },
    {
        sorting: true,
        name: 'receivedCost',
        title: 'Стоимость'
    },
    {
        sorting: true,
        name: 'issuedAmount',
        title: 'Кол-во'
    },
    {
        sorting: true,
        name: 'issuedCost',
        title: 'Стоимость'
    },
    {
        sorting: true,
        name: 'writeoffAmount',
        title: 'Кол-во'
    },
    {
        sorting: true,
        name: 'writeoffCost',
        title: 'Стоимость'
    },
    {
        sorting: true,
        name: 'endRemainderAmount',
        title: 'Кол-во'
    },
    {
        sorting: true,
        name: 'endRemainderCost',
        title: 'Стоимость'
    },
    {
        sorting: true,
        name: 'returnAmount',
        title: 'Кол-во'
    },
    {
        sorting: true,
        name: 'returnCost',
        title: 'Стоимость'
    }
]
const styleOnHover = {
    background: '#efefef'
}
const StatProductMoveGridList = enhance((props) => {
    const {
        classes,
        listData,
        sumData,
        filter,
        handleSubmitFilterDialog,
        getDocument,
        typeParent,
        initialValues,
        handleSubmit,
        currentRow,
        setCurrentRow
    } = props

    const summaryMeasurement = 'шт'
    const listLoading = _.get(listData, 'listLoading')
    const sumListLoading = _.get(sumData, 'sumListLoading')
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')

    const beginBalance = numberFormat(Math.abs(_.get(sumData, ['data', 'beginPriceSum'])), primaryCurrency)
    const endBalance = numberFormat(Math.abs(_.get(sumData, ['data', 'endPriceSum'])), primaryCurrency)
    const inBalance = numberFormat(Math.abs(_.get(sumData, ['data', 'inPriceSum'])), primaryCurrency)
    const outBalance = numberFormat(Math.abs(_.get(sumData, ['data', 'outPriceSum'])), primaryCurrency)
    const returnBalance = numberFormat(Math.abs(_.get(sumData, ['data', 'returnPriceSum'])), primaryCurrency)
    const writeoffBalance = numberFormat(Math.abs(_.get(sumData, ['data', 'writeoffPriceSum'])), primaryCurrency)

    // Amounts
    const beginAmount = numberFormat(Math.abs(_.get(sumData, ['data', 'beginBalanceSum'])))
    const endAmount = numberFormat(Math.abs(_.get(sumData, ['data', 'endBalanceSum'])))
    const inAmount = numberFormat(Math.abs(_.get(sumData, ['data', 'inBalanceSum'])))
    const outAmount = numberFormat(Math.abs(_.get(sumData, ['data', 'outBalanceSum'])))
    const returnAmount = numberFormat(Math.abs(_.get(sumData, ['data', 'returnBalanceSum'])))
    const writeoffAmount = numberFormat(Math.abs(_.get(sumData, ['data', 'writeoffBalanceSum'])))

    const tableLeft = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name') || 'No'
        return (
            <div
                key={id}
                onMouseLeave={() => setCurrentRow(null)}
                onMouseEnter={() => setCurrentRow(id)}
                style={currentRow === id ? styleOnHover : {}}>
                <span>{name}</span>
            </div>
        )
    })

    const tableList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const measurement = _.get(item, ['measurement', 'name'])
        const code = _.get(item, 'code') || 'неизвестно'

        const beginBalancePr = numberFormat(_.get(item, 'beginBalance'), measurement)
        const beginPricePr = numberFormat(_.get(item, 'beginPrice'), primaryCurrency)

        const inBalancePr = numberFormat(_.get(item, 'inBalance'), measurement)
        const inPricePr = numberFormat(_.get(item, 'inPrice'), primaryCurrency)

        const outBalancePr = numberFormat(_.get(item, 'outBalance'), measurement)
        const outPricePr = numberFormat(_.get(item, 'outPrice'), primaryCurrency)

        const endBalancePr = numberFormat(_.get(item, 'endBalance'), measurement)
        const endPricePr = numberFormat(_.get(item, 'endPrice'), primaryCurrency)

        const returnBalancePr = numberFormat(_.get(item, 'returnBalance'), measurement)
        const returnPricePr = numberFormat(_.get(item, 'returnPrice'), primaryCurrency)

        const writeoffBalancePr = numberFormat(_.get(item, 'writeoffBalance'), measurement)
        const writeoffPricePr = numberFormat(_.get(item, 'writeoffPrice'), primaryCurrency)
        return (
            <tr
                key={id}
                className={classes.tableRow}
                style={id === currentRow ? styleOnHover : {}}
                onMouseEnter={() => setCurrentRow(id)}
                onMouseLeave={() => setCurrentRow(null)}>
                <td>{code}</td>

                <td>{beginBalancePr}</td>
                <td>{beginPricePr}</td>

                <td>{inBalancePr}</td>
                <td>{inPricePr}</td>

                <td>{returnBalancePr}</td>
                <td>{returnPricePr}</td>

                <td>{outBalancePr}</td>
                <td>{outPricePr}</td>

                <td>{writeoffBalancePr}</td>
                <td>{writeoffPricePr}</td>

                <td>{endBalancePr}</td>
                <td>{endPricePr}</td>
            </tr>
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
                className={classes.inputFieldCustom}
                name="stock"
                component={StockSearchField}
                label="Склад"
                fullWidth={true}/>
            <Field
                name="typeParent"
                className={classes.inputFieldCustom}
                component={ProductTypeParentSearchField}
                label="Тип продукта"
                fullWidth={true}
            />
            {typeParent ? <Field
                name="type"
                className={classes.inputFieldCustom}
                component={ProductTypeChildSearchField}
                parentType={typeParent}
                label="Подкатегория"
                fullWidth={true}
            /> : null}
        </div>
    )

    const page = (
        <div className={classes.mainWrapper}>
            <Row style={{margin: '0', height: '100%'}}>
                <div className={classes.leftPanel}>
                    <StatSideMenu currentUrl={ROUTES.STATISTICS_PRODUCT_MOVE_URL} filter={filter}/>
                </div>
                <div className={classes.rightPanel}>
                    <div className={classes.wrapper}>
                        <StatisticsFilterExcel
                            filter={filter}
                            fields={fields}
                            filterKeys={STAT_PRODUCT_MOVE_FILTER_KEY}
                            initialValues={initialValues}
                            handleGetDocument={getDocument.handleGetDocument}
                            handleSubmitFilterDialog={handleSubmitFilterDialog}
                        />
                        <div className={classes.summary}>
                            {sumListLoading
                                ? <div className={classes.summaryLoader}>
                                    <Loader size={0.75}/>
                                </div>
                                : <div className={classes.summaryWrapper}>
                                    <div>
                                        <div>Остаток на начало периода</div>
                                        <div>{beginBalance} <span>({beginAmount} {summaryMeasurement})</span> </div>
                                        <div>Остаток на конец периода</div>
                                        <div>{endBalance} <span>({endAmount} {summaryMeasurement})</span></div>
                                    </div>
                                    <div>
                                        <div>Поступило товара на сумму</div>
                                        <div>{inBalance} <span>({inAmount} {summaryMeasurement})</span></div>
                                        <div>Возврат за период</div>
                                        <div>{returnBalance} <span>({outAmount} {summaryMeasurement})</span></div>
                                    </div>
                                    <div>
                                        <div>Выдано по заказу</div>
                                        <div>{outBalance} <span>({returnAmount} {summaryMeasurement})</span></div>
                                        <div>Cписано за период</div>
                                        <div>{writeoffBalance} <span>({writeoffAmount} {summaryMeasurement})</span></div>
                                    </div>
                                </div>}
                        </div>
                        <div className={classes.pagination}>
                            <div>Движение товаров на складе</div>
                            <form onSubmit={handleSubmit(handleSubmitFilterDialog)}>
                                <Field
                                    className={classes.inputFieldCustom}
                                    name="search"
                                    component={TextField}
                                    hintText="Поиск"/>
                            </form>
                            <Pagination filter={filter}/>
                        </div>
                        <div className={classes.container}>
                            {listLoading && <div className={classes.loader}>
                                <Loader size={0.75}/>
                            </div>}
                            <div className={classes.tableWrapper}>
                                <div className={classes.leftTable}>
                                    <div><span>Товар</span></div>
                                    {tableLeft}
                                </div>
                                {_.isEmpty(tableList) && !listLoading &&
                                <div className={classes.emptyQuery}>
                                    <div>По вашему запросу ничего не найдено</div>
                                </div>}
                                <div ref="horizontalTable">
                                    <table className={classes.mainTable}>
                                        <tbody className={classes.tableBody}>
                                        <tr className={classes.title}>
                                            <td rowSpan={2}>Код товара</td>

                                            <td colSpan={2}>Остаток на начало периода</td>
                                            <td colSpan={2}>Поступивший товара за период</td>
                                            <td colSpan={2}>Возврат</td>
                                            <td colSpan={2}>Выдано по заказу</td>
                                            <td colSpan={2}>Списано за период</td>
                                            <td colSpan={2}>Остаток на конец</td>
                                        </tr>
                                        <tr className={classes.subTitle}>
                                            {_.map(listHeader, (header, index) => {
                                                const sortingType = filter.getSortingType(header.name)
                                                const icon = _.isNil(sortingType) ? null : sortingType ? <ArrowUpIcon className={classes.icon}/> : <ArrowDownIcon className={classes.icon}/>

                                                if (!header.sorting) {
                                                    return <td>{header.title}</td>
                                                }
                                                return (
                                                    <td
                                                        key={index}
                                                        style={{cursor: 'pointer'}}
                                                        onClick={() => ordering(filter, header.name, props.pathname)}>
                                                        {header.title}{icon}
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                        {tableList}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
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

StatProductMoveGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object
}

export default StatProductMoveGridList
