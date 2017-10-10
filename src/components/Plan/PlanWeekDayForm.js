import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import PlanChooseWeekday from './PlanChooseWeekday'
import PlanChooseMonthDay from './PlanChooseMonthDay'
import PlanTypeRadio from './PlanTypeRadio'
import Paper from 'material-ui/Paper'
import FlatButton from 'material-ui/FlatButton'
import injectSheet from 'react-jss'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Close from 'material-ui/svg-icons/navigation/close'
import PlanAddPrioritySearchField from '../ReduxForm/PlanAddPrioritySearchField'
import {MARKET, UPDATE_PLAN} from '../Plan'

const enhance = compose(
    injectSheet({
        form: {
            width: '350px',
            padding: '20px 30px',
            position: 'relative'
        },
        closeIcon: {
            position: 'absolute',
            top: '12px',
            right: '12px',
            '& svg': {
                color: '#666 !important',
                width: '18px !important',
                height: '18px !important',
                cursor: 'pointer'
            }
        },
        title: {
            fontWeight: '600',
            marginBottom: '10px'
        },
        submitBtn: {
            marginTop: '15px'
        }
    }),
    reduxForm({
        form: 'PlanCreateForm',
        enableReinitialize: true
    }),
    connect((state) => {
        const planType = _.get(state, ['form', 'PlanCreateForm', 'values', 'planType']) || 'week'
        return {
            planType
        }
    })
)

const PlanWeekDayForm = enhance((props) => {
    const {classes, onSubmit, isUpdate, planType, filter, toggleDaysState} = props
    const closeForm = () => {
        hashHistory.push(filter.createURL({[MARKET]: null}))
    }
    const closeUpdateForm = () => {
        hashHistory.push(filter.createURL({[MARKET]: null, [UPDATE_PLAN]: false}))
    }
    return (
        <Paper zDepth={1} className={classes.form}>
            <div className={classes.closeIcon}>
                <Close onClick={isUpdate ? closeUpdateForm : closeForm}/>
            </div>
            <form onSubmit={onSubmit}>
                <div className={classes.title}>Тип плана</div>
                <Field
                    name="planType"
                    component={PlanTypeRadio}/>
                <div className={classes.title}>Выберите дни</div>
                {planType === 'week'
                ? <Field
                        name="weekday"
                        activeWeeks={toggleDaysState.activeWeeks}
                        updateWeeks={toggleDaysState.updateWeeks}
                        component={PlanChooseWeekday}/>
                : <Field
                        name="weekday"
                        activeDays={toggleDaysState.activeDays}
                        updateDays={toggleDaysState.updateDays}
                        component={PlanChooseMonthDay}/>}
                <div className={classes.title}>Приоритет</div>
                <Field
                    name="priority"
                    label="1...100"
                    component={PlanAddPrioritySearchField}/>
                <div className={classes.submitBtn}>
                    <FlatButton
                        label="Добавить в план агента"
                        backgroundColor="#12aaeb"
                        hoverColor="#12aaeb"
                        type="submit"
                        rippleColor="#fff"
                        fullWidth={true}
                        labelStyle={{
                            color: '#fff',
                            fontWeight: '600',
                            textTransform: 'none',
                            verticalAlign: 'baseline'
                        }}
                    />
                </div>
            </form>
        </Paper>
    )
})

PlanWeekDayForm.defaultProps = {
    isUpdate: false
}

export default PlanWeekDayForm
