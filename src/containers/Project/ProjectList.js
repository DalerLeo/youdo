import React from 'react'
import _ from 'lodash'
import {compose, pure, mapPropsStream, createEventHandler} from 'recompose'
import {connect} from 'react-redux'
import {reset} from 'redux-form'
// .import getDocument from 'helpers/getDocument'
import Layout from '../../components/Layout'
import {compareFilterByProps} from '../../helpers/get'
import {
  listWrapper,
  detailWrapper,
  createWrapper,
  confirmWrapper
} from '../Wrappers'
import {formInlineValidate} from 'helpers/formValidate'
import {updateDetailStore, updateStore} from '../../helpers/updateStore'
import {
  PROJECT_CREATE_DIALOG_OPEN,
  PROJECT_DELETE_DIALOG_OPEN,
  PROJECT_TASK_DIALOG_OPEN,
  ProjectGridList
} from '../../components/Project'
import {
  projectCreateAction,
  projectListFetchAction,
  projectDeleteAction,
  taskListFetchAction,
  taskItemFetchAction,
  commentListFetchAction,
  taskCreateAction,
  taskUpdateAction,
  taskListClear,
  commentCreateAction
} from '../../actions/project'
import {openErrorAction} from '../../actions/error'
import * as ROUTES from '../../constants/routes'
import {hashHistory} from 'react-router'

const except = {
  openMailDialog: null,
  project: null,
  taskOpen: null,
  ordering: null
}

const exceptTask = {
  taskOpen: null,
  openCreateDialog: null,
  worker: null,
  page: null
}
const mapDispatchToProps = {
  updateDetailStore,
  updateStore,
  openErrorAction,
  taskListFetchAction,
  taskListClear,
  taskItemFetchAction,
  commentListFetchAction,
  commentCreateAction,
  taskCreateAction,
  taskUpdateAction,
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

  connect(mapStateToProps, mapDispatchToProps),

  mapPropsStream(props$ => {
    props$
      .distinctUntilChanged((next, prev) => {
        return _.isEqual(_.get(next, 'list.results'), _.get(prev, 'list.results'))
      })
      .filter((props) => !props.filter.getParam('project'))
      .subscribe(({filter, list, location: {pathname}, ...props}) => {
        const project = _.get(list, 'results.0.id')
        return hashHistory.replace({
          pathname,
          query: filter.getParams({project})
        })
      })

    props$
      .distinctUntilChanged(compareFilterByProps(exceptTask))
      .subscribe(({filter, ...props}) => {
        const id = filter.getParam('project')
        if (id) {
          return props.taskListFetchAction(id, filter)
        }
        return props.taskListClear()
      })

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
    const {handler: onTaskClose, stream: onTaskClose$} = createEventHandler()
    const {handler: onTaskUpdate, stream: onTaskUpdate$} = createEventHandler()
    const {handler: onFilterSubmit, stream: onFilterSubmit$} = createEventHandler()
    // .   const {handler: onGetFile, stream: onGetFile$} = createEventHandler()

    onTaskCreate$
      .withLatestFrom(props$)
      .subscribe(([fieldNames, {filter, location: {pathname}, taskForm, ...props}]) => {
        const pId = filter.getParam('project')
        return props.taskCreateAction(pId, taskForm)
          .then(() => props.resetForm('TaskForm'))
          .then(() => {
            props.taskListFetchAction(pId, filter)
            props.taskDialog.onClose()
          })
          .catch(error => {
            return formInlineValidate(fieldNames, props.dispatch, error, 'TaskForm')
          })
      })

    onTaskUpdate$
      .withLatestFrom(props$)
      .subscribe(([fieldNames, {filter, location: {pathname}, params, commentForm, ...props}]) => {
        const pId = _.toNumber(filter.getParam('project'))
        const taskId = _.toNumber(_.get(params, 'id'))
        return props.taskUpdateAction(pId, taskId, commentForm)
          .then(() => {
            props.taskListFetchAction(pId, filter)
          })
          .catch(error => {
            return formInlineValidate(fieldNames, props.dispatch, error, 'ProjectDetailForm')
          })
      })

    onTaskClose$
      .withLatestFrom(props$)
      .subscribe(([fieldNames, {filter, resetForm, params, ...props}]) => {
        props.taskItemFetchAction(filter.getParam('project'), params.id)
        hashHistory.replace({pathname: ROUTES.PROJECT_LIST_URL, query: filter.getParams()})
        return resetForm('ProjectDetailForm')
      })

    onFilterSubmit$
      .withLatestFrom(props$)
      .subscribe(([value, {filter, resetForm}]) => {
        filter.filterBy({
          workers: value
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
            props.taskListFetchAction(pId, filter)
          })
          .catch(error => {
            return formInlineValidate(fieldNames, props.dispatch, error, 'ProjectDetailForm')
          })
      })

    return props$.combineLatest(props => {
      return {
        onTaskClose,
        onTaskCreate,
        onTaskUpdate,
        onComment,
        onFilterSubmit,
        ...props
      }
    })
  }),
  pure
)

const ProjectList = enhance((props) => {
  const {
    list,
    listLoading,
    filter,
    layout,
    params,
    createDialog,
    confirmDialog,
    taskDialog,
    commentList,
    taskList,
    onComment,
    taskDetail,
    onTaskCreate,
    onTaskClose,
    onTaskUpdate,
    onFilterSubmit
  } = props

  const detailId = _.toInteger(_.get(params, 'id'))
  const worker = filter.getParam('worker') ? _.toNumber(filter.getParam('worker')) : ''
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
    onComment,
    initialValues: {
      worker: _.get(taskDetail, 'detail.worker.id'),
      deadline: _.get(taskDetail, 'detail.deadline') && new Date(_.get(taskDetail, 'detail.deadline')),
      description: _.get(taskDetail, 'detail.description')
    }
  }

  return (
    <Layout {...layout}>
      <ProjectGridList
        filter={filter}
        listData={listData}
        detailData={detailData}
        createDialog={createDialog}
        taskDialog={{...taskDialog, taskList, onTaskCreate, onTaskClose, onTaskUpdate}}
        confirmDialog={{...confirmDialog, loading: listLoading}}
        onFilterSubmit={onFilterSubmit}
        initialValues={{worker}}
      />
    </Layout>
  )
})

export default ProjectList
