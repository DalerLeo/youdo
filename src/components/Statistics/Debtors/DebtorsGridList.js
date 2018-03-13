import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row} from 'react-flexbox-grid'
import * as ROUTES from '../../../constants/routes'
import Container from '../../Container/index'
import injectSheet from 'react-jss'
import {compose, withState, lifecycle} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import {connect} from 'react-redux'
import {
    TextField,
    DivisionMultiSearchField
} from '../../ReduxForm'
import StatSideMenu from '../StatSideMenu'
import Loader from '../../Loader'
import ToolTip from '../../ToolTip'
import IconButton from 'material-ui/IconButton'
import Pagination from '../../GridList/GridListNavPagination'
import numberFormat from '../../../helpers/numberFormat'
import getConfig from '../../../helpers/getConfig'
import horizontalScroll from '../../../helpers/horizontalScroll'
import StatSaleDialog from '../Sales/SalesDialog'
import DebtorsDetails from './DebtorsDetails'
import StatisticsFilterExcel from '../StatisticsFilterExcel'
import NotFound from '../../Images/not-found.png'
import FullScreen from 'material-ui/svg-icons/navigation/fullscreen'
import FullScreenExit from 'material-ui/svg-icons/navigation/fullscreen-exit'
import Expired from 'material-ui/svg-icons/action/update'
import Pending from 'material-ui/svg-icons/device/access-time'
import t from '../../../helpers/translate'

export const STAT_DEBTORS_FILTER_KEY = {
    DIVISION: 'division'
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
            position: 'absolute',
            top: '0',
            left: '-30px',
            right: '-30px',
            bottom: '0',
            padding: '100px 0',
            background: '#fff',
            zIndex: '30'
        },
        statLoader: {
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        wrapper: {
            padding: '20px 30px',
            '& .row': {
                marginLeft: '0',
                marginRight: '0'
            }
        },
        debtors: {
            display: 'flex',
            justifyContent: 'space-between',
            margin: '15px 0',
            '& > div': {
                marginRight: '60px',
                '& span': {
                    color: '#666',
                    marginBottom: '5px'
                },
                '& div': {
                    fontSize: '17px',
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
                alignSelf: 'baseline',
                overflowX: 'auto',
                overflowY: 'hidden'
            }
        },
        leftTable: {
            color: '#666',
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
                        fontWeight: '600',
                        verticalAlign: 'bottom',
                        padding: '15px 30px',
                        borderTop: '1px #efefef solid',
                        borderBottom: '1px #efefef solid'
                    }
                },
                '& span': {
                    fontWeight: '600',
                    display: 'table-cell',
                    verticalAlign: 'middle',
                    padding: '0 30px',
                    cursor: 'pointer'
                }
            }
        },
        mainTable: {
            width: '100%',
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
                border: '1px #efefef solid',
                '& > div': {
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    '& > svg': {
                        marginLeft: '5px',
                        width: '21px !important',
                        height: '21px !important'
                    }
                }
            }
        },
        subTitle: {
            extend: 'title',
            '& td:last-child': {
                textAlign: 'right'
            },
            '& td:nth-child(even)': {
                borderLeft: 'none',
                textAlign: 'right'
            }
        },
        tableRow: {
            cursor: 'pointer',
            '& td:nth-child(odd)': {
                textAlign: 'left',
                borderLeft: '1px #efefef solid',
                borderRight: '1px #efefef solid',
                '&:first-child': {
                    borderLeft: 'none'
                }
            },
            '& td:nth-child(even)': {
                borderRight: '1px #efefef solid',
                textAlign: 'right',
                '&:first-child': {
                    borderRight: 'none'
                }
            },
            '&:nth-child(odd)': {
                backgroundColor: '#f9f9f9'
            },
            '& td:last-child': {
                textAlign: 'right',
                borderRight: '1px #efefef solid',
                borderLeft: 'none'
            }
        },
        headers: {
            backgroundColor: '#fff',
            fontWeight: '600',
            color: '#666'
        },
        list: {
            cursor: 'pointer',
            transition: 'all 200ms ease',
            '&:hover': {
                background: '#fafafa',
                '& div:last-child': {
                    opacity: '1 !important'
                }
            },
            '&:last-child:after': {
                display: 'none'
            }
        },
        filters: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '10px',
            borderTop: '1px #efefef solid'
        },
        button: {
            opacity: '0',
            paddingRight: '0',
            transition: 'all 200ms ease'
        },
        expandedList: {
            extend: 'list',
            background: '#fcfcfc !important',
            position: 'relative',
            cursor: 'auto',
            '& > div:first-child': {
                fontWeight: '600',
                cursor: 'pointer'
            }
        },
        editButton: {
            position: 'absolute',
            top: '0',
            right: '30px',
            height: '55px',
            display: 'flex',
            alignItems: 'center',
            '& svg': {
                width: '22px !important',
                height: '22px !important'
            }
        },
        detail: {
            width: '100%',
            fontWeight: '400 !important',
            display: 'block !important',
            borderTop: '1px #efefef solid',
            '& .dottedList': {
                '&:first-child': {
                    color: '#666',
                    fontWeight: '600'
                },
                '& > div': {
                    padding: '0 5px'
                },
                '& > div:nth-child(2)': {
                    textAlign: 'left'
                },
                '& > div:nth-child(3)': {
                    textAlign: 'left'
                },
                '&:last-child:after': {
                    display: 'none'
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
            background: '#fff url(' + NotFound + ') no-repeat center 20px',
            backgroundSize: '200px',
            position: 'absolute',
            left: '0',
            right: '0',
            padding: '160px 0 0',
            textAlign: 'center',
            fontSize: '13px',
            color: '#666',
            zIndex: '30'
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
        fullScreen: {
            marginLeft: '10px !important'
        },
        details: {
            background: 'rgba(0, 0, 0, 0.54)',
            display: 'flex',
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            overflowY: 'auto',
            zIndex: '1000'
        }
    }),
    withState('currentRow', 'updateRow', null),
    withState('expandedTable', 'setExpandedTable', false),
    reduxForm({
        form: 'StatisticsFilterForm',
        enableReinitialize: true
    }),
    connect((state) => {
        const typeParent = _.get(state, ['form', 'StatisticsFilterForm', 'values', 'marketTypeParent', 'value'])
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

const styleOnHover = {
    background: '#efefef'
}

const iconStyle = {
    icon: {
        width: 24,
        height: 24
    },
    button: {
        width: 36,
        height: 36,
        padding: 6
    }
}

const StatDebtorsGridList = enhance((props) => {
    const {
        classes,
        filter,
        listData,
        detailData,
        handleSubmitFilterDialog,
        statDebtorsDialog,
        handleSubmit,
        handleOpenCloseDetail,
        getDocument,
        handleSubmitMultiUpdate,
        initialValues,
        currentRow,
        updateRow,
        expandedTable,
        setExpandedTable,
        filterItem
    } = props

    const currencyList = _.get(listData, 'currencyList')
    const currencyListLoading = _.get(listData, 'currencyListLoading')
    const divisionStatus = getConfig('DIVISIONS')
    const listLoading = _.get(listData, 'listLoading') || currencyListLoading
    const statLoading = _.get(listData, 'statLoading')
    const listHeader = _.map(_.sortBy(currencyList, ['id']), (item) => {
        return <td key={_.get(item, 'id')}>{_.get(item, 'name')}</td>
    })

    const tableLeft = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, ['client', 'id'])
        const name = _.get(item, ['client', 'name'])
        return (
            <div
                key={id}
                style={id === currentRow ? styleOnHover : {}}
                onMouseEnter={() => { updateRow(id) }}
                onMouseLeave={() => { updateRow(null) }}>
                <span onClick={() => { handleOpenCloseDetail.handleOpenDetail(id) }}>
                    {name}
                </span>
            </div>
        )
    })

    const tableList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, ['client', 'id'])
        const currencies = _.get(item, 'currencies')

        return (
            <tr
                key={id}
                className={classes.tableRow}
                style={id === currentRow ? styleOnHover : {}}
                onMouseEnter={() => { updateRow(id) }}
                onMouseLeave={() => { updateRow(null) }}
                onClick={() => { handleOpenCloseDetail.handleOpenDetail(id) }}>
                {_.map(currencies, (obj, currency) => {
                    const debt = numberFormat(_.get(obj, 'debt'))
                    return (
                        <td key={currency}>{debt}</td>
                    )
                })}
                {_.map(currencies, (obj, currency) => {
                    const expect = numberFormat(_.get(obj, 'expect'))
                    return (
                        <td key={currency}>{expect}</td>
                    )
                })}
            </tr>
        )
    })

    const fields = (
        <div>
            {divisionStatus && <Field
                name="division"
                component={DivisionMultiSearchField}
                className={classes.inputFieldCustom}
                label={t('Организация')}
                fullWidth={true}
            />}
        </div>
    )

    const countDebtors = _.get(listData, ['statData', 'debtors'])
    const stats = _.get(listData, ['statData', 'currencies'])
    const page = (
        <div className={classes.mainWrapper}>
            <Row style={{margin: '0', height: '100%'}}>
                <div className={classes.leftPanel}>
                    <StatSideMenu currentUrl={ROUTES.STATISTICS_DEBTORS_URL}/>
                </div>
                <div className={classes.rightPanel}>
                    <div className={classes.wrapper}>
                        <StatisticsFilterExcel
                            filter={filter}
                            fields={fields}
                            filterKeys={STAT_DEBTORS_FILTER_KEY}
                            initialValues={initialValues}
                            handleSubmitFilterDialog={handleSubmitFilterDialog}
                            handleGetDocument={getDocument.handleGetDocument}
                            withoutDate={true}
                        />
                        {statLoading
                            ? <div className={classes.statLoader}>
                                <Loader size={0.75}/>
                            </div>
                            : <div className={classes.debtors}>
                                <div>
                                    <span>{t('Всего должников')}</span>
                                    <div>{countDebtors} {t('клиентов')}</div>
                                </div>
                                <div>
                                    <span>{t('Просроченные платежи')}</span>
                                    {_.map(stats, (item, index) => {
                                        const debts = _.get(item, 'debts')
                                        const currency = _.find(currencyList, {'id': _.toNumber(index)})
                                        return debts && <div key={index}>{numberFormat(debts, _.get(currency, 'name'))}</div>
                                    })}
                                </div>
                                <div>
                                    <span>{t('Ожидаемые поступления')}</span>
                                    {_.map(stats, (item, index) => {
                                        const expect = _.get(item, 'expect')
                                        const currency = _.find(currencyList, {'id': _.toNumber(index)})
                                        return expect && <div key={index}>{numberFormat(expect, _.get(currency, 'name'))}</div>
                                    })}
                                </div>
                            </div>}
                        <div className={expandedTable ? classes.expandedTable : ''}>
                            <div className={classes.filters}>
                                <strong>{t('Статистика по должникам')}</strong>
                                <form onSubmit={handleSubmit(handleSubmitFilterDialog)}>
                                    <Field
                                        className={classes.inputFieldCustom}
                                        name="search"
                                        component={TextField}
                                        hintText={t('Поиск')}/>
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
                            <div className={classes.container}>
                                {listLoading && <div className={classes.loader}>
                                    <Loader size={0.75}/>
                                </div>}
                                <div className={classes.tableWrapper}>
                                    <div className={classes.leftTable}>
                                        <div><span>{t('Клиент')}</span></div>
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
                                                <td colSpan={2}>
                                                    <div>{t('Просроченные')} <Expired color={'#e57373'}/></div>
                                                </td>
                                                <td colSpan={2}>
                                                    <div>{t('Ожидаемые')} <Pending color={'#f0ad4e'}/></div>
                                                </td>
                                            </tr>
                                            <tr className={classes.subTitle}>
                                                {listHeader}
                                                {listHeader}
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
    const data = {
        data: _.get(detailData, 'detailOrder'),
        id: _.get(detailData, 'orderId')
    }
    const openDetails = _.get(detailData, 'openDetailId') > ZERO
    const openOrderDetails = _.get(statDebtorsDialog, 'openStatDebtorsDialog') !== ZERO
    return (
        <Container>
            {page}
            {openDetails &&
            <div className={classes.details} style={openOrderDetails ? {zIndex: '-99'} : {zIndex: '1000'}}>
                <DebtorsDetails
                    id={_.get(detailData, 'openDetailId')}
                    filter={filterItem}
                    listData={listData}
                    detailData={detailData}
                    statDebtorsDialog={statDebtorsDialog}
                    handleSubmitMultiUpdate={handleSubmitMultiUpdate}
                    handleOpenCloseDetail={handleOpenCloseDetail}/>
            </div>}
            <StatSaleDialog
                loading={_.get(detailData, 'detailOrderLoading')}
                detailData={data}
                open={openOrderDetails}
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
