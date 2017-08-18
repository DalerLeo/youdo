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
            padding: '0 30px',
            fontSize: '16px',
            fontWeight: '600',
            '& > div': {
                display: 'flex',
                height: '36px',
                alignItems: 'center',
                textTransform: 'capitalize'
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

const PlanMonthFilter = enhance((props) => {
    const {classes, calendar} = props
    const monthFormat = (date, defaultText) => {
        return (date) ? moment(date).locale('ru').format('MMMM') : defaultText
    }
    const selectedMonth = moment(_.get(calendar, 'selectedDate'))
    const selectedYear = moment(_.get(calendar, 'selectedDate')).format('YYYY')
    return (
        <div className={classes.titleDate}>
            <div>
                <IconButton
                    onTouchTap={calendar.handlePrevMonth}
                    iconStyle={navArrow.icon}
                    style={navArrow.button}
                    disableTouchRipple={true}>
                    <LeftArrow/>
                </IconButton>
            </div>
            <div>{monthFormat(selectedMonth)}&nbsp;{selectedYear}</div>
            <div>
                <IconButton
                    onTouchTap={calendar.handleNextMonth}
                    iconStyle={navArrow.icon}
                    style={navArrow.button}
                    disableTouchRipple={true}>
                    <RightArrow/>
                </IconButton>
            </div>
        </div>
    )
})

export default PlanMonthFilter
