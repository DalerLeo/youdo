import React from 'react'
import _ from 'lodash'
import {compose} from 'recompose'
import {connect} from 'react-redux'
import Layout from '../../components/Layout'
import filterHelper from '../../helpers/filter'
import GoogleCustomMap from '../../components/GoogleMapCustom/GoogleMapCustom'
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const list = _.get(state, ['zone', 'list', 'data'])
        const filter = filterHelper(list, pathname, query)
        return {
            filter
        }
    }),
)

const GoogleMapCustom = enhance((props) => {
    const {
        layout
    } = props

    const setting = {
        initialCenter: {
            lat: 29.975588,
            lng: -90.102682
        },
        initialZoom: 12
    }

    return (
        <Layout {...layout}>
            <GoogleCustomMap config={setting}/>
        </Layout>
    )
})

export default GoogleMapCustom
