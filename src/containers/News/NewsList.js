import React from 'react'
import _ from 'lodash'
import Layout from '../../components/Layout'
import {compose} from 'recompose'
import {
  NewsGridList
} from './components'
import {
  listWrapper,
  detailWrapper,
  createWrapper,
  updateWrapper
} from '../Wrappers'

import {
  articlesCreateAction,
  articlesUpdateAction,
  articlesListFetchAction,
  articlesDeleteAction,
  articlesItemFetchAction
} from './actions/news'
import confirmWrapper from '../Wrappers/ConfirmWrapper'

const updateKeys = {
  photo: 'image',
  title: 'title',
  text: 'text',
  intro: 'intro'
}

const enhance = compose(
  listWrapper({
    listFetchAction: articlesListFetchAction,
    storeName: 'articles'
  }),
  detailWrapper({
    itemFetchAction: articlesItemFetchAction,
    storeName: 'articles',
    paramName: 'articleId'
  }),
  createWrapper({
    createAction: articlesCreateAction,
    formName: 'ArticlesCreateForm',
    storeName: 'articles.create'
  }),
  updateWrapper({
    updateKeys,
    updateAction: articlesUpdateAction,
    formName: 'ArticlesCreateForm',
    storeName: 'articles'
  }),
  confirmWrapper({
    storeName: 'articles',
    confirmAction: articlesDeleteAction,
    successMessage: 'Успешно удалено',
    failMessage: 'Удаление невозможно из-за связи с другими данными'
  })
)

const NewsList = enhance((props) => {
  const {
    list,
    listLoading,
    detail,
    detailLoading,
    filter,
    layout,
    params
  } = props

  const detailId = _.toInteger(_.get(params, 'articleId'))

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
      <NewsGridList
        filter={filter}
        listData={listData}
        detailData={detailData}
        createDialog={props.createDialog}
        confirmDialog={props.confirmDialog}
        updateDialog={props.updateDialog}
      />
    </Layout>
  )
})

export default NewsList
