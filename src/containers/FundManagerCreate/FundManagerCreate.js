import _ from 'lodash'
import React from 'react'
import {connect} from 'react-redux'
import {toastr} from 'react-redux-toastr'
import {hashHistory} from 'react-router'
import {toasterError} from '../../helpers/apiErrorsHandler'
import * as ROUTE from '../../constants/routes'
import Layout from '../../components/Layout'
import FundManagerForm from '../../components/FundManagerForm'
import {fundManagerCreateAction} from '../../actions/fundManager'

const FundManagerCreate = (props) => {
    const {dispatch, loading, form, layout} = props
    const title = 'FUND MANAGER CREATE'
    const onSubmit = (event) => {
        event.preventDefault()
        dispatch(fundManagerCreateAction(form.values))
            .then(() => {
                toastr.success('Success', 'Data is successfully saved')
                hashHistory.push(ROUTE.FUND_MANAGER_LIST_URL)
            })
            .catch((response) => {
                toastr.error('Invalid data', toasterError(response))
            })
    }
    return (
        <Layout {...layout}>
            <div>
                <FundManagerForm title={title} loading={loading} onSubmit={onSubmit}/>
            </div>
        </Layout>
    )
}

export default connect((state) => {
    return {
        loading: _.get(state, ['fundManager', 'create', 'loading']),
        form: _.get(state, ['form', 'FundManagerForm'])
    }
})(FundManagerCreate)
