import React from 'react'
import PropTypes from 'prop-types'
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
            height: '55px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '15px',
            fontWeight: '600',
            '& > div': {
                display: 'flex',
                height: '36px',
                width: '120px',
                justifyContent: 'center',
                alignItems: 'center',
                textTransform: 'capitalize'
            },
            '& > nav': {
                display: 'flex',
                height: '30px',
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
        }
    })
)

const navArrow = {
    icon: {
        color: '#666',
        width: 24,
        height: 24
    },
    button: {
        width: 30,
        height: 30,
        padding: 3
    }
}

const DateFilter = enhance((props) => {
    const {classes, handlePrevMonth, handleNextMonth, selectedDate, beginDate, endDate, type} = props
    const monthFormat = (date, defaultText) => {
        return (date) ? moment(date).locale('ru').format('MMMM') : defaultText
    }
    const selectedMonth = moment(selectedDate)
    const selectedYear = moment(selectedDate).format('YYYY')
    return (type === 'begin')
        ? (
            <div className={classes.titleDate}>
                <nav>
                    <IconButton
                        onTouchTap={handlePrevMonth}
                        iconStyle={navArrow.icon}
                        style={navArrow.button}
                        disableTouchRipple={true}>
                        <LeftArrow/>
                    </IconButton>
                </nav>
                <div>{monthFormat(selectedMonth)}&nbsp;{selectedYear}</div>
                <nav>
                    <IconButton
                        disabled={beginDate >= endDate}
                        onTouchTap={handleNextMonth}
                        iconStyle={navArrow.icon}
                        style={navArrow.button}
                        disableTouchRipple={true}>
                        <RightArrow/>
                    </IconButton>
                </nav>
            </div>
        )
        : (type === 'end')
            ? (
                <div className={classes.titleDate}>
                    <nav>
                        <IconButton
                            disabled={endDate <= beginDate}
                            onTouchTap={handlePrevMonth}
                            iconStyle={navArrow.icon}
                            style={navArrow.button}
                            disableTouchRipple={true}>
                            <LeftArrow/>
                        </IconButton>
                    </nav>
                    <div>{monthFormat(selectedMonth)}&nbsp;{selectedYear}</div>
                    <nav>
                        <IconButton
                            onTouchTap={handleNextMonth}
                            iconStyle={navArrow.icon}
                            style={navArrow.button}
                            disableTouchRipple={true}>
                            <RightArrow/>
                        </IconButton>
                    </nav>
                </div>
            )
            : null
})

DateFilter.propTypes = {
    handlePrevMonth: PropTypes.func.isRequired,
    handleNextMonth: PropTypes.func.isRequired,
    selectedDate: PropTypes.any.isRequired
}

export default DateFilter
