import _ from 'lodash'
import React from 'react'
import {compose, withHandlers, withPropsOnChange, withState} from 'recompose'
import {connect} from 'react-redux'
import {toastr} from 'react-redux-toastr'
import {hashHistory} from 'react-router'
import {toasterError} from '../../helpers/apiErrorsHandler'
import * as ROUTE from '../../constants/routes'
import Layout from '../../components/Layout'
import BrokerFrom from '../../components/BrokerForm'
import {brokerItemFetchAction, brokerItemEditAction, brokerItemDeleteAction} from '../../actions/broker'

const enhance = compose(
    connect((state) => {
        const fetchItemLoading = _.get(state, ['broker', 'item', 'loading'])
        const editItemLoading = _.get(state, ['broker', 'edit', 'loading'])
        const item = _.get(state, ['broker', 'item', 'data'])
        const form = _.get(state, ['form', 'BrokerForm'])

        return {
            loading: fetchItemLoading || editItemLoading,
            item,
            form
        }
    }),
    withPropsOnChange((props, nextProps) => {
        const prevBrokerId = _.get(props, ['params', 'brokerId'])
        const nextBrokerId = _.get(nextProps, ['params', 'brokerId'])
        return prevBrokerId !== nextBrokerId
    }, ({dispatch, filter, params}) => {
        const brokerId = _.get(params, 'brokerId')

        dispatch(brokerItemFetchAction(brokerId, filter))
    }),

    withState('deleteDialogOpen', 'setDeleteDialogOpen', false),

    withHandlers({
        onSubmit: props => (event) => {
            event.preventDefault()
            const {dispatch, form, item} = props
            const brokerId = _.get(item, 'id')

            dispatch(brokerItemEditAction(brokerId, form.values))
                .then(() => {
                    toastr.success('Success', 'Data is successfully saved')
                    hashHistory.push(ROUTE.BROKER_LIST_URL)
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
            const brokerId = _.get(item, 'id')

            setDeleteDialogOpen(false)

            dispatch(brokerItemDeleteAction(brokerId))
                .then(() => {
                    toastr.success('Success', 'Successfully deleted')
                    hashHistory.push(ROUTE.BROKER_LIST_URL)
                })
                .catch((response) => {
                    toastr.error('Invalid data', toasterError(response))
                })
        }
    })
)

const BrokerEdit = enhance((props) => {
    const {layout, loading, item, onSubmit} = props
    const title = 'BROKER EDIT'
    const deleteConfirmDialog = {
        open: props.deleteDialogOpen,
        handleOpen: props.handleOpenDialog,
        handleClose: props.handleCloseDialog,
        handleDelete: props.handleDeleteDialog
    }
    const formInitialValues = {
        name: _.get(item, 'name')
    }

    return (
        <Layout {...layout}>
            <div>
                <BrokerFrom
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

export default BrokerEdit
