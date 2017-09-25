import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row} from 'react-flexbox-grid'
import * as ROUTES from '../../../constants/routes'
import Container from '../../Container/index'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import {connect} from 'react-redux'
import {DateToDateField, StockSearchField, ProductTypeParentSearchField, ProductTypeChildSearchField} from '../../ReduxForm/index'
import StatSideMenu from '../StatSideMenu'
import Search from 'material-ui/svg-icons/action/search'
import IconButton from 'material-ui/IconButton'
import CircularProgress from 'material-ui/CircularProgress'
import Excel from 'material-ui/svg-icons/av/equalizer'
import Pagination from '../../GridList/GridListNavPagination/index'
import numberFormat from '../../../helpers/numberFormat.js'
import getConfig from '../../../helpers/getConfig'
import NotFound from '../../Images/not-found.png'

export const STAT_PRODUCT_MOVE_FILTER_KEY = {
    FROM_DATE: 'fromDate',
    TO_DATE: 'toDate',
    STOCK: 'stock',
    TYPE: 'type'
}

const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            padding: '100px 0',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center'
        },
        mainWrapper: {
            background: '#fff',
            margin: '0 -28px',
            height: 'calc(100% + 28px)',
            boxShadow: 'rgba(0, 0, 0, 0.09) 0px -1px 6px, rgba(0, 0, 0, 0.10) 0px -1px 4px'
        },
        wrapper: {
            WebkitTransition: 'all 500ms ease',
            padding: '20px 30px',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            '& > div:nth-child(3)': {
                marginTop: '10px',
                borderTop: '1px #efefef solid'
            },
            '& .row': {
                margin: '0 !important'
            }
        },
        tableWrapper: {
            display: 'flex',
            margin: '0 -30px',
            overflow: 'hidden',
            paddingLeft: '30px',
            '& > div:first-child': {
                zIndex: '20',
                boxShadow: '5px 0 8px -3px #CCC',
                width: '400px'
            },
            '& > div:last-child': {
                width: 'calc(100% - 400px)',
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
            overflowY: 'auto'
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
        pointer: {
            cursor: 'pointer'
        },
        summary: {
            display: 'flex',
            padding: '30px 0',
            '& > div': {
                fontWeight: '400',
                flexBasis: '25%',
                maxWidth: '25%',
                '& div': {
                    fontSize: '17px',
                    marginTop: '2px',
                    fontWeight: '600'
                }
            }
        },
        pagination: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            '& div:first-child': {
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
        leftTable: {
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
        form: 'StatProductMoveFilterForm',
        enableReinitialize: true
    }),
    connect((state) => {
        const typeParent = _.get(state, ['form', 'StatProductMoveFilterForm', 'values', 'typeParent', 'value'])
        return {
            typeParent
        }
    })
)

const StatProductMoveGridList = enhance((props) => {
    const {
        classes,
        listData,
        sumData,
        filter,
        handleSubmitFilterDialog,
        getDocument,
        typeParent
    } = props

    const listLoading = _.get(listData, 'listLoading')
    const sumListLoading = _.get(sumData, 'sumListLoading')
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')

    const beginBalance = numberFormat(_.get(sumData, ['data', 'beginPriceSum']), primaryCurrency)
    const endBalance = numberFormat(_.get(sumData, ['data', 'endPriceSum']), primaryCurrency)
    const inBalance = numberFormat(_.get(sumData, ['data', 'inPriceSum']), primaryCurrency)
    const outBalance = numberFormat(_.get(sumData, ['data', 'outPriceSum']), primaryCurrency)
    const returnBalance = numberFormat(_.get(sumData, ['data', 'returnPriceSum']), primaryCurrency)

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
            <div key={id}><span>{name}</span></div>
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
        return (
            <tr key={id} className={classes.tableRow}>
                <td>{code}</td>
                <td>{beginBalancePr}</td>
                <td>{beginPricePr}</td>
                <td>{inBalancePr}</td>
                <td>{inPricePr}</td>
                <td>{inBalancePr}</td>
                <td>{inPricePr}</td>
                <td>{outBalancePr}</td>
                <td>{outPricePr}</td>
                <td>{endBalancePr}</td>
                <td>{endPricePr}</td>
            </tr>
        )
    })

    const page = (
        <div className={classes.mainWrapper}>
            <Row style={{margin: '0', height: '100%'}}>
                <div className={classes.leftPanel}>
                    <StatSideMenu currentUrl={ROUTES.STATISTICS_PRODUCT_MOVE_URL}/>
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
                            : (_.isEmpty(tableList) && !listLoading)
                                ? <div className={classes.emptyQuery}>
                                    <div>По вашему запросу ничего не найдено</div>
                                </div>
                                : <div>
                                    <div>
                                        {sumListLoading
                                            ? <div className={classes.loader}>
                                                <CircularProgress size={40} thickness={4}/>
                                            </div>
                                            : <div className={classes.summary}>
                                                <div>Остаток на начало периода
                                                    <div>{beginBalance}</div>
                                                </div>
                                                <div>Поступило товара на сумму
                                                    <div>{inBalance}</div>
                                                </div>
                                                <div>Возврат за период
                                                    <div>{returnBalance}</div>
                                                </div>
                                                <div>Выдано товара на сумму
                                                    <div>{outBalance}</div>
                                                </div>
                                                <div>Остаток на конец периода
                                                    <div>{endBalance}</div>
                                                </div>
                                            </div>}
                                    </div>
                                    <div className={classes.pagination}>
                                        <div>Движение товаров на складе</div>
                                        <Pagination filter={filter}/>
                                    </div>
                                    <div className={classes.tableWrapper}>
                                        <div className={classes.leftTable}>
                                            <div><span>Товар</span></div>
                                            {tableLeft}
                                        </div>
                                        <div>
                                            <table className={classes.mainTable}>
                                                <tbody className={classes.tableBody}>
                                                <tr className={classes.title}>
                                                    <td rowSpan={2}>Код товара</td>
                                                    <td colSpan={2}>Остаток на начало периода</td>
                                                    <td colSpan={2}>Поступивший товара за период</td>
                                                    <td colSpan={2}>Возврат</td>
                                                    <td colSpan={2}>Выданный товара за период</td>
                                                    <td colSpan={2}>Остаток на конец</td>
                                                </tr>
                                                <tr className={classes.subTitle}>
                                                    <td>Кол-во</td>
                                                    <td>Стоимость</td>
                                                    <td>Кол-во</td>
                                                    <td>Стоимость</td>
                                                    <td>Кол-во</td>
                                                    <td>Стоимость</td>
                                                    <td>Кол-во</td>
                                                    <td>Стоимость</td>
                                                    <td>Кол-во</td>
                                                    <td>Стоимость</td>
                                                </tr>
                                                {tableList}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            }
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
