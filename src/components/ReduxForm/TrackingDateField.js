/* eslint no-invalid-this: 0 */
/* eslint no-undefined: 0 */

import _ from 'lodash'
import React from 'react'
import injectSheet from 'react-jss'
import PropTypes from 'prop-types'
import {Calendar} from 'react-date-range-ru'
import {Popover} from 'material-ui'
import MUITextField from 'material-ui/TextField'
import moment from 'moment'
import {hashHistory} from 'react-router'

class TrackingDateField extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            starting: false
        }
    }

    handleOnTouchTap = (event) => {
        event.preventDefault()

        this.setState({
            anchorEl: event.currentTarget,
            open: !this.props.open
        })
    }

    handleOnRequestClose = () => {
        this.setState({
            open: false
        })
    }

    render () {
        const {classes, input, meta: {error}, filter} = this.props
        const {open, anchorEl} = this.state
        const dateFormat = (date, time, defaultText) => {
            const dateTime = moment(date).locale('ru').format('DD MMMM YYYY')
            return (date && time) ? dateTime : (date) ? moment(date).locale('ru').format('DD MMMM YYYY') : defaultText
        }
        const date = _.get(input, ['value']) ? dateFormat(_.get(input, ['value'])) : dateFormat(moment())
        const dateLabel = error || (!date)
            ? '' : date

        const onChange = (inputDate) => {
            input.onChange({inputDate})
            hashHistory.push(filter.createURL({date: moment(inputDate).format('YYYY-MM-DD')}))
        }

        const defaultDate = moment(_.get(input, ['value'])) || moment()

        return (
            <div className={classes.button}>
                <MUITextField
                    onFocus={this.handleOnTouchTap}
                    value={dateLabel}
                    className={classes.inputDateCustom}
                />
                <Popover
                     open={open}
                     anchorEl={anchorEl}
                     onRequestClose={this.handleOnRequestClose}>
                    <Calendar
                        lang={'ru'}
                        date={defaultDate}
                        calendars={1}
                        onChange={onChange}
                        theme={{
                            Calendar: {width: 289},
                            PredefinedRangesItemActive: {
                                background: '#98a1b7',
                                color: '#fff'
                            },
                            PredefinedRanges: {marginLeft: 10, marginTop: 10},
                            DateRange: {
                                background: '#ffffff'
                            },
                            MonthAndYear: {
                                background: '#5d6474',
                                color: '#fff',
                                height: '42px',
                                lineHeight: '18px',
                                padding: '12px'
                            },
                            MonthButton: {
                                background: '#fff'
                            },
                            MonthArrowPrev: {
                                borderRightColor: '#5d6474'
                            },
                            MonthArrowNext: {
                                borderLeftColor: '#5d6474'
                            },
                            Weekday: {
                                background: '#fff',
                                color: '#5d6474'
                            },
                            Day: {
                                transition: 'transform .1s ease, box-shadow .1s ease, background .1s ease'
                            },
                            DaySelected: {
                                background: '#5d6474'
                            },
                            DayActive: {
                                background: '#8e44ad',
                                boxShadow: 'none'
                            },
                            DayInRange: {
                                background: '#7e8698',
                                color: '#fff'
                            },
                            DayHover: {
                                background: '#98a1b7',
                                color: '#fff'
                            }
                        }}
                    />
                </Popover>
            </div>
        )
    }
}

TrackingDateField.defaultProps = {
    format: 'DD.MM.YYYY'
}

TrackingDateField.propTypes = {
    format: PropTypes.string,
    filter: PropTypes.object
}

export default injectSheet({
    button: {
        width: '100%',
        '& button': {
            width: '100%'
        }
    },
    inputDateCustom: {
        fontSize: '13px !important',
        height: '30px !important',
        width: '100% !important',
        cursor: 'pointer !important',
        '& div': {
            fontSize: '13px !important'
        },
        '& label': {
            top: '20px !important',
            lineHeight: '5px !important'
        },
        '& input': {
            marginTop: '0 !important',
            textAlign: 'center !important',
            textTransform: 'capitalize',
            fontWeight: '600 !important',
            fontSize: '16px !important',
            color: '#333 !important'
        },
        '& div:first-child': {
            height: '30px !important'
        },
        '& hr': {
            display: 'none !important'
        }
    },
    clear: {
        position: 'absolute',
        bottom: '0',
        backgroundColor: '#5d6474',
        borderRadius: '3px',
        margin: '10px',
        width: '140px',
        '& button': {
            width: '100%',
            '& span': {
                textTransform: 'none !important',
                color: '#fff !important'
            }
        }
    }
})(TrackingDateField)
