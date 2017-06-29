import React from 'react'
import _ from 'lodash'
import {compose, withHandlers} from 'recompose'
import {connect} from 'react-redux'
import Layout from '../../components/Layout'
import {hashHistory} from 'react-router'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import ZonesWrapper from '../../components/Zones/ZonesWrapper'
import {ADD_ZONE} from '../../components/Zones'
import {
    zoneCreateAction
} from '../../actions/zones'
import {openSnackbarAction} from '../../actions/snackbar'
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const list = _.get(state, ['zones', 'list', 'data'])
        const listLoading = _.get(state, ['zones', 'list', 'loading'])
        const createForm = _.get(state, ['form', 'ZoneCreateForm', 'values'])
        const filter = filterHelper(list, pathname, query)
        return {
            query,
            pathname,
            list,
            listLoading,
            createForm,
            filter
        }
    }),
    withHandlers({
        handleOpenAddZone: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ADD_ZONE]: true})})
        },

        handleCloseAddZone: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ADD_ZONE]: false})})
        },

        handleSubmitAddZone: props => () => {
            const {dispatch, createForm, filter} = props

            return dispatch(zoneCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Зона успешно добавлена'}))
                })
                .then(() => {
                    hashHistory.push({query: filter.getParams({[ADD_ZONE]: false})})
                })
        }
    })
)

const Zones = enhance((props) => {
    const {
        list,
        listLoading,
        location,
        layout
    } = props

    const openAddZone = toBoolean(_.get(location, ['query', ADD_ZONE]))

    const addZone = {
        openAddZone,
        handleOpenAddZone: props.handleOpenAddZone,
        handleCloseAddZone: props.handleCloseAddZone,
        handleSubmitAddZone: props.handleSubmitAddZone
    }

    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }

    return (
        <Layout {...layout}>
            <ZonesWrapper
                listData={listData}
                addZone={addZone}
            />
        </Layout>
    )
})

export default Zones
