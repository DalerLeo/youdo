import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import TrackingTimeSlider from './TrackingTimeSlider'

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
        }
    }),
    reduxForm({
        form: 'TrackingFilterForm',
        enableReinitialize: true
    })
)

const TrackingTime = enhance((props) => {
    const {
        classes,
        openDetail
    } = props
    return (
        <div className={classes.detailWrap} style={openDetail ? {opacity: '1'} : {opacity: '0'}}>
            <Field
                name="time"
                component={TrackingTimeSlider}
            />
        </div>
    )
})

export default TrackingTime
