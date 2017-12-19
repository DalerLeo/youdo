import _ from 'lodash'
import React from 'react'
import IconButton from 'material-ui/IconButton'
import PropTypes from 'prop-types'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import SubMenu from '../SubMenu'
import Loader from '../Loader'
import {Link} from 'react-router'
import sprintf from 'sprintf'
import Tooltip from '../ToolTip'
import Search from './PlanSearch'
import PlanDatePicker from './PlanDatePicker'
import Details from './PlanDetails'
import PlanCreateDialog from './PlanCreateDialog'
import PlanSalesDialog from './PlanSalesDialog'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Man from 'material-ui/svg-icons/action/accessibility'
import Loyalty from 'material-ui/svg-icons/action/loyalty'
import Van from 'material-ui/svg-icons/maps/local-shipping'
import Money from 'material-ui/svg-icons/maps/local-atm'
import NotFound from '../Images/not-found.png'
import numberFormat from '../../helpers/numberFormat'
import getConfig from '../../helpers/getConfig'
const ZERO = 0
const HUNDRED = 100
const MERCH = 'посещено'
const DELIVER = 'посетил'

const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            height: '250px',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        wrapper: {
            display: 'flex',
            height: 'calc(100% - 32px)',
            margin: '0 -28px',
            overflow: 'hidden',
            borderTop: '1px #e0e0e0 solid'
        },
        padding: {
            padding: '20px 30px'
        },
        leftSide: {
            background: '#fff',
            width: '330px',
            minWidth: '330px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
        },
        titleDate: {
            display: 'flex',
            alignItems: 'center',
            extend: 'padding',
            '& svg': {
                width: '32px !important',
                height: '32px !important',
                marginRight: '10px'
            },
            '& a': {
                fontWeight: '600'
            }
        },
        titleTabs: {
            background: '#ccc',
            display: 'flex',
            justifyContent: 'center',
            minHeight: '40px',
            '& button': {
                justifyContent: 'center',
                alignItems: 'center'
            }
        },
        activeTab: {
            '& svg': {
                color: '#666 !important'
            },
            '&:after': {
                content: '""',
                position: 'absolute',
                bottom: '0',
                borderBottom: '6px solid #fff',
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent'
            }
        },
        link: {
            position: 'relative',
            paddingRight: '12px',
            '&:after': {
                top: '7px',
                right: '0',
                content: '""',
                position: 'absolute',
                borderTop: '4px solid',
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent'
            }
        },
        agentsList: {
            height: '100%',
            overflowY: 'auto',
            position: 'relative',
            '&:after': {
                background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%,rgba(255,255,255,1)' +
                ' 90%,rgba(255,255,255,1) 100%)',
                content: '""',
                position: 'fixed',
                bottom: '0',
                left: '84px',
                width: '330px',
                height: '40px'
            },
            '&::-webkit-scrollbar': {
                width: '0'
            },
            '& > div:last-child': {
                marginBottom: '20px'
            }
        },
        agent: {
            borderTop: '1px #efefef solid',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '45px',
            position: 'relative',
            padding: '0 30px 0 45px',
            cursor: 'pointer',
            width: '100%',
            '& a': {
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0'
            }
        },
        activeAgent: {
            extend: 'agent',
            background: '#f2f5f8'
        },
        line: {
            background: '#999',
            position: 'absolute',
            left: '30px',
            top: '50%',
            marginTop: '-15px',
            height: '30px',
            width: '3px'
        },
        addButtonWrapper: {
            position: 'absolute',
            top: '10px',
            right: '0',
            marginBottom: '0px'
        },
        datePicker: {
            background: '#fff',
            padding: '10px 0 20px',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: '2',
            '& > div': {
                textAlign: 'center'
            }
        },
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center center',
            backgroundSize: '150px',
            padding: '165px 0 0',
            width: '170px',
            margin: 'auto',
            textAlign: 'center',
            fontSize: '13px',
            color: '#666',
            '& svg': {
                width: '50px !important',
                height: '50px !important',
                color: '#999 !important'
            }
        }
    })
)

const iconStyle = {
    icon: {
        color: '#fff',
        width: 22,
        height: 22
    },
    button: {
        width: 40,
        height: 40,
        padding: 0,
        display: 'flex',
        margin: '0 10px'
    }
}

const PlanWrapper = enhance((props) => {
    const {
        filter,
        usersList,
        detailData,
        classes,
        addPlan,
        updatePlan,
        comboPlan,
        zoneDetails,
        planSalesDialog,
        handleClickTab,
        groupId,
        calendar,
        addPlanCalendar,
        monthlyPlan,
        selectedWeekDay,
        agentPlans
    } = props
    const detailId = _.get(detailData, 'id')
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const agentsList = _.map(_.get(usersList, 'data'), (item) => {
        const id = _.get(item, 'id')
        const username = _.get(item, 'firstName') + ' ' + _.get(item, 'secondName')
        const planFact = _.toNumber(_.get(item, 'doneCount'))
        const planAmount = _.toNumber(_.get(item, 'todoCount'))
        const percent = (planFact / planAmount) * HUNDRED
        const tooltipHint = groupId === 'merch' ? MERCH : (groupId === 'delivery') ? DELIVER : (groupId === 'collector') ? primaryCurrency : ''
        const agentTooltip = numberFormat(planFact) + ' / ' + numberFormat(planAmount) + ' ' + tooltipHint

        if (planAmount <= ZERO) {
            return (
                <div key={id} className={(id === detailId) ? classes.activeAgent : classes.agent}>
                    <Link to={{
                        pathname: sprintf(ROUTES.PLAN_ITEM_PATH, id),
                        query: filter.getParams()
                    }}>
                    </Link>
                    <div className={classes.line}>
                    </div>
                    <span>{username}</span>
                </div>
            )
        }

        return (
            <Tooltip key={id} position="bottom" text={agentTooltip}>
                <div className={(id === detailId) ? classes.activeAgent : classes.agent}>
                    <Link to={{
                        pathname: sprintf(ROUTES.PLAN_ITEM_PATH, id),
                        query: filter.getParams()
                    }}>
                    </Link>
                    <div className={classes.line}>
                    </div>
                    <span>{username}</span>
                    <span>{numberFormat(percent)}%</span>
                </div>
            </Tooltip>
        )
    })

    const listLoading = _.get(usersList, 'usersListLoading')

    const buttons = [
        {
            group: 'agent',
            name: 'Агенты',
            icon: <Man/>
        },
        {
            group: 'merch',
            name: 'Мерчендайзеры',
            icon: <Loyalty/>
        },
        {
            group: 'delivery',
            name: 'Доставщики',
            icon: <Van/>
        },
        {
            group: 'collector',
            name: 'Инкассаторы',
            icon: <Money/>
        }
    ]

    const leftSide = (
        <div className={classes.leftSide}>
            <PlanDatePicker calendar={calendar} filter={filter}/>
            <div className={classes.titleTabs}>
                {_.map(buttons, (item) => {
                    const group = _.get(item, 'group')
                    const name = _.get(item, 'name')
                    const icon = _.get(item, 'icon')

                    return (
                        <Tooltip key={group} position="bottom" text={name}>
                            <IconButton
                                disableTouchRipple={true}
                                className={(group === groupId) ? classes.activeTab : ''}
                                onTouchTap={() => { handleClickTab(group) }}
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}>
                                {icon}
                            </IconButton>
                        </Tooltip>
                    )
                })}
            </div>
            <Search filter={filter}/>
            <div className={classes.agentsList}>
                {listLoading ? <div className={classes.loader}>
                    <Loader size={0.75}/>
                </div>
                    : (_.isEmpty(agentsList)
                        ? <div className={classes.emptyQuery}>
                            <div>По вашему запросу ничего не найдено</div>
                        </div>
                        : agentsList)}
            </div>
        </div>
    )

    return (
        <Container>
            <SubMenu url={ROUTES.PLAN_LIST_URL}/>
            <div className={classes.addButtonWrapper}>
                <Tooltip position="left" text="Составить план">
                    <FloatingActionButton
                        mini={true}
                        zDepth={1}
                        backgroundColor="#12aaeb"
                        onTouchTap={addPlan.handleOpenAddPlan}>
                        <ContentAdd />
                    </FloatingActionButton>
                </Tooltip>
            </div>

            <div className={classes.wrapper}>
                {leftSide}
                <Details
                    agentPlans={agentPlans}
                    calendar={calendar}
                    detailData={detailData}
                    planSalesDialog={planSalesDialog}
                    monthlyPlan={monthlyPlan}
                    filter={filter}/>
            </div>

            <PlanCreateDialog
                filter={filter}
                open={addPlan.openAddPlan}
                onClose={addPlan.handleCloseAddPlan}
                onSubmit={addPlan.handleSubmitAddPlan}
                handleChooseZone={addPlan.handleChooseZone}
                handleChooseAgent={addPlan.handleChooseAgent}
                handleChooseMarket={addPlan.handleChooseMarket}
                selectedAgent={addPlan.selectedAgent}
                selectedMarket={addPlan.selectedMarket}
                selectedZone={addPlan.selectedZone}
                zonesList={addPlan.zonesList}
                zonesLoading={addPlan.zonesLoading}
                zoneAgents={addPlan.zoneAgents}
                zoneAgentsLoading={addPlan.zoneAgentsLoading}
                addPlanCalendar={addPlanCalendar}
                marketsLocation={addPlan.marketsLocation}
                updatePlan={updatePlan}
                comboPlan={comboPlan}
                createPlanLoading={addPlan.createPlanLoading}
                selectedWeekDay={selectedWeekDay}
                zoneDetails={zoneDetails}
            />

            <PlanSalesDialog
                divisions={planSalesDialog.divisions}
                divisionsLoading={planSalesDialog.divisionsLoading}
                loading={planSalesDialog.monthlyPlanCreateLoading}
                open={planSalesDialog.openPlanSales}
                onClose={planSalesDialog.handleClosePlanSales}
                onSubmit={planSalesDialog.handleSubmitPlanSales}
                initialValues={planSalesDialog.initialValues}
            />
        </Container>
    )
})

PlanWrapper.PropTypes = {
    filter: PropTypes.object,
    usersList: PropTypes.object,
    detailData: PropTypes.object,
    addPlan: PropTypes.shape({
        openAddPlan: PropTypes.bool.isRequired,
        zonesList: PropTypes.object.isRequired,
        zonesLoading: PropTypes.bool.isRequired,
        zoneAgents: PropTypes.object.isRequired,
        zoneAgentsLoading: PropTypes.bool.isRequired,
        createPlanLoading: PropTypes.bool.isRequired,
        handleChooseZone: PropTypes.func.isRequired,
        handleChooseAgent: PropTypes.func.isRequired,
        handleChooseMarket: PropTypes.func.isRequired,
        handleOpenAddPlan: PropTypes.func.isRequired,
        handleCloseAddPlan: PropTypes.func.isRequired,
        handleSubmitAddPlan: PropTypes.func.isRequired
    }).isRequired,
    planSalesDialog: PropTypes.shape({
        divisions: PropTypes.array,
        divisionsLoading: PropTypes.bool,
        openPlanSales: PropTypes.bool.isRequired,
        monthlyPlanCreateLoading: PropTypes.bool.isRequired,
        handleOpenPlanSales: PropTypes.func.isRequired,
        handleClosePlanSales: PropTypes.func.isRequired,
        handleSubmitPlanSales: PropTypes.func.isRequired
    }).isRequired,
    calendar: PropTypes.object
}

export default PlanWrapper
