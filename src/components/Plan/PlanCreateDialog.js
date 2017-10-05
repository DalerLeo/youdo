import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {reduxForm} from 'redux-form'
import Dialog from 'material-ui/Dialog'
import CircularProgress from 'material-ui/CircularProgress'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import CloseIcon2 from '../CloseIcon2'
import Person from 'material-ui/svg-icons/social/person'
import GoogleMap from '../GoogleMap'
import PlanAddCalendar from './PlanAddCalendar'
import PlanWeekDayForm from './PlanWeekDayForm'

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
        agentsLoader: {
            extend: 'loader',
            height: 'auto',
            padding: '0 30px'
        },
        podlojkaScroll: {
            overflowY: 'auto !important',
            padding: '0 !important',
            '& > div:first-child > div:first-child': {
                transform: 'translate(0px, 0px) !important'
            },
            '& > div': {
                height: '100% !important',
                '& > div': {
                    height: '100% !important',
                    padding: '0',
                    '& > div': {
                        height: '100%'
                    }
                }
            }
        },
        popUp: {
            background: '#fff',
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'hidden',
            height: '100%',
            minHeight: '700px',
            maxHeight: 'inherit !important'
        },
        titleContent: {
            background: '#fff',
            color: '#333',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #efefef',
            padding: '0 10px 0 30px',
            minHeight: '59px',
            zIndex: '999',
            '& button': {
                padding: '0 !important',
                '& > div': {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }
            }
        },
        inContent: {
            display: 'flex',
            color: '#333',
            height: '100%'
        },
        bodyContent: {
            color: '#333',
            width: '100%',
            height: '100%'
        },
        form: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'space-between'
        },
        field: {
            width: '100%'
        },
        leftSide: {
            width: '300px',
            borderRight: '1px #efefef solid',
            display: 'flex',
            flexDirection: 'column',
            zIndex: '10'
        },
        scroll: {
            height: '100%'
        },
        zone: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            padding: '0 30px',
            height: '40px',
            borderTop: '1px #efefef solid'
        },
        zoneTitle: {
            extend: 'zone',
            cursor: 'default',
            fontWeight: '600'
        },
        activeZone: {
            extend: 'zone',
            background: '#f2f5f8'
        },
        rightSide: {
            width: 'calc(100% - 300px)',
            position: 'relative'
        },
        agents: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: '0',
            bottom: '0',
            left: '0',
            right: '0',
            zIndex: '8',
            transition: 'all 200ms ease-out'
        },
        agentsActive: {
            extend: 'agents',
            top: 'calc(100% - 66px)',
            '& > div': {
                minWidth: '100%',
                maxWidth: '100%'
            }
        },
        agentsWrapper: {
            display: 'flex',
            padding: '0 40px',
            lineHeight: '1.2',
            alignItems: 'center',
            height: '66px',
            transition: 'all 300ms ease-out !important',
            minWidth: '0'
        },
        chooseAgent: {
            fontWeight: 'bold',
            paddingRight: '15px',
            borderRight: '1px #efefef solid'
        },
        chooseZone: {
            fontWeight: '600',
            textAlign: 'center'
        },
        agentItem: {
            background: '#fff',
            height: '45px',
            display: 'flex',
            alignItems: 'center',
            margin: '0 15px',
            cursor: 'pointer',
            '& span': {
                color: '#333',
                display: 'block',
                lineHeight: '1.2',
                '&:first-child': {
                    fontWeight: '600'
                },
                '&:last-child': {
                    color: '#666'
                }
            },
            '& > div': {
                zIndex: '8',
                display: 'flex',
                borderBottom: '3px solid',
                padding: '8px 0'
            }
        },
        imgPlace: {
            display: 'flex',
            alignItems: 'center',
            width: '30px',
            minWidth: '30px',
            height: '30px',
            borderRadius: '50%',
            background: '#9aa6b3',
            overflow: 'hidden',
            marginRight: '5px',
            '& svg': {
                margin: 'auto'
            }
        },
        agentItemActive: {
            extend: 'agentItem',
            position: 'relative',
            '&:after': {
                content: '""',
                position: 'absolute',
                top: '-10px',
                bottom: '-11px',
                left: '-15px',
                right: '-15px',
                background: '#f3f6f9',
                zIndex: '2'
            }
        },
        map: {
            height: '100%',
            filter: 'blur(0px)',
            transition: 'all 200ms ease'
        },
        mapBlurred: {
            extend: 'map',
            filter: 'blur(3px)'
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
        inputDateCustom: {
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
            },
            '& div:first-child': {
                height: '45px !important'
            }
        },
        weeks: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '20px',
            padding: '0 30px'
        },
        weekItem: {
            color: '#666',
            width: '32px',
            height: '32px',
            display: 'flex',
            background: '#eaeaea',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
        },
        weekItemActive: {
            extend: 'weekItem',
            background: '#8de2b3',
            color: '#fff',
            fontWeight: '600'
        },
        addPlan: {
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            top: '0',
            bottom: '0',
            left: '0',
            right: '0',
            background: 'rgba(0,0,0, 0.3)',
            zIndex: '999',
            '& form': {
                background: '#fff'
            }
        }
    }),
    reduxForm({
        form: 'PlanCreateForm',
        enableReinitialize: true
    })
)

const customContentStyle = {
    width: '100%',
    maxWidth: 'none'
}
const agentIcon = {
    color: '#fff',
    width: 20,
    height: 20
}
const PlanCreateDialog = enhance((props) => {
    const {
        open,
        handleSubmit,
        onClose,
        classes,
        isUpdate,
        zonesList,
        zonesLoading,
        calendar,
        zonesItem,
        zonesItemLoading,
        handleChooseZone,
        handleChooseAgent,
        handleChooseMarket,
        selectedAgent,
        selectedMarket,
        marketsLocation
    } = props
    const onSubmit = handleSubmit(() => props.onSubmit())
    const ZERO = 0
    const isAgentChosen = selectedAgent > ZERO
    const chosenZone = _.get(zonesItem, 'id')
    const zones = _.map(zonesList, (item) => {
        const id = _.get(item, 'id')
        const title = _.get(item, 'title')

        return (
            <div key={id} className={(id === chosenZone) ? classes.activeZone : classes.zone}
                 onClick={() => { handleChooseZone(id) }}>
                <span>{title}</span>
                <span>50 / 100</span>
            </div>
        )
    })
    const colors = [
        '#62d6a0',
        '#eeab21',
        '#fd4641'
    ]
    const agents = _.map(_.get(zonesItem, ['properties', 'agents']), (agent, index) => {
        const id = _.get(agent, 'id')
        const username = _.get(agent, 'username')
        return (
            <div key={id} className={(id === selectedAgent) ? classes.agentItemActive : classes.agentItem}
                 onClick={() => { handleChooseAgent(id) }} style={{color: _.get(colors, index)}}>
                <div>
                    <div className={classes.imgPlace}>
                        <Person style={agentIcon}/>
                    </div>
                    <div>
                        <span>{username}</span>
                        <span>15 магазинов</span>
                    </div>
                </div>
            </div>
        )
    })
    return (
        <Dialog
            modal={true}
            className={classes.podlojkaScroll}
            contentStyle={customContentStyle}
            open={open}
            onRequestClose={onClose}
            bodyClassName={classes.popUp}
            autoScrollBodyContent={true}>
            <div className={classes.bodyContent}>
                <div className={classes.inContent}>
                    <Paper zDepth={2} className={classes.leftSide}>
                        <div className={classes.titleContent}>
                            <span>{isUpdate ? 'Изменение плана' : 'Составление плана'}</span>
                            <IconButton onTouchTap={onClose}>
                                <CloseIcon2 color="#666666"/>
                            </IconButton>
                        </div>
                        <div className={classes.scroll}>
                            <PlanAddCalendar calendar={calendar}/>
                            <div className={classes.zonesList}>
                                <div className={classes.zoneTitle}>
                                    <span>Зоны</span>
                                    <span>Магазины</span>
                                </div>
                                {zonesLoading
                                    ? <div className={classes.loader}>
                                        <CircularProgress size={40} thickness={4}/>
                                    </div>
                                    : zones}
                            </div>
                        </div>
                    </Paper>
                    <div className={classes.rightSide}>
                        <div className={isAgentChosen ? classes.agentsActive : classes.agents}>
                            {!_.isEmpty(agents)
                                ? <Paper zDepth={2} className={classes.agentsWrapper}>
                                    <div className={classes.chooseAgent}>
                                        <span>Выберите <br/>агента</span>
                                    </div>
                                    {zonesItemLoading
                                        ? <div className={classes.agentsLoader}>
                                            <CircularProgress size={35} thickness={3.5}/>
                                        </div>
                                        : agents}
                                </Paper>
                                : (!zonesItemLoading ? <Paper zDepth={2} className={classes.agentsWrapper}>
                                        <div className={classes.chooseZone}>
                                            <div>Для составления плана <br/> выберите зону</div>
                                        </div>
                                    </Paper>
                                    : <Paper zDepth={2} className={classes.agentsWrapper}>
                                        <div className={classes.agentsLoader}>
                                            <CircularProgress size={35} thickness={3.5}/>
                                        </div>
                                    </Paper>)}
                        </div>
                        {selectedMarket > ZERO && <div className={classes.addPlan}>
                            <PlanWeekDayForm onSubmit={onSubmit}/>
                        </div>}
                        <div className={isAgentChosen ? classes.map : classes.mapBlurred}>
                            <GoogleMap
                                marketsLocation={marketsLocation}
                                selectedMarket={selectedMarket}
                                handleChooseMarket={handleChooseMarket}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    )
})
PlanCreateDialog.propTyeps = {
    isUpdate: PropTypes.bool,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}
PlanCreateDialog.defaultProps = {
    isUpdate: false
}
export default PlanCreateDialog
