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
            minHeight: '55px',
            display: 'flex',
            borderBottom: '1px #efefef solid',
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

const TrakingDayFilter = enhance((props) => {
    const {classes, calendar} = props
    const dateFormat = (date, time, defaultText) => {
        const dateTime = moment(date).locale('ru').format('DD MMMM YYYY')
        return (date && time) ? dateTime : (date) ? moment(date).locale('ru').format('DD MMMM YYYY') : defaultText
    }
    const selectedDate = dateFormat(_.get(calendar, 'selectedDate'))
    return (
        <div className={classes.titleDate}>
            <nav>
                <IconButton
                    onTouchTap={calendar.handlePrevDay}
                    iconStyle={navArrow.icon}
                    style={navArrow.button}
                    disableTouchRipple={true}>
                    <LeftArrow/>
                </IconButton>
            </nav>
            <div>{selectedDate}</div>
            <nav>
                <IconButton
                    onTouchTap={calendar.handleNextDay}
                    iconStyle={navArrow.icon}
                    style={navArrow.button}
                    disableTouchRipple={true}>
                    <RightArrow/>
                </IconButton>
            </nav>
        </div>
    )
})

export default TrakingDayFilter
