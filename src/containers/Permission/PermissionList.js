import React from 'react'
import _ from 'lodash'
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
import {openErrorAction} from '../../actions/error'
import {getPermName} from '../../constants/permissionTime'

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
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
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
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[SET_DATE_DIALOG_DATE]: false})})
                    dispatch(permissionListFetchAction(filter))
                })
                .catch((error) => {
                    const errorWhole = _.map(error, (item, index) => {
                        return <p style={{marginBottom: '10px'}}>{(index !== 'non_field_errors' || _.isNumber(index)) &&
                        <b style={{textTransform: 'uppercase'}}>{index}:</b>} {item}</p>
                    })

                    dispatch(openErrorAction({
                        message: <div style={{padding: '0 30px'}}>
                            {errorWhole}
                        </div>
                    }))
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
                fromTime: _.get(detail, 'fromTime'),
                toTime: _.get(detail, 'toTime')
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
