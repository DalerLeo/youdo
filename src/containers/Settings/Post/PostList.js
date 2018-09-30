import React from 'react'
import _ from 'lodash'
import Layout from '../../../components/Layout/index'
import {compose, pure} from 'recompose'
import * as ROUTER from '../../../constants/routes'
import {
  createWrapper,
  listWrapper,
  detailWrapper,
  updateWrapper,
  confirmWrapper
} from '../../Wrappers'

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

const updateKeys = {
  name: 'name'
}

const enhance = compose(
  listWrapper({
    storeName: 'post',
    listFetchAction: postListFetchAction
  }),
  detailWrapper({
    storeName: 'post',
    paramName: 'postId',
    itemFetchAction: postItemFetchAction
  }),
  createWrapper({
    storeName: 'post',
    formName: 'PostCreateForm',
    createAction: postCreateAction,
    queryKey: POST_CREATE_DIALOG_OPEN
  }),
  updateWrapper({
    updateKeys,
    storeName: 'post',
    formName: 'PostCreateForm',
    updateAction: postUpdateAction,
    itemPath: ROUTER.POST_ITEM_PATH,
    listPath: ROUTER.POST_LIST_URL,
    queryKey: POST_UPDATE_DIALOG_OPEN
  }),
  confirmWrapper({
    storeName: 'users',
    confirmAction: postDeleteAction,
    itemPath: ROUTER.POST_ITEM_PATH,
    listPath: ROUTER.POST_LIST_URL,
    queryKey: POST_DELETE_DIALOG_OPEN,
    successMessage: 'Успешно удалено',
    failMessage: 'Удаление невозможно из-за связи с другими данными'
  }),
  pure
)

const PostList = enhance((props) => {
  const {
    list,
    listLoading,
    detail,
    detailLoading,
    filter,
    layout,
    params,
    createDialog,
    confirmDialog,
    updateDialog
  } = props

  const detailId = _.toInteger(_.get(params, 'postId'))

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
