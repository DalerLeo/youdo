import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import {hashHistory} from 'react-router'
import {connect} from 'react-redux'
import {Grid, Dimmer, Loader} from 'semantic-ui-react'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import Layout from '../../components/Layout'
import PieChart from '../../components/PieChart'
import LineChart from '../../components/LineChart'
import {dashboardStaticsPieFetchAction, dashboardStaticsLineFetchAction} from '../../actions/dashboardStatics'
import filterHelper from '../../helpers/filter'
import './Dashboard.css'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const list = _.get(state, ['dashboardStatics'])
        const loading = _.get(state, ['dashboardStatics', 'loading'])
        const pieChart = _.get(state, ['form', 'PieChartForm', 'values', 'fromToDate'])
        const lineChart = _.get(state, ['form', 'LineChartForm', 'values', 'fromToDate'])
        const filter = filterHelper(list, pathname, query)

        return {
            list,
            loading,
            filter,
            pieChart,
            lineChart
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.createURL() !== nextProps.filter.createURL()
    }, ({dispatch, filter}) => {
        dispatch(dashboardStaticsPieFetchAction(filter))
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.createURL() !== nextProps.filter.createURL()
    }, ({dispatch, filter}) => {
        dispatch(dashboardStaticsLineFetchAction(filter))
    }),
    withHandlers({
        onPieChart: props => event => {
            event.preventDefault()
            const {filter, pieChart} = props
            const fromPieDate = _.get(pieChart, ['startDate'])
            const toPieDate = _.get(pieChart, ['endDate'])

            hashHistory.push(filter.createURL({
                fromPieDate: fromPieDate.format('YYYY-MM-DD HH:mm'),
                toPieDate: toPieDate.format('YYYY-MM-DD HH:mm')
            }))
        },

        onLineChart: props => event => {
            event.preventDefault()
            const {filter, lineChart} = props
            const fromLineDate = _.get(lineChart, ['startDate'])
            const toLineDate = _.get(lineChart, ['endDate'])

            hashHistory.push(filter.createURL({
                fromLineDate: fromLineDate.format('YYYY-MM-DD HH:mm'),
                toLineDate: toLineDate.format('YYYY-MM-DD HH:mm')
            }))
        }
    })
)

const Dashboard = enhance((props) => {
    const {list, loading, onPieChart, onLineChart, layout, filter} = props
    const pieData = _.get(list, ['pieChart', 'data'])
    const lineData = _.get(list, ['lineChart', 'data'])

    const fromPieDate = filter.getParam('fromPieDate')
    const toPieDate = filter.getParam('toPieDate')

    const fromLineDate = filter.getParam('fromLineDate')
    const toLineDate = filter.getParam('toLineDate')

    const initialPieValues = {
        fromToDate: {
            startDate: fromPieDate && moment(fromPieDate, 'YYYY-MM-DD'),
            endDate: toPieDate && moment(toPieDate, 'YYYY-MM-DD')
        }
    }

    const initialLineValues = {
        fromToDate: {
            startDate: fromLineDate && moment(fromLineDate, 'YYYY-MM-DD'),
            endDate: toLineDate && moment(toLineDate, 'YYYY-MM-DD')
        }
    }

    return (
        <Layout {...layout}>
            <div>
                <Dimmer active={loading} inverted>
                    <Loader size="large">Loading</Loader>
                </Dimmer>

                <Grid columns={2} centered>
                    <Grid.Row columns={2}>
                        <PieChart data={pieData} initialValues={initialPieValues} onSubmit={onPieChart}/>
                        <LineChart data={lineData} initialValues={initialLineValues} onSubmit={onLineChart}/>
                    </Grid.Row>
                </Grid>
            </div>
        </Layout>
    )
})

export default Dashboard
