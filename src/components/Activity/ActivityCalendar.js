import _ from 'lodash'
import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import moment from 'moment'
import Paper from 'material-ui/Paper'
import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left'
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right'

const border = '1px #efefef solid'
const enhance = compose(
    injectSheet({
        calendarWrapper: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textTransform: 'capitalize',
            userSelect: 'none'
        },
        calendarNav: {
            extend: 'calendarWrapper',
            color: '#666',
            padding: '0 30px',
            cursor: 'pointer',
            lineHeight: '75px',
            '& svg': {
                width: '20px !important',
                height: '20px !important',
                color: 'inherit !important'
            }
        },
        calendar: {
            borderLeft: border,
            borderRight: border
        },
        currentMonth: {
            textAlign: 'center',
            fontWeight: 'bold',
            borderBottom: border,
            padding: '10px'
        },
        currentDays: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '5px'
        },
        day: {
            height: '26px',
            width: '26px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
        },
        today: {
            extend: 'day',
            borderRadius: '50%',
            background: '#92ce95',
            color: '#fff',
            fontWeight: '600',
            position: 'relative',
            zIndex: '2',
            '&:before': {
                content: '""',
                position: 'absolute',
                bottom: '-14px',
                left: 'calc(50% - 6px)',
                borderTop: '7px solid #cacaca',
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                filter: 'blur(1px)'
            },
            '&:after': {
                content: '""',
                position: 'absolute',
                bottom: '-12px',
                left: 'calc(50% - 6px)',
                borderTop: '7px solid',
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent'
            }
        }
    })
)

const ActivityCalendar = enhance((props) => {
    const {classes, calendar, handleClickDay} = props

    const ONE = 1
    const monthFormat = (date, defaultText) => {
        return (date) ? moment(date).locale('ru').format('MMMM') : defaultText
    }
    const selectedDay = _.get(calendar, 'selectedDay')
    const selectedDate = _.get(calendar, 'selectedDate')
    const handleNextMonth = _.get(calendar, 'handleNextMonth')
    const handlePrevMonth = _.get(calendar, 'handlePrevMonth')

    const selectedYear = moment(selectedDate).format('YYYY')

    const getDaysArrayByMonth = () => {
        let daysInMonth = moment(selectedDate).daysInMonth()
        let arrDays = []

        while (daysInMonth) {
            const current = moment(selectedDate).date(daysInMonth)
            arrDays.push(current)
            daysInMonth--
        }

        return arrDays
    }
    const currentMonthDays = getDaysArrayByMonth()

    const prevMonth = monthFormat(moment(selectedDate).subtract(ONE, 'month'))
    const nextMonth = monthFormat(moment(selectedDate).add(ONE, 'month'))

    const days = _.map(_.reverse(currentMonthDays), (item) => {
        const day = _.toInteger(item.format('D'))
        return (
            <div
                key={day}
                onClick={() => { handleClickDay(day) }}
                className={(day === selectedDay) ? classes.today : classes.day}>
                {day}
            </div>
        )
    })

    return (
        <Paper zDepth={1} className={classes.calendarWrapper}>
            <div className={classes.calendarNav} onClick={() => { handlePrevMonth() }}>
                <ChevronLeft/> <span>{prevMonth}</span>
            </div>
            <div className={classes.calendar}>
                <div className={classes.currentMonth}>{monthFormat(selectedDate)} {selectedYear}</div>
                <div className={classes.currentDays}>{days}</div>
            </div>
            <div className={classes.calendarNav} onClick={() => { handleNextMonth() }}>
                <span>{nextMonth}</span> <ChevronRight/>
            </div>
        </Paper>
    )
})

ActivityCalendar.PropTypes = {
}

export default ActivityCalendar
