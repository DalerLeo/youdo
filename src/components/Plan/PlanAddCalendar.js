import _ from 'lodash'
import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import moment from 'moment'
import IconButton from 'material-ui/IconButton'
import LeftArrow from 'material-ui/svg-icons/navigation/chevron-left'
import RightArrow from 'material-ui/svg-icons/navigation/chevron-right'
import {getCalendar, weekNames} from '../../helpers/planCalendar'

const enhance = compose(
    injectSheet({
        padding: {
            padding: '20px 30px'
        },
        titleDate: {
            height: '66px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '16px',
            fontWeight: '600',
            '& > div': {
                display: 'flex',
                height: '36px',
                alignItems: 'center',
                textTransform: 'capitalize'
            },
            '& > nav': {
                display: 'flex',
                height: '36px',
                alignItems: 'center'
            }
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
        dateBlock: {
            padding: '0 30px',
            marginBottom: '20px'
        },
        week: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '5px'
        },
        weekItem: {
            background: '#eaeaea',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '32px',
            width: '32px'
        },
        weekItemActive: {
            extend: 'weekItem',
            background: '#8de2b3',
            color: '#fff'
        },
        days: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between'
        },
        weekDay: {
            extend: 'weekItem',
            cursor: 'pointer',
            background: '#fff'
        },
        weekDayEmty: {
            height: '32px',
            width: '32px'
        },
        weekDayActive: {
            extend: 'weekDay',
            borderRadius: '50%',
            background: '#8de2b3',
            cursor: 'default',
            color: '#fff',
            fontWeight: '600'
        },
        today: {
            extend: 'weekDayActive',
            cursor: 'pointer',
            background: '#ccc'
        },
        weekDayDisabled: {
            extend: 'weekDay',
            cursor: 'default',
            color: '#999'
        }
    })
)

const navArrow = {
    icon: {
        color: '#666',
        width: 34,
        height: 34
    },
    button: {
        width: 34,
        height: 34,
        padding: 0
    }
}

const PlanAddCalendar = enhance((props) => {
    const {classes, calendar} = props

    // Month Year

    const monthFormat = (date, defaultText) => {
        return (date) ? moment(date).locale('ru').format('MMMM') : defaultText
    }
    const selectedDay = _.get(calendar, 'selectedDay')
    const selectedMonth = moment(_.get(calendar, 'selectedCreateDate'))
    const selectedYear = moment(_.get(calendar, 'selectedCreateDate')).format('YYYY')

    // Calendar
    const daysInMonth = moment(selectedMonth).daysInMonth()
    const firstDayWeek = moment(moment(selectedMonth).format('YYYY-MM-01')).isoWeekday()
    const lastDayWeek = moment(moment(selectedMonth).format('YYYY-MM-' + daysInMonth)).isoWeekday()
    const selectedWeek = moment(moment(selectedMonth).format('YYYY-MM-' + selectedDay)).isoWeekday()

    return (
        <div className={classes.dateBlock}>
            <div className={classes.titleDate}>
                <nav>
                    <IconButton
                        onTouchTap={calendar.handlePrevMonth}
                        iconStyle={navArrow.icon}
                        style={navArrow.button}
                        disableTouchRipple={true}>
                        <LeftArrow/>
                    </IconButton>
                </nav>
                <div>{monthFormat(selectedMonth)}&nbsp;{selectedYear}</div>
                <nav>
                    <IconButton
                        onTouchTap={calendar.handleNextMonth}
                        iconStyle={navArrow.icon}
                        style={navArrow.button}
                        disableTouchRipple={true}>
                        <RightArrow/>
                    </IconButton>
                </nav>
            </div>
            <div className={classes.week}>
                {_.map(weekNames, (w) => {
                    const weekId = _.get(w, 'id')
                    const weekName = _.get(w, 'name')
                    return (
                        <div key={weekId} className={(selectedWeek === weekId) ? classes.weekItemActive : classes.weekItem}>{weekName}</div>
                    )
                })}
            </div>
            <div className={classes.days}>
                {_.map(getCalendar(firstDayWeek, daysInMonth, lastDayWeek), (d, i) => {
                    const day = _.get(d, 'day')
                    const parsedDay = _.parseInt(day)
                    const parsedSelectedDay = _.parseInt(selectedDay)
                    const isEmpty = _.get(d, 'isEmpty')
                    if (isEmpty) {
                        return (<div key={i} className={classes.weekDayEmty}/>)
                    } else if (parsedDay === parsedSelectedDay) {
                        return (
                            <div key={i} className={classes.weekDayActive}>{parsedDay}</div>
                        )
                    }
                    return (
                        <div
                            key={i}
                            onClick={() => { calendar.handleChooseDay(day) }}
                            className={classes.weekDay}>
                            {parsedDay}
                        </div>
                    )
                })}
            </div>
        </div>
    )
})

export default PlanAddCalendar
