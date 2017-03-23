import _ from 'lodash'
import React from 'react'
import {connect} from 'react-redux'
import {toastr} from 'react-redux-toastr'
import {hashHistory} from 'react-router'
import {toasterError} from '../../helpers/apiErrorsHandler'
import Layout from '../../components/Layout'
import ClientCreateForm from '../../components/ClientCreateForm'
import * as ROUTE from '../../constants/routes'
import {clientEntryAction} from '../../actions/clientCreate'

const ClientCreate = (props) => {
    const {dispatch, loading, form, layout} = props
    const onSubmit = (event) => {
        event.preventDefault()
        dispatch(clientEntryAction(form.values))
            .then(() => {
                toastr.success('Success', 'Data is successfully saved')
                hashHistory.push(ROUTE.CLIENT_LIST)
            })
            .catch((response) => {
                toastr.error('Invalid data', toasterError(response))
            })
    }

    return (
        <Layout {...layout}>
            <ClientCreateForm loading={loading} onSubmit={onSubmit} />
        </Layout>
    )
}

export default connect((state) => {
    return {
        loading: _.get(state, ['client', 'create', 'loading']),
        form: _.get(state, ['form', 'ClientCreate'])
    }
})(ClientCreate)
