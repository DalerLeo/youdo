import React from 'react'
import _ from 'lodash'
import {compose} from 'recompose'
import {connect} from 'react-redux'
import Layout from '../../components/Layout'
import TrackingWrapper from '../../components/Tracking/TrackingWrapper'
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        return {
            query,
            pathname
        }
    })
)

const Tracking = enhance((props) => {
    const {
        list,
        listLoading,
        layout
    } = props

    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }

    return (
        <Layout {...layout}>
            <TrackingWrapper
                listData={listData}
            />
        </Layout>
    )
})

export default Tracking
