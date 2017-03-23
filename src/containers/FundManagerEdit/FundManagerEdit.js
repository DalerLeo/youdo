import _ from 'lodash'
import React from 'react'
import {compose, withHandlers, withPropsOnChange, withState} from 'recompose'
import {connect} from 'react-redux'
import {toastr} from 'react-redux-toastr'
import {hashHistory} from 'react-router'
import {toasterError} from '../../helpers/apiErrorsHandler'
import * as ROUTE from '../../constants/routes'
import Layout from '../../components/Layout'
import FundManagerForm from '../../components/FundManagerForm'
import {fundManagerItemFetchAction, fundManagerItemEditAction, fundManagerItemDeleteAction} from '../../actions/fundManager'

const enhance = compose(
    connect((state) => {
        console.log(state)
        const fetchItemLoading = _.get(state, ['fundManager', 'item', 'loading'])
        const editItemLoading = _.get(state, ['fundManager', 'edit', 'loading'])
        const item = _.get(state, ['fundManager', 'item', 'data'])
        const form = _.get(state, ['form', 'FundManagerForm'])

        return {
            loading: fetchItemLoading || editItemLoading,
            item,
            form
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const prevFmId = _.get(props, ['params', 'fundManagerId'])
        const nextFmId = _.get(nextProps, ['params', 'fundManagerId'])
        return prevFmId !== nextFmId
    }, ({dispatch, filter, params}) => {
        const fundManagerId = _.get(params, 'fundManagerId')

        dispatch(fundManagerItemFetchAction(fundManagerId, filter))
    }),

    withState('deleteDialogOpen', 'setDeleteDialogOpen', false),

    withHandlers({
        onSubmit: props => (event) => {
            event.preventDefault()
            const {dispatch, form, item} = props
            const fundManagerId = _.get(item, 'id')

            dispatch(fundManagerItemEditAction(fundManagerId, form.values))
                .then(() => {
                    toastr.success('Success', 'Data is successfully saved')
                    hashHistory.push(ROUTE.FUND_MANAGER_LIST_URL)
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
            const fundManagerId = _.get(item, 'id')

            setDeleteDialogOpen(false)
            dispatch(fundManagerItemDeleteAction(fundManagerId))
                .then(() => {
                    toastr.success('Success', 'Successfully deleted')
                    hashHistory.push(ROUTE.FUND_MANAGER_LIST_URL)
                })
                .catch((response) => {
                    toastr.error('Invalid data', toasterError(response))
                })
        }
    })
)

const FundManagerEdit = enhance((props) => {
    const {layout, loading, item, onSubmit} = props
    const title = 'FUND MANAGER EDIT'
    const deleteConfirmDialog = {
        open: props.deleteDialogOpen,
        handleOpen: props.handleOpenDialog,
        handleClose: props.handleCloseDialog,
        handleDelete: props.handleDeleteDialog
    }
    const formInitialValues = {
        username: _.get(item, 'username'),
        firstName: _.get(item, 'first_name'),
        secondName: _.get(item, 'second_name')
    }
    return (
        <Layout {...layout}>
            <div>
                <FundManagerForm
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

export default FundManagerEdit

