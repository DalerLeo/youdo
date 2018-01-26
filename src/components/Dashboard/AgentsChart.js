import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import ReactHighcharts from 'react-highcharts'
import getConfig from '../../helpers/getConfig'

const enhance = compose(
    injectSheet({

    })
)

const AgentsChart = enhance((props) => {
    const {
        agentsList,
        ordersData,
        returnsData,
        factsData
    } = props
    const ONE = 1
    const TWO = 2
    const THREE = 3
    const FOUR = 4
    const FIVE = 5
    const agentsCount = _.get(agentsList, 'length')
    const getChartHeight = () => {
        switch (agentsCount) {
            case ONE: return '100'
            case TWO: return '150'
            case THREE: return '200'
            case FOUR: return '250'
            case FIVE: return '300'
            default: return '400'
        }
    }

    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const config = {
        chart: {
            type: 'bar',
            height: _.toInteger(getChartHeight())
        },
        title: {
            text: '',
            style: {
                display: 'none'
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        xAxis: {
            categories: agentsList,
            title: {
                text: '',
                style: {
                    display: 'none'
                }
            }
        },
        yAxis: {
            title: {
                text: '',
                style: {
                    display: 'none'
                }
            },
            gridLineColor: '#efefef',
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            shared: true,
            valueSuffix: ' ' + primaryCurrency,
            backgroundColor: '#fff',
            style: {
                color: '#666',
                fontFamily: 'Open Sans',
                fontWeight: '600'
            },
            borderRadius: 0,
            borderWidth: 0,
            enabled: true,
            shadow: true,
            useHTML: true,
            crosshairs: true,
            headerFormat: '<b>{point.x}</b><br/>'
        },
        series: [{
            name: 'Продажи',
            data: ordersData,
            color: '#5d6474'
        },
        {
            name: 'Возвраты',
            data: returnsData,
            color: '#ff526d'
        }, {
            name: 'Фактически',
            data: factsData,
            color: '#12aaeb'
        }]
    }

    return (
        <ReactHighcharts config={config} neverReflow={true} isPureConfig={true}/>
    )
})

AgentsChart.propTypes = {
    agentsList: PropTypes.array.isRequired,
    ordersData: PropTypes.array.isRequired,
    returnsData: PropTypes.array.isRequired,
    factsData: PropTypes.array.isRequired
}

export default AgentsChart
