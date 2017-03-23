import _ from 'lodash'
import React from 'react'
import {compose, withHandlers, withPropsOnChange, withState} from 'recompose'
import {connect} from 'react-redux'
import {toastr} from 'react-redux-toastr'
import {hashHistory} from 'react-router'
import {toasterError} from '../../helpers/apiErrorsHandler'
import * as ROUTE from '../../constants/routes'
import Layout from '../../components/Layout'
import MonthlyReportForm from '../../components/MonthlyReportForm'
import {monthlyReportItemFetchAction,
        monthlyReportItemEditAction,
        monthlyReportItemDeleteAction} from '../../actions/monthly'

const enhance = compose(
    connect((state) => {
        const fetchItemLoading = _.get(state, ['monthlyReport', 'item', 'loading'])
        const editItemLoading = _.get(state, ['monthlyReport', 'edit', 'loading'])
        const item = _.get(state, ['monthlyReport', 'item', 'data'])
        const form = _.get(state, ['form', 'MonthlyReportForm'])

        return {
            loading: fetchItemLoading || editItemLoading,
            item,
            form
        }
    }),
    withPropsOnChange((props, nextProps) => {
        const prevMrId = _.get(props, ['params', 'monthlyReportId'])
        const nextMrId = _.get(nextProps, ['params', 'monthlyReportId'])
        return prevMrId !== nextMrId
    }, ({dispatch, filter, params}) => {
        const monthlyReportId = _.get(params, 'monthlyReportId')

        dispatch(monthlyReportItemFetchAction(monthlyReportId, filter))
    }),

    withState('deleteDialogOpen', 'setDeleteDialogOpen', false),

    withHandlers({
        onSubmit: props => (event) => {
            event.preventDefault()
            const {dispatch, form, item} = props
            const monthlyReportId = _.get(item, 'id')

            dispatch(monthlyReportItemEditAction(monthlyReportId, form.values))
                .then(() => {
                    toastr.success('Success', 'Data is successfully saved')
                    hashHistory.push(ROUTE.MONTHLY_REPORT_LIST_URL)
                })
                .catch((response) => {
                    toastr.error('Invalid data', toasterError(response))
                })
        },

        handleOpenDialog: props => (event) => {
            event.preventDefault()
            const {setDeleteDialogOpen} = props
            setDeleteDialogOpen(true)
        },

        handleCloseDialog: props => (event) => {
            event.preventDefault()
            const {setDeleteDialogOpen} = props
            setDeleteDialogOpen(false)
        },

        handleDeleteDialog: props => (event) => {
            event.preventDefault()
            const {dispatch, item, setDeleteDialogOpen} = props
            const monthlyReportId = _.get(item, 'id')

            setDeleteDialogOpen(false)

            dispatch(monthlyReportItemDeleteAction(monthlyReportId))
                .then(() => {
                    toastr.success('Success', 'Successfully deleted')
                    hashHistory.push(ROUTE.MONTHLY_REPORT_LIST_URL)
                })
                .catch((response) => {
                    toastr.error('Invalid data', toasterError(response))
                })
        }
    })
)

const MonthlyReportEdit = enhance((props) => {
    const {layout, loading, item, onSubmit} = props
    const title = 'MONTHLY REPORT EDIT'
    const deleteConfirmDialog = {
        open: props.deleteDialogOpen,
        handleOpen: props.handleOpenDialog,
        handleClose: props.handleCloseDialog,
        handleDelete: props.handleDeleteDialog
    }
    const formInitialValues = {
        account: {
            id: _.get(item, 'account'),
            title: _.get(item, 'account_number')
        },
        grossBalance: _.get(item, 'gross_balance'),
        grossProfit: _.get(item, 'gross_profit'),
        month: _.get(item, 'month'),
        mtm: _.get(item, 'mtm'),
        openingBalance: _.get(item, 'opening_balance'),
        year: _.get(item, 'year')
    }

    return (
        <Layout {...layout}>
            <div>
                <MonthlyReportForm
                    title={title}
                    loading={loading}
                    onSubmit={onSubmit}
                    initialValues={formInitialValues}
                    deleteConfirmDialog={deleteConfirmDialog}
                />
            </div>
        </Layout>
    )
})

export default MonthlyReportEdit

