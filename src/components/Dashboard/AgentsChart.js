import PropTypes from 'prop-types'
import React from 'react'
import _ from 'lodash'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import ReactHighcharts from 'react-highcharts'
import getConfig from '../../helpers/getConfig'
import moment from 'moment'

const dateFormat = (date, time, defaultText) => {
    const dateTime = moment(date).locale('ru').format('DD MMM YYYY')
    return (date && time) ? dateTime : (date) ? moment(date).locale('ru').format('D MMM') : defaultText
}

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

    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const config = {
        chart: {
            type: 'column',
            height: 400
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
        plotOptions: {

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
            pointFormat:
            '<div>' +
            '{series.name}: {point.y}' +
            '</div>'
        },
        series: [{
            name: 'Продажи',
            data: ordersData
        }, {
            name: 'Возвраты',
            data: returnsData
        }, {
            name: 'Фактически',
            data: factsData
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
