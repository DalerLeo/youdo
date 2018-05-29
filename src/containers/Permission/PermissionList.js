import React from 'react'
import _ from 'lodash'
import fp from 'lodash/fp'
import moment from 'moment'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withHandlers, mapPropsStream, pure} from 'recompose'
import filterHelper from '../../helpers/filter'
import {PermissionGridList} from '../../components/Settings/Permission'
import {
  permissionListFetchAction,
  permissionItemFetchAction,
  setDateAction
} from '../../actions/permission'
import {compareFilterByProps} from '../../helpers/get'

import {getPermName} from '../../constants/permissionTime'
import t from '../../helpers/translate'
import {openSnackbarAction} from '../../actions/snackbar'

const SET_DATE_DIALOG_DATE = 'openSetDateDialog'

const mapStateToProps = (state, props) => {
  const query = _.get(props, ['location', 'query'])
  const pathname = _.get(props, ['location', 'pathname'])
  const detail = _.get(state, ['access', 'item', 'data'])
  const detailLoading = _.get(state, ['access', 'item', 'loading'])
  const list = _.get(state, ['access', 'list', 'data'])
  const listLoading = _.get(state, ['access', 'list', 'loading'])
  const setDateForm = _.get(state, ['form', 'SetDateDialogForm'])
  const filter = filterHelper(list, pathname, query)

  return {
    list,
    listLoading,
    detail,
    detailLoading,
    filter,
    setDateForm,
    query
  }
}

const mapDispatchToProps = {
  permissionListFetchAction,
  permissionItemFetchAction,
  setDateAction,
  openSnackbarAction
}
const except = {
  openSetDateDialog: null
}
const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),

  // Fetch actions
  mapPropsStream(props$ => {
    props$
      .distinctUntilChanged((prev, next) => compareFilterByProps(prev, next, except))
      .subscribe(({filter, ...props}) => props.permissionListFetchAction(filter))

    props$
      .filter(fp.get('params.itemId'))
      .distinctUntilChanged(null, fp.get('params.itemId'))
      .subscribe(props => {
        const itemId = fp.flow(fp.get('params.itemId'), fp.toInteger)
        props.permissionItemFetchAction(itemId(props))
      })
  }),

  withHandlers({
    handleOpenSetDateDialog: ({filter, location: {pathname}}) => (id) => {
      hashHistory.push({pathname, query: filter.getParams({[SET_DATE_DIALOG_DATE]: id})})
    },

    handleCloseSetDateDialog: ({location: {pathname}, filter}) => () => {
      hashHistory.push({pathname, query: filter.getParams({[SET_DATE_DIALOG_DATE]: false})})
    },

    handleSubmitSetDateDialog: ({setDateForm, filter, location: {pathname}, ...props}) => () => {
      const permissionId = _.toInteger(_.get(props, ['query', 'openSetDateDialog']))

      return props.setDateAction(_.get(setDateForm, ['values']), permissionId)
        .then(() => props.openSnackbarAction({message: t('Успешно сохранено')}))
        .then(() => {
          hashHistory.push(
            {
              pathname,
              query: filter.getParams({[SET_DATE_DIALOG_DATE]: false
              })
            })
          props.permissionListFetchAction(filter)
        })
    }
  }),
  pure)

const PermissionList = enhance((props) => {
  const {
    location,
    list,
    listLoading,
    filter,
    layout
  } = props

  const openSetDateDialog = _.toInteger(_.get(location, ['query', SET_DATE_DIALOG_DATE]))

  const listData = {
    data: _.get(list, 'results'),
    listLoading
  }
  const detail = _.find(_.get(list, 'results'), {'id': openSetDateDialog})

  const setDateDialog = {
    initialValues: (() => {
      if (!detail) {
        return {}
      }
      return {
        status: {
          text: getPermName[_.toInteger(_.get(detail, 'status'))],
          value: _.toInteger(_.get(detail, 'status'))
        },
        fromTime: moment(_.get(detail, 'fromTime'), 'HH:mm:ss').toDate(),
        toTime: moment(_.get(detail, 'toTime'), 'HH:mm:ss').toDate()
      }
    })(),
    open: openSetDateDialog,
    handleOpenSetDateDialog: props.handleOpenSetDateDialog,
    handleCloseSetDateDialog: props.handleCloseSetDateDialog,
    handleSubmitSetDateDialog: props.handleSubmitSetDateDialog
  }

  return (
    <Layout {...layout}>
      <PermissionGridList
        filter={filter}
        listData={listData}
        setDateDialog={setDateDialog}
      />
    </Layout>
  )
})

export default PermissionList
