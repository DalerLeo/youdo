import _ from 'lodash'
import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import moment from 'moment'
import IconButton from 'material-ui/IconButton'
import LeftArrow from 'material-ui/svg-icons/navigation/chevron-left'
import RightArrow from 'material-ui/svg-icons/navigation/chevron-right'

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
        weekDays: {
            extend: 'week'
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
        weekDay: {
            extend: 'weekItem',
            cursor: 'pointer',
            background: '#fff'
        },
        weekDayActive: {
            extend: 'weekDay',
            borderRadius: '50%',
            background: '#8de2b3',
            cursor: 'default',
            color: '#fff',
            fontWeight: '600'
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
    const selectedDate = _.get(calendar, 'selectedDate')
    const selectedDay = _.toInteger(_.get(calendar, 'selectedDay'))
    const selectedMonth = moment(_.get(calendar, 'selectedDate'))
    const selectedYear = moment(_.get(calendar, 'selectedDate')).format('YYYY')

    // Calendar

    const startWeek = moment(selectedDate).startOf('month').week()
    const endWeek = moment(selectedDate).endOf('month').week()
    const DAYS_PER_WEEK = 7
    const ONE = 1

    // .. const daysInMonth = moment(selectedMonth).daysInMonth()
    // .. const firstDayWeek = moment(moment(selectedMonth).format('YYYY-MM-01')).isoWeekday()

    let calendarDays = []
    for (let week = startWeek; week <= endWeek; week++) {
        calendarDays.push({
            week: week,
            days: new Array(DAYS_PER_WEEK).fill(ONE).map((n, i) => {
                return moment().week(week).startOf('week').clone().add(n + i, 'day')
            })
        })
    }
    // .. for (let j = 0; j < firstDayWeek; j++) {
    // ..    console.warn(j)
    // }
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
                <div className={classes.weekItemActive}>Пн</div>
                <div className={classes.weekItem}>Вт</div>
                <div className={classes.weekItem}>Ср</div>
                <div className={classes.weekItem}>Чт</div>
                <div className={classes.weekItem}>Пт</div>
                <div className={classes.weekItem}>Сб</div>
                <div className={classes.weekItem}>Вс</div>
            </div>
            {_.map(calendarDays, (week) => {
                const days = _.get(week, 'days')
                return (
                    <div key={week.week} className={classes.weekDays}>
                        {_.map(days, (day, index) => {
                            const currentMonth = selectedMonth.format('MM')
                            const outputMonth = moment(day).format('MM')
                            const formattedDay = _.toInteger(moment(day).format('D'))
                            if (currentMonth !== outputMonth) {
                                return (
                                    <div key={index} className={classes.weekDayDisabled}>{formattedDay}</div>
                                )
                            }
                            return (
                                <div
                                    key={index}
                                    onClick={() => { calendar.handleChooseDay(formattedDay) }}
                                    className={(selectedDay === formattedDay) ? classes.weekDayActive : classes.weekDay}>
                                    {formattedDay}
                                </div>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
})

export default PlanAddCalendar
