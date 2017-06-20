import React from 'react'
import _ from 'lodash'
import {compose} from 'recompose'
import {connect} from 'react-redux'
import Layout from '../../components/Layout'
import ZonesWrapper from '../../components/Zones/ZonesWrapper'

const enhance = compose(
    connect((state, props) => {
        return {

        }
    }),
)

const Zones = enhance((props) => {
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
            <ZonesWrapper
                listData={listData}
            />
        </Layout>
    )
})

export default Zones
