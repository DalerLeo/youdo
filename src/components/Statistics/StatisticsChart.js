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
const ZERO = 0
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
        merged
    } = props

    const clientIn = []
    const clientOut = []
    const clientDate = []
    _.map(mergedGraph, (item) => {
        const dataIn = _.toNumber(_.get(item, 'in'))
        const dataOut = _.toNumber(_.get(item, 'out')) < ZERO ? _.toNumber(_.get(item, 'out')) * MINUS_ONE : _.toNumber(_.get(item, 'out'))
        const date = dateFormat(_.get(item, 'date'))
        clientIn.push(dataIn)
        clientOut.push(dataOut)
        clientDate.push(date)
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
            categories: merged ? clientDate : tooltipDate,
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
            data: merged ? clientIn : primaryValues,
            color: '#58bed9'

        },
        {
            marker: {
                enabled: false,
                symbol: 'circle'
            },
            name: secondaryText,
            data: merged ? clientOut : secondaryValues,
            color: '#e37676'

        }]
    }

    return (
        <ReactHighcharts config={config} neverReflow={true} isPureConfig={true}/>
    )
})

StatisticsChart.propTypes = {
    tooltipTitle: PropTypes.any.isRequired,
    primaryValues: PropTypes.array.isRequired,
    primaryText: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired
}

export default StatisticsChart
