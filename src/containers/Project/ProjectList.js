import React from 'react'
import _ from 'lodash'
import {compose, pure, mapPropsStream, createEventHandler} from 'recompose'
import {connect} from 'react-redux'
import Layout from '../../components/Layout'
import setInitialValues from '../../helpers/setInitialValues'
import {
  listWrapper,
  detailWrapper,
  createWrapper,
  updateWrapper,
  confirmWrapper,
  filterWrapper
} from '../Wrappers'
import {reset} from 'redux-form'
import {formInlineValidate} from 'helpers/formValidate'
import {updateDetailStore, updateStore} from '../../helpers/updateStore'
import moment from 'moment'
import {
  PROJECT_CREATE_DIALOG_OPEN,
  PROJECT_UPDATE_DIALOG_OPEN,
  PROJECT_DELETE_DIALOG_OPEN,
  PROJECT_FILTER_KEY,
  PROJECT_FILTER_OPEN,
  PROJECT_TASK_DIALOG_OPEN,
  ProjectGridList
} from '../../components/Project'
import {
  projectCreateAction,
  projectUpdateAction,
  projectListFetchAction,
  projectDeleteAction,
  taskListFetchAction,
  taskItemFetchAction,
  commentListFetchAction,
  taskCreateAction,
  commentCreateAction
} from '../../actions/project'
import {openErrorAction} from '../../actions/error'
import * as ROUTES from '../../constants/routes'
import {hashHistory} from 'react-router'

const updateKeys = {
  'manager': 'manager.id',
  'salesAmount': 'salesAmount',
  'comment': 'comment'
}

const except = {
  openMailDialog: null,
  project: null,
  taskOpen: null
}
const mapDispatchToProps = {
  updateDetailStore,
  updateStore,
  openErrorAction,
  taskListFetchAction,
  taskItemFetchAction,
  commentListFetchAction,
  commentCreateAction,
  taskCreateAction,
  resetForm: reset
}

const mapStateToProps = (state) => ({
  detail: _.get(state, ['task', 'item', 'data']),
  detailLoading: _.get(state, ['task', 'item', 'loading']),
  commentForm: _.get(state, 'form.ProjectDetailForm.values'),
  taskForm: _.get(state, 'form.TaskForm.values'),
  commentCreateLoading: _.get(state, ['comment', 'create', 'loading'])
})

const enhance = compose(
  listWrapper({
    except,
    storeName: 'project',
    listFetchAction: projectListFetchAction
  }),
  listWrapper({
    storeName: 'comment'
  }),
  listWrapper({
    storeName: 'task'
  }),
  detailWrapper({
    storeName: 'task'
  }),
  createWrapper({
    storeName: 'project',
    formName: 'ProjectCreateForm',
    createAction: projectCreateAction,
    queryKey: PROJECT_CREATE_DIALOG_OPEN
  }),
  updateWrapper({
    updateKeys,
    storeName: 'project',
    formName: 'ProjectCreateForm',
    updateAction: projectUpdateAction,
    queryKey: PROJECT_UPDATE_DIALOG_OPEN,
    itemPath: ROUTES.PROJECT_ITEM_PATH,
    listPath: ROUTES.PROJECT_LIST_URL
  }),
  confirmWrapper({
    storeName: 'project',
    confirmAction: projectDeleteAction,
    queryKey: PROJECT_DELETE_DIALOG_OPEN,
    itemPath: ROUTES.PROJECT_ITEM_PATH,
    listPath: ROUTES.PROJECT_LIST_URL,
    successMessage: 'Успешно удалено',
    failMessage: 'Удаление невозможно из-за связи с другими данными'
  }),
  confirmWrapper({
    name: 'task',
    storeName: 'project',
    confirmAction: projectDeleteAction,
    queryKey: PROJECT_TASK_DIALOG_OPEN,
    successMessage: 'Успешно удалено',
    failMessage: 'Удаление невозможно из-за связи с другими данными'
  }),
  filterWrapper({
    formName: 'ProjectFilterForm',
    queryKey: PROJECT_FILTER_OPEN,
    filterKeys: PROJECT_FILTER_KEY
  }),

  connect(mapStateToProps, mapDispatchToProps),

  mapPropsStream(props$ => {
    props$
      .filter(({list}) => !_.isEmpty(_.get(list, 'results')))
      .filter((props) => !props.filter.getParam('project'))
      .subscribe(({filter, list, location: {pathname}, ...props}) => {
        const project = _.get(list, 'results.0.id')
        return hashHistory.replace({
          pathname,
          query: filter.getParams({project})
        })
      })

    props$
      .filter((props) => props.filter.getParam('project'))
      .distinctUntilChanged(null, (props) => props.filter.getParam('project'))
      .subscribe(({filter, ...props}) => props.taskListFetchAction(filter.getParam('project')))

    props$
      .filter((props) => props.params.id)
      .distinctUntilChanged(null, (props) => props.params.id)
      .subscribe(({filter, params: {id}, ...props}) => {
        props.taskItemFetchAction(filter.getParam('project'), id)
        props.commentListFetchAction(filter.getParam('project'), id)

        return null
      })

    const {handler: onComment, stream: onComment$} = createEventHandler()
    const {handler: onTaskCreate, stream: onTaskCreate$} = createEventHandler()

    onTaskCreate$
      .withLatestFrom(props$)
      .subscribe(([fieldNames, {filter, location: {pathname}, taskForm, ...props}]) => {
        const pId = filter.getParam('project')
        return props.taskCreateAction(pId, taskForm)
          .then(() => props.resetForm('TaskForm'))
          .then(() => {
            props.taskDialog.onClose()
            props.taskListFetchAction(pId)
          })
          .catch(error => {
            return formInlineValidate(fieldNames, props.dispatch, error, 'ProjectDetailForm')
          })
      })

    onComment$
      .withLatestFrom(props$)
      .subscribe(([fieldNames, {filter, location: {pathname}, detail, commentForm, ...props}]) => {
        const pId = filter.getParam('project')
        const id = detail.id
        return props.commentCreateAction(pId, id, commentForm)
          .then(() => props.resetForm('ProjectDetailForm'))
          .then(() => {
            props.commentListFetchAction(pId, id)
          })
          .catch(error => {
            return formInlineValidate(fieldNames, props.dispatch, error, 'ProjectDetailForm')
          })
      })

    return props$.combineLatest(props => {
      return {
        onTaskCreate,
        onComment,
        ...props
      }
    })
  }),
  pure
)

const ProjectList = enhance((props) => {
  const {
    location,
    list,
    listLoading,
    filter,
    layout,
    params,
    createDialog,
    updateDialog,
    filterDialog,
    confirmDialog,
    taskDialog,
    commentList,
    taskList,
    onComment,
    taskDetail,
    onTaskCreate
  } = props

  const fromDate = _.get(location, ['query', 'fromDate']) || null
  const toDate = _.get(location, ['query', 'toDate']) || null

  const detailId = _.toInteger(_.get(params, 'id'))

  const filterInitial = {
    date: {
      fromDate: fromDate && moment(fromDate),
      toDate: toDate && moment(toDate)
    }
  }
  // SET SOME VALUES TO INITIAL VALUES MANUALLY
  setInitialValues(filterDialog, filterInitial)

  const listData = {
    data: _.get(list, 'results'),
    loading: listLoading
  }
  const detailData = {
    id: detailId,
    data: _.get(taskDetail, 'detail'),
    loading: _.get(taskDetail, 'detailLoading'),
    comment: _.get(commentList, 'list.results'),
    commentLoading: _.get(commentList, 'loading'),
    onComment
  }

  return (
    <Layout {...layout}>
      <ProjectGridList
        filter={filter}
        listData={listData}
        detailData={detailData}
        createDialog={createDialog}
        updateDialog={updateDialog}
        filterDialog={filterDialog}
        taskDialog={{...taskDialog, taskList, onTaskCreate}}
        confirmDialog={{...confirmDialog, loading: listLoading}}
      />
    </Layout>
  )
})

export default ProjectList
