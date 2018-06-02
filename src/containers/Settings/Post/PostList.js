import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../../components/Layout/index'
import {compose, withHandlers, pure} from 'recompose'
import * as ROUTER from '../../../constants/routes'
import {createWrapper, listWrapper, detailWrapper} from '../../Wrappers'
import toBoolean from '../../../helpers/toBoolean'
import {
  POST_CREATE_DIALOG_OPEN,
  POST_UPDATE_DIALOG_OPEN,
  POST_DELETE_DIALOG_OPEN,
  PostGridList
} from '../../../components/Settings/Post'
import {
  postCreateAction,
  postUpdateAction,
  postListFetchAction,
  postDeleteAction,
  postItemFetchAction
} from '../../../actions/Settings/post'
import {openSnackbarAction} from '../../../actions/snackbar'
import t from '../../../helpers/translate'

const mapDispatchToProps = {
  postUpdateAction,
  postDeleteAction
}

const mapStateToProps = (state, props) => {
  const createLoading = _.get(state, ['post', 'create', 'loading'])
  const updateLoading = _.get(state, ['post', 'update', 'loading'])
  return {
    createLoading,
    updateLoading
  }
}
const enhance = compose(
  listWrapper({listFetchAction: postListFetchAction, storeName: 'post'}),
  detailWrapper({itemFetchAction: postItemFetchAction, storeName: 'post', paramName: 'postId'}),
  createWrapper(postCreateAction, POST_CREATE_DIALOG_OPEN, 'PostCreateForm'),
  connect(mapStateToProps, mapDispatchToProps),

  withHandlers({
    handleOpenConfirmDialog: props => (id) => {
      const {filter} = props
      hashHistory.replace({
        pathname: sprintf(ROUTER.POST_ITEM_PATH, id),
        query: filter.getParams({[POST_DELETE_DIALOG_OPEN]: true})
      })
    },

    handleCloseConfirmDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.replace({pathname, query: filter.getParams({[POST_DELETE_DIALOG_OPEN]: false})})
    },
    handleSendConfirmDialog: props => () => {
      const {dispatch, detail, filter, location: {pathname}} = props
      dispatch(postDeleteAction(detail.id))
        .then(() => {
          hashHistory.replace({pathname, query: filter.getParams({[POST_DELETE_DIALOG_OPEN]: false})})
          props.listFetchAction(filter)
          return dispatch(openSnackbarAction({message: t('Успешно удалено')}))
        })
        .catch(() => {
          return dispatch(openSnackbarAction({message: t('Удаление невозможно из-за связи с другими данными')}))
        })
    },
    handleOpenUpdateDialog: props => (id) => {
      const {filter} = props
      hashHistory.replace({
        pathname: sprintf(ROUTER.POST_ITEM_PATH, id),
        query: filter.getParams({[POST_UPDATE_DIALOG_OPEN]: true})
      })
    },

    handleCloseUpdateDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.replace({pathname, query: filter.getParams({[POST_UPDATE_DIALOG_OPEN]: false})})
    },

    handleSubmitUpdateDialog: props => () => {
      const {dispatch, createForm, filter} = props
      const postId = _.toInteger(_.get(props, ['params', 'postId']))

      return dispatch(postUpdateAction(postId, _.get(createForm, ['values'])))
        .then(() => props.openSnackbarAction({message: t('Успешно сохранено')}))
        .then(() => {
          hashHistory.replace(filter.createURL({[POST_UPDATE_DIALOG_OPEN]: false}))
          props.listFetchAction(filter)
        })
    }
  }),
  pure
)

const PostList = enhance((props) => {
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
    params
  } = props

  const openCreateDialog = toBoolean(_.get(location, ['query', POST_CREATE_DIALOG_OPEN]))
  const openUpdateDialog = toBoolean(_.get(location, ['query', POST_UPDATE_DIALOG_OPEN]))
  const openConfirmDialog = toBoolean(_.get(location, ['query', POST_DELETE_DIALOG_OPEN]))

  const detailId = _.toInteger(_.get(params, 'postId'))

  const createDialog = {
    createLoading,
    openCreateDialog,
    ...props.createDialog
  }

  const confirmDialog = {
    confirmLoading: detailLoading,
    openConfirmDialog: openConfirmDialog,
    handleOpenConfirmDialog: props.handleOpenConfirmDialog,
    handleCloseConfirmDialog: props.handleCloseConfirmDialog,
    handleSendConfirmDialog: props.handleSendConfirmDialog
  }

  const updateDialog = {
    initialValues: (() => {
      if (!detail || openCreateDialog) {
        return {}
      }
      return {
        name: _.get(detail, 'name')
      }
    })(),
    updateLoading: detailLoading || updateLoading,
    openUpdateDialog,
    handleOpenUpdateDialog: props.handleOpenUpdateDialog,
    handleCloseUpdateDialog: props.handleCloseUpdateDialog,
    handleSubmitUpdateDialog: props.handleSubmitUpdateDialog
  }

  const listData = {
    data: list,
    listLoading
  }

  const detailData = {
    id: detailId,
    data: detail,
    detailLoading
  }

  return (
    <Layout {...layout}>
      <PostGridList
        filter={filter}
        listData={listData}
        detailData={detailData}
        createDialog={createDialog}
        confirmDialog={confirmDialog}
        updateDialog={updateDialog}
      />
    </Layout>
  )
})

export default PostList
