import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import {connect} from 'react-redux'
import {reset} from 'redux-form'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers, withState} from 'recompose'
import filterHelper from '../../helpers/filter'
import getDocument from '../../helpers/getDocument'
import {
    LongListGridList,
    OPEN_ADD_LONG_LIST_DIALOG,
    OPEN_MOVE_TO_DIALOG,
    OPEN_QUESTIONS_DIALOG,
    OPEN_REPORT_DIALOG,
    EDIT_REPORT_DIALOG,
    EDIT_RESUME_DETAILS
} from '../../components/HR/LongList'
import {
    getApplicationDetails,
    getResumePreviewList,
    getLongList,
    getInterviewList,
    getShortList,
    getReportList,
    addToLongList,
    changeResumeStatus,
    deleteResume,
    formShortList,
    addResumeComment,
    getResumeComments,
    resumeAddNote,
    createQuestions,
    getQuestionsList,
    sendResumeAnswers,
    getResumeAnswersList,
    addReportList,
    addToShortList,
    updateReportList,
    resumeUpdateAction,
    finishMeetingAction,
    getResumeLogsList,
    getAppStatAction,
    getRequiredCommentsAction,
    sendRequiredCommentsAction
} from '../../actions/HR/longList'
import {
    confirmMeetingTime,
    getApplicationLogs,
    getMeetingListAction, submitMeetingAction
} from '../../actions/HR/application'
import {resumeItemFetchAction} from '../../actions/HR/resume'
import {RESUME_FILTER_KEY} from '../../components/HR/Resume'
import {joinArray, splitToArray} from '../../helpers/joinSplitValues'
import numberWithoutSpaces from '../../helpers/numberWithoutSpaces'
import {langArrayFormat, langQueryFormat} from '../../helpers/joinSplitLanguages'
import {
    HR_RESUME_LONG,
    HR_RESUME_MEETING,
    HR_RESUME_NOTE,
    HR_RESUME_REMOVED,
    HR_RESUME_REPORT,
    HR_RESUME_SHORT,
    ZERO
} from '../../constants/backendConstants'
import toBoolean from '../../helpers/toBoolean'
import t from '../../helpers/translate'
import {openSnackbarAction} from '../../actions/snackbar'
import numberFormat from '../../helpers/numberFormat'
import {openErrorAction} from '../../actions/error'
import {APPLICATION_MEETING_DIALOG_UPDATE} from '../../components/HR/Application'
import {getYearText} from '../../helpers/hrcHelpers'
import {notificationCountFetchAction} from '../../actions/notifications'

const except = {
    application: null,
    resume: null,
    relation: null,
    moveTo: null,
    excludeAccepted: null,
    openAddLongListDialog: null,
    openMoveToDialog: null,
    openQuestionsDialog: null,
    openReportDialog: null,
    editReportDialog: null,
    page: null,
    meeting: null,
    updateMeetingDialog: null,
    // DETAIL URI
    sex: null,
    skills: null,
    mode: null,
    age0: null,
    age1: null,
    status: null,
    levelPc: null,
    positions: null,
    educations: null,
    languagesLevel: null,
    totalExp0: null,
    totalExp1: null,
    editResumeDetails: null,
    completed: null
}
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const resumePreviewList = _.get(state, ['longList', 'resumePreview', 'data'])
        const resumePreviewListLoading = _.get(state, ['longList', 'resumePreview', 'loading'])
        const longList = _.get(state, ['longList', 'longList', 'data'])
        const longListLoading = _.get(state, ['longList', 'longList', 'loading'])
        const meetingList = _.get(state, ['longList', 'interviewList', 'data'])
        const meetingListLoading = _.get(state, ['longList', 'interviewList', 'loading'])
        const shortList = _.get(state, ['longList', 'shortList', 'data'])
        const shortListLoading = _.get(state, ['longList', 'shortList', 'loading'])
        const reportList = _.get(state, ['longList', 'reportList', 'data'])
        const reportListLoading = _.get(state, ['longList', 'reportList', 'loading'])
        const detail = _.get(state, ['application', 'item', 'data'])
        const appLogs = _.get(state, ['longList', 'resumeLogs', 'data'])
        const detailLoading = _.get(state, ['application', 'item', 'loading'])
        const createForm = _.get(state, ['form', 'AddLongListForm'])
        const moveToForm = _.get(state, ['form', 'ResumeMoveForm'])
        const resumeDetailsForm = _.get(state, ['form', 'ResumeDetailsForm'])
        const filterForm = _.get(state, ['form', 'ResumeFilterForm'])
        const notesForm = _.get(state, ['form', 'ResumeItemForm'])
        const questionsForm = _.get(state, ['form', 'QuestionnaireForm'])
        const filter = filterHelper([], pathname, query)
        const filterResume = filterHelper(resumePreviewList, pathname, query)
        const resumeDetail = _.get(state, ['resume', 'item', 'data'])
        const resumeDetailLoading = _.get(state, ['resume', 'item', 'loading'])
        const createCommentLoading = _.get(state, ['longList', 'createComment', 'loading'])
        const resumeCommentsList = _.get(state, ['longList', 'resumeComments', 'data'])
        const resumeCommentsLoading = _.get(state, ['longList', 'resumeComments', 'loading'])
        const questionsList = _.get(state, ['longList', 'questionsList', 'data'])
        const questionsListLoading = _.get(state, ['longList', 'questionsList', 'loading'])
        const answersList = _.get(state, ['longList', 'answersList', 'data'])
        const answersListLoading = _.get(state, ['longList', 'answersList', 'loading'])
        const resumeEditDetailsForm = _.get(state, ['form', 'ResumeDetailsEditForm', 'values'])
        const educationForm = _.get(state, ['form', 'ResumeEducationForm', 'values'])
        const experienceForm = _.get(state, ['form', 'ResumeExperienceForm', 'values'])
        const appCount = _.get(state, ['longList', 'appCount', 'data'])
        const logsList = _.get(state, ['application', 'logs', 'data'])
        const logsListLoading = _.get(state, ['application', 'logs', 'loading'])
        const logMeetingList = _.get(state, ['application', 'meetingList', 'data'])
        const logMeetingListLoading = _.get(state, ['application', 'meetingList', 'loading'])
        const feedbackList = _.get(state, ['longList', 'feedbackList', 'data'])
        const feedbackListLoading = _.get(state, ['longList', 'feedbackList', 'loading'])
        const meetingForm = _.get(state, ['form', 'ApplicationMeetingForm'])
        return {
            resumePreviewList,
            resumePreviewListLoading,
            longList,
            longListLoading,
            meetingList,
            meetingListLoading,
            shortList,
            shortListLoading,
            reportList,
            reportListLoading,
            detail,
            detailLoading,
            createForm,
            filterForm,
            moveToForm,
            notesForm,
            questionsForm,
            resumeDetailsForm,
            filter,
            filterResume,
            resumeDetail,
            resumeDetailLoading,
            createCommentLoading,
            resumeCommentsList,
            resumeCommentsLoading,
            questionsList,
            questionsListLoading,
            answersList,
            answersListLoading,
            resumeEditDetailsForm,
            educationForm,
            experienceForm,
            appLogs,
            appCount,
            logsList,
            logsListLoading,
            logMeetingList,
            logMeetingListLoading,
            feedbackList,
            feedbackListLoading,
            meetingForm
        }
    }),

    withState('openConfirmDialog', 'setOpenConfirmDialog', false),
    withState('openConfirmDeleteReport', 'setOpenConfirmDeleteReport', false),
    withState('showProgress', 'setShowProgress', false),

    // LONG LIST
    withPropsOnChange((props, nextProps) => {
        return props.longList && props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
    }, ({dispatch, filter, location: {query}}) => {
        const application = _.toInteger(_.get(query, 'application'))
        dispatch(getLongList(filter, application, HR_RESUME_LONG))
        dispatch(getAppStatAction(application))
    }),

    // INTERVIEW LIST // MEETING LIST
    withPropsOnChange((props, nextProps) => {
        const completed = (_.get(props, ['location', 'query', 'completed']))
        const nextCompleted = (_.get(nextProps, ['location', 'query', 'completed']))
        return (props.meetingList && props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)) ||
                completed !== nextCompleted
    }, ({dispatch, filter, location: {query}}) => {
        const application = _.toInteger(_.get(query, 'application'))
        dispatch(getInterviewList(filter, application, HR_RESUME_MEETING))
    }),

     // SHORT LIST
    withPropsOnChange((props, nextProps) => {
        return props.shortList && props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
    }, ({dispatch, filter, location: {query}}) => {
        const application = _.toInteger(_.get(query, 'application'))
        dispatch(getShortList(filter, application, HR_RESUME_SHORT))
    }),

    // REPORT LIST
    withPropsOnChange((props, nextProps) => {
        return props.reportList && props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
    }, ({dispatch, filter, location: {query}}) => {
        const application = _.toInteger(_.get(query, 'application'))
        dispatch(getReportList(filter, application, HR_RESUME_REPORT))
    }),

     // APPLICATION DETAILS
     withPropsOnChange((props, nextProps) => {
         const app = _.toInteger(_.get(props, ['location', 'query', 'application']))
         const nextApp = _.toInteger(_.get(nextProps, ['location', 'query', 'application']))
         return app !== nextApp && nextApp
     }, ({dispatch, location: {query}}) => {
         const app = _.toInteger(_.get(query, ['application']))
         if (app > ZERO) {
             dispatch(getApplicationDetails(app))
             dispatch(getMeetingListAction(app))
         }
     }),

    // RESUME DETAILS
     withPropsOnChange((props, nextProps) => {
         const resume = _.toInteger(_.get(props, ['location', 'query', 'resume']))
         const nextResume = _.toInteger(_.get(nextProps, ['location', 'query', 'resume']))
         const nextDialog = toBoolean(_.get(nextProps, ['location', 'query', OPEN_MOVE_TO_DIALOG]))
         return resume !== nextResume && nextResume && !nextDialog
     }, ({dispatch, location: {query}, filter}) => {
         const application = _.toInteger(_.get(query, ['application']))
         const relation = _.toInteger(_.get(query, ['relation']))
         const resume = _.toInteger(_.get(query, ['resume']))
         const status = _.get(query, ['status'])
         if (resume > ZERO) {
             if (status === HR_RESUME_MEETING) {
                 dispatch(getResumeAnswersList(application, resume))
                 dispatch(getQuestionsList(application))
                 dispatch(getRequiredCommentsAction(relation))
             }
             dispatch(resumeItemFetchAction(resume))
             dispatch(getResumeComments(filter))
             dispatch(getResumeLogsList(resume))
         }
     }),

    // GET RESUME LIST ON DIALOG OPEN
    withPropsOnChange((props, nextProps) => {
        const excludeFilters = {
            application: null,
            resume: null,
            relation: null,
            moveTo: null,
            excludeAccepted: null,
            openMoveToDialog: null,
            page: null,
            openAddLongListDialog: null,
            openReportDialog: null,
            editReportDialog: null,
            openQuestionsDialog: null
        }
        const openDialog = toBoolean(_.get(props, ['location', 'query', OPEN_ADD_LONG_LIST_DIALOG]))
        const nextOpenDialog = toBoolean(_.get(nextProps, ['location', 'query', OPEN_ADD_LONG_LIST_DIALOG]))
        return (openDialog !== nextOpenDialog && nextOpenDialog === true) ||
            (props.filter.filterRequest(excludeFilters) !== nextProps.filter.filterRequest(excludeFilters) && nextOpenDialog === true)
    }, ({dispatch, location: {query}, filterResume}) => {
        const openDialog = toBoolean(_.get(query, [OPEN_ADD_LONG_LIST_DIALOG]))
        if (openDialog) {
            dispatch(getResumePreviewList(filterResume))
        }
    }),

    // GET QUESTIONS LIST WHEN DIALOG OPEN
    withPropsOnChange((props, nextProps) => {
        const dialog = toBoolean(_.get(props, ['location', 'query', OPEN_QUESTIONS_DIALOG]))
        const nextDialog = toBoolean(_.get(nextProps, ['location', 'query', OPEN_QUESTIONS_DIALOG]))
        return dialog !== nextDialog && nextDialog === true
    }, ({dispatch, location: {query}}) => {
        const application = _.toInteger(_.get(query, ['application']))
        const openDialog = toBoolean(_.get(query, [OPEN_QUESTIONS_DIALOG]))
        if (application > ZERO && openDialog) {
            dispatch(getQuestionsList(application))
        }
    }),

    // SHOW LOGS WHEN OPEN
    withPropsOnChange((props, nextProps) => {
        const open = toBoolean(_.get(props, 'showProgress'))
        const nextOpen = toBoolean(_.get(nextProps, 'showProgress'))
        return open !== nextOpen && nextOpen === true
    }, ({dispatch, showProgress, location: {query}}) => {
        const application = _.toInteger(_.get(query, ['application']))
        if (showProgress) {
            dispatch(getApplicationLogs(application))
                .then(() => {
                    dispatch(notificationCountFetchAction('application'))
                })
        }
    }),

    withHandlers({
        handleOpenAddDialog: props => (uri) => {
            const {location: {pathname}, filter} = props
            const mergedURI = _.merge(uri, {[OPEN_ADD_LONG_LIST_DIALOG]: true})
            hashHistory.push({pathname, query: filter.getParams(mergedURI)})
        },

        handleCloseAddDialog: props => () => {
            const {location: {pathname, query}} = props
            const application = _.get(query, 'application')
            hashHistory.push({pathname, query: {application}})
        },

        handleSubmitAddDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname, query}} = props
            const application = _.toInteger(_.get(query, 'application'))
            return dispatch(addToLongList(application, _.get(createForm, ['values'])))
                .then(() => {
                    dispatch(reset('AddLongListForm'))
                    return dispatch(openSnackbarAction({message: t('Выбранные резюме успешно добавлены')}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[OPEN_ADD_LONG_LIST_DIALOG]: false})})
                    dispatch(getLongList(filter, application, HR_RESUME_LONG))
                    dispatch(getApplicationDetails(application))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },

        handleOpenMoveToDialog: props => (status) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({moveTo: status, [OPEN_MOVE_TO_DIALOG]: true})})
        },

        handleCloseMoveToDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({moveTo: null, [OPEN_MOVE_TO_DIALOG]: false})})
        },

        handleSubmitMoveToDialog: props => (datetime) => {
            const {dispatch, moveToForm, filter, location: {pathname, query}} = props
            const application = _.toInteger(_.get(query, 'application'))
            const resume = _.toInteger(_.get(query, 'resume'))
            const relation = _.toInteger(_.get(query, 'relation'))
            const toStatus = _.get(query, 'moveTo')
            const currentStatus = _.get(query, 'status')
            const formValues = _.get(moveToForm, ['values'])
            const dispatchByStatus = (customStatus) => {
                const outputStatus = customStatus || toStatus
                switch (outputStatus) {
                    case HR_RESUME_MEETING: return dispatch(changeResumeStatus(application, resume, formValues, filter, datetime))
                    case HR_RESUME_SHORT: return dispatch(changeResumeStatus(application, resume, formValues, filter))
                    case HR_RESUME_REMOVED: return dispatch(deleteResume(application, resume, formValues, filter, relation))
                    case HR_RESUME_NOTE: return dispatch(changeResumeStatus(application, resume, formValues, filter))
                    default: return null
                }
            }
            const getListsByStatus = (customStatus) => {
                switch (customStatus) {
                    case HR_RESUME_LONG: return dispatch(getLongList(filter, application, customStatus))
                    case HR_RESUME_MEETING: return dispatch(getInterviewList(filter, application, customStatus))
                    case HR_RESUME_SHORT: return dispatch(getShortList(filter, application, customStatus))
                    case HR_RESUME_REPORT: return dispatch(getReportList(filter, application, customStatus))
                    default: return null
                }
            }
            return (dispatchByStatus())
                    .then(() => {
                        dispatch(reset('ResumeMoveForm'))
                        const getSnackbarMessage = () => {
                            switch (toStatus) {
                                case HR_RESUME_MEETING: return t('Резюме успешно добавлено в "собеседования"')
                                case HR_RESUME_SHORT: return t('Резюме успешно добавлено в "short list"')
                                case HR_RESUME_REMOVED: return t('Резюме успешно удалено')
                                default: return null
                            }
                        }
                        return dispatch(openSnackbarAction({message: getSnackbarMessage()}))
                    })
                    .then(() => {
                        hashHistory.push({pathname, query: {application}})
                        if (currentStatus === HR_RESUME_LONG) {
                            if (toStatus === HR_RESUME_MEETING) {
                                getListsByStatus(HR_RESUME_LONG)
                                getListsByStatus(HR_RESUME_MEETING)
                            } else if (toStatus === HR_RESUME_SHORT) {
                                getListsByStatus(HR_RESUME_LONG)
                                getListsByStatus(HR_RESUME_SHORT)
                            } else if (toStatus === HR_RESUME_NOTE) {
                                getListsByStatus(HR_RESUME_LONG)
                            } else if (toStatus === HR_RESUME_REMOVED) {
                                getListsByStatus(HR_RESUME_LONG)
                            }
                        }
                        if (currentStatus === HR_RESUME_MEETING) {
                            if (toStatus === HR_RESUME_SHORT) {
                                getListsByStatus(HR_RESUME_MEETING)
                                getListsByStatus(HR_RESUME_SHORT)
                            } else if (toStatus === HR_RESUME_NOTE) {
                                getListsByStatus(HR_RESUME_MEETING)
                            } else if (toStatus === HR_RESUME_REMOVED) {
                                getListsByStatus(HR_RESUME_MEETING)
                            }
                        }
                        if (currentStatus === HR_RESUME_SHORT) {
                            if (toStatus === HR_RESUME_NOTE) {
                                getListsByStatus(HR_RESUME_SHORT)
                            } else if (toStatus === HR_RESUME_REMOVED) {
                                getListsByStatus(HR_RESUME_SHORT)
                            }
                        }
                        if (currentStatus === HR_RESUME_REPORT) {
                            if (toStatus === HR_RESUME_REMOVED) {
                                getListsByStatus(HR_RESUME_REPORT)
                            }
                        }
                    })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },

        handleClearFilterDialog: props => () => {
            const {dispatch, location: {pathname, query}} = props
            const application = _.toInteger(_.get(query, 'application'))
            dispatch(reset('ResumeFilterForm'))
            return hashHistory.push({pathname, query: {application, [OPEN_ADD_LONG_LIST_DIALOG]: true}})
        },

        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm, location: {query}} = props
            const application = _.toInteger(_.get(query, 'application'))
            const position = _.get(filterForm, ['values', 'position']) || null
            const mode = _.get(filterForm, ['values', 'mode']) || null
            const ageMin = _.toNumber(_.get(filterForm, ['values', 'age', 'min'])) || null
            const ageMax = _.toNumber(_.get(filterForm, ['values', 'age', 'max'])) || null
            const sex = _.get(filterForm, ['values', 'sex', 'value']) || null
            const education = _.get(filterForm, ['values', 'education']) || null
            const levelPc = _.get(filterForm, ['values', 'levelPc', 'value']) || null
            const languages = _.get(filterForm, ['values', 'languages']) || null
            const experience = _.get(filterForm, ['values', 'experience']) || null
            const search = _.get(filterForm, ['values', 'search']) || null
            const skills = _.get(filterForm, ['values', 'skills']) || null
            const langToUrl = langQueryFormat(languages)

            filter.filterBy({
                application,
                [OPEN_ADD_LONG_LIST_DIALOG]: true,
                [RESUME_FILTER_KEY.POSITIONS]: joinArray(position),
                [RESUME_FILTER_KEY.MODE]: joinArray(mode),
                [RESUME_FILTER_KEY.AGE_0]: ageMin && numberWithoutSpaces(ageMin),
                [RESUME_FILTER_KEY.AGE_1]: ageMax && numberWithoutSpaces(ageMax),
                [RESUME_FILTER_KEY.SEX]: sex,
                [RESUME_FILTER_KEY.EDUCATIONS]: joinArray(education),
                [RESUME_FILTER_KEY.LEVEL_PC]: levelPc,
                [RESUME_FILTER_KEY.LANG_LEVEL]: _.join(langToUrl, '|'),
                [RESUME_FILTER_KEY.TOTAL_EXP_0]: experience && numberWithoutSpaces(experience),
                [RESUME_FILTER_KEY.SEARCH]: search,
                [RESUME_FILTER_KEY.SKILLS]: joinArray(skills)
            })
        },

        handleOpenConfirmDialog: props => () => {
            const {setOpenConfirmDialog} = props
            setOpenConfirmDialog(true)
        },

        handleCloseConfirmDialog: props => () => {
            const {setOpenConfirmDialog} = props
            setOpenConfirmDialog(false)
        },
        handleSendConfirmDialog: props => () => {
            const {dispatch, setOpenConfirmDialog, location: {query}} = props
            const application = _.toInteger(_.get(query, 'application'))
            dispatch(formShortList(application))
                .then(() => {
                    setOpenConfirmDialog(false)
                    return dispatch(openSnackbarAction({message: t('Отчет успешно сформирован')}))
                })
                .then(() => {
                    dispatch(getApplicationDetails(application))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },

        handleSubmitResumeComment: props => () => {
            const {dispatch, resumeDetailsForm, location: {query}, filter} = props
            const resume = _.toInteger(_.get(query, 'resume'))
            return dispatch(addResumeComment(resume, _.get(resumeDetailsForm, ['values'])))
                .then(() => {
                    dispatch(reset('ResumeDetailsForm'))
                    return dispatch(openSnackbarAction({message: t('Комментарий успешно добавлен')}))
                })
                .then(() => {
                    dispatch(getResumeComments(filter))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },

        handleSubmitEditNote: props => (resume, value, prevValue, status, {date, time}) => {
            const {dispatch, location: {query}} = props
            const application = _.toInteger(_.get(query, 'application'))
            if (value !== prevValue) {
                return dispatch(resumeAddNote(application, resume, value, status, {date, time}))
                    .then(() => {
                        return dispatch(openSnackbarAction({message: _.isEmpty(value)
                                ? t('Заметка успешно удалена')
                                : t('Заметка успешно обновлена')
                        }))
                    })
                    .catch((error) => {
                        dispatch(openErrorAction({
                            message: error
                        }))
                    })
            }
            return null
        },

        handleOpenQuestionsDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[OPEN_QUESTIONS_DIALOG]: true})})
        },

        handleCloseQuestionsDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[OPEN_QUESTIONS_DIALOG]: false})})
        },

        handleSubmitQuestionsDialog: props => () => {
            const {dispatch, questionsForm, location: {pathname, query}, filter} = props
            const application = _.toInteger(_.get(query, 'application'))
            return dispatch(createQuestions(application, _.get(questionsForm, ['values'])))
                .then(() => {
                    dispatch(reset('QuestionnaireForm'))
                    return dispatch(openSnackbarAction({message: t('Вопросник успешно сохранен')}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[OPEN_QUESTIONS_DIALOG]: false})})
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },

        handleSubmitResumeAnswers: props => (answer, prevAnswer) => {
            const {dispatch, resumeDetailsForm, location: {query}} = props
            const application = _.toInteger(_.get(query, 'application'))
            const resume = _.toInteger(_.get(query, 'resume'))
            if (!_.isEmpty(answer) && answer !== prevAnswer) {
                return dispatch(sendResumeAnswers(application, resume, _.get(resumeDetailsForm, ['values'])))
                    .then(() => {
                        return dispatch(openSnackbarAction({message: t('Ответы успешно сохранены')}))
                    })
                    .catch((error) => {
                        dispatch(openErrorAction({
                            message: error
                        }))
                    })
            }
            return null
        },

        handleAddReportList: props => (resume) => {
            const {dispatch, filter, location: {query}} = props
            const application = _.toInteger(_.get(query, 'application'))
            return dispatch(addReportList(application, resume))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Отчет успешно сформирован')}))
                })
                .then(() => {
                    dispatch(getShortList(filter, application, HR_RESUME_SHORT))
                    dispatch(getReportList(filter, application, HR_RESUME_REPORT))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },

        // OPEN REPORT DIALOG
        handleOpenReportDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[OPEN_REPORT_DIALOG]: true})})
        },

        handleCloseReportDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[OPEN_REPORT_DIALOG]: false})})
        },

        handleSubmitReportDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[OPEN_REPORT_DIALOG]: false})})
        },

        // UPDATE REPORT DIALOG
        handleOpenUpdateReportDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[EDIT_REPORT_DIALOG]: true})})
        },

        handleCloseUpdateReportDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[EDIT_REPORT_DIALOG]: false})})
        },

        handleSubmitUpdateReportDialog: props => (reportIds, shortIds) => {
            const {dispatch, location: {pathname, query}, filter} = props
            const application = _.toInteger(_.get(query, 'application'))
            return dispatch(updateReportList(application, reportIds, shortIds))
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[EDIT_REPORT_DIALOG]: false})})
                    return dispatch(openSnackbarAction({message: t('Отчет успешно изменен')}))
                })
                .then(() => {
                    dispatch(getShortList(filter, application, HR_RESUME_SHORT))
                    dispatch(getReportList(filter, application, HR_RESUME_REPORT))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },

        // ****

        handleOpenConfirmDeleteReport: props => () => {
            const {setOpenConfirmDeleteReport} = props
            setOpenConfirmDeleteReport(true)
        },

        handleCloseConfirmDeleteReport: props => () => {
            const {setOpenConfirmDeleteReport} = props
            setOpenConfirmDeleteReport(false)
        },
        handleSendConfirmDeleteReport: props => (resumes) => {
            const {dispatch, setOpenConfirmDeleteReport, location: {query}, filter} = props
            const application = _.toInteger(_.get(query, 'application'))
            dispatch(addToShortList(application, resumes))
                .then(() => {
                    setOpenConfirmDeleteReport(false)
                    return dispatch(openSnackbarAction({message: t('Отчет успешно удален')}))
                })
                .then(() => {
                    dispatch(getReportList(filter, application, HR_RESUME_REPORT))
                    dispatch(getShortList(filter, application, HR_RESUME_SHORT))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },
        handleGetPreviewReport: props => () => {
            const {detail} = props
            const url = _.get(detail, 'downloadReport')
            getDocument(url, {})
        },
        handleOpenUpdateResumeDetails: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[EDIT_RESUME_DETAILS]: true})})
        },

        handleCloseUpdateResumeDetails: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[EDIT_RESUME_DETAILS]: false})})
        },
        handleSubmitUpdateResumeDialog: props => () => {
            const {dispatch, resumeEditDetailsForm, educationForm, experienceForm, filter, location: {query}} = props
            const resumeId = _.toInteger(_.get(query, ['resume']))
            const forms = {createForm: resumeEditDetailsForm, educationForm, experienceForm}
            return dispatch(resumeUpdateAction(resumeId, forms))
                .then(() => {
                    return dispatch(resumeItemFetchAction(resumeId))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[EDIT_RESUME_DETAILS]: false}))
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },
        handleSubmitCompleteMeetingDialog: props => () => {
            const {dispatch, filter, location: {query}, meetingList} = props
            const resume = _.toInteger(_.get(query, ['resume']))
            const application = _.toInteger(_.get(query, 'application'))
            const app = _.find(_.get(meetingList, 'results'), {id: resume})
            const note = _.get(app, 'note')
            const meetingDate = _.get(app, 'dateMeeting')
            const data = {
                application,
                resume,
                date_time: meetingDate,
                status: 'meeting',
                note,
                is_completed: true
            }
            return dispatch(finishMeetingAction(data))
                .then(() => {
                    dispatch(getInterviewList(filter, application, HR_RESUME_MEETING))
                    hashHistory.push(filter.createURL({resume: null}))
                    return dispatch(openSnackbarAction({message: t('Собеседование завершено')}))
                })
                .then(() => {
                    return dispatch(getAppStatAction(application))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },
        handleSubmitRequiredFeedback: props => (id, comment, key, value) => {
            const {dispatch} = props
            const data = {
                application_resume: id,
                value,
                comment,
                key,
                do: true
            }
            return comment && dispatch(sendRequiredCommentsAction(data))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },

        handleOpenUpdateMeetingDialog: props => (resume, meeting) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname, query: filter.getParams({[APPLICATION_MEETING_DIALOG_UPDATE]: resume, meeting: meeting})
            })
        },

        handleCloseUpdateMeetingDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({
                pathname, query: filter.getParams({[APPLICATION_MEETING_DIALOG_UPDATE]: false})
            })
        },

        handleSubmitUpdateMeetingDialog: props => () => {
            const {dispatch, meetingForm, filter, location: {query}} = props
            const applicationId = _.toInteger(_.get(query, ['application']))
            const resumeId = _.toInteger(_.get(query, APPLICATION_MEETING_DIALOG_UPDATE))
            const meetingId = _.toInteger(_.get(query, 'meeting'))
            const signleUpdate = true

            return dispatch(submitMeetingAction(applicationId, _.get(meetingForm, ['values']), signleUpdate, resumeId, meetingId))
                .then(() => {
                    return dispatch(getMeetingListAction(applicationId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[APPLICATION_MEETING_DIALOG_UPDATE]: false}))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },

        handleConfirmMeetingTime: props => (data) => {
            const {dispatch, location: {query}} = props
            const application = _.toInteger(_.get(query, ['application']))
            return dispatch(confirmMeetingTime(data, application))
                .then(() => {
                    return dispatch(getMeetingListAction(application))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Время подтверждено')}))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        }
    })
)

const LongList = enhance((props) => {
    const {
        location,
        resumePreviewList,
        resumePreviewListLoading,
        longList,
        longListLoading,
        meetingList,
        meetingListLoading,
        shortList,
        shortListLoading,
        reportList,
        reportListLoading,
        detail,
        detailLoading,
        createLoading,
        resumeDetail,
        resumeDetailLoading,
        createCommentLoading,
        resumeCommentsList,
        resumeCommentsLoading,
        questionsList,
        questionsListLoading,
        answersList,
        answersListLoading,
        filter,
        layout,
        params,
        appLogs,
        appCount,
        logsList,
        logsListLoading,
        logMeetingList,
        logMeetingListLoading,
        showProgress,
        setShowProgress,
        feedbackList,
        feedbackListLoading
    } = props

    const detailId = _.toInteger(_.get(params, 'longListId'))
    const openAddDialog = toBoolean(_.get(location, ['query', OPEN_ADD_LONG_LIST_DIALOG]))
    const openMoveToDialog = toBoolean(_.get(location, ['query', OPEN_MOVE_TO_DIALOG]))
    const openQuestionsDialog = toBoolean(_.get(location, ['query', OPEN_QUESTIONS_DIALOG]))
    const openResumeDialog = _.toInteger(_.get(location, ['query', 'resume'])) > ZERO && !_.isNull(_.get(location, ['query', 'status']))
    const openReportDialog = toBoolean(_.get(location, ['query', OPEN_REPORT_DIALOG]))
    const openEditReportDialog = toBoolean(_.get(location, ['query', EDIT_REPORT_DIALOG]))
    const openEditResumeDetails = toBoolean(_.get(location, ['query', EDIT_RESUME_DETAILS]))
    const openUpdateMeetingDialog = _.toInteger(_.get(location, ['query', APPLICATION_MEETING_DIALOG_UPDATE])) > ZERO

    const position = filter.getParam(RESUME_FILTER_KEY.POSITIONS)
    const mode = filter.getParam(RESUME_FILTER_KEY.MODE)
    const ageMin = filter.getParam(RESUME_FILTER_KEY.AGE_0)
    const ageMax = filter.getParam(RESUME_FILTER_KEY.AGE_1)
    const sex = filter.getParam(RESUME_FILTER_KEY.SEX)
    const education = filter.getParam(RESUME_FILTER_KEY.EDUCATIONS)
    const levelPc = filter.getParam(RESUME_FILTER_KEY.LEVEL_PC)
    const languages = filter.getParam(RESUME_FILTER_KEY.LANG_LEVEL)
    const experience = filter.getParam(RESUME_FILTER_KEY.TOTAL_EXP_0)
    const search = filter.getParam(RESUME_FILTER_KEY.SEARCH)
    const skills = filter.getParam(RESUME_FILTER_KEY.SKILLS)
    const langToForm = langArrayFormat(languages)

    const detailData = {
        id: detailId,
        data: detail,
        loading: detailLoading
    }

    const resumePreview = {
        list: _.get(resumePreviewList, 'results'),
        loading: resumePreviewListLoading
    }

    const longListData = {
        count: _.get(longList, 'count'),
        list: _.get(longList, 'results'),
        loading: longListLoading
    }

    const meetingListData = {
        count: _.get(meetingList, 'count'),
        list: _.get(meetingList, 'results'),
        loading: meetingListLoading
    }

    const shortListData = {
        count: _.get(shortList, 'count'),
        list: _.get(shortList, 'results'),
        loading: shortListLoading,
        handleSubmitReport: props.handleAddReportList
    }

    const reportListData = {
        count: _.get(reportList, 'count'),
        list: _.get(reportList, 'results'),
        loading: reportListLoading
    }

    const addDialog = {
        resumePreview,
        loading: createLoading,
        open: openAddDialog,
        handleOpen: props.handleOpenAddDialog,
        handleClose: props.handleCloseAddDialog,
        handleSubmit: props.handleSubmitAddDialog
    }

    const moveToDialog = {
        open: openMoveToDialog,
        handleOpen: props.handleOpenMoveToDialog,
        handleClose: props.handleCloseMoveToDialog,
        handleSubmit: props.handleSubmitMoveToDialog,
        initialValues: (() => {
            const resume = _.toInteger(_.get(location, ['query', 'resume']))
            const meetingResumeDetails = _.find(meetingListData.list, {'id': resume})
            return {
                date: _.get(meetingResumeDetails, 'dateMeeting')
                    ? moment(_.get(meetingResumeDetails, 'dateMeeting')).toDate()
                    : '',
                time: _.get(meetingResumeDetails, 'dateMeeting')
                    ? moment(_.get(meetingResumeDetails, 'dateMeeting')).format('HH:mm')
                    : ''
            }
        })()
    }

    const filterDialog = {
        openFilterDialog: true,
        handleOpenFilterDialog: () => null,
        handleCloseFilterDialog: () => null,
        handleClearFilterDialog: props.handleClearFilterDialog,
        handleSubmitFilterDialog: props.handleSubmitFilterDialog,
        initialValues: {
            position: position && splitToArray(position),
            mode: mode && splitToArray(mode),
            age: {
                min: ageMin && numberFormat(ageMin),
                max: ageMax && numberFormat(ageMax)
            },
            sex: {
                value: sex
            },
            education: education && splitToArray(education),
            levelPc: {
                value: levelPc
            },
            languages: langToForm,
            experience: experience && numberFormat(experience),
            search: search,
            skills: skills && splitToArray(skills)
        }
    }

    const confirmDialog = {
        open: props.openConfirmDialog,
        handleOpen: props.handleOpenConfirmDialog,
        handleClose: props.handleCloseConfirmDialog,
        handleSubmit: props.handleSendConfirmDialog
    }

    const questionsData = {
        list: _.get(questionsList, 'results'),
        loading: questionsListLoading
    }

    const answersData = {
        list: _.get(answersList, 'results'),
        loading: answersListLoading
    }

    const feedbackData = {
        list: _.get(feedbackList, 'results'),
        loading: feedbackListLoading
    }
    const langsFeedbacks = _.filter(feedbackData.list, {'key': 'lang_level'})
    const optionalFeedbacks = _.filter(feedbackData.list, {'key': 'requirements'})
    const otherFeedbacks = _.differenceBy(feedbackData.list, _.concat(langsFeedbacks, optionalFeedbacks))

    const resumeDetails = {
        open: openResumeDialog,
        data: resumeDetail,
        loading: resumeDetailLoading,
        createCommentLoading,
        handleCreateComment: props.handleSubmitResumeComment,
        handleSubmitRequiredFeedback: props.handleSubmitRequiredFeedback,
        handleSubmitResumeAnswers: props.handleSubmitResumeAnswers,
        handleSubmitCompleteMeetingDialog: props.handleSubmitCompleteMeetingDialog,
        commentsList: _.get(resumeCommentsList, 'results'),
        appLogs,
        commentsLoading: resumeCommentsLoading,
        initialValues: (() => {
            const answers = {}
            const langs = {}
            const feedbacks = {}
            const requirements = {}

            const getFeedback = (array, object, type) => {
                _.map(array, (item) => {
                    const value = _.get(item, 'value')
                    const comment = _.get(item, 'comment')
                    const key = _.get(item, 'key')
                    if (type === 'lang' || type === 'optional') {
                        object[value] = {
                            checked: true,
                            comment
                        }
                    } else {
                        object[key] = {
                            checked: true,
                            comment
                        }
                    }
                })
            }
            _.map(answersData.list, (item) => {
                const answer = _.get(item, 'answer')
                const question = _.get(item, 'question')
                answers[question] = {answer}
            })
            getFeedback(otherFeedbacks, feedbacks)
            getFeedback(langsFeedbacks, langs, 'lang')
            getFeedback(optionalFeedbacks, requirements, 'optional')
            return {
                answers,
                requirements: _.merge({
                    age: {
                        checked: false,
                        comment: getYearText(_.get(resumeDetail, 'age'))
                    },
                    langs
                }, feedbacks, requirements)
            }
        })()
    }

    const getNotesInitialValues = () => {
        const note = {}
        const setNoteValue = (data) => {
            _.map(data.list, (item) => {
                const id = _.get(item, 'id')
                note[id] = _.get(item, 'note')
            })
        }
        setNoteValue(longListData)
        setNoteValue(meetingListData)
        setNoteValue(shortListData)
        return {
            note
        }
    }

    const resumeNoteData = {
        handleEdit: props.handleSubmitEditNote
    }

    const questionsDialog = {
        open: openQuestionsDialog,
        initialValues: (() => {
            if (!_.isEmpty(questionsData.list)) {
                return {
                    questions: _.map(questionsData.list, (item) => {
                        return {
                            id: _.get(item, 'id'),
                            question: _.get(item, 'question')
                        }
                    })
                }
            }
            return {
                questions: _.map(_.range(Number('5')), () => ({}))
            }
        })(),
        handleOpen: props.handleOpenQuestionsDialog,
        handleClose: props.handleCloseQuestionsDialog,
        handleSubmit: props.handleSubmitQuestionsDialog
    }

    const reportDialog = {
        open: openReportDialog,
        handleOpen: props.handleOpenReportDialog,
        handleClose: props.handleCloseReportDialog,
        handleSubmit: props.handleSubmitReportDialog
    }
    const editReportDialog = {
        open: openEditReportDialog,
        handleOpen: props.handleOpenUpdateReportDialog,
        handleClose: props.handleCloseUpdateReportDialog,
        handleSubmit: props.handleSubmitUpdateReportDialog
    }

    const deleteReportDialog = {
        open: props.openConfirmDeleteReport,
        handleOpen: props.handleOpenConfirmDeleteReport,
        handleClose: props.handleCloseConfirmDeleteReport,
        handleSubmit: props.handleSendConfirmDeleteReport
    }

    const editResumeDetails = {
        initialValues: (() => {
            return {
                address: _.get(resumeDetail, 'address'),
                businessTrip: _.get(resumeDetail, 'businessTrip'),
                city: {
                    value: _.get(resumeDetail, ['city', 'id']),
                    text: _.get(resumeDetail, ['city', 'name'])
                },
                country: {
                    value: _.get(resumeDetail, ['country', 'id'])
                },
                dateOfBirth: moment(_.get(resumeDetail, 'dateOfBirth')).toDate(),
                driverLicense: _.map(_.get(resumeDetail, 'driverLicense'), (item) => {
                    return {
                        id: _.get(item, 'name'),
                        name: _.get(item, 'name'),
                        active: true
                    }
                }),
                educations: _.map(_.get(resumeDetail, 'educations'), (item) => {
                    return {
                        city: {
                            value: _.get(item, ['city', 'id']),
                            text: _.get(resumeDetail, ['city', 'name'])
                        },
                        country: {
                            value: _.get(item, ['country', 'id'])
                        },
                        education: {
                            value: _.get(item, 'education')
                        },
                        institution: _.get(item, 'institution'),
                        speciality: _.get(item, 'speciality'),
                        studyTillNow: _.get(item, 'studyTillNow'),
                        studyStart: moment(_.get(item, 'studyStart')).toDate(),
                        studyEnd: moment(_.get(item, 'studyEnd')).toDate()
                    }
                }),
                email: _.get(resumeDetail, 'email'),
                experiences: _.map(_.get(resumeDetail, 'experiences'), (item) => {
                    return {
                        position: {
                            value: _.get(item, ['position', 'id'])
                        },
                        organization: _.get(item, 'organization'),
                        responsibility: _.get(item, 'responsibility'),
                        workTillNow: _.get(item, 'workTillNow'),
                        workStart: moment(_.get(item, 'workStart')).toDate(),
                        workEnd: moment(_.get(item, 'workEnd')).toDate()
                    }
                }),
                familyStatus: {
                    value: _.get(resumeDetail, 'familyStatus')
                },
                fullName: _.get(resumeDetail, 'fullName'),
                hobby: _.get(resumeDetail, 'hobby'),
                languagesLevel: _.map(_.get(resumeDetail, 'languages'), (item) => {
                    return {
                        name: {
                            value: _.get(item, ['language', 'id'])
                        },
                        level: {
                            value: _.get(item, ['level'])
                        }
                    }
                }),
                levelPc: {
                    value: _.get(resumeDetail, 'levelPc')
                },
                phone: _.get(resumeDetail, 'phone'),
                position: {
                    value: _.get(resumeDetail, ['position', 'id'])
                },
                relocation: _.get(resumeDetail, 'relocation'),
                salary: {
                    min: numberFormat(_.get(resumeDetail, 'salaryMin')),
                    max: numberFormat(_.get(resumeDetail, 'salaryMax'))
                },
                sex: {
                    value: _.get(resumeDetail, 'sex')
                },
                skills: _.map(_.get(resumeDetail, 'skills'), (item) => _.get(item, 'name'))

            }
        })(),
        open: openEditResumeDetails,
        handleOpen: props.handleOpenUpdateResumeDetails,
        handleClose: props.handleCloseUpdateResumeDetails,
        handleSubmit: props.handleSubmitUpdateResumeDialog
    }

    const logsData = {
        list: _.orderBy(logsList, ['id'], ['asc']),
        loading: logsListLoading
    }

    const logMeetingData = {
        list: logMeetingList,
        loading: logMeetingListLoading
    }

    const updateMeetingDialog = {
        open: openUpdateMeetingDialog,
        handleOpen: props.handleOpenUpdateMeetingDialog,
        handleClose: props.handleCloseUpdateMeetingDialog,
        handleSubmit: props.handleSubmitUpdateMeetingDialog,
        handleConfirm: props.handleConfirmMeetingTime,
        initialValues: (() => {
            const resumes = {}
            _.map(logMeetingData.list, (item) => {
                const id = _.get(item, ['resume', 'id'])
                const meetingTime = moment(_.get(item, 'meetingTime')).format('DD/MM/YYYY HH:mm')
                resumes[id] = {
                    datetime: meetingTime,
                    selected: true
                }
            })
            return {resumes}
        })()
    }

    return (
        <Layout {...layout}>
            <LongListGridList
                filter={filter}
                detailData={detailData}
                filterDialog={filterDialog}
                addDialog={addDialog}
                moveToDialog={moveToDialog}
                longListData={longListData}
                meetingListData={meetingListData}
                shortListData={shortListData}
                reportListData={reportListData}
                confirmDialog={confirmDialog}
                resumeDetails={resumeDetails}
                initialValues={getNotesInitialValues()}
                resumeNoteData={resumeNoteData}
                questionsDialog={questionsDialog}
                questionsData={questionsData}
                answersData={answersData}
                reportDialog={reportDialog}
                editReportDialog={editReportDialog}
                deleteReportDialog={deleteReportDialog}
                handleGetPreviewReport={props.handleGetPreviewReport}
                editResumeDetails={editResumeDetails}
                appCount={appCount}
                pathname={location.pathname}
                logsData={logsData}
                logMeetingData={logMeetingData}
                updateMeetingDialog={updateMeetingDialog}
                showProgress={showProgress}
                setShowProgress={setShowProgress}
            />
        </Layout>
    )
})

export default LongList
