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

const MINUS_ONE = -1
const enhance = compose(
    injectSheet({

    })
)

const StatisticsChart = enhance((props) => {
    const {
        tooltipTitle,
        primaryValues,
        secondaryValues,
        primaryText,
        secondaryText,
        height,
        mergedGraph,
        clientIncome
    } = props

    let clientIn = []
    let clientOut = []
    let clientDate = []
    _.map(mergedGraph, (item) => {
        clientIn.push(_.toNumber(item.in))
        clientOut.push(_.toNumber(item.out) * MINUS_ONE)
        clientDate.push(dateFormat(item.date))
    })

    const tooltipDate = _.map(tooltipTitle, (item) => {
        return dateFormat(item)
    })

    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const config = {
        chart: {
            type: 'areaspline',
            height: height
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
            categories: clientIncome ? clientDate : tooltipDate,
            tickmarkPlacement: 'on',
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
            series: {
                lineWidth: 0,
                pointPlacement: 'on'
            },
            areaspline: {
                fillOpacity: 0.7
            }
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
            '<div class="diagramTooltip">' +
            '{series.name}: {point.y}' +
            '</div>'
        },
        series: [{
            marker: {
                enabled: false,
                symbol: 'circle'
            },
            name: primaryText,
            data: clientIncome ? clientIn : primaryValues,
            color: '#58bed9'

        },
        {
            marker: {
                enabled: false,
                symbol: 'circle'
            },
            name: secondaryText,
            data: clientIncome ? clientOut : secondaryValues,
            color: '#e37676'

        }]
    }

    return (
        <ReactHighcharts config={config} neverReflow={true} isPureConfig={true}/>
    )
})

StatisticsChart.propTypes = {
    tooltipTitle: PropTypes.any.isRequired,
    primaryValues: PropTypes.object.isRequired,
    primaryText: PropTypes.object.isRequired,
    height: PropTypes.number.isRequired
}

export default StatisticsChart
