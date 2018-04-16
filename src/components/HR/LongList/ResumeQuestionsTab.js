import _ from 'lodash'
import React from 'react'
import {compose, withState, withPropsOnChange} from 'recompose'
import injectSheet from 'react-jss'
import Loader from '../../Loader'
import {reduxForm, Field} from 'redux-form'
import {TextField} from '../../ReduxForm'
import {COLOR_GREY, COLOR_WHITE} from '../../../constants/styleConstants'
import RemoveIcon from 'material-ui/svg-icons/navigation/close'

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
    withState('questionListClone', 'updateQuestionList', []),
    withState('answerListClone', 'updateAnswerList', []),
    withState('currentAnswer', 'updateAnswer', ''),

    withPropsOnChange((props, nextProps) => {
        const listLoading = _.get(props, ['questionsData', 'loading'])
        const nextListLoading = _.get(nextProps, ['questionsData', 'loading'])
        return listLoading !== nextListLoading && nextListLoading === false
    }, ({questionsData: {list}, updateQuestionList}) => {
        if (!_.isEmpty(list)) {
            updateQuestionList(list)
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const list = _.get(props, ['input', 'value'])
        const nextList = _.get(nextProps, ['input', 'value'])
        return !_.isEqual(list, nextList) && !_.isEmpty(nextList)
    }, ({input: {value}, updateAnswerList}) => {
        if (!_.isEmpty(value)) {
            updateAnswerList(_.map(value, (item, index) => {
                return {
                    question: index,
                    answer: _.get(item, 'answer')
                }
            }))
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const list = _.get(props, ['answerListClone'])
        const nextList = _.get(nextProps, ['answerListClone'])
        return !_.isEqual(list, nextList)
    }, ({input, answerListClone}) => {
        if (!_.isEmpty(answerListClone)) {
            const getAnswers = () => {
                const answers = {}
                _.map(answerListClone, (item) => {
                    const answer = _.get(item, 'answer')
                    answers[_.get(item, 'question')] = {answer}
                })
                return answers
            }
            input.onChange(getAnswers())
        }
    })
)

const ResumeQuestionsTab = enhance((props) => {
    const {
        classes,
        handleSubmitResumeAnswers,
        questionsData: {loading},
        questionListClone,
        updateQuestionList,
        currentAnswer,
        updateAnswer,
        answerListClone,
        updateAnswerList
    } = props
    const removeQuestion = (id) => {
        const removedArray = _.remove(questionListClone, (item) => {
            return _.get(item, 'id') === id
        })
        const clearedAnswers = _.filter(answerListClone, (item) => {
            return String(_.get(item, 'question')) !== String(id)
        })
        updateAnswerList(clearedAnswers)
        return _.differenceBy(questionListClone, removedArray)
    }

    return (
        <div className={classes.questions}>
            {loading
                ? <div className={classes.staticLoader}>
                    <Loader size={0.75}/>
                </div>
                : _.map(questionListClone, (item, index) => {
                    const ONE = 1
                    const count = index + ONE
                    const id = _.get(item, 'id')
                    const question = _.get(item, 'question')
                    return (
                        <li key={id} className={classes.question}>
                            <div onClick={() => { updateQuestionList(removeQuestion(id)) }} className={classes.remove}>
                                <RemoveIcon/>
                            </div>
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
