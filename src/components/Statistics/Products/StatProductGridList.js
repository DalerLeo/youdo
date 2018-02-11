import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row} from 'react-flexbox-grid'
import * as ROUTES from '../../../constants/routes'
import Container from '../../Container/index'
import Loader from '../../Loader'
import {compose, lifecycle, withState} from 'recompose'
import injectSheet from 'react-jss'
import StatSideMenu from '../StatSideMenu'
import ToolTip from '../../ToolTip'
import Pagination from '../../GridList/GridListNavPagination/index'
import getConfig from '../../../helpers/getConfig'
import numberFormat from '../../../helpers/numberFormat.js'
import horizontalScroll from '../../../helpers/horizontalScroll.js'
import NotFound from '../../Images/not-found.png'
import {TextField, ProductTypeChildSearchField, ProductTypeParentSearchField, DateToDateField, ClientMultiSearchField} from '../../ReduxForm'
import ordering from '../../../helpers/ordering'
import {reduxForm, Field} from 'redux-form'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import Search from 'material-ui/svg-icons/action/search'
import ExpandList from 'material-ui/svg-icons/action/list'
import ArrowUpIcon from 'material-ui/svg-icons/navigation/arrow-upward'
import ArrowDownIcon from 'material-ui/svg-icons/navigation/arrow-downward'
import {StatisticsFilterExcel} from '../../Statistics'
import {connect} from 'react-redux'
import FullScreen from 'material-ui/svg-icons/navigation/fullscreen'
import FullScreenExit from 'material-ui/svg-icons/navigation/fullscreen-exit'
import t from '../../../helpers/translate'
import Product from 'material-ui/svg-icons/device/widgets'
import ProductType from 'material-ui/svg-icons/action/settings-input-component'
import {hashHistory} from 'react-router'

export const STAT_PRODUCT_FILTER_KEY = {
    SEARCH: 'search',
    CLIENT: 'client',
    PRODUCT_TYPE: 'productType',
    PRODUCT_TYPE_CHILD: 'productTypeChild',
    TO_DATE: 'toDate',
    FROM_DATE: 'fromDate'
}

export const PRODUCT = 'product'
export const PRODUCT_TYPE = 'productType'

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
        sumLoader: {
            width: '100%',
            margin: '0 !important',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex',
            padding: '0',
            height: '72px'
        },
        mainWrapper: {
            background: '#fff',
            margin: '0 -28px',
            height: 'calc(100% + 28px)',
            boxShadow: 'rgba(0, 0, 0, 0.09) 0px -1px 6px, rgba(0, 0, 0, 0.10) 0px -1px 4px'
        },
        wrapper: {
            height: '100%',
            overflowX: 'hidden',
            overflowY: 'auto',
            padding: '20px 30px 0',
            '& .row': {
                margin: '0 !important'
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
        emptyQuery: {
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            background: '#fff url(' + NotFound + ') no-repeat center 20px',
            backgroundSize: '200px',
            padding: '160px 0 0',
            textAlign: 'center',
            fontSize: '13px',
            color: '#666',
            zIndex: '30',
            '& svg': {
                width: '50px !important',
                height: '50px !important',
                color: '#999 !important'
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
        form: {
            display: 'flex',
            alignItems: 'center',
            width: '30%',
            position: 'relative'
        },
        tableRow: {
            '& td:nth-child(odd)': {
                borderRight: '1px #efefef solid',
                textAlign: 'right'
            },
            '& td:nth-child(1)': {
                textAlign: 'left'
            },
            '&:nth-child(odd)': {
                backgroundColor: '#f9f9f9'
            }
        },
        tableRowExt: {
            '& td:nth-child(even)': {
                borderRight: '1px #efefef solid',
                textAlign: 'right'
            },
            '& td:last-child': {
                borderRight: '1px #efefef solid',
                textAlign: 'right'
            },
            '& td:nth-child(1)': {
                textAlign: 'left'
            },
            '&:nth-child(odd)': {
                backgroundColor: '#f9f9f9'
            }
        },
        leftTable: {
            color: '#666',
            display: 'table',
            marginLeft: '-30px',
            width: '100%',
            '& > div': {
                cursor: 'pointer',
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
                    height: '81px',
                    verticalAlign: 'bottom',
                    '& span': {
                        verticalAlign: 'bottom',
                        padding: '15px 30px',
                        borderTop: '1px #efefef solid',
                        borderBottom: '1px #efefef solid'
                    }
                },
                '& span': {
                    display: 'table-cell',
                    fontWeight: '600',
                    verticalAlign: 'middle',
                    padding: '0 30px'
                }
            }
        },
        leftTableList: {
            '& > span': {
                display: 'flex !important',
                alignItems: 'center',
                minHeight: '39px',
                justifyContent: 'space-between',
                height: '100%'
            }
        },
        filters: {
            display: 'flex',
            justifyContent: 'space-between'
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
                boxShadow: '5px 0 8px -3px #CCC',
                width: '350px'
            },
            '& > div:last-child': {
                alignSelf: 'baseline',
                width: 'calc(100% - 350px)',
                overflowX: 'auto',
                overflowY: 'hidden'
            }
        },
        tableBody: {
            '& > tr:first-child > td:first-child': {
                minWidth: '220px'
            }
        },
        mainTable: {
            width: '100%',
            minWidth: '950px',
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
        subTitle: {
            extend: 'title',
            '& td:nth-child(odd)': {
                borderRight: 'none'
            },
            '& td:nth-child(even)': {
                borderLeft: 'none',
                textAlign: 'right'
            }
        },
        icon: {
            height: '15px !important'
        },
        summaryWrapper: {
            width: '100%',
            display: 'flex',
            marginTop: '15px',
            justifyContent: 'space-between',
            '& > div': {
                border: '1px solid #efefef',
                borderRadius: '2px',
                padding: '5px 15px',
                width: 'calc((100% / 3) - 10px)',
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
        expandedTable: {
            background: '#fff',
            padding: '0 10px 0 30px',
            position: 'fixed',
            overflowY: 'auto',
            overflowX: 'hidden',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: '100',
            '& > div': {
                margin: '0'
            }
        },
        flexCenter: {
            display: 'flex',
            alignItems: 'center'
        },
        flexSpaceBetween: {
            justifyContent: 'space-between'
        },
        fullScreen: {
            marginLeft: '10px !important'
        },
        toggleWrapper: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '10px 0',
            borderTop: '1px #efefef solid',
            '& > div': {
                display: 'flex',
                background: 'transparent !important'
            },
            '& button': {
                height: '32px !important',
                lineHeight: '32px !important',
                minWidth: '66px !important',
                '& > div': {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '& svg': {
                        width: '20px !important',
                        height: '20px !important'
                    }
                }
            }
        },
        shadowButton: {
            boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px'
        },
        filtered: {
            whiteSpace: 'nowrap',
            '& > a': {
                display: 'block',
                fontWeight: '600'
            }
        }
    }),
    reduxForm({
        form: 'StatProductForm',
        enableReinitialize: true
    }),
    withState('currentRow', 'updateRow', null),
    withState('expandedTable', 'setExpandedTable', false),
    withState('currentParent', 'updateCurrentParent', null),
    connect((state) => {
        const typeParent = _.get(state, ['form', 'StatisticsFilterForm', 'values', 'productType', 'value'])
        return {
            typeParent
        }
    }),
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
        name: 'salesCount',
        title: t('Кол-во')
    },
    {
        sorting: true,
        name: 'salesIncome',
        title: t('Стоимость')
    },
    {
        sorting: true,
        name: 'orderReturnsCount',
        title: t('Кол-во')
    },
    {
        sorting: true,
        name: 'orderReturnsSum',
        title: t('Стоимость')
    },
    {
        sorting: true,
        name: 'actualSalesCount',
        title: t('Кол-во')
    },
    {
        sorting: true,
        name: 'actualSalesSum',
        title: t('Стоимость')
    }
]
const StatProductGridList = enhance((props) => {
    const {
        listData,
        classes,
        filter,
        typeParent,
        handleSubmitFilterDialog,
        getDocument,
        filterForm,
        handleSubmit,
        searchSubmit,
        pathname,
        currentRow,
        updateRow,
        expandedTable,
        setExpandedTable,
        sumData,
        sumDataLoading,
        handleGetChilds,
        handleResetChilds,
        currentParent,
        updateCurrentParent,
        query
    } = props

    const iconStyle = {
        icon: {
            color: '#5d6474',
            width: 22,
            height: 22
        },
        button: {
            minWidth: 40,
            width: 40,
            height: 40,
            padding: 9
        }
    }

    const toggle = filter.getParam('toggle') || PRODUCT
    const parent = filter.getParam('parent') && true
    const primaryColor = '#12aaeb'
    const disabledColor = '#dadada'
    const whiteColor = '#fff'
    const isProduct = toggle === PRODUCT
    const isProductType = toggle === PRODUCT_TYPE

    const styleOnHover = {
        background: '#efefef'
    }
    const listLoading = _.get(listData, 'listLoading')
    const currency = getConfig('PRIMARY_CURRENCY')
    const tableLeft = _.map(_.get(listData, 'data'), (item, index) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        return (
            <div
                key={index}
                className={classes.leftTableList}
                onClick={isProductType && !parent
                    ? () => {
                        updateCurrentParent(name)
                        handleGetChilds(id)
                    }
                    : null}
                style={index === currentRow ? styleOnHover : {}}
                onMouseEnter={() => { updateRow(index) }}
                onMouseLeave={() => { updateRow(null) }}>
                <span>{name} {isProductType && !parent && <ExpandList color={'#12aaeb'}/>}</span>
            </div>
        )
    })

    const summaryMeasurement = 'шт'
    const totalCostSale = numberFormat(_.get(sumData, 'salesIncomeTotal'), currency)
    const totalCountSale = numberFormat(_.get(sumData, 'salesCountTotal'))
    const actualSalesSumTotal = numberFormat(_.get(sumData, 'actualSalesSumTotal'), currency)
    const actualSalesCountTotal = numberFormat(_.get(sumData, 'actualSalesCountTotal'))
    const orderReturnsSumTotal = numberFormat(_.get(sumData, 'orderReturnsTotal'), currency)
    const orderReturnsCountTotal = numberFormat(_.get(sumData, 'orderReturnsCountTotal'))
    const tableList = _.map(_.get(listData, 'data'), (item, index) => {
        const type = _.get(item, ['type', 'name'])
        const measurement = _.get(item, ['measurement', 'name'])
        const actualSalesPrice = numberFormat(_.get(item, 'actualSalesSum'), currency)
        const actualSalesCount = numberFormat(_.get(item, 'actualSalesCount'), measurement)
        const returnPrice = numberFormat(_.get(item, 'orderReturnsCount'), measurement)
        const returnCount = numberFormat(_.get(item, 'orderReturnsSum'), currency)
        const salesPrice = numberFormat(_.get(item, 'salesIncome'), currency)
        const salesCount = numberFormat(_.get(item, 'salesCount'), measurement)

        return (
            <tr
                key={index}
                className={isProduct ? classes.tableRow : classes.tableRowExt}
                style={index === currentRow ? styleOnHover : {}}
                onMouseEnter={() => { updateRow(index) }}
                onMouseLeave={() => { updateRow(null) }}>
                {isProduct && <td>{type}</td>}

                <td>{salesCount}</td>
                <td>{salesPrice}</td>

                <td>{returnPrice}</td>
                <td>{returnCount}</td>

                <td>{actualSalesCount}</td>
                <td>{actualSalesPrice}</td>
            </tr>
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
                name="productType"
                component={ProductTypeParentSearchField}
                label={t('Тип товара')}
                fullWidth={true}/>
            {typeParent ? <Field
                name="productTypeChild"
                className={classes.inputFieldCustom}
                component={ProductTypeChildSearchField}
                parentType={typeParent}
                label={t('Подкатегория')}
                fullWidth={true}
            /> : null}
            <Field
                className={classes.inputFieldCustom}
                name="client"
                component={ClientMultiSearchField}
                label={t('Клиент')}
                fullWidth={true}/>
        </div>
    )

    const page = (
        <div className={classes.mainWrapper}>
            <Row style={{margin: '0', height: '100%'}}>
                <div className={classes.leftPanel}>
                    <StatSideMenu currentUrl={ROUTES.STATISTICS_PRODUCT_URL} filter={filter}/>
                </div>
                <div className={classes.rightPanel}>
                    <div className={classes.wrapper}>
                        <StatisticsFilterExcel
                            filter={filter}
                            handleGetDocument={getDocument.handleGetDocument}
                            initialValues={filterForm.initialValues}
                            handleSubmitFilterDialog={handleSubmitFilterDialog}
                            fields={fields}
                            filterKeys={STAT_PRODUCT_FILTER_KEY}
                        />
                        {sumDataLoading
                            ? <div className={classes.sumLoader}>
                                <Loader size={0.75}/>
                            </div>
                            : <div className={classes.summaryWrapper}>
                                <div>
                                    <div>{t('Сумма от продаж')}</div>
                                    <div>{totalCostSale} <span>({totalCountSale} {summaryMeasurement})</span></div>
                                </div>
                                <div>
                                    <div>{t('Фактические продажи')}</div>
                                    <div>{actualSalesSumTotal} <span>({actualSalesCountTotal} {summaryMeasurement})</span></div>
                                </div>
                                <div>
                                    <div>{t('Сумма возвратов')}</div>
                                    <div>{orderReturnsSumTotal} <span>({orderReturnsCountTotal} {summaryMeasurement})</span></div>
                                </div>
                            </div>}
                        <div className={expandedTable ? classes.expandedTable : ''}>
                            <div className={classes.filters}>
                                <form className={classes.form} onSubmit={handleSubmit(searchSubmit)}>
                                    <Field
                                        className={classes.inputFieldCustom}
                                        name="search"
                                        component={TextField}
                                        label={t('Поиск')}
                                        fullWidth={true}/>
                                    <IconButton
                                        className={classes.searchButton}
                                        iconStyle={iconStyle.icon}
                                        style={iconStyle.button}
                                        type="submit">
                                        <Search/>
                                    </IconButton>
                                </form>
                                <div className={classes.flexCenter}>
                                    <Pagination filter={filter}/>
                                    {expandedTable &&
                                    <ToolTip position="left" text={t('Обычный вид')}>
                                        <IconButton
                                            className={classes.fullScreen}
                                            onTouchTap={() => { setExpandedTable(!expandedTable) }}
                                            iconStyle={iconStyle.icon}
                                            style={iconStyle.button}>
                                            <FullScreenExit color="#666"/>
                                        </IconButton>
                                    </ToolTip>}
                                    {!expandedTable &&
                                    <ToolTip position="left" text={t('Расширенный вид')}>
                                        <IconButton
                                            className={classes.fullScreen}
                                            onTouchTap={() => { setExpandedTable(!expandedTable) }}
                                            iconStyle={iconStyle.icon}
                                            style={iconStyle.button}>
                                            <FullScreen color="#666"/>
                                        </IconButton>
                                    </ToolTip>}
                                </div>
                            </div>
                            <div className={classes.flexCenter + ' ' + classes.flexSpaceBetween}>
                                {isProductType && parent &&
                                <div className={classes.filtered}>
                                    {t('Отфильтровано по')}: <strong>{currentParent}</strong>
                                    <a onClick={() => {
                                        updateCurrentParent(null)
                                        handleResetChilds()
                                    }}>{t('Сбросить фильтр')}</a>
                                </div>}
                                <div className={classes.toggleWrapper} style={parent ? {width: 'auto'} : {width: '100%'}}>
                                    <ToolTip position="left" text={t('Показать по товарам')}>
                                        <FlatButton
                                            icon={<Product color={whiteColor}/>}
                                            className={isProduct ? classes.shadowButton : ''}
                                            onTouchTap={() => {
                                                updateCurrentParent(null)
                                                hashHistory.push(filter.createURL({toggle: PRODUCT, parent: null}))
                                            }}
                                            backgroundColor={isProduct ? primaryColor : disabledColor}
                                            rippleColor={whiteColor}
                                            hoverColor={isProduct ? primaryColor : disabledColor}/>
                                    </ToolTip>
                                    <ToolTip position="left" text={t('Показать по типам товаров')}>
                                        <FlatButton
                                            icon={<ProductType color={whiteColor}/>}
                                            className={isProductType ? classes.shadowButton : ''}
                                            onTouchTap={() => {
                                                updateCurrentParent(null)
                                                hashHistory.push(filter.createURL({toggle: PRODUCT_TYPE, parent: null}))
                                            }}
                                            backgroundColor={isProductType ? primaryColor : disabledColor}
                                            rippleColor={whiteColor}
                                            hoverColor={isProductType ? primaryColor : disabledColor}/>
                                    </ToolTip>
                                </div>
                            </div>
                            <div className={classes.container}>
                                {listLoading && <div className={classes.loader}>
                                    <Loader size={0.75}/>
                                </div>}
                                <div className={classes.tableWrapper}>
                                    <div className={classes.leftTable}>
                                        <div><span>{isProduct ? t('Товар') : t('Тип товара')}</span></div>
                                        {tableLeft}
                                    </div>
                                    {_.isEmpty(tableList) && !listLoading &&
                                    <div className={classes.emptyQuery}>
                                        <div>{t('По вашему запросу ничего не найдено')}</div>
                                    </div>}
                                    <div ref="horizontalTable">
                                        <table className={classes.mainTable}>
                                            <tbody className={classes.tableBody}>
                                            <tr className={classes.title}>
                                                {isProduct && <td rowSpan={2}>{t('Тип')}</td>}
                                                <td colSpan={2}>{t('Продажа')}</td>
                                                <td colSpan={2}>{t('Возврат')}</td>
                                                <td colSpan={2}>{t('Фактическая продажа')}</td>
                                            </tr>
                                            <tr className={classes.subTitle}>
                                                {_.map(listHeader, (header, index) => {
                                                    const sortingType = filter.getSortingType(header.name)
                                                    const icon = _.isNil(sortingType) ? null : sortingType ? <ArrowUpIcon className={classes.icon}/> : <ArrowDownIcon className={classes.icon}/>
                                                    if (!header.sorting) {
                                                        return <td key={index}>{header.title}</td>
                                                    }
                                                    return <td key={index} style={{cursor: 'pointer'}} onClick={() => {
                                                        if (_.get(query, 'ordering') === header.name) {
                                                            ordering(filter, '-' + header.name, pathname)
                                                        } else if (_.get(query, 'ordering') === '-' + header.name) {
                                                            ordering(filter, '', pathname)
                                                        } else {
                                                            ordering(filter, header.name, pathname)
                                                        }
                                                    }}>{header.title}{icon}</td>
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

StatProductGridList.propTypes = {
    listData: PropTypes.object,
    detailData: PropTypes.object,
    filter: PropTypes.object.isRequired,
    getDocument: PropTypes.object.isRequired

}

export default StatProductGridList
