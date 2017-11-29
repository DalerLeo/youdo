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
import Pagination from '../../GridList/GridListNavPagination/index'
import getConfig from '../../../helpers/getConfig'
import numberFormat from '../../../helpers/numberFormat.js'
import horizontalScroll from '../../../helpers/horizontalScroll.js'
import NotFound from '../../Images/not-found.png'
import {ProductTypeChildSearchField, ProductTypeParentSearchField, DateToDateField} from '../../ReduxForm'
import ordering from '../../../helpers/ordering'
import {reduxForm, Field} from 'redux-form'
import {TextField} from '../../ReduxForm/index'
import IconButton from 'material-ui/IconButton'
import Search from 'material-ui/svg-icons/action/search'
import ArrowUpIcon from 'material-ui/svg-icons/navigation/arrow-upward'
import ArrowDownIcon from 'material-ui/svg-icons/navigation/arrow-downward'
import {StatisticsFilterExcel} from '../../Statistics'
import {connect} from 'react-redux'

export const STAT_PRODUCT_FILTER_KEY = {
    SEARCH: 'search',
    PRODUCT_TYPE: 'productType',
    PRODUCT_TYPE_CHILD: 'productTypeChild',
    TO_DATE: 'toDate',
    FROM_DATE: 'fromDate'
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
            '& > div:nth-child(2)': {
                marginTop: '10px',
                borderTop: '1px #efefef solid'
            },
            '& .row': {
                margin: '0 !important'
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
                    verticalAlign: 'middle',
                    padding: '0 30px'
                }
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
                boxShadow: '5px 0 8px -3px #CCC',
                width: '350px'
            },
            '& > div:last-child': {
                width: 'calc(100% - 350px)',
                overflowX: 'auto',
                overflowY: 'hidden'
            }
        },
        tableBody: {
            '& > tr:first-child > td:first-child': {
                minWidth: '220px'
            },
            '& tr:first-child > td:first-child': {
                verticalAlign: 'bottom',
                padding: '0 30px 15px'
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
        }
    }),
    reduxForm({
        form: 'StatProductForm',
        enableReinitialize: true
    }),
    withState('currentRow', 'updateRow', null),
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
        title: 'Кол-во'
    },
    {
        sorting: true,
        name: 'salesIncome',
        title: 'Стоимость'
    },
    {
        sorting: true,
        name: 'orderReturnsCount',
        title: 'Кол-во'
    },
    {
        sorting: true,
        name: 'orderReturnsSum',
        title: 'Стоимость'
    },
    {
        sorting: true,
        name: 'actualSalesCount',
        title: 'Кол-во'
    },
    {
        sorting: true,
        name: 'actualSalesSum',
        title: 'Стоимость'
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
    const styleOnHover = {
        background: '#efefef'
    }
    const listLoading = _.get(listData, 'listLoading')
    const currency = getConfig('PRIMARY_CURRENCY')
    const tableLeft = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name') || 'No'
        return (
            <div
                key={id}
                style={id === currentRow ? styleOnHover : {}}
                onMouseEnter={() => { updateRow(id) }}
                onMouseLeave={() => { updateRow(null) }}>
                <span>{name}</span>
            </div>
        )
    })
    const tableList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
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
                key={id}
                className={classes.tableRow}
                style={id === currentRow ? styleOnHover : {}}
                onMouseEnter={() => { updateRow(id) }}
                onMouseLeave={() => { updateRow(null) }}>
                <td>{type}</td>

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
                label="Диапазон дат"
                fullWidth={true}/>
            <Field
                className={classes.inputFieldCustom}
                name="productType"
                component={ProductTypeParentSearchField}
                label="Тип товара"
                fullWidth={true}/>
            {typeParent ? <Field
                name="productTypeChild"
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
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <form className={classes.form} onSubmit={handleSubmit(searchSubmit)}>
                                <Field
                                    className={classes.inputFieldCustom}
                                    name="search"
                                    component={TextField}
                                    label="Поиск"
                                    fullWidth={true}/>
                                <IconButton
                                    className={classes.searchButton}
                                    iconStyle={iconStyle.icon}
                                    style={iconStyle.button}
                                    type="submit">
                                    <Search/>
                                </IconButton>
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
                                            <td rowSpan={2}>Тип</td>
                                            <td colSpan={2}>Продажа</td>
                                            <td colSpan={2}>Возврат</td>
                                            <td colSpan={2}>Фактическая продажа</td>
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
