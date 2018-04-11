import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import {connect} from 'react-redux'
import {reset} from 'redux-form'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers, withState} from 'recompose'
import filterHelper from '../../helpers/filter'
import {
    LongListGridList,
    OPEN_ADD_LONG_LIST_DIALOG,
    OPEN_MOVE_TO_DIALOG,
    OPEN_QUESTIONS_DIALOG,
    OPEN_REPORT_DIALOG,
    EDIT_REPORT_DIALOG
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
    updateReportList
} from '../../actions/HR/longList'
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
    langLevel: null,
    totalExp0: null,
    totalExp1: null
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
            answersListLoading
        }
    }),

    // LONG LIST
    withPropsOnChange((props, nextProps) => {
        return props.longList && props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
    }, ({dispatch, filter, location: {query}}) => {
        const application = _.toInteger(_.get(query, 'application'))
        dispatch(getLongList(filter, application, HR_RESUME_LONG))
    }),

    // INTERVIEW LIST
    withPropsOnChange((props, nextProps) => {
        return props.meetingList && props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
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
         const resume = _.toInteger(_.get(query, ['resume']))
         if (resume > ZERO) {
             dispatch(resumeItemFetchAction(resume))
             dispatch(getResumeComments(filter))
             dispatch(getQuestionsList(application))
             dispatch(getResumeAnswersList(application, resume))
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

    withState('openConfirmDialog', 'setOpenConfirmDialog', false),
    withState('openConfirmDeleteReport', 'setOpenConfirmDeleteReport', false),
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
        },

        handleOpenMoveToDialog: props => (status) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({moveTo: status, [OPEN_MOVE_TO_DIALOG]: true})})
        },

        handleCloseMoveToDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({moveTo: null, [OPEN_MOVE_TO_DIALOG]: false})})
        },

        handleSubmitMoveToDialog: props => () => {
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
                    case HR_RESUME_MEETING: return dispatch(changeResumeStatus(application, resume, formValues, filter))
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
            }
            return null
        },

        // . handleCompleteResumeInterview: props => () => {
        // .     const {dispatch, resumeDetailsForm, location: {query}} = props
        // .     const application = _.toInteger(_.get(query, 'application'))
        // .     const resume = _.toInteger(_.get(query, 'resume'))
        // .     return dispatch(sendResumeAnswers(resume, _.get(resumeDetailsForm, ['values'])))
        // .         .then(() => {
        // .             return dispatch(openSnackbarAction({message: t('Ответы успешно сохранены')}))
        // .         })
        // . },

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
        params
    } = props

    const detailId = _.toInteger(_.get(params, 'longListId'))
    const openAddDialog = toBoolean(_.get(location, ['query', OPEN_ADD_LONG_LIST_DIALOG]))
    const openMoveToDialog = toBoolean(_.get(location, ['query', OPEN_MOVE_TO_DIALOG]))
    const openQuestionsDialog = toBoolean(_.get(location, ['query', OPEN_QUESTIONS_DIALOG]))
    const openResumeDialog = _.toInteger(_.get(location, ['query', 'resume'])) > ZERO && !_.isNull(_.get(location, ['query', 'status']))
    const openReportDialog = toBoolean(_.get(location, ['query', OPEN_REPORT_DIALOG]))
    const openEditReportDialog = toBoolean(_.get(location, ['query', EDIT_REPORT_DIALOG]))

    const position = filter.getParam(RESUME_FILTER_KEY.POSITIONS)
    const mode = filter.getParam(RESUME_FILTER_KEY.MODE)
    const ageMin = filter.getParam(RESUME_FILTER_KEY.AGE_0)
    const ageMax = filter.getParam(RESUME_FILTER_KEY.AGE_1)
    const sex = filter.getParam(RESUME_FILTER_KEY.SEX)
    const education = filter.getParam(RESUME_FILTER_KEY.EDUCATIONS)
    const levelPc = filter.getParam(RESUME_FILTER_KEY.LEVEL_PC)
    const languages = filter.getParam(RESUME_FILTER_KEY.LANG_LEVEL)
    const experience = filter.getParam(RESUME_FILTER_KEY.TOTAL_EXP_0)
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
                    ? moment(_.get(meetingResumeDetails, 'dateMeeting')).toDate()
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
            skills: skills && splitToArray(skills)
        }
    }

    const confirmDialog = {
        open: props.openConfirmDialog,
        handleOpen: props.handleOpenConfirmDialog,
        handleClose: props.handleCloseConfirmDialog,
        handleSubmit: props.handleSendConfirmDialog
    }

    const answersData = {
        list: _.get(answersList, 'results'),
        loading: answersListLoading
    }

    const resumeDetails = {
        open: openResumeDialog,
        data: resumeDetail,
        loading: resumeDetailLoading,
        createCommentLoading,
        handleCreateComment: props.handleSubmitResumeComment,
        handleSubmitResumeAnswers: props.handleSubmitResumeAnswers,
        commentsList: _.get(resumeCommentsList, 'results'),
        commentsLoading: resumeCommentsLoading,
        initialValues: (() => {
            const answers = {}
            _.map(answersData.list, (item) => {
                const question = _.get(item, 'question')
                const answer = _.get(item, 'answer')
                answers[question] = {answer}
                return answers
            })
            return {answers}
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

    const questionsData = {
        list: _.get(questionsList, 'results'),
        loading: questionsListLoading
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
                reportDialog={reportDialog}
                editReportDialog={editReportDialog}
                deleteReportDialog={deleteReportDialog}
            />
        </Layout>
    )
})

export default LongList
