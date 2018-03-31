import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import {reset} from 'redux-form'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers, withState} from 'recompose'
import filterHelper from '../../helpers/filter'
import {
    LongListGridList,
    OPEN_ADD_LONG_LIST_DIALOG,
    OPEN_MOVE_TO_DIALOG
} from '../../components/HR/LongList'
import {
    getApplicationDetails,
    getResumePreviewList,
    getLongList,
    getInterviewList,
    getShortList,
    addToLongList,
    addToInterviewList,
    addToShortList,
    deleteResume,
    formShortList,
    addResumeComment,
    getResumeComments,
    resumeAddNote
} from '../../actions/HR/longList'
import {resumeItemFetchAction} from '../../actions/HR/resume'
import {RESUME_FILTER_KEY} from '../../components/HR/Resume'
import {joinArray, splitToArray} from '../../helpers/joinSplitValues'
import numberWithoutSpaces from '../../helpers/numberWithoutSpaces'
import {langArrayFormat, langQueryFormat} from '../../helpers/joinSplitLanguages'
import {
    HR_RESUME_LONG, HR_RESUME_MEETING, HR_RESUME_REMOVED, HR_RESUME_SHORT,
    ZERO
} from '../../constants/backendConstants'
import toBoolean from '../../helpers/toBoolean'
import t from '../../helpers/translate'
import {openSnackbarAction} from '../../actions/snackbar'
import numberFormat from '../../helpers/numberFormat'

const except = {
    application: null,
    resume: null,
    moveTo: null,
    excludeAccepted: null,
    openAddLongListDialog: null,
    openMoveToDialog: null,
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
        const detail = _.get(state, ['application', 'item', 'data'])
        const detailLoading = _.get(state, ['application', 'item', 'loading'])
        const createForm = _.get(state, ['form', 'AddLongListForm'])
        const moveToForm = _.get(state, ['form', 'ResumeMoveForm'])
        const resumeDetailsForm = _.get(state, ['form', 'ResumeDetailsForm'])
        const filterForm = _.get(state, ['form', 'ResumeFilterForm'])
        const notesForm = _.get(state, ['form', 'ResumeItemForm'])
        const filter = filterHelper([], pathname, query)
        const filterResume = filterHelper(resumePreviewList, pathname, query)
        const resumeDetail = _.get(state, ['resume', 'item', 'data'])
        const resumeDetailLoading = _.get(state, ['resume', 'item', 'loading'])
        const createCommentLoading = _.get(state, ['longList', 'createComment', 'loading'])
        const resumeCommentsList = _.get(state, ['longList', 'resumeComments', 'data'])
        const resumeCommentsLoading = _.get(state, ['longList', 'resumeComments', 'loading'])

        return {
            resumePreviewList,
            resumePreviewListLoading,
            longList,
            longListLoading,
            meetingList,
            meetingListLoading,
            shortList,
            shortListLoading,
            detail,
            detailLoading,
            createForm,
            filterForm,
            moveToForm,
            notesForm,
            resumeDetailsForm,
            filter,
            filterResume,
            resumeDetail,
            resumeDetailLoading,
            createCommentLoading,
            resumeCommentsList,
            resumeCommentsLoading
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
         const resume = _.toInteger(_.get(query, ['resume']))
         if (resume > ZERO) {
             dispatch(resumeItemFetchAction(resume))
             dispatch(getResumeComments(filter))
         }
     }),

    // GET RESUME LIST ON DIALOG OPEN
    withPropsOnChange((props, nextProps) => {
        const excludeFilters = {
            application: null,
            resume: null,
            moveTo: null,
            excludeAccepted: null,
            openMoveToDialog: null,
            page: null,
            openAddLongListDialog: null
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

    withState('openConfirmDialog', 'setOpenConfirmDialog', false),
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

        handleOpenMoveToDialog: props => (resume, moveTo) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({resume: resume, moveTo: moveTo, [OPEN_MOVE_TO_DIALOG]: true})})
        },

        handleCloseMoveToDialog: props => () => {
            const {location: {pathname, query}} = props
            const application = _.get(query, 'application')
            hashHistory.push({pathname, query: {application}})
        },

        handleSubmitMoveToDialog: props => () => {
            const {dispatch, moveToForm, filter, location: {pathname, query}} = props
            const application = _.toInteger(_.get(query, 'application'))
            const resume = _.toInteger(_.get(query, 'resume'))
            const status = _.get(query, 'moveTo')
            const formValues = _.get(moveToForm, ['values'])
            const dispatchByStatus = () => {
                switch (status) {
                    case HR_RESUME_MEETING: return dispatch(addToInterviewList(application, resume, formValues))
                    case HR_RESUME_SHORT: return dispatch(addToShortList(application, resume, formValues))
                    case HR_RESUME_REMOVED: return dispatch(deleteResume(application, resume, formValues))
                    default: return null
                }
            }
            return (dispatchByStatus())
                    .then(() => {
                        dispatch(reset('ResumeMoveForm'))
                        const getSnackbarMessage = () => {
                            switch (status) {
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
                        dispatch(getLongList(filter, application, HR_RESUME_LONG))
                        if (status === HR_RESUME_MEETING) {
                            dispatch(getInterviewList(filter, application, HR_RESUME_MEETING))
                        } else if (status === HR_RESUME_SHORT) {
                            dispatch(getInterviewList(filter, application, HR_RESUME_MEETING))
                            dispatch(getShortList(filter, application, HR_RESUME_SHORT))
                        } else if (status === HR_RESUME_REMOVED) {
                            dispatch(getInterviewList(filter, application, HR_RESUME_MEETING))
                            dispatch(getShortList(filter, application, HR_RESUME_SHORT))
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

        handleSubmitEditNote: props => (resume, value, prevValue) => {
            const {dispatch, location: {query}} = props
            const application = _.toInteger(_.get(query, 'application'))
            if (value !== prevValue) {
                return dispatch(resumeAddNote(application, resume, value))
                    .then(() => {
                        return dispatch(openSnackbarAction({message: t('Заметка успешно обновлена')}))
                    })
            }
            return null
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
        detail,
        detailLoading,
        createLoading,
        resumeDetail,
        resumeDetailLoading,
        createCommentLoading,
        resumeCommentsList,
        resumeCommentsLoading,
        filter,
        layout,
        params
    } = props

    const detailId = _.toInteger(_.get(params, 'longListId'))
    const openAddDialog = toBoolean(_.get(location, ['query', OPEN_ADD_LONG_LIST_DIALOG]))
    const openMoveToDialog = toBoolean(_.get(location, ['query', OPEN_MOVE_TO_DIALOG]))
    const openResumeDialog = !toBoolean(_.get(location, ['query', OPEN_MOVE_TO_DIALOG])) && _.toInteger(_.get(location, ['query', 'resume'])) > ZERO

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
        loading: shortListLoading
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
        handleSubmit: props.handleSubmitMoveToDialog
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

    const resumeDetails = {
        open: openResumeDialog,
        data: resumeDetail,
        loading: resumeDetailLoading,
        createCommentLoading,
        handleCreateComment: props.handleSubmitResumeComment,
        commentsList: _.get(resumeCommentsList, 'results'),
        commentsLoading: resumeCommentsLoading
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
                confirmDialog={confirmDialog}
                resumeDetails={resumeDetails}
                initialValues={getNotesInitialValues()}
                resumeNoteData={resumeNoteData}
            />
        </Layout>
    )
})

export default LongList
