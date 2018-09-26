import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import sprintf from 'sprintf'
import {reset} from 'redux-form'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout/index'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import {joinArray, splitToArray} from '../../helpers/joinSplitValues'
import toBoolean from '../../helpers/toBoolean'
import {
  RESUME_CREATE_DIALOG_OPEN,
  RESUME_UPDATE_DIALOG_OPEN,
  ResumeGridList
} from '../../components/HR/Resume/index'
import {
  resumeCreateAction,
  resumeUpdateAction,
  resumeListFetchAction,
  resumeDeleteAction,
  resumeItemFetchAction
} from '../../actions/HR/resume'
import {openSnackbarAction} from '../../actions/snackbar'
import t from '../../helpers/translate'
import {RESUME_FILTER_KEY, RESUME_FILTER_OPEN} from '../../components/HR/Resume'
import {HR_WORK_SCHEDULE} from '../../constants/backendConstants'
import numberWithoutSpaces from '../../helpers/numberWithoutSpaces'
import numberFormat from '../../helpers/numberFormat'

const enhance = compose(
  connect((state, props) => {
    const query = _.get(props, ['location', 'query'])
    const pathname = _.get(props, ['location', 'pathname'])
    const detail = _.get(state, ['resume', 'item', 'data'])
    const detailLoading = _.get(state, ['resume', 'item', 'loading'])
    const createLoading = _.get(state, ['resume', 'create', 'loading'])
    const updateLoading = _.get(state, ['resume', 'update', 'loading'])
    const list = _.get(state, ['resume', 'list', 'data'])
    const listLoading = _.get(state, ['resume', 'list', 'loading'])
    const createForm = _.get(state, ['form', 'ResumeCreateForm', 'values'])
    const educationForm = _.get(state, ['form', 'ResumeEducationForm', 'values'])
    const experienceForm = _.get(state, ['form', 'ResumeExperienceForm', 'values'])
    const personalForm = _.get(state, ['form', 'ResumePersonalForm', 'values'])
    const skillsForm = _.get(state, ['form', 'ResumeSkillsForm', 'values'])
    const filterForm = _.get(state, ['form', 'ResumeFilterForm', 'values'])
    const filter = filterHelper(list, pathname, query)

    return {
      list,
      listLoading,
      detail,
      detailLoading,
      createLoading,
      updateLoading,
      filter,
      createForm,
      educationForm,
      experienceForm,
      personalForm,
      skillsForm,
      filterForm
    }
  }),
  withState('openConfirmDialog', 'setOpenConfirmDialog', false),

  withPropsOnChange((props, nextProps) => {
    return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
  }, ({dispatch, filter}) => {
    dispatch(resumeListFetchAction(filter))
  }),

  withPropsOnChange((props, nextProps) => {
    const resumeId = _.get(nextProps, ['params', 'resumeId'])
    return resumeId && _.get(props, ['params', 'resumeId']) !== resumeId
  }, ({dispatch, params}) => {
    const resumeId = _.toInteger(_.get(params, 'resumeId'))
    resumeId && dispatch(resumeItemFetchAction(resumeId))
  }),

  withHandlers({
    handleOpenFilterDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[RESUME_FILTER_OPEN]: true})})
    },

    handleCloseFilterDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[RESUME_FILTER_OPEN]: false})})
    },

    handleClearFilterDialog: props => () => {
      const {location: {pathname}, dispatch} = props
      hashHistory.push({pathname, query: {}})
      dispatch(reset('ResumeFilterForm'))
    },

    handleSubmitFilterDialog: props => () => {
      const {filter, filterForm} = props
      const sphere = _.get(filterForm, ['sphere', 'value']) || null
      const position = _.get(filterForm, ['position', 'value']) || null
      const mode = _.get(filterForm, ['mode']) || null
      const ageMin = _.get(filterForm, ['age', 'min']) || null
      const ageMax = _.get(filterForm, ['age', 'max']) || null
      const sex = _.get(filterForm, ['sex', 'value']) || null
      const education = _.get(filterForm, ['education']) || null
      const levelPc = _.get(filterForm, ['levelPc', 'value']) || null
      const experience = _.get(filterForm, ['experience']) || null
      const skills = _.get(filterForm, ['skills']) || null

      filter.filterBy({
        [RESUME_FILTER_OPEN]: false,
        [RESUME_FILTER_KEY.SPHERE]: sphere,
        [RESUME_FILTER_KEY.POSITION]: position,
        [RESUME_FILTER_KEY.MODE]: joinArray(mode),
        [RESUME_FILTER_KEY.AGE_MIN]: ageMin && numberWithoutSpaces(ageMin),
        [RESUME_FILTER_KEY.AGE_MAX]: ageMax && numberWithoutSpaces(ageMax),
        [RESUME_FILTER_KEY.SEX]: sex,
        [RESUME_FILTER_KEY.EDUCATION]: joinArray(education),
        [RESUME_FILTER_KEY.LEVEL_PC]: levelPc,
        [RESUME_FILTER_KEY.EXPERIENCE]: experience && numberWithoutSpaces(experience),
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
      const {dispatch, detail, setOpenConfirmDialog, filter} = props
      dispatch(resumeDeleteAction(detail.id))
        .then(() => {
          setOpenConfirmDialog(false)
          dispatch(resumeListFetchAction(filter))
          return dispatch(openSnackbarAction({message: t('Успешно удалено')}))
        })
        .catch(() => {
          return dispatch(openSnackbarAction({message: t('Удаление невозможно из-за связи с другими данными')}))
        })
    },
    handleOpenCreateDialog: props => () => {
      const {dispatch, location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[RESUME_CREATE_DIALOG_OPEN]: true})})
      dispatch(reset('ResumeCreateForm'))
    },

    handleCloseCreateDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[RESUME_CREATE_DIALOG_OPEN]: false})})
    },

    handleSubmitCreateDialog: props => () => {
      const {dispatch, createForm, educationForm, experienceForm, personalForm, skillsForm, filter, location: {pathname}} = props
      const forms = {createForm, educationForm, experienceForm, personalForm, skillsForm}

      return dispatch(resumeCreateAction(forms))
        .then(() => {
          return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
        })
        .then(() => {
          hashHistory.push({pathname, query: filter.getParams({[RESUME_CREATE_DIALOG_OPEN]: false})})
          dispatch(resumeListFetchAction(filter))
        })
    },

    handleOpenUpdateDialog: props => (id) => {
      const {filter} = props
      hashHistory.push({
        pathname: sprintf(ROUTER.HR_RESUME_ITEM_PATH, id),
        query: filter.getParams({[RESUME_UPDATE_DIALOG_OPEN]: true})
      })
    },

    handleCloseUpdateDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[RESUME_UPDATE_DIALOG_OPEN]: false})})
    },

    handleSubmitUpdateDialog: props => () => {
      const {dispatch, createForm, educationForm, experienceForm, personalForm, skillsForm, filter} = props
      const forms = {createForm, educationForm, experienceForm, personalForm, skillsForm}
      const resumeId = _.toInteger(_.get(props, ['params', 'resumeId']))
      return dispatch(resumeUpdateAction(resumeId, forms))
        .then(() => {
          return dispatch(resumeItemFetchAction(resumeId))
        })
        .then(() => {
          return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
        })
        .then(() => {
          hashHistory.push(filter.createURL({[RESUME_UPDATE_DIALOG_OPEN]: false}))
          dispatch(resumeListFetchAction(filter))
        })
    },

    handleCloseDetail: props => () => {
      const {filter} = props
      hashHistory.push({pathname: ROUTER.HR_RESUME_LIST_URL, query: filter.getParams()})
    }
  })
)

const ResumeList = enhance((props) => {
  const {
    location,
    list,
    listLoading,
    detail,
    detailLoading,
    createLoading,
    updateLoading,
    filter,
    layout,
    params,
    dispatch
  } = props

  const openFilterDialog = toBoolean(_.get(location, ['query', RESUME_FILTER_OPEN]))
  const openCreateDialog = toBoolean(_.get(location, ['query', RESUME_CREATE_DIALOG_OPEN]))
  const openUpdateDialog = toBoolean(_.get(location, ['query', RESUME_UPDATE_DIALOG_OPEN]))
  const detailId = _.toInteger(_.get(params, 'resumeId'))

  const sphere = filter.getParam(RESUME_FILTER_KEY.SPHERE)
  const position = filter.getParam(RESUME_FILTER_KEY.POSITION)
  const mode = filter.getParam(RESUME_FILTER_KEY.MODE)
  const ageMin = filter.getParam(RESUME_FILTER_KEY.AGE_MIN)
  const ageMax = filter.getParam(RESUME_FILTER_KEY.AGE_MAX)
  const sex = filter.getParam(RESUME_FILTER_KEY.SEX)
  const education = filter.getParam(RESUME_FILTER_KEY.EDUCATION)
  const levelPc = filter.getParam(RESUME_FILTER_KEY.LEVEL_PC)
  const experience = filter.getParam(RESUME_FILTER_KEY.EXPERIENCE)
  const skills = filter.getParam(RESUME_FILTER_KEY.SKILLS)

  const filterDialog = {
    initialValues: {
      sphere: {
        value: sphere
      },
      position: {
        value: position
      },
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
      experience: experience && numberFormat(experience),
      skills: skills && splitToArray(skills)
    },
    filterLoading: false,
    openFilterDialog,
    handleOpenFilterDialog: props.handleOpenFilterDialog,
    handleCloseFilterDialog: props.handleCloseFilterDialog,
    handleClearFilterDialog: props.handleClearFilterDialog,
    handleSubmitFilterDialog: props.handleSubmitFilterDialog
  }

  const confirmDialog = {
    openConfirmDialog: props.openConfirmDialog,
    handleOpenConfirmDialog: props.handleOpenConfirmDialog,
    handleCloseConfirmDialog: props.handleCloseConfirmDialog,
    handleSendConfirmDialog: props.handleSendConfirmDialog
  }

  const createDialog = {
    createLoading,
    openCreateDialog,
    handleOpenCreateDialog: props.handleOpenCreateDialog,
    handleCloseCreateDialog: props.handleCloseCreateDialog,
    handleSubmitCreateDialog: props.handleSubmitCreateDialog
  }

  const isSelectedModes = _.map(HR_WORK_SCHEDULE, (obj) => {
    const userSelectedMode = _.find(_.get(detail, 'mode'), {'id': obj.id})
    if (!openCreateDialog && _.get(userSelectedMode, 'id') === obj.id) {
      return {id: obj.id, selected: true}
    }
    return {id: obj.id, selected: false}
  })

  const updateDialog = {
    initialValues: (() => {
      if (!detail || openCreateDialog) {
        return {
          experiences: [{}],
          educations: [{}],
          languagesLevel: [{}, {}],
          modes: isSelectedModes
        }
      }
      return {
        address: _.get(detail, 'address'),
        businessTrip: _.get(detail, 'businessTrip'),
        city: {
          value: _.get(detail, ['city', 'id']),
          text: _.get(detail, ['city', 'name'])
        },
        country: {
          value: _.get(detail, ['country', 'id'])
        },
        dateOfBirth: moment(_.get(detail, 'dateOfBirth')).toDate(),
        driverLicense: _.map(_.get(detail, 'driverLicense'), (item) => {
          return {
            id: _.get(item, 'name'),
            name: _.get(item, 'name'),
            active: true
          }
        }),
        educations: _.map(_.get(detail, 'educations'), (item) => {
          return {
            city: {
              value: _.get(item, ['city', 'id']),
              text: _.get(detail, ['city', 'name'])
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
        email: _.get(detail, 'email'),
        experiences: _.map(_.get(detail, 'experiences'), (item) => {
          return {
            sphere: {
              value: _.get(item, ['position', 'child'])
            },
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
          value: _.get(detail, 'familyStatus')
        },
        fullName: _.get(detail, 'fullName'),
        hobby: _.get(detail, 'hobby'),
        languagesLevel: _.map(_.get(detail, 'languages'), (item) => {
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
          value: _.get(detail, 'levelPc')
        },
        modes: isSelectedModes,
        phone: _.get(detail, 'phone'),
        sphere: {
          value: _.get(detail, ['position', 'child'])
        },
        position: {
          value: _.get(detail, ['position', 'id'])
        },
        relocation: _.get(detail, 'relocation'),
        salary: {
          min: numberFormat(_.get(detail, 'salaryMin')),
          max: numberFormat(_.get(detail, 'salaryMax'))
        },
        sex: {
          value: _.get(detail, 'sex')
        },
        skills: _.map(_.get(detail, 'skills'), (item) => _.get(item, 'name'))

      }
    })(),
    updateLoading: detailLoading || updateLoading,
    openUpdateDialog,
    handleOpenUpdateDialog: props.handleOpenUpdateDialog,
    handleCloseUpdateDialog: props.handleCloseUpdateDialog,
    handleSubmitUpdateDialog: props.handleSubmitUpdateDialog
  }

  const listData = {
    data: _.get(list, 'results'),
    listLoading
  }

  const detailData = {
    id: detailId,
    data: detail,
    detailLoading,
    handleCloseDetail: props.handleCloseDetail
  }

  return (
    <Layout {...layout}>
      <ResumeGridList
        filter={filter}
        listData={listData}
        detailData={detailData}
        filterDialog={filterDialog}
        createDialog={createDialog}
        confirmDialog={confirmDialog}
        updateDialog={updateDialog}
        dispatch={dispatch}
      />
    </Layout>
  )
})

export default ResumeList
