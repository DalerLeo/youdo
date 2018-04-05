import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import * as ROUTES from '../../../constants/routes'
import Container from '../../Container'
import Loader from '../../Loader'
import IconButton from 'material-ui/IconButton'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import Calendar from 'material-ui/svg-icons/action/event'
import CalendarCreated from 'material-ui/svg-icons/notification/event-available'
import ToolTip from '../../ToolTip'
import {hashHistory, Link} from 'react-router'
import dateFormat from '../../../helpers/dateFormat'
import t from '../../../helpers/translate'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MenuItemIcon from 'material-ui/svg-icons/navigation/more-vert'
import NewIcon from 'material-ui/svg-icons/av/new-releases'
import InProcess from 'material-ui/svg-icons/av/loop'
import DoneIcon from 'material-ui/svg-icons/action/done-all'
import {
    BORDER_STYLE,
    BORDER_DARKER,
    COLOR_DEFAULT,
    COLOR_GREEN,
    COLOR_GREY,
    COLOR_WHITE,
    LINK_COLOR
} from '../../../constants/styleConstants'
import {APPLICATION_ASSIGNED, APPLICATION_COMPLETED} from '../../../constants/backendConstants'
import {CUSTOM_BOX_SHADOW, CUSTOM_BOX_SHADOW_HOVER} from '../LongList/LongListGridList'

const SORT_BY_DEADLINE = 'deadline'
const SORT_BY_CREATED_DATE = 'createdDate'

const enhance = compose(
    injectSheet({
        loader: {
            display: 'flex',
            alignItems: 'center',
            alignSelf: 'baseline',
            justifyContent: 'center',
            padding: '100px 0',
            width: '100%'
        },
        wrapper: {
            position: 'absolute',
            top: '0',
            left: '-28px',
            right: '-32px',
            bottom: '-28px',
            display: 'flex'
        },
        leftSide: {
            overflowY: 'auto',
            height: '100%',
            width: 'calc(100% - 350px)'
        },
        header: {
            display: 'flex',
            height: '60px',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
        },
        title: {
            fontWeight: '600',
            fontSize: '18px',
            padding: '0 30px'
        },
        tasks: {
            display: 'flex',
            flexWrap: 'wrap',
            padding: '0 30px 5px',
            width: '100%'
        },
        task: {
            background: COLOR_WHITE,
            boxShadow: CUSTOM_BOX_SHADOW,
            position: 'relative',
            cursor: 'pointer',
            minHeight: '300px',
            width: 'calc((100% / 3) - 10px)',
            transition: 'all 250ms ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            margin: '0 15px 15px 0',
            '& > a': {
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0'
            },
            '&:nth-child(3n + 3)': {
                marginRight: '0'
            },

            '&:hover': {
                boxShadow: CUSTOM_BOX_SHADOW_HOVER,
                zIndex: '2'
            },

            '& header': {
                display: 'flex',
                height: '50px',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 20px'
            },
            '& section': {
                padding: '10px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            },
            '& footer': {
                borderTop: BORDER_STYLE,
                display: 'flex',
                height: '50px',
                alignItems: 'center',
                justifyContent: 'space-between',
                '& > div': {
                    borderRight: BORDER_STYLE,
                    color: COLOR_GREY,
                    fontSize: '11px',
                    fontWeight: '600',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    width: 'calc(100% / 3)',
                    '&:last-child': {
                        borderRight: 'none'
                    },
                    '& strong': {
                        color: COLOR_DEFAULT,
                        marginLeft: '5px',
                        fontWeight: 'bold'
                    }
                }
            }
        },
        deadline: {
            display: 'flex',
            alignItems: 'center',
            color: COLOR_GREY,
            fontSize: '11px',
            '& svg': {
                color: COLOR_GREY + '!important',
                width: '20px !important',
                height: '20px !important',
                marginRight: '5px'
            }
        },
        bodyBlock: {
            textAlign: 'center'
        },
        status: {
            border: '2px solid',
            borderRadius: '4px',
            color: LINK_COLOR,
            display: 'inline-block',
            fontWeight: '600',
            padding: '2px 8px'
        },
        completed: {
            extend: 'status',
            color: COLOR_GREEN
        },
        client: {
            fontSize: '13px',
            color: COLOR_GREY,
            marginBottom: '5px'
        },
        position: {
            fontSize: '16px',
            fontWeight: '600'
        },
        rightSide: {
            borderLeft: BORDER_DARKER,
            padding: '20px',
            width: '350px'
        },
        buttons: {
            display: 'flex',
            alignItems: 'center',
            borderRadius: '40px',
            background: COLOR_WHITE,
            marginRight: '30px'
        },
        popover: {
            borderRight: BORDER_STYLE,
            marginRight: '5px',
            paddingRight: '5px'
        },
        calendarDay: {
            marginBottom: '25px',
            '&:last-child': {
                marginBottom: '0'
            }
        },
        calendarDate: {
            fontWeight: '600',
            color: COLOR_GREY,
            marginBottom: '10px'
        },
        calendarResume: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '5px',
            padding: '15px 15px 25px',
            background: COLOR_WHITE,
            position: 'relative',
            boxShadow: CUSTOM_BOX_SHADOW,
            '&:last-child': {
                marginBottom: '0'
            }
        },
        calendarTime: {
            marginRight: '10px',
            color: COLOR_GREY,
            fontWeight: '700'
        },
        calendarDeadline: {
            position: 'absolute',
            color: '#4db6ac',
            borderBottom: '2px solid',
            fontSize: '11px',
            fontWeight: '600',
            left: '0',
            bottom: '0',
            padding: '0 15px 5px'
        },
        resumePerson: {
            fontWeight: '600',
            textAlign: 'right'
        },
        resumeName: {

        },
        resumePosition: {
            color: COLOR_GREY
        }
    })
)

const TasksGridList = enhance((props) => {
    const {
        filter,
        listData,
        classes
    } = props

    const loading = _.get(listData, 'listLoading')
    const tasksList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const isNew = _.get(item, 'isNew')
        const client = _.get(item, ['contact', 'client', 'name'])
        const position = _.get(item, ['position', 'name'])
        const deadline = dateFormat(_.get(item, 'deadline'))
        const longCount = _.get(item, ['stats', 'long'])
        const meetingCount = _.get(item, ['stats', 'meeting'])
        const shortCount = _.get(item, ['stats', 'short'])
        const status = _.get(item, 'status')
        const isCompleted = status === APPLICATION_COMPLETED
        return (
            <div key={id} className={classes.task}>
                <Link target={'_blank'} to={{
                    pathname: ROUTES.HR_LONG_LIST_URL,
                    query: filter.getParams({application: id})}}/>
                <header>
                    <div className={classes.deadline}><Calendar/>{deadline}</div>
                    {isNew && <div className={classes.status}>{t('новое')}</div>}
                    {isCompleted && <div className={classes.completed}>{t('завершено')}</div>}
                </header>
                <section>
                    <div className={classes.bodyBlock}>
                        <div className={classes.client}>{client}</div>
                        <div className={classes.position}>{position}</div>
                    </div>
                </section>
                <footer>
                    <div>{t('Лонглист')}:<strong>{longCount}</strong></div>
                    <div>{t('Собесед')}:<strong>{meetingCount}</strong></div>
                    <div>{t('Шортлист')}:<strong>{shortCount}</strong></div>
                </footer>
            </div>
        )
    })

    const buttonStyle = {
        button: {
            width: 42,
            height: 42,
            padding: 10
        },
        icon: {
            width: 22,
            height: 22
        }
    }
    // . const DOING = 'выполняется'
    const currentOrdering = filter.getParam('ordering')
    const currentStatus = filter.getParam('status')
    const getIconByStatus = () => {
        switch (currentStatus) {
            case APPLICATION_COMPLETED: return <DoneIcon color={COLOR_GREEN}/>
            default: return <MenuItemIcon color={COLOR_GREY}/>
        }
    }
    const sortyBy = (value) => {
        return hashHistory.push(filter.createURL({ordering: value}))
    }
    const filterByStatus = (status) => {
        return hashHistory.push(filter.createURL({status: status}))
    }

    const popoverStyle = {
        menuItem: {
            fontSize: '13px',
            minHeight: '36px',
            lineHeight: '36px'
        },
        innerDiv: {
            padding: '0px 16px 0px 60px'
        },
        icon: {
            margin: '7px',
            width: '22px',
            height: '22px'
        }
    }

    const calendarData = [
        {
            date: '2018-04-25 20:15',
            fullName: 'Akhunbabaev Khamidulla',
            position: 'Программист',
            deadline: '2018-05-01'
        }, {
            date: '2018-04-25 22:00',
            fullName: 'Jasur Juraev',
            position: 'Программист',
            deadline: '2018-05-05'
        }, {
            date: '2018-04-27 15:00',
            fullName: 'Omonov Kaxramon',
            position: 'Менеджер',
            deadline: '2018-04-15'
        }]
    const groupByDate = _.groupBy(calendarData, (item) => {
        return dateFormat(item.date)
    })
    console.warn(groupByDate)

    return (
        <Container>
            <div className={classes.wrapper}>
                <div className={classes.leftSide}>
                    <div className={classes.header}>
                        <h2 className={classes.title}>{t('Активные задания')}</h2>
                        <div className={classes.buttons}>
                            <IconMenu
                                className={classes.popover}
                                iconButtonElement={
                                    <IconButton
                                        style={buttonStyle.button}
                                        iconStyle={buttonStyle.icon}>
                                        {getIconByStatus()}
                                    </IconButton>
                                }
                                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                                <MenuItem
                                    style={popoverStyle.menuItem}
                                    innerDivStyle={popoverStyle.innerDiv}
                                    leftIcon={<NewIcon style={popoverStyle.icon}/>}
                                    primaryText={t('Новые')}
                                    onClick={() => { filterByStatus() }}/>
                                <MenuItem
                                    style={popoverStyle.menuItem}
                                    innerDivStyle={popoverStyle.innerDiv}
                                    leftIcon={<InProcess style={popoverStyle.icon}/>}
                                    primaryText={t('В процессе')}
                                    onClick={() => { filterByStatus(APPLICATION_ASSIGNED) }}/>
                                <MenuItem
                                    style={popoverStyle.menuItem}
                                    innerDivStyle={popoverStyle.innerDiv}
                                    leftIcon={<DoneIcon style={popoverStyle.icon}/>}
                                    primaryText={t('Завершенные')}
                                    onClick={() => { filterByStatus(APPLICATION_COMPLETED) }}/>
                            </IconMenu>
                            <ToolTip position={'left'} text={t('Сортировать по дэдлайну')}>
                                <IconButton
                                    style={buttonStyle.button}
                                    iconStyle={buttonStyle.icon}
                                    onTouchTap={() => { sortyBy(SORT_BY_DEADLINE) }}>
                                    <Calendar color={currentOrdering === SORT_BY_DEADLINE ? COLOR_GREEN : COLOR_GREY}/>
                                </IconButton>
                            </ToolTip>
                            <ToolTip position={'left'} text={t('Сортировать по дате создания')}>
                                <IconButton
                                    style={buttonStyle.button}
                                    iconStyle={buttonStyle.icon}
                                    onTouchTap={() => { sortyBy(SORT_BY_CREATED_DATE) }}>
                                    <CalendarCreated color={currentOrdering === SORT_BY_CREATED_DATE ? COLOR_GREEN : COLOR_GREY}/>
                                </IconButton>
                            </ToolTip>
                        </div>
                    </div>
                    {loading
                        ? <div className={classes.loader}><Loader size={0.75}/></div>
                        : <div className={classes.tasks}>
                            {tasksList}
                        </div>}
                </div>
                <div className={classes.rightSide}>
                    {_.map(groupByDate, (item, date) => {
                        return (
                            <div key={date} className={classes.calendarDay}>
                                <div className={classes.calendarDate}>{date}</div>
                                {_.map(item, (obj, index) => {
                                    const time = moment(_.get(obj, 'date')).format('HH:mm')
                                    const deadline = dateFormat(_.get(obj, 'deadline'))
                                    const fullName = _.get(obj, 'fullName')
                                    const position = _.get(obj, 'position')
                                    return (
                                        <div key={index} className={classes.calendarResume}>
                                            <div className={classes.calendarTime}>
                                                <div>{time}</div>
                                                <div className={classes.calendarDeadline}>дэдлайн: {deadline}</div>
                                            </div>
                                            <div className={classes.resumePerson}>
                                                <div className={classes.resumeName}>{fullName}</div>
                                                <div className={classes.resumePosition}>{position}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            </div>
        </Container>
    )
})

TasksGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object
}

export default TasksGridList
