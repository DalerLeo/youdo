import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from '../../../constants/routes'
import Container from '../../Container/index'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import {TextField, ZoneSearchField, DivisionSearchField} from '../../ReduxForm'
import StatAgentDialog from './StatAgentDialog'
import StatSideMenu from '../StatSideMenu'
import CircularProgress from 'material-ui/CircularProgress'
import Pagination from '../../GridList/GridListNavPagination/index'
import numberFormat from '../../../helpers/numberFormat.js'
import getConfig from '../../../helpers/getConfig'
import NotFound from '../../Images/not-found.png'
import GridListHeader from '../../GridList/GridListHeader/index'
import PlanMonthFilter from '../../../components/Plan/PlanMonthFilter'
import Tooltip from '../../ToolTip'
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
            width: '100%',
            padding: '100px 0',
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
            padding: '20px 30px',
            height: '100%',
            '& > div:nth-child(2)': {
                marginTop: '10px',
                borderTop: '1px #efefef solid',
                borderBottom: '1px #efefef solid'
            },
            '& .row': {
                margin: '0 !important'
            }
        },
        tableWrapper: {
            margin: '0 -30px',
            '& .row': {
                '&:after': {
                    bottom: '-1px'
                },
                '& > div': {
                    textAlign: 'right',
                    '&:first-child': {
                        paddingLeft: '0',
                        textAlign: 'left'
                    },
                    '&:last-child': {
                        paddingRight: '0'
                    }
                }
            },
            '& .dottedList': {
                padding: '0 30px',
                height: '50px',
                '&:last-child:after': {
                    display: 'none'
                },
                '&:hover': {
                    '& > div:first-child': {
                        fontWeight: '600',
                        color: '#12aaeb'
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
            '& > div:first-child': {
                padding: '0',
                height: '55px',
                fontSize: '15px',
                '& > div': {
                    width: '120px',
                    justifyContent: 'center'
                },
                '& > nav': {
                    height: '30px',
                    '& button': {
                        display: 'flex !important',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '30px !important',
                        width: '30px !important'
                    },
                    '& svg': {
                        height: '24px !important',
                        width: '24px !important'
                    }
                }
            }
        },
        opacity: {
            '& span': {
                color: '#777',
                margin: '0 2px'
            }
        }
    }),
    reduxForm({
        form: 'StatisticsFilterForm',
        enableReinitialize: true
    })
)

const listHeader = [
    {
        sorting: false,
        name: 'agent',
        title: 'Агенты',
        xs: 2
    },
    {
        sorting: true,
        name: 'monthlyPlanAmount',
        alignRight: true,
        title: 'План',
        xs: 1
    },
    {
        sorting: false,
        alignRight: true,
        name: 'summary',
        title: 'Сумма',
        xs: 3
    },
    {
        sorting: true,
        name: 'totalPaid',
        alignRight: true,
        title: 'Оплачено',
        xs: 2
    },
    {
        sorting: true,
        name: 'ordersLeftTotalPrice',
        alignRight: true,
        title: 'Баланс',
        xs: 2
    },
    {
        sorting: true,
        alignRight: true,
        name: 'monthlyPlanLeft',
        title: 'До выполнения',
        xs: 2
    }
]

const StatAgentGridList = enhance((props) => {
    const {
        classes,
        statAgentDialog,
        listData,
        filter,
        handleSubmitFilterDialog,
        detailData,
        getDocument,
        calendar,
        initialValues,
        handleSubmit
    } = props

    const listLoading = _.get(listData, 'listLoading')
    const salesSummary = numberFormat(_.get(_.find(_.get(listData, 'data'), {'id': _.get(detailData, 'id')}), 'ordersTotalPrice'))
    const divisionStatus = getConfig('DIVISION')

    const list = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const plan = numberFormat(_.get(item, 'monthlyPlanAmount'), getConfig('PRIMARY_CURRENCY'))
        const factPrice = numberFormat(_.get(item, 'factPrice'))
        const orderTotalPrice = numberFormat(_.get(item, 'ordersTotalPrice'))
        const orderReturnTotalPrice = numberFormat(_.get(item, 'ordersReturnedTotalPrice'))
        const orderLeftTotalPrice = numberFormat(_.get(item, 'ordersLeftTotalPrice'), getConfig('PRIMARY_CURRENCY'))
        const totalPaid = numberFormat(_.get(item, 'totalPaid'), getConfig('PRIMARY_CURRENCY'))
        const monthlyPlanLeft = numberFormat(_.get(item, 'monthlyPlanLeft'), getConfig('PRIMARY_CURRENCY'))

        const tooltipText = '<div>Продажи / Возвраты / Фактически</div>'

        return (
            <Row key={id} className="dottedList">
                <Col xs={2}>
                    <div className={classes.pointer} onClick={() => { statAgentDialog.handleOpenStatAgentDialog(id) }}>{name}</div>
                </Col>
                <Col xs={1}>
                    <div>{plan}</div>
                </Col>
                <Col xs={3} style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Tooltip position="bottom" text={tooltipText}>
                        <div className={classes.opacity}>
                            <span>{orderTotalPrice}</span> / <span>{orderReturnTotalPrice}</span> / <strong>{factPrice}</strong> {getConfig('PRIMARY_CURRENCY')}
                        </div>
                    </Tooltip>
                </Col>
                <Col xs={2} className={classes.alignRightFlex}>
                    <div>{totalPaid}</div>
                </Col>
                <Col xs={2} className={classes.alignRightFlex}>
                    <div>{orderLeftTotalPrice}</div>
                </Col>
                <Col xs={2} className={classes.alignRightFlex}>
                    <div>{monthlyPlanLeft}</div>
                </Col>
            </Row>
        )
    })
    const fields = (
        <div>
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
    const listIds = _.map(list, item => _.toInteger(_.get(item, 'key')))
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
                            fields={fields}
                            filterKeys={STAT_AGENT_FILTER_KEY}
                            initialValues={initialValues}
                            handleSubmitFilterDialog={handleSubmitFilterDialog}
                            handleGetDocument={getDocument.handleGetDocument}
                            withoutDate={true}
                        />
                        <div className={classes.filters}>
                            <PlanMonthFilter calendar={calendar}/>
                            <form onSubmit={handleSubmit(handleSubmitFilterDialog)}>
                                <Field
                                    className={classes.inputFieldCustom}
                                    name="search"
                                    component={TextField}
                                    hintText="Поиск"/>
                            </form>
                            <Pagination filter={filter}/>
                        </div>
                        <div className={classes.tableWrapper}>
                            <GridListHeader
                                filter={filter}
                                listIds={listIds}
                                withoutCheckboxes={false}
                                column={listHeader}
                                listShadow={true}
                                style={{position: 'relative'}}
                                className={classes.header}
                                statistics={true}
                            />
                    {listLoading
                        ? <div className={classes.loader}>
                            <CircularProgress size={40} thickness={4}/>
                        </div>
                        : (_.isEmpty(list))
                            ? <div className={classes.emptyQuery}>
                                <div>По вашему запросу ничего не найдено</div>
                            </div>
                            : <div>{list}</div>
                            }
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
