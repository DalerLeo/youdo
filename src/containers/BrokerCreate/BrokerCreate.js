import _ from 'lodash'
import React from 'react'
import {connect} from 'react-redux'
import {toastr} from 'react-redux-toastr'
import {hashHistory} from 'react-router'
import {toasterError} from '../../helpers/apiErrorsHandler'
import * as ROUTE from '../../constants/routes'
import Layout from '../../components/Layout'
import BrokerFrom from '../../components/BrokerForm'
import {brokerCreateAction} from '../../actions/broker'

const BrokerCreate = (props) => {
    const title = 'BROKER CREATE'
    const {dispatch, loading, form, layout} = props
    const onSubmit = (event) => {
        event.preventDefault()
        dispatch(brokerCreateAction(form.values))
            .then(() => {
                toastr.success('Success', 'Data is successfully saved')
                hashHistory.push(ROUTE.BROKER_LIST_URL)
            })
            .catch((response) => {
                toastr.error('Invalid data', toasterError(response))
            })
    }
    return (
        <Layout {...layout}>
            <div>
                <BrokerFrom title={title} loading={loading} onSubmit={onSubmit}/>
            </div>
        </Layout>
    )
}

export default connect((state) => {
    return {
        loading: _.get(state, ['broker', 'create', 'loading']),
        form: _.get(state, ['form', 'BrokerForm'])
    }
})(BrokerCreate)
