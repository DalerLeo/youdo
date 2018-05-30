import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {reset} from 'redux-form'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout/index'
import {compose, withPropsOnChange, withState, withHandlers, mapPropsStream, createEventHandler} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {
  applicationCreateAction,
  applicationUpdateAction,
  applicationListFetchAction,
  applicationDeleteAction,
  applicationItemFetchAction,
  usersListFetchAction,
  privilegeListFetchAction,
  getApplicationLogs,
  changeApplicationAction,
  submitMeetingAction,
  getMeetingListAction,
  confirmMeetingTime,
  confirmCompleteApplication
} from '../../actions/HR/application'
import {openSnackbarAction} from '../../actions/snackbar'
import t from '../../helpers/translate'
import {
  APPLICATION_CREATE_DIALOG_OPEN,
  APPLICATION_UPDATE_DIALOG_OPEN,
  ApplicationGridList,
  APPLICATION_FILTER_KEY,
  APPLICATION_FILTER_OPEN,
  APPLICATION_MEETING_DIALOG_OPEN,
  APPLICATION_MEETING_DIALOG_UPDATE
} from '../../components/HR/Application'
import numberFormat from '../../helpers/numberFormat'
import moment from 'moment'
import {ZERO} from '../../constants/backendConstants'
import {openErrorAction} from '../../actions/error'

const enhance = compose(
  connect((state, props) => {
    const query = _.get(props, ['location', 'query'])
    const pathname = _.get(props, ['location', 'pathname'])
    const detail = _.get(state, ['application', 'item', 'data'])
    const detailLoading = _.get(state, ['application', 'item', 'loading'])
    const createLoading = _.get(state, ['application', 'create', 'loading'])
    const updateLoading = _.get(state, ['application', 'update', 'loading'])
    const list = _.get(state, ['application', 'list', 'data'])
    const listLoading = _.get(state, ['application', 'list', 'loading'])
    const meetingList = _.get(state, ['application', 'meetingList', 'data'])
    const meetingListLoading = _.get(state, ['application', 'meetingList', 'loading'])
    const privilegeList = _.get(state, ['application', 'privilege', 'data'])
    const privilegeListLoading = _.get(state, ['application', 'privilege', 'loading'])
    const logsList = _.get(state, ['application', 'logs', 'data'])
    const logsListLoading = _.get(state, ['application', 'logs', 'loading'])
    const usersList = _.get(state, ['users', 'list', 'data'])
    const usersListLoading = _.get(state, ['users', 'list', 'loading'])
    const reportList = _.get(state, ['longList', 'reportList', 'data'])
    const reportListLoading = _.get(state, ['longList', 'reportList', 'loading'])
    const createForm = _.get(state, ['form', 'ApplicationCreateForm'])
    const meetingForm = _.get(state, ['form', 'ApplicationMeetingForm'])
    const progressForm = _.get(state, ['form', 'ApplicationProgressForm'])
    const sendReportForm = _.get(state, ['form', 'ApplicationSendReportForm'])
    const filter = filterHelper(list, pathname, query)

    return {
      list,
      listLoading,
      detail,
      detailLoading,
      createLoading,
      updateLoading,
      usersList,
      usersListLoading,
      privilegeList,
      privilegeListLoading,
      logsList,
      logsListLoading,
      reportList,
      reportListLoading,
      meetingList,
      meetingListLoading,
      filter,
      createForm,
      meetingForm,
      progressForm,
      sendReportForm
    }
  }),
  withState('openConfirmDialog', 'setOpenConfirmDialog', false),
  withState('openRecruiterList', 'setOpenRecruiterList', false),

  withPropsOnChange((props, nextProps) => {
    const except = {
      meeting: null,
      createMeetingDialog: null,
      updateMeetingDialog: null
    }
    return props.list && props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
  }, ({dispatch, filter}) => {
    dispatch(applicationListFetchAction(filter))
  }),

  withPropsOnChange((props, nextProps) => {
    const applicationId = _.get(nextProps, ['params', 'applicationId'])
    return applicationId && _.get(props, ['params', 'applicationId']) !== applicationId
  }, ({dispatch, params}) => {
    const applicationId = _.toInteger(_.get(params, 'applicationId'))
    if (applicationId > ZERO) {
      dispatch(applicationItemFetchAction(applicationId))
      dispatch(getApplicationLogs(applicationId))
      dispatch(getMeetingListAction(applicationId))
    }
  }),

  withPropsOnChange((props, nextProps) => {
    const prevOpen = _.get(props, ['openRecruiterList'])
    const nextOpen = _.get(nextProps, ['openRecruiterList'])
    const usersList = _.get(nextProps, ['usersList'])
    return nextOpen !== prevOpen && nextOpen === true && !usersList
  }, ({dispatch, openRecruiterList}) => {
    if (openRecruiterList) {
      dispatch(usersListFetchAction())
    }
  }),

  withPropsOnChange((props, nextProps) => {
    const prevCreate = toBoolean(_.get(props, ['location', 'query', APPLICATION_CREATE_DIALOG_OPEN]))
    const nextCreate = toBoolean(_.get(nextProps, ['location', 'query', APPLICATION_CREATE_DIALOG_OPEN]))
    const prevUpdate = toBoolean(_.get(props, ['location', 'query', APPLICATION_UPDATE_DIALOG_OPEN]))
    const nextUpdate = toBoolean(_.get(nextProps, ['location', 'query', APPLICATION_UPDATE_DIALOG_OPEN]))
    const privilegeList = _.get(nextProps, ['privilegeList'])
    return ((prevCreate !== nextCreate && nextCreate === true) || (prevUpdate !== nextUpdate && nextUpdate === true)) && !privilegeList
  }, ({dispatch, location: {query}}) => {
    const openCreate = toBoolean(_.get(query, APPLICATION_CREATE_DIALOG_OPEN))
    const openUpdate = toBoolean(_.get(query, APPLICATION_UPDATE_DIALOG_OPEN))
    if (openCreate || openUpdate) {
      dispatch(privilegeListFetchAction())
    }
  }),

  mapPropsStream(props$ => {
    const {stream: handleOpenFilterDialog$, handler: handleOpenFilterDialog} = createEventHandler()
    const {stream: handleCloseFilterDialog$, handler: handleCloseFilterDialog} = createEventHandler()

    handleOpenFilterDialog$
      .withLatestFrom(props$)
      .subscribe(([event, props]) => {
        const {location: {pathname}, filter} = props
        hashHistory.push({pathname, query: filter.getParams({[APPLICATION_FILTER_OPEN]: true})})
      })

    handleCloseFilterDialog$
      .withLatestFrom(props$)
      .subscribe(([event, props]) => {
        const {location: {pathname}, filter} = props
        hashHistory.push({pathname, query: filter.getParams({[APPLICATION_FILTER_OPEN]: false})})
      })

    props$
      .filter((props) => {
        const a = toBoolean(_.get(props, ['location', 'query', APPLICATION_MEETING_DIALOG_OPEN]))
        const b = _.toInteger(_.get(props.location.query, [APPLICATION_MEETING_DIALOG_UPDATE])) > ZERO

        return a || b
      })
    // . .subscribe(props => {
    // .     const application = _.toInteger(_.get(props.params, 'applicationId'))
    // .     return props.dispatch(getReportList(props.filter, application, 'report'))
    // . })

    props$
      .first()
      .subscribe(({filter, ...props}) => props.dispatch(applicationListFetchAction(filter)))

    return props$.combineLatest(props => ({...props, handleOpenFilterDialog, handleCloseFilterDialog}))
  }),

  withHandlers({
    handleClearFilterDialog: props => () => {
      const {location: {pathname}, dispatch} = props
      hashHistory.push({pathname, query: {}})
      dispatch(reset('ApplicationFilterForm'))
    },

    handleSubmitFilterDialog: props => () => {
      const {filter, filterForm} = props
      const typeParent = _.get(filterForm, ['values', 'typeParent', 'value']) || null
      const typeChild = _.get(filterForm, ['values', 'typeChild', 'value']) || null
      const measurement = _.get(filterForm, ['values', 'measurement']) || null
      const withoutNetCost = _.get(filterForm, ['values', 'withoutNetCost']) || null

      filter.filterBy({
        [APPLICATION_FILTER_OPEN]: false,
        [APPLICATION_FILTER_KEY.TYPE_PARENT]: typeParent,
        [APPLICATION_FILTER_KEY.TYPE_CHILD]: typeParent && typeChild,
        [APPLICATION_FILTER_KEY.MEASUREMENT]: _.join(measurement, '-'),
        [APPLICATION_FILTER_KEY.WITHOUT_NET_COST]: withoutNetCost
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
      dispatch(applicationDeleteAction(detail.id))
        .then(() => {
          setOpenConfirmDialog(false)
          dispatch(applicationListFetchAction(filter))
          return dispatch(openSnackbarAction({message: t('Успешно удалено')}))
        })
        .catch((error) => {
          dispatch(openErrorAction({
            message: error
          }))
        })
    },

    handleOpenCreateDialog: props => () => {
      const {dispatch, location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[APPLICATION_CREATE_DIALOG_OPEN]: true})})
      dispatch(reset('ApplicationCreateForm'))
    },

    handleCloseCreateDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[APPLICATION_CREATE_DIALOG_OPEN]: false})})
    },

    handleSubmitCreateDialog: props => () => {
      const {dispatch, createForm, filter, location: {pathname}} = props

      return dispatch(applicationCreateAction(_.get(createForm, ['values'])))
        .then(() => {
          return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
        })
        .then(() => {
          hashHistory.push({pathname, query: filter.getParams({[APPLICATION_CREATE_DIALOG_OPEN]: false})})
          dispatch(applicationListFetchAction(filter))
        })
        .catch((error) => {
          dispatch(openErrorAction({
            message: error
          }))
        })
    },

    handleOpenUpdateDialog: props => (id) => {
      const {filter} = props
      hashHistory.push({
        pathname: sprintf(ROUTER.HR_APPLICATION_ITEM_PATH, id),
        query: filter.getParams({[APPLICATION_UPDATE_DIALOG_OPEN]: true})
      })
    },

    handleCloseUpdateDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[APPLICATION_UPDATE_DIALOG_OPEN]: false})})
    },

    handleSubmitUpdateDialog: props => () => {
      const {dispatch, createForm, filter} = props
      const applicationId = _.toInteger(_.get(props, ['params', 'applicationId']))

      return dispatch(applicationUpdateAction(applicationId, _.get(createForm, ['values'])))
        .then(() => {
          dispatch(getApplicationLogs(applicationId))
          return dispatch(applicationItemFetchAction(applicationId))
        })
        .then(() => {
          return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
        })
        .then(() => {
          hashHistory.push(filter.createURL({[APPLICATION_UPDATE_DIALOG_OPEN]: false}))
          dispatch(applicationListFetchAction(filter))
        })
        .catch((error) => {
          dispatch(openErrorAction({
            message: error
          }))
        })
    },

    handleCloseDetail: props => () => {
      const {filter} = props
      hashHistory.push({pathname: ROUTER.HR_APPLICATION_LIST_URL, query: filter.getParams()})
    },

    handleChangeApplicationAction: props => (action) => {
      const {params, dispatch, sendReportForm} = props
      const application = _.toInteger(_.get(params, 'applicationId'))
      const formValues = _.get(sendReportForm, 'values')
      return dispatch(changeApplicationAction(action, application, formValues))
        .then(() => {
          return dispatch(getApplicationLogs(application))
        })
        .then(() => {
          if (action === 'sent_to_client') {
            return dispatch(openSnackbarAction({message: t('Отчет отправлен клиенту')}))
          }
          return null
        })
    },

    handleOpenMeetingDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({
        pathname, query: filter.getParams({[APPLICATION_MEETING_DIALOG_OPEN]: true})
      })
    },

    handleCloseMeetingDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({
        pathname, query: filter.getParams({[APPLICATION_MEETING_DIALOG_OPEN]: false})
      })
    },

    handleSubmitMeetingDialog: props => () => {
      const {dispatch, meetingForm, filter} = props
      const applicationId = _.toInteger(_.get(props, ['params', 'applicationId']))

      return dispatch(submitMeetingAction(applicationId, _.get(meetingForm, ['values'])))
        .then(() => {
          return dispatch(getMeetingListAction(applicationId))
        })
        .then(() => {
          return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
        })
        .then(() => {
          hashHistory.push(filter.createURL({[APPLICATION_MEETING_DIALOG_OPEN]: false}))
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
      const applicationId = _.toInteger(_.get(props, ['params', 'applicationId']))
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
      const {dispatch, params} = props
      const application = _.toInteger(_.get(params, ['applicationId']))
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
    },

    handleConfirmCompleteApp: props => () => {
      const {dispatch, params, progressForm} = props
      const application = _.toInteger(_.get(params, ['applicationId']))
      const formValues = _.get(progressForm, 'values')
      return dispatch(confirmCompleteApplication(application, formValues))
        .then(() => {
          return dispatch(applicationItemFetchAction(application))
        })
        .then(() => {
          return dispatch(getApplicationLogs(application))
        })
        .then(() => {
          return dispatch(openSnackbarAction({message: t('Заявка завершена успешно')}))
        })
        .catch((error) => {
          dispatch(openErrorAction({
            message: error
          }))
        })
    }
  })
)

const ApplicationList = enhance((props) => {
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
    openRecruiterList,
    setOpenRecruiterList,
    usersList,
    usersListLoading,
    privilegeList,
    privilegeListLoading,
    logsList,
    logsListLoading,
    reportList,
    reportListLoading,
    meetingList,
    meetingListLoading
  } = props

  const openFilterDialog = toBoolean(_.get(location, ['query', APPLICATION_FILTER_OPEN]))
  const openCreateDialog = toBoolean(_.get(location, ['query', APPLICATION_CREATE_DIALOG_OPEN]))
  const openUpdateDialog = toBoolean(_.get(location, ['query', APPLICATION_UPDATE_DIALOG_OPEN]))
  const openMeetingDialog = toBoolean(_.get(location, ['query', APPLICATION_MEETING_DIALOG_OPEN]))
  const openUpdateMeetingDialog = _.toInteger(_.get(location, ['query', APPLICATION_MEETING_DIALOG_UPDATE])) > ZERO
  const detailId = _.toInteger(_.get(params, 'applicationId'))

  const filterDialog = {
    initialValues: {},
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

  const isSelectedPrivileges = _.map(_.get(privilegeList, 'results'), (obj) => {
    const userSelectedPrivilege = _.find(_.get(detail, 'privileges'), {'id': obj.id})
    if (!openCreateDialog && _.get(userSelectedPrivilege, 'id') === obj.id) {
      return {id: obj.id, selected: true}
    }
    return {id: obj.id, selected: false}
  })

  const createDialog = {
    createLoading,
    openCreateDialog,
    handleOpenCreateDialog: props.handleOpenCreateDialog,
    handleCloseCreateDialog: props.handleCloseCreateDialog,
    handleSubmitCreateDialog: props.handleSubmitCreateDialog
  }

  const updateDialog = {
    initialValues: (() => {
      if (openUpdateDialog && detail) {
        const required = {}
        const requiredLangs = _.get(_.last(_.get(detail, 'filterRequired')), 'langLevel')
        _.map(_.get(detail, 'filterRequired'), (item) => {
          if (!_.isObject(item)) {
            required[item] = true
          }
        })
        return {
          age: {
            min: _.get(detail, 'ageMin'),
            max: _.get(detail, 'ageMax')
          },
          businessTrip: _.get(detail, 'businessTrip'),
          client: {
            value: _.get(detail, ['contact', 'client', 'id'])
          },
          contact: String(_.get(detail, ['contact', 'id'])),
          education: {
            value: _.get(detail, 'education')
          },
          experience: _.get(detail, 'experience'),
          deadline: moment(_.get(detail, 'deadline')).toDate(),
          guaranteedDate: moment(_.get(detail, 'dateGuarantee')).toDate(),
          languages: _.map(_.get(detail, 'languages'), (item) => {
            return {
              name: {
                value: _.get(item, ['language', 'id'])
              },
              level: {
                value: _.get(item, 'level')
              },
              required: _.includes(requiredLangs, _.get(item, ['language', 'id']))
            }
          }),
          levelPc: {
            value: _.get(detail, 'levelPc')
          },
          planningDate: moment(_.get(detail, 'planningDate')).toDate(),
          sphere: {
            value: _.get(detail, ['position', 'child'])
          },
          position: {
            value: _.get(detail, ['position', 'id'])
          },
          privileges: isSelectedPrivileges,
          trialSalary: {
            min: numberFormat(_.get(detail, 'trialSalaryMin')),
            max: numberFormat(_.get(detail, 'trialSalaryMax'))
          },
          realSalary: {
            min: numberFormat(_.get(detail, 'realSalaryMin')),
            max: numberFormat(_.get(detail, 'realSalaryMax'))
          },
          responsibility: _.get(detail, 'responsibility'),
          requirements: _.map(_.get(detail, 'requirements'), (item) => {
            return {
              text: _.get(item, 'text'),
              required: _.get(item, 'required')
            }
          }),
          required,
          sex: {
            value: _.get(detail, 'sex')
          },
          schedule: {
            value: _.get(detail, 'mode')
          },
          skills: _.map(_.get(detail, 'skills'), (item) => _.get(item, 'name')),
          recruiter: _.get(detail, ['recruiter'])
        }
      }
      return {
        languages: [{}],
        privileges: isSelectedPrivileges
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

  const usersData = {
    list: _.get(usersList, 'results'),
    loading: usersListLoading
  }

  const privilegeData = {
    list: _.get(privilegeList, 'results'),
    loading: privilegeListLoading
  }

  const detailData = {
    id: detailId,
    data: detail,
    detailLoading,
    handleCloseDetail: props.handleCloseDetail,
    handleChangeApplicationAction: props.handleChangeApplicationAction
  }

  const logsData = {
    list: _.orderBy(logsList, ['id'], ['asc']),
    loading: logsListLoading
  }

  const meetingData = {
    list: meetingList,
    loading: meetingListLoading
  }

  const meetingDialog = {
    open: openMeetingDialog,
    handleOpen: props.handleOpenMeetingDialog,
    handleClose: props.handleCloseMeetingDialog,
    handleSubmit: props.handleSubmitMeetingDialog,
    initialValues: (() => {
      const resumes = {}
      _.map(meetingData.list, (item) => {
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

  const updateMeetingDialog = {
    open: openUpdateMeetingDialog,
    handleOpen: props.handleOpenUpdateMeetingDialog,
    handleClose: props.handleCloseUpdateMeetingDialog,
    handleSubmit: props.handleSubmitUpdateMeetingDialog,
    handleConfirm: props.handleConfirmMeetingTime
  }

  const reportData = {
    list: _.get(reportList, 'results'),
    loading: reportListLoading
  }

  const confirmData = {
    handleComplete: props.handleConfirmCompleteApp
  }

  return (
    <Layout {...layout}>
      <ApplicationGridList
        filter={filter}
        listData={listData}
        detailData={detailData}
        filterDialog={filterDialog}
        createDialog={createDialog}
        confirmDialog={confirmDialog}
        updateDialog={updateDialog}
        openRecruiterList={openRecruiterList}
        setOpenRecruiterList={setOpenRecruiterList}
        usersData={usersData}
        privilegeData={privilegeData}
        logsData={logsData}
        meetingDialog={meetingDialog}
        updateMeetingDialog={updateMeetingDialog}
        reportData={reportData}
        meetingData={meetingData}
        confirmData={confirmData}
      />
    </Layout>
  )
})

export default ApplicationList
