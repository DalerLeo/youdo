import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row} from 'react-flexbox-grid'
import * as ROUTES from '../../../constants/routes'
import Container from '../../Container/index'
import injectSheet from 'react-jss'
import {compose, withState, lifecycle} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import {TextField, ZoneSearchField, DivisionSearchField, DateToDateField} from '../../ReduxForm'
import StatAgentDialog from './StatAgentDialog'
import StatSideMenu from '../StatSideMenu'
import Loader from '../../Loader'
import ToolTip from '../../ToolTip'
import Pagination from '../../GridList/GridListNavPagination/index'
import numberFormat from '../../../helpers/numberFormat'
import horizontalScroll from '../../../helpers/horizontalScroll'
import getConfig from '../../../helpers/getConfig'
import NotFound from '../../Images/not-found.png'
import {StatisticsFilterExcel} from '../../Statistics'

export const STAT_AGENT_FILTER_KEY = {
    FROM_DATE: 'fromDate',
    TO_DATE: 'toDate',
    ZONE: 'zone',
    DIVISION: 'division',
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
        mainWrapper: {
            background: '#fff',
            margin: '0 -28px',
            height: 'calc(100% + 28px)',
            boxShadow: 'rgba(0, 0, 0, 0.09) 0px -1px 6px, rgba(0, 0, 0, 0.10) 0px -1px 4px'
        },
        wrapper: {
            padding: '20px 30px',
            height: '100%',
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
                boxShadow: '5px 0 8px -3px #CCC',
                width: '350px'
            },
            '& > div:last-child': {
                width: 'calc(100% - 350px)',
                overflowX: 'auto',
                overflowY: 'hidden'
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
        tableRow: {
            '& td:nth-child(odd)': {
                textAlign: 'left'
            },
            '& td:nth-child(even)': {
                borderRight: '1px #efefef solid',
                textAlign: 'right'
            },
            '&:nth-child(odd)': {
                backgroundColor: '#f9f9f9'
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
        dateFilter: {
            display: 'flex',
            alignItems: 'center',
            '& span': {
                fontWeight: '600'
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
        pointer: {
            cursor: 'pointer'
        },
        header: {
            position: 'relative',
            top: 'auto'
        },
        alignRightFlex: {
            justifyContent: 'flex-end'
        },
        filters: {
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '10px',
            borderTop: '1px #efefef solid'
        },
        opacity: {
            '& span': {
                color: '#777',
                margin: '0 2px'
            }
        }
    }),
    withState('currentRow', 'updateRow', null),
    reduxForm({
        form: 'StatisticsFilterForm',
        enableReinitialize: true
    }),
    lifecycle({
        componentDidMount () {
            const horizontalTable = this.refs.horizontalTable
            horizontalScroll(horizontalTable)
        }
    })
)

const listHeader = [
    // Sales
    {
        sorting: true,
        title: 'Сумма'
    },
    {
        sorting: true,
        title: 'Фактически'
    },
    // Returns
    {
        sorting: true,
        tooltip: 'Сумма возвратов заказов за этот период',
        title: 'По периоду'
    },
    {
        sorting: true,
        tooltip: 'Сумма возвратов за этот период',
        title: 'Общее'
    },
    // Payments
    {
        sorting: true,
        title: 'По периоду'
    },
    {
        sorting: true,
        title: 'Общее'
    },
    // Plan
    {
        sorting: true,
        title: 'План'
    },
    {
        sorting: true,
        title: 'Осталось'
    }
]

const styleOnHover = {
    background: '#efefef'
}

const StatAgentGridList = enhance((props) => {
    const {
        classes,
        statAgentDialog,
        listData,
        filter,
        handleSubmitFilterDialog,
        detailData,
        getDocument,
        initialValues,
        handleSubmit,
        filterOpen,
        currentRow,
        updateRow
    } = props

    const listLoading = _.get(listData, 'listLoading')
    const salesSummary = numberFormat(_.get(_.find(_.get(listData, 'data'), {'id': _.get(detailData, 'id')}), 'ordersTotalPrice'))
    const divisionStatus = getConfig('DIVISIONS')

    const tableLeft = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
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
        const actualSalesPrice = numberFormat(_.get(item, 'actualSalesSum'), 'UZS')
        const actualSalesCount = numberFormat(_.get(item, 'actualSalesCount'), 'UZS')
        const returnPrice = numberFormat(_.get(item, 'orderReturnsCount'), 'UZS')
        const returnCount = numberFormat(_.get(item, 'orderReturnsSum'), 'UZS')
        const salesPrice = numberFormat(_.get(item, 'salesIncome'), 'UZS')
        const salesCount = numberFormat(_.get(item, 'salesCount'), 'UZS')

        return (
            <tr
                key={id}
                className={classes.tableRow}
                style={id === currentRow ? styleOnHover : {}}
                onMouseEnter={() => { updateRow(id) }}
                onMouseLeave={() => { updateRow(null) }}>
                <td>{salesCount}</td>
                <td>{salesPrice}</td>

                <td>{returnPrice}</td>
                <td>{returnCount}</td>

                <td>{actualSalesCount}</td>
                <td>{actualSalesPrice}</td>

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
                name="zone"
                component={ZoneSearchField}
                label="Зона"
                fullWidth={true}/>
            {divisionStatus && <Field
                className={classes.inputFieldCustom}
                name="division"
                component={DivisionSearchField}
                label="Подразделение"
                fullWidth={true}/>}
        </div>

    )
    const page = (
        <div className={classes.mainWrapper}>
            <Row style={{margin: '0', height: '100%'}}>
                <div className={classes.leftPanel}>
                    <StatSideMenu currentUrl={ROUTES.STATISTICS_AGENT_URL} filter={filter}/>
                </div>
                <div className={classes.rightPanel}>
                    <div className={classes.wrapper}>
                        <StatisticsFilterExcel
                            filter={filter}
                            filterOpen={filterOpen}
                            fields={fields}
                            filterKeys={STAT_AGENT_FILTER_KEY}
                            initialValues={initialValues}
                            handleSubmitFilterDialog={handleSubmitFilterDialog}
                            handleGetDocument={getDocument.handleGetDocument}
                        />
                        <div className={classes.filters}>
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
                                    <div><span>Агент</span></div>
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
                                            <td colSpan={2}>Продажа</td>
                                            <td colSpan={2}>Возврат</td>
                                            <td colSpan={2}>Оплачено</td>
                                            <td colSpan={2}>План</td>
                                        </tr>
                                        <tr className={classes.subTitle}>
                                            {_.map(listHeader, (header, index) => {
                                                const ZERO = 0
                                                const ONE = 1
                                                const EVEN = 2
                                                const isEven = (index + ONE) % EVEN === ZERO
                                                const tooltip = _.get(header, 'tooltip')
                                                const sorting = _.get(header, 'sorting')
                                                const position = 'left'
                                                if (tooltip) {
                                                    return (
                                                        <td key={index}>
                                                            <ToolTip text={tooltip} position={position} alignRight={isEven}>{header.title}</ToolTip>
                                                        </td>
                                                    )
                                                } else if (sorting) {
                                                    if (tooltip) {
                                                        return (
                                                            <td key={index} style={{cursor: 'pointer'}}>
                                                                <ToolTip text={tooltip} position={position} alignRight={isEven}>{header.title}</ToolTip>
                                                            </td>
                                                        )
                                                    }
                                                    return <td key={index} style={{cursor: 'pointer'}}>{header.title}</td>
                                                }
                                                return <td key={index}>{header.title}</td>
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
            <StatAgentDialog
                loading={_.get(detailData.detailLoading)}
                detailData={detailData}
                salesSummary={salesSummary}
                open={statAgentDialog.openStatAgentDialog}
                onClose={statAgentDialog.handleCloseStatAgentDialog}
                filter={filter}/>
        </Container>
    )
})

StatAgentGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    getDocument: PropTypes.object.isRequired,
    statAgentDialog: PropTypes.shape({
        openStatAgentDialog: PropTypes.bool.isRequired,
        handleOpenStatAgentDialog: PropTypes.func.isRequired,
        handleCloseStatAgentDialog: PropTypes.func.isRequired
    }).isRequired
}

export default StatAgentGridList
