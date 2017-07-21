import React from 'react'
import IconButton from 'material-ui/IconButton'
import PropTypes from 'prop-types'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import SubMenu from '../SubMenu'
import Tooltip from '../ToolTip'
import Search from './PlanSearch'
import Details from './PlanDetails'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Calendar from 'material-ui/svg-icons/action/today'
import Bike from 'material-ui/svg-icons/maps/directions-bike'
import Man from 'material-ui/svg-icons/maps/transfer-within-a-station'
import Van from 'material-ui/svg-icons/maps/local-shipping'
import Money from 'material-ui/svg-icons/maps/local-atm'

const enhance = compose(
    injectSheet({
        loader: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: '#fff',
            top: '0',
            left: '0',
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
            flexDirection: 'column'
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
            padding: '0 30px 0 45px'
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
        classes,
        addPlan
    } = props

    const leftSide = (
        <div className={classes.leftSide}>
            <div className={classes.titleDate}>
                <Calendar color="#666"/>
                <a className={classes.link}>21 Апр, 2017 - 27 Апр, 2017</a>
            </div>
            <div className={classes.titleTabs}>
                <IconButton
                    disableTouchRipple={true}
                    iconStyle={iconStyle.icon}
                    style={iconStyle.button}>
                    <Bike/>
                </IconButton>
                <IconButton
                    disableTouchRipple={true}
                    iconStyle={iconStyle.icon}
                    style={iconStyle.button}>
                    <Man/>
                </IconButton>
                <IconButton
                    disableTouchRipple={true}
                    iconStyle={iconStyle.icon}
                    style={iconStyle.button}>
                    <Van/>
                </IconButton>
                <IconButton
                    disableTouchRipple={true}
                    iconStyle={iconStyle.icon}
                    style={iconStyle.button}>
                    <Money/>
                </IconButton>
            </div>
            <Search filter={filter}/>
            <div className={classes.agentsList}>
                <div className={classes.agent}>
                    <div className={classes.line}>
                    </div>
                    <span>Бердиев Абдупахмон</span>
                    <span>70 / 100</span>
                </div>
                <div className={classes.activeAgent}>
                    <div className={classes.line}>
                    </div>
                    <span>Бердиев Абдупахмон</span>
                    <span>70 / 100</span>
                </div>
                <div className={classes.agent}>
                    <div className={classes.line}>
                    </div>
                    <span>Бердиев Абдупахмон</span>
                    <span>70 / 100</span>
                </div>
                <div className={classes.agent}>
                    <div className={classes.line}>
                    </div>
                    <span>Бердиев Абдупахмон</span>
                    <span>70 / 100</span>
                </div>
                <div className={classes.agent}>
                    <div className={classes.line}>
                    </div>
                    <span>Бердиев Абдупахмон</span>
                    <span>70 / 100</span>
                </div>
                <div className={classes.agent}>
                    <div className={classes.line}>
                    </div>
                    <span>Бердиев Абдупахмон</span>
                    <span>70 / 100</span>
                </div>
                <div className={classes.agent}>
                    <div className={classes.line}>
                    </div>
                    <span>Бердиев Абдупахмон</span>
                    <span>70 / 100</span>
                </div>
                <div className={classes.agent}>
                    <div className={classes.line}>
                    </div>
                    <span>Бердиев Абдупахмон</span>
                    <span>70 / 100</span>
                </div>
                <div className={classes.agent}>
                    <div className={classes.line}>
                    </div>
                    <span>Бердиев Абдупахмон</span>
                    <span>70 / 100</span>
                </div>
                <div className={classes.agent}>
                    <div className={classes.line}>
                    </div>
                    <span>Бердиев Абдупахмон</span>
                    <span>70 / 100</span>
                </div>
                <div className={classes.agent}>
                    <div className={classes.line}>
                    </div>
                    <span>Бердиев Абдупахмон</span>
                    <span>70 / 100</span>
                </div>
                <div className={classes.agent}>
                    <div className={classes.line}>
                    </div>
                    <span>Бердиев Абдупахмон</span>
                    <span>70 / 100</span>
                </div>
                <div className={classes.agent}>
                    <div className={classes.line}>
                    </div>
                    <span>Бердиев Абдупахмон</span>
                    <span>70 / 100</span>
                </div>
                <div className={classes.agent}>
                    <div className={classes.line}>
                    </div>
                    <span>Бердиев Абдупахмон</span>
                    <span>70 / 100</span>
                </div>
                <div className={classes.agent}>
                    <div className={classes.line}>
                    </div>
                    <span>Бердиев Абдупахмон</span>
                    <span>70 / 100</span>
                </div>
                <div className={classes.agent}>
                    <div className={classes.line}>
                    </div>
                    <span>Бердиев Абдупахмон</span>
                    <span>70 / 100</span>
                </div>
                <div className={classes.agent}>
                    <div className={classes.line}>
                    </div>
                    <span>Бердиев Абдупахмон</span>
                    <span>70 / 100</span>
                </div>
                <div className={classes.agent}>
                    <div className={classes.line}>
                    </div>
                    <span>Бердиев Абдупахмон</span>
                    <span>70 / 100</span>
                </div>
                <div className={classes.agent}>
                    <div className={classes.line}>
                    </div>
                    <span>Бердиев Абдупахмон</span>
                    <span>70 / 100</span>
                </div>
                <div className={classes.agent}>
                    <div className={classes.line}>
                    </div>
                    <span>Бердиев Абдупахмон</span>
                    <span>70 / 100</span>
                </div>
            </div>
        </div>
    )

    return (
        <Container>
            <SubMenu url={ROUTES.PLAN_LIST_URL}/>

            <div className={classes.addButtonWrapper}>
                <Tooltip position="left" text="Добавить зону">
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
                <Details filter={filter} />
            </div>
        </Container>
    )
})

PlanWrapper.PropTypes = {
    filter: PropTypes.object,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    addPlan: PropTypes.shape({
        openAddPlan: PropTypes.bool.isRequired,
        handleOpenAddPlan: PropTypes.func.isRequired,
        handleCloseAddPlan: PropTypes.func.isRequired,
        handleSubmitAddPlan: PropTypes.func.isRequired
    }).isRequired
}

export default PlanWrapper
