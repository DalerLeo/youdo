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
import Loader from '../Loader'

const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        form: {
            width: '350px',
            padding: '20px 30px',
            position: 'relative'
        },
        confirmDialog: {
            zIndex: '999',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0'
        },
        confirmWrapper: {
            '& h4': {
                fontSize: '13px',
                fontWeight: '600',
                marginBottom: '15px'
            }
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

const buttonLabelStyle = {
    color: '#fff',
    fontWeight: '600',
    textTransform: 'none',
    verticalAlign: 'baseline'
}
const confirmLabelStyle = {
    color: '#12aaeb',
    fontWeight: '600',
    textTransform: 'none',
    verticalAlign: 'baseline'
}

const PlanWeekDayForm = enhance((props) => {
    const {classes, onSubmit, isUpdate, planType, filter, createLoading, updateLoading, submitDelete, openConfirmDialog, setOpenConfirmDialog, selectedWeekDay} = props
    const closeForm = () => {
        hashHistory.push(filter.createURL({[MARKET]: null}))
    }
    const closeUpdateForm = () => {
        hashHistory.push(filter.createURL({[MARKET]: null, [UPDATE_PLAN]: false}))
    }
    if (createLoading || updateLoading) {
        return (
            <Paper zDepth={1} className={classes.form}>
                <div className={classes.loader}>
                    <Loader size={0.8}/>
                </div>
            </Paper>
        )
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
                    isUpdate={isUpdate}
                    component={PlanTypeRadio}/>
                <div className={classes.title}>Выберите дни</div>
                {planType === 'week'
                ? <Field
                        name="weekday"
                        selectedWeekDay={!isUpdate ? selectedWeekDay : null}
                        component={PlanChooseWeekday}/>
                : <Field
                        name="weekday"
                        component={PlanChooseMonthDay}/>}
                <div className={classes.title}>Приоритет</div>
                <Field
                    name="priority"
                    label="1...100"
                    component={PlanAddPrioritySearchField}/>
                <div className={classes.submitBtn}>
                    <FlatButton
                        label={isUpdate ? 'Изменить план' : 'Добавить в план агента'}
                        backgroundColor="#12aaeb"
                        hoverColor="#12aaeb"
                        type="submit"
                        rippleColor="#fff"
                        fullWidth={true}
                        labelStyle={buttonLabelStyle}
                    />
                    {isUpdate && <FlatButton
                        onTouchTap={() => { setOpenConfirmDialog(true) }}
                        label="Удалить план"
                        backgroundColor="#fd4641"
                        style={{marginTop: '5px'}}
                        hoverColor="#fd4641"
                        rippleColor="#fff"
                        fullWidth={true}
                        labelStyle={buttonLabelStyle}
                    />}
                </div>
                {openConfirmDialog && <div className={classes.confirmDialog}>
                    <div className={classes.confirmWrapper}>
                        <h4>Удалить текущий план?</h4>
                        <FlatButton
                            label="Нет"
                            hoverColor="#efefef"
                            labelStyle={confirmLabelStyle}
                            onTouchTap={() => { setOpenConfirmDialog(false) }}
                        />
                        <FlatButton
                            label="Да"
                            hoverColor="#efefef"
                            labelStyle={confirmLabelStyle}
                            onTouchTap={submitDelete}
                        />
                    </div>
                </div>}
            </form>
        </Paper>
    )
})

PlanWeekDayForm.defaultProps = {
    isUpdate: false
}

export default PlanWeekDayForm
