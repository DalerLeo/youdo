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
    const {classes, onSubmit, planType, filter} = props
    const closeForm = () => {
        hashHistory.push(filter.createURL({'market': null}))
    }
    return (
        <Paper zDepth={1} className={classes.form}>
            <div className={classes.closeIcon}>
                <Close onClick={closeForm}/>
            </div>
            <form onSubmit={onSubmit}>
                <div className={classes.title}>Выберите дни</div>
                {planType === 'week'
                ? <Field
                        name="weekday"
                        component={PlanChooseWeekday}/>
                : <Field
                        name="weekday"
                        component={PlanChooseMonthDay}/>}
                <div className={classes.title}>Тип плана</div>
                <Field
                    name="planType"
                    component={PlanTypeRadio}/>
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

export default PlanWeekDayForm