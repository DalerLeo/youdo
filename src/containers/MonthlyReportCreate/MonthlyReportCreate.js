import _ from 'lodash'
import React from 'react'
import {connect} from 'react-redux'
import {toastr} from 'react-redux-toastr'
import {hashHistory} from 'react-router'
import {toasterError} from '../../helpers/apiErrorsHandler'
import * as ROUTE from '../../constants/routes'
import Layout from '../../components/Layout'
import MonthlyReportForm from '../../components/MonthlyReportForm'
import {monthlyReportCreateAction} from '../../actions/monthly'

const MonthlyReportCreate = (props) => {
    const title = 'MONTHLY REPORT CREATE'
    const {dispatch, loading, form, layout} = props
    const onSubmit = (event) => {
        event.preventDefault()
        dispatch(monthlyReportCreateAction(form.values))
            .then(() => {
                toastr.success('Success', 'Data is successfully saved')
                hashHistory.push(ROUTE.MONTHLY_REPORT_LIST_URL)
            })
            .catch((response) => {
                toastr.error('Invalid data', toasterError(response))
            })
    }
    return (
        <Layout {...layout}>
            <MonthlyReportForm
                title={title}
                loading={loading}
                onSubmit={onSubmit}
            />
        </Layout>
    )
}

export default connect((state) => {
    return {
        loading: _.get(state, ['monthlyReport', 'create', 'loading']),
        form: _.get(state, ['form', 'MonthlyReportForm'])
    }
})(MonthlyReportCreate)

