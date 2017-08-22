import _ from 'lodash'
import React from 'react'
import {compose, withState} from 'recompose'
import Slider from 'material-ui/Slider'
import injectSheet from 'react-jss'

const enhance = compose(
    injectSheet({
        wrapper: {}
    }),
    withState('sliderValue', 'setSliderValue', 0)
)

const max = 1440
const min = 0
const minutePerHour = 60

const TrackingTimeSlider = enhance((props) => {
    const {classes, input, sliderValue, setSliderValue} = props

    const handleSlider = (event, value) => {
        setSliderValue(value)
        input.onChange(value)
    }
    const hour = _.floor(sliderValue / minutePerHour)
    const minute = _.floor(sliderValue % minutePerHour)

    return (
        <div className={classes.wrapper}>
            <Slider
                min={min}
                max={max}
                step={1}
                value={sliderValue}
                defaultValue={input.value}
                onChange={handleSlider}
            />
            <div>{sliderValue}</div>
            <div>Hour: {hour}</div>
            <div>Minute: {minute}</div>
        </div>
    )
})

export default TrackingTimeSlider
