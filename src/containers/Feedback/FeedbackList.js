import React from 'react'
import _ from 'lodash'
import Layout from '../../components/Layout'
import {compose} from 'recompose'
import {
  listWrapper
} from '../Wrappers'

import {
  FeedbackGridList
} from './component'
import {
  feedbackListFetchAction
} from './actions/service'

const enhance = compose(
  listWrapper({
    storeName: 'feedback',
    listFetchAction: feedbackListFetchAction
  })
)

const FeedbackList = enhance((props) => {
  const {
    list,
    listLoading,
    filter,
    layout
  } = props

  const listData = {
    data: _.get(list, 'results'),
    listLoading
  }

  return (
    <Layout {...layout}>
      <FeedbackGridList
        filter={filter}
        listData={listData}
      />
    </Layout>
  )
})

export default FeedbackList
