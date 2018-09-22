import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import {reset} from 'redux-form'
import {hashHistory} from 'react-router'
import Layout from '../../../components/Layout'
import {compose, withHandlers} from 'recompose'
import * as ROUTER from '../../../constants/routes'
import toBoolean from '../../../helpers/toBoolean'
import {
  ARTICLES_CREATE_DIALOG_OPEN,
  ARTICLES_UPDATE_DIALOG_OPEN,
  ARTICLES_DELETE_DIALOG_OPEN,
  ArticlesGridList
} from '../../../components/Administration/Articles'
import {listWrapper, detailWrapper} from '../../Wrappers'

import {
  articlesCreateAction,
  articlesUpdateAction,
  articlesListFetchAction,
  articlesDeleteAction,
  articlesItemFetchAction
} from '../../../actions/Administration/articles'
import {openSnackbarAction} from '../../../actions/snackbar'
import t from '../../../helpers/translate'

const enhance = compose(

  listWrapper({listFetchAction: articlesListFetchAction, storeName: 'articles'}),
  detailWrapper({itemFetchAction: articlesItemFetchAction, storeName: 'articles', paramName: 'articleId'}),
  connect((state, props) => {
    const createLoading = _.get(state, ['articles', 'create', 'loading'])
    const updateLoading = _.get(state, ['articles', 'update', 'loading'])
    const createForm = _.get(state, ['form', 'ArticlesCreateForm'])

    return {
      createLoading,
      updateLoading,
      createForm
    }
  }),

  withHandlers({
    handleActionEdit: props => () => {
      return null
    },

    handleOpenConfirmDialog: props => (id) => {
      const {filter} = props
      hashHistory.push({
        pathname: sprintf(ROUTER.ARTICLES_ITEM_PATH, id),
        query: filter.getParams({[ARTICLES_DELETE_DIALOG_OPEN]: true})
      })
    },

    handleCloseConfirmDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[ARTICLES_DELETE_DIALOG_OPEN]: false})})
    },
    handleSendConfirmDialog: props => () => {
      const {dispatch, detail, filter, location: {pathname}} = props
      dispatch(articlesDeleteAction(detail.id))
        .then(() => {
          hashHistory.push({pathname, query: filter.getParams({[ARTICLES_DELETE_DIALOG_OPEN]: false})})
          dispatch(articlesListFetchAction(filter))
          return dispatch(openSnackbarAction({message: t('Успешно удалено')}))
        })
        .catch(() => {
          return dispatch(openSnackbarAction({message: t('Удаление невозможно из-за связи с другими данными')}))
        })
    },

    handleOpenCreateDialog: props => () => {
      const {dispatch, location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[ARTICLES_CREATE_DIALOG_OPEN]: true})})
      dispatch(reset('ArticlesCreateForm'))
    },

    handleCloseCreateDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[ARTICLES_CREATE_DIALOG_OPEN]: false})})
    },

    handleSubmitCreateDialog: props => () => {
      const {dispatch, createForm, filter, location: {pathname}} = props

      return dispatch(articlesCreateAction(_.get(createForm, ['values'])))
        .then(() => {
          return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
        })
        .then(() => {
          hashHistory.push({pathname, query: filter.getParams({[ARTICLES_CREATE_DIALOG_OPEN]: false})})
          dispatch(articlesListFetchAction(filter))
        })
    },

    handleOpenUpdateDialog: props => (id) => {
      const {filter} = props
      hashHistory.push({
        pathname: sprintf(ROUTER.ARTICLES_ITEM_PATH, id),
        query: filter.getParams({[ARTICLES_UPDATE_DIALOG_OPEN]: true})
      })
    },

    handleCloseUpdateDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[ARTICLES_UPDATE_DIALOG_OPEN]: false})})
    },

    handleSubmitUpdateDialog: props => () => {
      const {dispatch, createForm, filter} = props
      const articleId = _.toInteger(_.get(props, ['params', 'articleId']))

      return dispatch(articlesUpdateAction(articleId, _.get(createForm, ['values'])))
        .then(() => {
          return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
        })
        .then(() => {
          hashHistory.push(filter.createURL({[ARTICLES_UPDATE_DIALOG_OPEN]: false}))
          dispatch(articlesListFetchAction(filter))
        })
    }
  })
)

const ArticlesList = enhance((props) => {
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

  const openCreateDialog = toBoolean(_.get(location, ['query', ARTICLES_CREATE_DIALOG_OPEN]))
  const openUpdateDialog = toBoolean(_.get(location, ['query', ARTICLES_UPDATE_DIALOG_OPEN]))
  const openConfirmDialog = toBoolean(_.get(location, ['query', ARTICLES_DELETE_DIALOG_OPEN]))

  const detailId = _.toInteger(_.get(params, 'articleId'))

  const createDialog = {
    createLoading,
    openCreateDialog,
    handleOpenCreateDialog: props.handleOpenCreateDialog,
    handleCloseCreateDialog: props.handleCloseCreateDialog,
    handleSubmitCreateDialog: props.handleSubmitCreateDialog
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
        title: _.get(detail, 'title'),
        text: _.get(detail, 'text')
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
    detailLoading
  }

  return (
    <Layout {...layout}>
      <ArticlesGridList
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

export default ArticlesList
