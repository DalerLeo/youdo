import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../../Loader/index'
import {reduxForm, Field} from 'redux-form'
import {TextField} from '../../ReduxForm'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import t from '../../../helpers/translate'
import {
    BORDER_STYLE, COLOR_DEFAULT, COLOR_GREY, COLOR_GREY_LIGHTEN, COLOR_WHITE, LINK_COLOR,
    PADDING_STANDART
} from '../../../constants/styleConstants'
import formValidate from '../../../helpers/formValidate'
import LeftArrow from 'material-ui/svg-icons/navigation/chevron-left'
import RightArrow from 'material-ui/svg-icons/navigation/chevron-right'
import {
    HR_RESUME_MEETING, HR_RESUME_NOTE, HR_RESUME_REMOVED,
    HR_RESUME_SHORT
} from '../../../constants/backendConstants'
import moment from 'moment'
import {getCalendar, weekNames} from '../../../helpers/planCalendar'

const enhance = compose(
    injectSheet({
        dialog: {
            overflowY: 'auto',
            zIndex: '1410 !important'
        },
        loader: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: '#fff',
            top: '0',
            left: '0',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: ({loading}) => loading ? 'flex' : 'none'
        },
        popUp: {
            color: '#333 !important',
            overflowY: 'unset !important',
            overflowX: 'unset !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            height: '100%',
            maxHeight: 'none !important',
            marginBottom: '64px'
        },
        titleContent: {
            background: '#fff',
            color: COLOR_DEFAULT,
            fontWeight: 'bold',
            textTransform: 'uppercase',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: BORDER_STYLE,
            padding: '0 10px 0 30px',
            height: '60px',
            zIndex: '999'
        },
        inContent: {
            display: 'flex'
        },
        leftSide: {
            borderRight: BORDER_STYLE,
            width: '50%',
            padding: '0 30px 10px'
        },
        rightSide: {
            width: '50%',
            padding: PADDING_STANDART
        },
        block: {
            padding: PADDING_STANDART,
            width: '100%'
        },
        inputFieldCustom: {
            fontSize: '13px !important',
            height: '45px !important',
            marginTop: '7px',
            '& > div:first-child': {
                fontSize: '13px !important'
            },
            '& label': {
                top: '20px !important',
                lineHeight: '5px !important'
            },
            '& input': {
                marginTop: '0 !important'
            }
        },
        textFieldArea: {
            top: '-20px !important',
            lineHeight: '20px !important',
            fontSize: '13px !important',
            marginBottom: '-22px'
        },
        inputDateCustom: {
            fontSize: '13px !important',
            height: '45px !important',
            marginTop: '7px',
            '& > div:first-child': {
                fontSize: '13px !important'
            },
            '& label': {
                top: '20px !important',
                lineHeight: '5px !important'
            },
            '& input': {
                marginTop: '0 !important'
            },
            '& div:first-child': {
                height: '45px !important'
            }
        },
        bottomButton: {
            bottom: '0',
            left: '0',
            right: '0',
            padding: '10px',
            zIndex: '999',
            borderTop: BORDER_STYLE,
            background: COLOR_WHITE,
            textAlign: 'right',
            '& span': {
                fontSize: '13px !important',
                fontWeight: '600 !important',
                color: '#129fdd',
                verticalAlign: 'inherit !important'
            }
        },
        actionButton: {
            fontSize: '13px !important',
            margin: '0 !important'
        },

        // CALENDAR
        titleDate: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '14px',
            fontWeight: '600',
            padding: '10px 0',
            '& > div': {
                display: 'flex',
                alignItems: 'center',
                textTransform: 'capitalize'
            },
            '& > nav': {
                display: 'flex',
                alignItems: 'center'
            }
        },
        dateBlock: {

        },
        week: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        weekItem: {
            color: COLOR_GREY_LIGHTEN,
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '32px',
            width: '32px'
        },
        days: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between'
        },
        weekDay: {
            extend: 'weekItem',
            color: COLOR_DEFAULT,
            fontSize: '13px',
            cursor: 'pointer',
            background: COLOR_WHITE
        },
        weekDayEmty: {
            height: '32px',
            width: '32px'
        },
        weekDayActive: {
            extend: 'weekDay',
            borderRadius: '50%',
            background: LINK_COLOR,
            cursor: 'default',
            color: COLOR_WHITE,
            fontWeight: '600'
        },
        today: {
            extend: 'weekDayActive',
            cursor: 'pointer',
            background: '#ccc'
        },
        weekDayDisabled: {
            extend: 'weekDay',
            cursor: 'default',
            color: COLOR_GREY_LIGHTEN
        }
    }),
    reduxForm({
        form: 'ResumeMoveForm',
        enableReinitialize: true
    }),
    withState('selectedDay', 'changeSelectedDay', moment().format('DD')),
    withState('selectedDate', 'changeSelectedDate', moment().format('YYYY-MM')),
)

const DateTimeCommentDialog = enhance((props) => {
    const {
        open,
        onClose,
        classes,
        handleSubmit,
        dispatch,
        status,
        selectedDay,
        changeSelectedDay,
        selectedDate,
        changeSelectedDate
    } = props
    const ONE = 1
    const onSubmit = (datetime) => {
        return handleSubmit(() => props.onSubmit(datetime)
            .catch((error) => {
                formValidate([], dispatch, error)
            }))
    }
    const getTitle = () => {
        switch (status) {
            case HR_RESUME_MEETING: return t('Назначить собеседование')
            case HR_RESUME_SHORT: return t('Добавление в шортлист')
            case HR_RESUME_REMOVED: return t('Удаление резюме из списка')
            case HR_RESUME_NOTE: return t('Добавление заметки')
            default: return null
        }
    }

    // Calendar
    const monthFormat = (date, defaultText) => {
        return (date) ? moment(date).locale('ru').format('MMMM') : defaultText
    }
    const selectedMonth = moment(selectedDate)
    const selectedYear = moment(selectedDate).format('YYYY')

    const daysInMonth = moment(selectedDate).daysInMonth()
    const firstDayWeek = moment(moment(selectedDate).format('YYYY-MM-01')).isoWeekday()
    const lastDayWeek = moment(moment(selectedDate).format('YYYY-MM-' + daysInMonth)).isoWeekday()

    const handlePrevMonth = () => {
        const prevMonth = moment(selectedDate).subtract(ONE, 'month')
        const outputMonth = prevMonth.format('YYYY-MM')
        return changeSelectedDate(outputMonth)
    }
    const handleNextMonth = () => {
        const nextMonth = moment(selectedDate).add(ONE, 'month')
        const outputMonth = nextMonth.format('YYYY-MM')
        return changeSelectedDate(outputMonth)
    }

    const calendar = {
        selectedDay,
        selectedCreateDate: selectedDate,
        handlePrevMonth,
        handleNextMonth,
        handleChooseDay: (day) => {
            return changeSelectedDay(day)
        }
    }

    const navArrow = {
        icon: {
            color: COLOR_GREY,
            width: 24,
            height: 24
        },
        button: {
            width: 34,
            height: 34,
            padding: 5
        }
    }

    const normalizeTime = (value, data) => {
        const first = 0
        const last = 1
        const TWO = 2
        const FIVE = 5
        const TEN = 10
        const MAX_DIGITS = 2
        const matchCondition = /[0-9]{2}:[0-9]{2}/g
        const getValues = (which) => {
            return _.split(value.match(matchCondition), ':')[which]
        }
        const maxHour = 23
        const maxMinute = 59
        const hour = _.parseInt(getValues(first)) > maxHour ? maxHour : getValues(first)
        const minute = _.parseInt(getValues(last)) > maxMinute ? maxMinute : getValues(last)
        const fullOutput = hour + ':' + minute

        const splittedValue = _.split(value, ':')
        const hasOtherSymbols = _.map(splittedValue, (item) => {
            return _.isNaN(_.parseInt(item))
        })
        const hourValue = splittedValue[first]
        const minuteValue = _.parseInt(splittedValue[last])
        if (_.includes(hasOtherSymbols, true) && value) {
            return ''
        }
        if (minuteValue > FIVE && minuteValue < TEN) {
            return hourValue + ':0' + minuteValue
        }
        if (value.length === ONE && _.parseInt(value) > TWO) {
            return '0' + value + ':'
        }
        if (value.length === MAX_DIGITS && _.parseInt(value) > maxHour) {
            return maxHour + ':'
        }
        if (value.length === TWO && data.substr(TWO) !== ':') {
            return value + ':'
        }

        if (!_.isNaN(_.parseInt(hour)) && !_.isNaN(_.parseInt(minute))) {
            return fullOutput
        }
        return value
    }

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={{width: '600px', maxWidth: 'none'}}
            bodyClassName={classes.popUp}>

            <div className={classes.titleContent}>
                <span>{getTitle()}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>

            <div className={classes.bodyContent}>
                <div className={classes.inContent}>
                    <div className={classes.loader}>
                        <Loader size={0.75}/>
                    </div>
                    {status === HR_RESUME_MEETING &&
                    <div className={classes.leftSide}>
                        <div className={classes.dateBlock}>
                            <div className={classes.titleDate}>
                                <nav>
                                    <IconButton
                                        onTouchTap={calendar.handlePrevMonth}
                                        iconStyle={navArrow.icon}
                                        style={navArrow.button}
                                        disableTouchRipple={true}>
                                        <LeftArrow/>
                                    </IconButton>
                                </nav>
                                <div>{monthFormat(selectedMonth)}&nbsp;{selectedYear}</div>
                                <nav>
                                    <IconButton
                                        onTouchTap={calendar.handleNextMonth}
                                        iconStyle={navArrow.icon}
                                        style={navArrow.button}
                                        disableTouchRipple={true}>
                                        <RightArrow/>
                                    </IconButton>
                                </nav>
                            </div>
                            <div className={classes.week}>
                                {_.map(weekNames, (w) => {
                                    const weekId = _.get(w, 'id')
                                    const weekName = _.get(w, 'name')
                                    return (
                                        <div key={weekId} className={classes.weekItem}>{weekName}</div>
                                    )
                                })}
                            </div>
                            <div className={classes.days}>
                                {_.map(getCalendar(firstDayWeek, daysInMonth, lastDayWeek), (d, i) => {
                                    const day = _.get(d, 'day')
                                    const parsedDay = _.parseInt(day)
                                    const parsedSelectedDay = _.parseInt(selectedDay)
                                    const isEmpty = _.get(d, 'isEmpty')
                                    if (isEmpty) {
                                        return (<div key={i} className={classes.weekDayEmty}/>)
                                    } else if (parsedDay === parsedSelectedDay) {
                                        return (
                                            <div key={i} className={classes.weekDayActive}>{parsedDay}</div>
                                        )
                                    }
                                    return (
                                        <div
                                            key={i}
                                            onClick={() => { calendar.handleChooseDay(day) }}
                                            className={classes.weekDay}>
                                            {parsedDay}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>}
                    <div className={status === HR_RESUME_MEETING ? classes.rightSide : classes.block}>
                        {status === HR_RESUME_MEETING &&
                        <Field
                            name="time"
                            className={classes.inputFieldCustom}
                            component={TextField}
                            normalize={normalizeTime}
                            label={t('Время собеседования')}
                            fullWidth={true}/>}
                        <Field
                            name="note"
                            component={TextField}
                            className={classes.textFieldArea}
                            label={t('Заметки')}
                            fullWidth={true}
                            multiLine={true}
                            rows={1}/>
                    </div>
                </div>
                <div className={classes.bottomButton}>
                    <FlatButton
                        label={t('Сохранить')}
                        className={classes.actionButton}
                        primary={true}
                        onTouchTap={onSubmit(selectedDate + '-' + selectedDay)}
                    />
                </div>
            </div>
        </Dialog>
    )
})

DateTimeCommentDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool
}

export default DateTimeCommentDialog
