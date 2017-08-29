import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {Field, reduxForm} from 'redux-form'
import TrackingDateField from '../ReduxForm/TrackingDateField'
import IconButton from 'material-ui/IconButton'
import LeftArrow from 'material-ui/svg-icons/navigation/chevron-left'
import RightArrow from 'material-ui/svg-icons/navigation/chevron-right'

const enhance = compose(
    injectSheet({
        titleDate: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '55px',
            padding: '0px 30px',
            position: 'relative',
            '& nav': {
                height: '34px',
                position: 'absolute'
            }
        },
        prev: {
            left: '30px'
        },
        next: {
            right: '30px'
        }
    }),
    reduxForm({
        form: 'TrackingFilterForm',
        enableReinitialize: true
    }),
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

const TrackingDatePicker = enhance((props) => {
    const {classes, filter, calendar} = props
    return (
        <div className={classes.titleDate}>
            <nav className={classes.prev}>
                <IconButton
                    onTouchTap={calendar.handlePrevDay}
                    iconStyle={navArrow.icon}
                    style={navArrow.button}
                    disableTouchRipple={true}>
                    <LeftArrow/>
                </IconButton>
            </nav>
            <Field
                name="date"
                className={classes.inputDateCustom}
                filter={filter}
                component={TrackingDateField}
                fullWidth={true}
            />
            <nav className={classes.next}>
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

export default TrackingDatePicker