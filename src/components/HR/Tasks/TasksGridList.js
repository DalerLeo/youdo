import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import * as ROUTES from '../../../constants/routes'
import Container from '../../Container'
import Loader from '../../Loader'
import FlatButton from 'material-ui/FlatButton'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import Calendar from 'material-ui/svg-icons/action/event'
import {hashHistory, Link} from 'react-router'
import dateFormat from '../../../helpers/dateFormat'
import toBoolean from '../../../helpers/toBoolean'
import t from '../../../helpers/translate'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MenuItemIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-down'
import FullList from 'material-ui/svg-icons/action/assignment'
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
    LINK_COLOR, COLOR_YELLOW, COLOR_RED
} from '../../../constants/styleConstants'
import {APPLICATION_ASSIGNED, APPLICATION_COMPLETED, ZERO} from '../../../constants/backendConstants'
import {CUSTOM_BOX_SHADOW, CUSTOM_BOX_SHADOW_HOVER} from '../LongList/LongListGridList'

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
        missedDeadline: {
            color: COLOR_RED + '!important',
            fontWeight: '600',
            '& svg': {
                color: COLOR_RED + '!important'
            }
        },
        completedDeadline: {
            color: COLOR_GREEN + '!important',
            fontWeight: '600',
            '& svg': {
                color: COLOR_GREEN + '!important'
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
        doing: {
            extend: 'status',
            color: COLOR_YELLOW
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
            marginRight: '30px',
            padding: '0 10px'
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
            padding: '15px 15px',
            background: COLOR_WHITE,
            position: 'relative',
            cursor: 'pointer',
            boxShadow: CUSTOM_BOX_SHADOW,
            '&:last-child': {
                marginBottom: '0'
            }
        },
        calendarTime: {
            background: COLOR_GREEN,
            display: 'flex',
            alignItems: 'center',
            margin: '-15px',
            marginRight: '10px',
            color: COLOR_WHITE,
            fontWeight: '700',
            padding: '0 10px'
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
        classes,
        calendarData
    } = props

    let resumes = []
    _.map(_.get(calendarData, 'data'), item => {
        _.map(_.get(item, 'resume'), resume => {
            resumes.push({...resume, application: item.id})
        })
    })

    const groupByDate = _.groupBy(resumes, (item) => {
        return dateFormat(item.dateTime)
    })

    const loading = _.get(listData, 'listLoading')
    const tasksList = _.map(_.get(listData, 'data'), (item) => {
        const id = _.get(item, 'id')
        const isNew = _.get(item, 'isNew')
        const client = _.get(item, ['contact', 'client', 'name'])
        const position = _.get(item, ['position', 'name'])
        const deadline = moment(_.get(item, 'deadline')).format('YYYY-MM-DD')
        const longCount = _.get(item, ['stats', 'long'])
        const meetingCount = _.get(item, ['stats', 'meeting'])
        const shortCount = _.get(item, ['stats', 'short'])
        const status = _.get(item, 'status')
        const isCompleted = status === APPLICATION_COMPLETED
        const now = moment().format('YYYY-MM-DD')
        const deadlineDifference = moment(_.get(item, 'deadline')).diff(now, 'days', true)
        return (
            <div key={id} className={classes.task}>
                <Link to={{
                    pathname: ROUTES.HR_LONG_LIST_URL,
                    query: filter.getParams({application: id})}}/>
                <header>
                    <div className={classNames(classes.deadline, {
                        [classes.missedDeadline]: deadlineDifference < ZERO && !isCompleted,
                        [classes.completedDeadline]: isCompleted
                    })}>
                        {!isCompleted && <Calendar/>}
                        {!isCompleted && dateFormat(deadline)}
                    </div>
                    {isNew && <div className={classes.status}>{t('новое')}</div>}
                    {isCompleted && <div className={classes.completed}>{t('завершено')}</div>}
                    {!isCompleted && !isNew && <div className={classes.doing}>{t('выполняется')}</div>}
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
    // . const DOING = 'выполняется'
    const getIconByStatus = (style) => {
        if (toBoolean(filter.getParam('doing')) === true) {
            return <InProcess color={COLOR_YELLOW} style={style}/>
        }
        if (toBoolean(filter.getParam('isNew')) === true) {
            return <NewIcon color={LINK_COLOR} style={style}/>
        }
        if (filter.getParam('status') === APPLICATION_COMPLETED) {
            return <DoneIcon color={COLOR_GREEN} style={style}/>
        }
        return <MenuItemIcon color={COLOR_GREY} style={style}/>
    }
    const filterByStatus = (status) => {
        return hashHistory.push(filter.createURL(status))
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
                                    <FlatButton
                                        label={t('Статус')}
                                        style={{display: 'flex', alignItems: 'center'}}
                                        backgroundColor={COLOR_WHITE}
                                        hoverColor={COLOR_WHITE}
                                        disableTouchRipple
                                        labelStyle={{
                                            textTransform: 'none',
                                            verticalAlign: 'baseline',
                                            fontWeight: '600'
                                        }}
                                        icon={getIconByStatus({verticalAlign: 'unset'})}
                                    />
                                }
                                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                                <MenuItem
                                    style={popoverStyle.menuItem}
                                    innerDivStyle={popoverStyle.innerDiv}
                                    leftIcon={<FullList style={popoverStyle.icon}/>}
                                    primaryText={t('Все')}
                                    onClick={() => { filterByStatus({isNew: null, doing: null, status: null}) }}/>
                                <MenuItem
                                    style={popoverStyle.menuItem}
                                    innerDivStyle={popoverStyle.innerDiv}
                                    leftIcon={<NewIcon style={popoverStyle.icon}/>}
                                    primaryText={t('Новые')}
                                    onClick={() => { filterByStatus({isNew: 'true', doing: null, status: null}) }}/>
                                <MenuItem
                                    style={popoverStyle.menuItem}
                                    innerDivStyle={popoverStyle.innerDiv}
                                    leftIcon={<InProcess style={popoverStyle.icon}/>}
                                    primaryText={t('В процессе')}
                                    onClick={() => { filterByStatus({doing: 'true', isNew: null, status: APPLICATION_ASSIGNED}) }}/>
                                <MenuItem
                                    style={popoverStyle.menuItem}
                                    innerDivStyle={popoverStyle.innerDiv}
                                    leftIcon={<DoneIcon style={popoverStyle.icon}/>}
                                    primaryText={t('Завершенные')}
                                    onClick={() => { filterByStatus({status: APPLICATION_COMPLETED, isNew: null, doing: null}) }}/>
                            </IconMenu>
                        </div>
                    </div>
                    {loading
                        ? <div className={classes.loader}><Loader size={0.75}/></div>
                        : <div className={classes.tasks}>
                            {tasksList}
                        </div>}
                </div>
                <div className={classes.rightSide}>
                    {calendarData.loading
                        ? <div className={classes.loader}><Loader size={0.75}/></div>
                        : _.map(groupByDate, (item, date) => {
                            return (
                            <div key={date} className={classes.calendarDay}>
                                <div className={classes.calendarDate}>{date}</div>
                                {_.map(item, (obj, index) => {
                                    const time = moment(_.get(obj, 'dateTime')).format('HH:mm')
                                    const fullName = _.get(obj, 'fullName')
                                    const position = _.get(obj, 'position')
                                    const status = _.get(obj, 'status')
                                    const relation = _.get(obj, 'relation_id')
                                    const application = _.get(obj, 'application')
                                    const id = _.get(obj, 'id')
                                    return (
                                        <div onClick={() => calendarData.handleOpenResumeMeetingDialog(status, id, application, relation)} key={index} className={classes.calendarResume}>
                                            <div className={classes.calendarTime}>
                                                <div>{time}</div>
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
