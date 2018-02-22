import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import PlanChooseWeekday from './PlanChooseWeekday'
import PlanChooseMonthDay from './PlanChooseMonthDay'
import PlanTypeRadio from './PlanTypeRadio'
import PlanChooseAgentsRadio from './PlanChooseAgentsRadio'
import Paper from 'material-ui/Paper'
import FlatButton from 'material-ui/FlatButton'
import injectSheet from 'react-jss'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Close from 'material-ui/svg-icons/navigation/close'
import PlanAddPrioritySearchField from '../ReduxForm/PlanAddPrioritySearchField'
import {MARKET, UPDATE_PLAN} from '../Plan'
import Loader from '../Loader'
import t from '../../helpers/translate'
import formValidate from '../../helpers/formValidate'

const enhance = compose(
    injectSheet({
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
        loader: {
            extend: 'confirmDialog',
            zIndex: '1000'
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
    const {
        classes,
        handleSubmit,
        isUpdate,
        comboPlan,
        combo,
        planType,
        filter,
        createLoading,
        updateLoading,
        submitDelete,
        openConfirmDialog,
        setOpenConfirmDialog,
        selectedWeekDay,
        dispatch
    } = props
    const closeForm = () => {
        hashHistory.push(filter.createURL({[MARKET]: null}))
    }
    const closeUpdateForm = () => {
        hashHistory.push(filter.createURL({[MARKET]: null, [UPDATE_PLAN]: false}))
    }
    const formNames = ['agent', 'planType', 'weekday', 'priority']
    const onSubmit = handleSubmit(() => props.onSubmit()
        .catch((error) => {
            formValidate(formNames, dispatch, error)
        }))
    const comboLoading = _.get(comboPlan, 'combinationLoading')
    const comboPlanId = _.get(comboPlan, 'comboPlanId')
    const agents = _.get(comboPlan, 'agents')
    const loading = createLoading || updateLoading || comboLoading
    return (
        <Paper zDepth={1} className={classes.form}>
            <div className={classes.closeIcon}>
                <Close onClick={(isUpdate || combo) ? closeUpdateForm : closeForm}/>
            </div>
            <form onSubmit={onSubmit}>
                {combo && comboLoading
                    ? <div/>
                    : combo && !comboLoading &&
                    <div>
                        <div className={classes.title}>{t('Закрепленные агенты')}</div>
                        <Field
                            name="agent"
                            agents={agents}
                            data={comboPlan.combinationDetails}
                            component={PlanChooseAgentsRadio}
                        />
                    </div>}
                <div className={classes.title}>{t('Тип плана')}</div>
                {loading
                ? <div>{null}</div>
                : <Field
                    name="planType"
                    isUpdate={isUpdate}
                    component={PlanTypeRadio}/>}
                <div className={classes.title}>{t('Выберите дни')}</div>
                {planType === 'week'
                    ? <Field
                        name="weekday"
                        selectedWeekDay={!isUpdate ? selectedWeekDay : null}
                        component={PlanChooseWeekday}/>
                    : <Field
                        name="weekday"
                        component={PlanChooseMonthDay}/>}
                <div className={classes.title}>{t('Приоритет')}</div>
                <Field
                    name="priority"
                    label="1...100"
                    component={PlanAddPrioritySearchField}/>
                <div className={classes.submitBtn}>
                    <FlatButton
                        label={(isUpdate || comboPlanId) ? t('Изменить план') : t('Добавить в план агента')}
                        backgroundColor="#12aaeb"
                        hoverColor="#12aaeb"
                        type="submit"
                        rippleColor="#fff"
                        fullWidth={true}
                        labelStyle={buttonLabelStyle}
                    />
                    {(isUpdate || comboPlanId) && <FlatButton
                        onTouchTap={() => { setOpenConfirmDialog(true) }}
                        label={t('Удалить план')}
                        backgroundColor="#ff5b57"
                        style={{marginTop: '5px'}}
                        hoverColor="#ff5b57"
                        rippleColor="#fff"
                        fullWidth={true}
                        labelStyle={buttonLabelStyle}
                    />}
                </div>
                {openConfirmDialog && <div className={classes.confirmDialog}>
                    <div className={classes.confirmWrapper}>
                        <h4>{t('Удалить текущий план')}?</h4>
                        <FlatButton
                            label={t('Нет')}
                            hoverColor="#efefef"
                            labelStyle={confirmLabelStyle}
                            onTouchTap={() => { setOpenConfirmDialog(false) }}
                        />
                        <FlatButton
                            label={t('Да')}
                            hoverColor="#efefef"
                            labelStyle={confirmLabelStyle}
                            onTouchTap={handleSubmit(submitDelete)}
                        />
                    </div>
                </div>}
                {loading && <div className={classes.loader}>
                    <Loader size={0.8}/>
                </div>}
            </form>
        </Paper>
    )
})

PlanWeekDayForm.defaultProps = {
    isUpdate: false,
    combo: false
}

export default PlanWeekDayForm
