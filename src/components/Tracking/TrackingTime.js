import _ from 'lodash'
import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import Slider from 'material-ui/Slider'

const min = 0
const zero = 0
const minutePerHour = 60
const hourPerDay = 24
const max = minutePerHour * hourPerDay

const enhance = compose(
    injectSheet({
        detailWrap: {
            background: '#fff',
            position: 'absolute',
            padding: '8px 20px 5px',
            left: '-28px',
            right: '322px',
            bottom: '-28px',
            borderTop: '1px #efefef  solid',
            zIndex: '4',
            overflow: 'hidden',
            transition: 'all 400ms ease'
        },
        wrapper: {
            display: 'flex',
            alignItems: 'center'
        },
        hours: {
            fontSize: '10px',
            color: '#999',
            display: 'flex',
            justifyContent: 'space-between',
            margin: '0 -4px',
            marginBottom: '5px',
            '& > div': {
                textAlign: 'right',
                position: 'relative'
            }
        },
        points: {
            display: 'flex',
            marginBottom: '-10px',
            justifyContent: 'space-between'
        },
        point: {
            background: '#9e9e9e',
            width: '1px',
            height: '8px'
        },
        slider: {
            width: '100%',
            '& > div:last-child > div': {
                margin: '0 !important'
            }
        },
        time: {
            fontWeight: '600',
            color: '#12aaeb',
            fontSize: '15px',
            marginRight: '20px'
        }
    })
)

const sliderTheme = getMuiTheme({
    slider: {
        trackColor: '#9e9e9e',
        selectionColor: '#12aaeb'
    }
})

const TrackingTime = enhance((props) => {
    const {
        classes,
        openDetail,
        sliderValue,
        setSliderValue
    } = props

    const handleSlider = (event, value) => {
        setSliderValue(value)
    }
    const TEN = 10
    let hour = _.floor(sliderValue / minutePerHour) || zero
    if (hour < TEN) {
        hour = '0' + hour
    } else if (hour === hourPerDay) {
        hour = '00'
    }
    let minute = _.floor(sliderValue % minutePerHour) || zero
    if (minute < TEN) {
        minute = '0' + minute
    }

    let hours = []
    for (let i = 0; i <= hourPerDay; i++) {
        if (i < TEN) {
            i = '0' + i
        }
        hours.push(i)
    }

    return (
        <div className={classes.detailWrap} style={openDetail ? {opacity: '1'} : {opacity: '0'}}>
            <div className={classes.wrapper}>
                <div className={classes.time}>{hour}:{minute}</div>
                <div className={classes.slider}>
                    <div className={classes.hours}>
                        {_.map(hours, (item) => {
                            return (
                                <div key={item}>{item}</div>
                            )
                        })}
                    </div>
                    <div className={classes.points}>
                        {_.map(hours, (item) => {
                            return (
                                <div
                                    key={item * hourPerDay}
                                    className={classes.point}>
                                </div>
                            )
                        })}
                    </div>
                    <MuiThemeProvider muiTheme={sliderTheme}>
                        <Slider
                            min={min}
                            max={max}
                            step={5}
                            style={{cursor: 'pointer', width: '100%'}}
                            value={sliderValue}
                            defaultValue={sliderValue}
                            onChange={handleSlider}
                        />
                    </MuiThemeProvider>
                </div>
            </div>
        </div>
    )
})

export default TrackingTime