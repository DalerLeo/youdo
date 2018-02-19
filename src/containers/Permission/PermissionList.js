import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import filterHelper from '../../helpers/filter'
import {
    PermissionGridList
} from '../../components/Permission'
import {
    permissionListFetchAction,
    permissionItemFetchAction,
    setDateAction
} from '../../actions/permission'
import {openSnackbarAction} from '../../actions/snackbar'
import {getPermName} from '../../constants/permissionTime'
import t from '../../helpers/translate'

const SET_DATE_DIALOG_DATE = 'openSetDateDialog'

const enhance = compose(
    connect((state, props) => {
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
    }),
    withPropsOnChange((props, nextProps) => {
        const except = {
            openSetDateDialog: null
        }
        return props.list && props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
    }, ({dispatch, filter}) => {
        dispatch(permissionListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const itemId = _.get(nextProps, ['params', 'itemId'])
        return itemId && _.get(props, ['params', 'itemId']) !== itemId
    }, ({dispatch, params}) => {
        const itemId = _.toInteger(_.get(params, 'itemId'))
        itemId && dispatch(permissionItemFetchAction(itemId))
    }),

    withHandlers({
        handleOpenSetDateDialog: props => (id) => {
            const {filter, location: {pathname}} = props
            hashHistory.push({pathname, query: filter.getParams({[SET_DATE_DIALOG_DATE]: id})})
        },

        handleCloseSetDateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[SET_DATE_DIALOG_DATE]: false})})
        },

        handleSubmitSetDateDialog: props => () => {
            const {dispatch, setDateForm, filter, location: {pathname}} = props
            const permissionId = _.toInteger(_.get(props, ['query', 'openSetDateDialog']))
            return dispatch(setDateAction(_.get(setDateForm, ['values']), permissionId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[SET_DATE_DIALOG_DATE]: false})})
                    dispatch(permissionListFetchAction(filter))
                })
        }
    })
)

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
