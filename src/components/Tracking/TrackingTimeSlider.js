import _ from 'lodash'
import React from 'react'
import {compose, withState} from 'recompose'
import Slider from 'material-ui/Slider'
import injectSheet from 'react-jss'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

const ZERO = 0
const enhance = compose(
    injectSheet({
        wrapper: {
            '& > div:first-child > div': {
                margin: '20px 0 !important'
            }
        },
        time: {
            fontWeight: '600'
        }
    }),
    withState('sliderValue', 'setSliderValue', ZERO)
)

const sliderTheme = getMuiTheme({
    slider: {
        trackColor: '#9e9e9e',
        selectionColor: '#12aaeb'
    }
})

const max = 1440
const min = 0
const minutePerHour = 60
const hourPerDay = 24

const TrackingTimeSlider = enhance((props) => {
    const {classes, input, sliderValue, setSliderValue} = props

    const handleSlider = (event, value) => {
        setSliderValue(value)
        input.onChange(value)
    }
    const TEN = 10
    let hour = _.floor(sliderValue / minutePerHour) || ZERO
    if (hour < TEN) {
        hour = '0' + hour
    } else if (hour === hourPerDay) {
        hour = '00'
    }
    let minute = _.floor(sliderValue % minutePerHour) || ZERO
    if (minute < TEN) {
        minute = '0' + minute
    }

    return (
        <div className={classes.wrapper}>
            <MuiThemeProvider muiTheme={sliderTheme}>
                <Slider
                    min={min}
                    max={max}
                    step={1}
                    value={input.value}
                    defaultValue={input.value}
                    onChange={handleSlider}
                />
            </MuiThemeProvider>
            <div className={classes.time}>Время: {hour}:{minute}</div>
        </div>
    )
})

export default TrackingTimeSlider
