import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import {reset} from 'redux-form'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import {
    LongListGridList,
    OPEN_ADD_LONG_LIST_DIALOG
} from '../../components/HR/LongList'
import {
    getApplicationDetails,
    getResumePreviewList,
    getLongList,
    getInterviewList,
    getShortList,
    addToLongList
} from '../../actions/HR/longList'
import {RESUME_FILTER_KEY, RESUME_FILTER_OPEN} from '../../components/HR/Resume'
import {joinArray} from '../../helpers/joinSplitValues'
import numberWithoutSpaces from '../../helpers/numberWithoutSpaces'
import {langQueryFormat} from '../../helpers/joinSplitLanguages'
import {HR_RESUME_LONG, HR_RESUME_MEETING, HR_RESUME_SHORT, ZERO} from '../../constants/backendConstants'
import toBoolean from '../../helpers/toBoolean'
import t from '../../helpers/translate'
import {openSnackbarAction} from '../../actions/snackbar'

const except = {
    application: null,
    openAddLongListDialog: null,
    // DETAIL URI
    sex: null,
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
        const filter = filterHelper([], pathname, query)
        const filterResume = filterHelper(resumePreviewList, pathname, query)

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
            filter,
            filterResume
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

    // GET RESUME LIST ON DIALOG OPEN
    withPropsOnChange((props, nextProps) => {
        const openDialog = toBoolean(_.get(props, ['location', 'query', OPEN_ADD_LONG_LIST_DIALOG]))
        const nextOpenDialog = toBoolean(_.get(nextProps, ['location', 'query', OPEN_ADD_LONG_LIST_DIALOG]))
        return openDialog !== nextOpenDialog && nextOpenDialog === true
    }, ({dispatch, location: {query}, filterResume}) => {
        const openDialog = toBoolean(_.get(query, [OPEN_ADD_LONG_LIST_DIALOG]))
        if (openDialog) {
            dispatch(getResumePreviewList(filterResume))
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
                })
        },

        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const position = _.get(filterForm, ['values', 'position']) || null
            const mode = _.get(filterForm, ['values', 'mode']) || null
            const ageMin = _.get(filterForm, ['values', 'age', 'min']) || null
            const ageMax = _.get(filterForm, ['values', 'age', 'max']) || null
            const sex = _.get(filterForm, ['values', 'sex', 'value']) || null
            const education = _.get(filterForm, ['values', 'education']) || null
            const levelPc = _.get(filterForm, ['values', 'levelPc', 'value']) || null
            const languages = _.get(filterForm, ['values', 'languages']) || null
            const experience = _.get(filterForm, ['values', 'experience']) || null
            const skills = _.get(filterForm, ['values', 'skills']) || null
            const langToUrl = langQueryFormat(languages)

            filter.filterBy({
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
        filter,
        layout,
        params
    } = props

    const detailId = _.toInteger(_.get(params, 'longListId'))
    const openAddDialog = toBoolean(_.get(location, ['query', OPEN_ADD_LONG_LIST_DIALOG]))

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

    const filterDialog = {
        openFilterDialog: true,
        handleOpenFilterDialog: () => null,
        handleCloseFilterDialog: () => null,
        handleClearFilterDialog: () => null,
        handleSubmitFilterDialog: props.handleSubmitFilterDialog
    }

    return (
        <Layout {...layout}>
            <LongListGridList
                filter={filter}
                detailData={detailData}
                filterDialog={filterDialog}
                addDialog={addDialog}
                longListData={longListData}
                meetingListData={meetingListData}
                shortListData={shortListData}
            />
        </Layout>
    )
})

export default LongList
