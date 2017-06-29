import React from 'react'
import * as ROUTES from '../../constants/routes'
import {reduxForm, Field} from 'redux-form'
import Container from '../Container'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose, withState} from 'recompose'
import DateToDateField from '../ReduxForm/Basic/DateToDateFieldCustom'
import MarketTypeSearch from '../ReduxForm/Shop/MarketTypeSearchField'
import AgentSearch from '../ReduxForm/Users/UsersSearchField'
import Checkbox from '../ReduxForm/Basic/CheckBox'
import Arrow from 'material-ui/svg-icons/navigation/arrow-drop-down'
import TrackingMap from './TrackingMap'
import More from 'material-ui/svg-icons/navigation/expand-more'
import Less from 'material-ui/svg-icons/navigation/expand-less'
import Dot from 'material-ui/svg-icons/av/fiber-manual-record'

const enhance = compose(
    injectSheet({
        red: {
            color: '#e57373 !important'
        },
        green: {
            color: '#81c784 !important'
        },
        trackingWrapper: {
            background: '#f2f5f8',
            position: 'relative',
            overflowX: 'hidden',
            margin: '0 -28px',
            minHeight: 'calc(100% - 4px)',
            boxShadow: 'rgba(0, 0, 0, 0.09) 0px -2px 5px, rgba(0, 0, 0, 0.05) 0px -2px 6px',
            '& > div:first-child': {
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0'
            }
        },
        trackingInfo: {
            background: '#fff',
            position: 'absolute',
            width: '450px',
            top: '0',
            bottom: '0',
            transition: 'all 0.3s ease',
            zIndex: '2'
        },
        toggleButton: {
            position: 'absolute',
            left: '-24px',
            top: '18px',
            padding: '8px 0',
            background: '#fff',
            cursor: 'pointer'
        },
        expanded: {
            display: 'flex',
            alignItems: 'center',
            '& svg': {
                transform: 'rotate(-90deg)',
                position: 'relative',
                left: '1px'
            }
        },
        collapsed: {
            extend: 'expanded',
            '& svg': {
                transform: 'rotate(90deg)',
                position: 'relative',
                left: '1px'
            }
        },
        trackingInfoTitle: {
            display: 'flex',
            alignItems: 'center',
            padding: '20px 30px',
            borderBottom: '1px #efefef solid',
            fontWeight: '600',
            '& span': {
                textAlign: 'right',
                lineHeight: '1'
            }
        },
        online: {
            color: '#666',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            fontSize: '30px',
            marginLeft: '10px',
            '& span': {
                fontSize: 'inherit !important'
            }
        },
        content: {
            padding: '20px 30px'
        },
        inputFieldCustom: {
            flexBasis: '200px',
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
        checkbox: {
            margin: '15px 0 !important',
            '& span': {
                top: '-10px !important',
                left: '-10px !important'
            }
        },
        title: {
            fontWeight: '600',
            marginBottom: '15px'
        },
        activeAgents: {
            margin: '-10px 0 10px'
        },
        agent: {
            display: 'flex',
            alignItems: 'center',
            padding: '10px 0',
            '& span i': {
                fontSize: '10px',
                color: '#999'
            },
            '& svg': {
                width: '12px !important',
                height: '12px !important',
                marginRight: '10px',
                color: '#666'
            }
        }
    }),
    reduxForm({
        form: 'TrackingCreateForm',
        enableReinitialize: true
    }),
    withState('expandInfo', 'setExpandInfo', true),
    withState('onlineAgents', 'setOnlineAgents', false)
)

const TrackingWrapper = enhance((props) => {
    const ZERO = 0
    const {
        classes,
        expandInfo,
        setExpandInfo,
        onlineAgents,
        setOnlineAgents
    } = props
    const online = 30
    const zoneInfoToggle = (
        <div className={classes.trackingInfo} style={expandInfo ? {right: '0'} : {right: '-450px'}}>
            <div className={classes.toggleButton}>
                {expandInfo ? <div className={classes.expanded} onClick={() => { setExpandInfo(false) }}><Arrow/></div>
                    : <div className={classes.collapsed} onClick={() => { setExpandInfo(true) }}><Arrow/></div>}
            </div>
                <div className={classes.trackingInfoTitle}>
                    <span>Агентов <br/> online</span>
                    <div className={classes.online} onClick={() => { setOnlineAgents(!onlineAgents) }}>
                        <div>
                            <span className={online > ZERO && classes.green}>{online}</span>/<span>45</span>
                        </div>
                        {onlineAgents ? <Less color="#666"/> : <More color="#666"/>}
                    </div>
                </div>
                <div className={classes.content}>
                    {onlineAgents &&
                        <div className={classes.activeAgents}>
                            <div className={classes.agent}>
                                <Dot color="#81c784"/>
                                <span>Трололоев Хабибулла</span>
                            </div>
                            <div className={classes.agent}>
                                <Dot color="#81c784"/>
                                <span>Трололоев Хабибулла</span>
                            </div>
                            <div className={classes.agent}>
                                <Dot/>
                                <span>Трололоев Хабибулла</span>
                            </div>
                            <div className={classes.agent}>
                                <Dot/>
                                <span>Трололоев Хабибулла</span>
                            </div>
                            <div className={classes.agent}>
                                <Dot/>
                                <span>Трололоев Хабибулла <i>(2 часа назад)</i></span>
                            </div>
                        </div>
                    }
                    <div className={classes.filter}>
                        <div className={classes.title}>Фильтры</div>
                        <Field
                            className={classes.inputFieldCustom}
                            name="border"
                            component={MarketTypeSearch}
                            label="Выберите зону"
                            fullWidth={true}/>
                        <Field
                            className={classes.inputFieldCustom}
                            name="agent"
                            component={AgentSearch}
                            label="Агент"
                            fullWidth={true}/>
                        <Field
                            className={classes.inputFieldCustom}
                            name="period"
                            component={DateToDateField}
                            label="Посмотреть по периоду"
                            fullWidth={true}/>
                        <Field
                            name="showMarkets"
                            className={classes.checkbox}
                            component={Checkbox}
                            label="Отображать магазины"/>
                        <Field
                            name="showZones"
                            className={classes.checkbox}
                            component={Checkbox}
                            label="Отображать зоны"/>
                        <Field
                            name="agentTrack"
                            className={classes.checkbox}
                            component={Checkbox}
                            label="Пройденный маршрут агента"/>
                    </div>
                </div>
        </div>
    )

    return (
        <Container>
            <SubMenu url={ROUTES.ZONES_LIST_URL}/>
            <div className={classes.trackingWrapper}>
                <TrackingMap />
                {zoneInfoToggle}
            </div>
        </Container>
    )
})

export default TrackingWrapper
