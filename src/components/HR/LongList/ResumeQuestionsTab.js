import _ from 'lodash'
import React from 'react'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import Loader from '../../Loader'
import {reduxForm, Field} from 'redux-form'
import {TextField} from '../../ReduxForm'
import {COLOR_GREY, COLOR_WHITE} from '../../../constants/styleConstants'

const enhance = compose(
    injectSheet({
        staticLoader: {
            background: COLOR_WHITE,
            padding: '50px 0',
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex'
        },
        textFieldArea: {
            top: '-5px !important',
            lineHeight: '20px !important',
            fontSize: '13px !important'
        },
        questions: {
            padding: '20px 30px',
            position: 'absolute',
            top: '0',
            bottom: '0',
            overflowY: 'auto',
            width: '100%'
        },
        question: {
            marginBottom: '15px',
            listStyle: 'none',
            position: 'relative',
            '&:last-child': {
                marginBottom: '0'
            },
            '& > span': {
                fontWeight: '600'
            },
            '&:hover > div:first-child': {
                opacity: '1 !important'
            }
        },
        remove: {
            cursor: 'pointer',
            opacity: '0',
            position: 'absolute',
            height: '18px',
            width: '18px',
            top: '0',
            right: '0',
            zIndex: '4',
            '& > svg': {
                color: COLOR_GREY + '!important',
                width: '18px !important',
                height: '18px !important'
            }
        }
    }),
    reduxForm({
        form: 'ResumeDetailsForm',
        enableReinitialize: true
    }),
    withState('currentAnswer', 'updateAnswer', '')
)

const ResumeQuestionsTab = enhance((props) => {
    const {
        classes,
        handleSubmitResumeAnswers,
        currentAnswer,
        updateAnswer,
        questionsData
    } = props

    return (
        <div className={classes.questions}>
            {questionsData.loading
                ? <div className={classes.staticLoader}>
                    <Loader size={0.75}/>
                </div>
                : _.map(questionsData.list, (item, index) => {
                    const ONE = 1
                    const count = index + ONE
                    const id = _.get(item, 'id')
                    const question = _.get(item, 'question')
                    return (
                        <li key={id} className={classes.question}>
                            <span>{count}. {question}</span>
                            <Field
                                name={'answers[' + id + '][answer]'}
                                component={TextField}
                                className={classes.textFieldArea}
                                onBlur={(event, value) => {
                                    handleSubmitResumeAnswers(value, currentAnswer)
                                }}
                                onFocus={(event) => { updateAnswer(event.target.value) }}
                                fullWidth
                                multiLine
                                rows={1}/>
                        </li>
                    )
                })}
        </div>
    )
})

export default ResumeQuestionsTab
