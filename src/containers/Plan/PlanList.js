import React from 'react'
import _ from 'lodash'
import {compose, withHandlers, pure} from 'recompose'
import {connect} from 'react-redux'
import Layout from '../../components/Layout'
import * as actionType from '../../constants/actionTypes'
import setInitialValues from '../../helpers/setInitialValues'
import {
  listWrapper,
  detailWrapper,
  createWrapper,
  updateWrapper,
  confirmWrapper,
  filterWrapper
} from '../Wrappers'
import {updateDetailStore, updateStore} from '../../helpers/updateStore'
import toCamelCase from '../../helpers/toCamelCase'
import moment from 'moment'
import {
  PLAN_CREATE_DIALOG_OPEN,
  PLAN_UPDATE_DIALOG_OPEN,
  PLAN_DELETE_DIALOG_OPEN,
  PLAN_FILTER_KEY,
  PLAN_FILTER_OPEN,
  PLAN_MAIL_DIALOG_OPEN,
  PlanGridList
} from '../../components/Plan'
import {
  planCreateAction,
  planUpdateAction,
  planListFetchAction,
  planDeleteAction,
  planItemFetchAction
} from '../../actions/plan'
import {openSnackbarAction} from '../../actions/snackbar'
import {openErrorAction} from '../../actions/error'
import * as ROUTES from '../../constants/routes'

const updateKeys = {
  'manager': 'manager.id',
  'salesAmount': 'salesAmount',
  'comment': 'comment'
}

const except = {
  openMailDialog: null
}
const mapDispatchToProps = {
  updateDetailStore,
  updateStore,
  openErrorAction
}

const mapStateToProps = () => ({})

const enhance = compose(
  listWrapper({
    except,
    storeName: 'plan',
    listFetchAction: planListFetchAction
  }),
  detailWrapper({
    storeName: 'plan',
    itemFetchAction: planItemFetchAction
  }),
  createWrapper({
    storeName: 'plan',
    formName: 'PlanCreateForm',
    createAction: planCreateAction,
    queryKey: PLAN_CREATE_DIALOG_OPEN,
    thenActionKey: PLAN_MAIL_DIALOG_OPEN
  }),
  updateWrapper({
    updateKeys,
    storeName: 'plan',
    formName: 'PlanCreateForm',
    updateAction: planUpdateAction,
    queryKey: PLAN_UPDATE_DIALOG_OPEN,
    itemPath: ROUTES.PLAN_ITEM_PATH,
    listPath: ROUTES.PLAN_LIST_URL
  }),
  confirmWrapper({
    storeName: 'plan',
    confirmAction: planDeleteAction,
    queryKey: PLAN_DELETE_DIALOG_OPEN,
    itemPath: ROUTES.PLAN_ITEM_PATH,
    listPath: ROUTES.PLAN_LIST_URL,
    successMessage: 'Успешно удалено',
    failMessage: 'Удаление невозможно из-за связи с другими данными'
  }),
  filterWrapper({
    formName: 'PlanFilterForm',
    queryKey: PLAN_FILTER_OPEN,
    filterKeys: PLAN_FILTER_KEY
  }),
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({

    handleSubmitUpdateDialog: props => (fieldNames) => {
      const {detail, list} = props
      const id = _.toInteger(_.get(props, ['params', 'id']))
      return props.planUpdateAction(id, detail)
        .then(({value}) => {
          const formedValue = toCamelCase(value)
          props.updateDetailStore(actionType.PLAN_ITEM, formedValue)
          return props.updateStore(id, list, actionType.PLAN_LIST, {
            firstName: _.get(formedValue, 'firstName'),
            lastName: _.get(formedValue, 'lastName'),
            secondName: _.get(formedValue, 'secondName'),
            resumeNum: _.get(formedValue, 'resumeNum'),
            updatedAt: _.get(formedValue, 'updatedAt'),
            balance: _.get(formedValue, 'balance')
          })
        })
        .then(() => openSnackbarAction({message: 'Успешно сохранено'}))
        .catch(error => props.openErrorAction({message: error}))
    }
  }),
  pure
)

const PlanList = enhance((props) => {
  const {
    location,
    list,
    listLoading,
    detail,
    detailLoading,
    filter,
    layout,
    params,
    createDialog,
    updateDialog,
    filterDialog
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
  const UpdateInitial = {
    period: {
      fromDate: _.get(detail, 'fromDate') && moment(_.get(detail, 'fromDate')),
      toDate: _.get(detail, 'toDate') && moment(_.get(detail, 'toDate'))

    }
  }
  // SET SOME VALUES TO INITIAL VALUES MANUALLY
  setInitialValues(filterDialog, filterInitial)
  setInitialValues(updateDialog, UpdateInitial)

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
      <PlanGridList
        filter={filter}
        listData={listData}
        detailData={detailData}
        createDialog={createDialog}
        updateDialog={updateDialog}
        filterDialog={filterDialog}
        confirmDialog={{...props.confirmDialog, loading: listLoading}}
      />
    </Layout>
  )
})

export default PlanList
