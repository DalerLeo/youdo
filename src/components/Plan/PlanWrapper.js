import _ from 'lodash'
import React from 'react'
import IconButton from 'material-ui/IconButton'
import PropTypes from 'prop-types'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import SubMenu from '../SubMenu'
import {Link} from 'react-router'
import sprintf from 'sprintf'
import Tooltip from '../ToolTip'
import Search from './PlanSearch'
import PlanMonthFilter from './PlanMonthFilter'
import Details from './PlanDetails'
import PlanCreateDialog from './PlanCreateDialog'
import PlanSalesDialog from './PlanSalesDialog'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import CircularProgress from 'material-ui/CircularProgress'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Man from 'material-ui/svg-icons/action/accessibility'
import Loyalty from 'material-ui/svg-icons/action/loyalty'
import Van from 'material-ui/svg-icons/maps/local-shipping'
import Money from 'material-ui/svg-icons/maps/local-atm'
import NotFound from '../Images/not-found.png'

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
            margin: '0 -28px'
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
            background: '#f2f5f8',
            '&:before': {
                content: '""',
                background: 'rgba(0,0,0, 0.45)',
                position: 'absolute',
                right: '0',
                height: '14px',
                width: '7px',
                filter: 'blur(6px)'
            },
            '&:after': {
                content: '""',
                position: 'absolute',
                right: '0',
                borderTop: '10px solid transparent',
                borderRight: '12px solid #f4f4f4',
                borderBottom: '10px solid transparent',
                zIndex: '3'
            }
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
        addButton: {
            '& button': {
                backgroundColor: '#275482 !important'
            }
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
        planSalesDialog,
        handleClickTab,
        groupId,
        PlanDateInitialValues
    } = props

    const detailId = _.get(detailData, 'id')
    const agentsList = _.map(_.get(usersList, 'data'), (item) => {
        const id = _.get(item, 'id')
        const username = _.get(item, 'firstName') + ' ' + _.get(item, 'secondName')
        const agentTooltip = '2 000 000 / 3 000 000 UZS'

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
                    <span>56%</span>
                </div>
            </Tooltip>
        )
    })

    const listLoading = _.get(usersList, 'usersListLoading')

    const buttons = [
        {
            group: 1,
            icon: <Man/>
        },
        {
            group: 2,
            icon: <Loyalty/>
        },
        {
            group: 3,
            icon: <Van/>
        },
        {
            group: 4,
            icon: <Money/>
        }
    ]

    const leftSide = (
        <div className={classes.leftSide}>
            <PlanMonthFilter/>
            <div className={classes.titleTabs}>
                {_.map(buttons, (item) => {
                    const group = _.get(item, 'group')
                    const icon = _.get(item, 'icon')

                    return (
                        <IconButton
                            key={group}
                            disableTouchRipple={true}
                            className={(group === groupId) && classes.activeTab}
                            onTouchTap={() => { handleClickTab(group) }}
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}>
                            {icon}
                        </IconButton>
                    )
                })}
            </div>
            <Search filter={filter}/>
            <div className={classes.agentsList}>
                {listLoading ? <div className={classes.loader}>
                    <CircularProgress size={40} thickness={4}/>
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
                        className={classes.addButton}
                        onTouchTap={addPlan.handleOpenAddPlan}>
                        <ContentAdd />
                    </FloatingActionButton>
                </Tooltip>
            </div>

            <div className={classes.wrapper}>
                {leftSide}
                <Details
                    detailData={detailData}
                    planSalesDialog={planSalesDialog}
                    filter={filter}/>
            </div>

            <PlanCreateDialog
                open={addPlan.openAddPlan}
                onClose={addPlan.handleCloseAddPlan}
                onSubmit={addPlan.handleSubmitAddPlan}
                zonesList={addPlan.zonesList}
                zonesLoading={addPlan.zonesLoading}
            />

            <PlanSalesDialog
                open={planSalesDialog.openPlanSales}
                onClose={planSalesDialog.handleClosePlanSales}
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
        handleOpenAddPlan: PropTypes.func.isRequired,
        handleCloseAddPlan: PropTypes.func.isRequired,
        handleSubmitAddPlan: PropTypes.func.isRequired
    }).isRequired,
    planSalesDialog: PropTypes.shape({
        openPlanSales: PropTypes.bool.isRequired,
        handleOpenPlanSales: PropTypes.func.isRequired,
        handleClosePlanSales: PropTypes.func.isRequired
    }).isRequired
}

export default PlanWrapper
