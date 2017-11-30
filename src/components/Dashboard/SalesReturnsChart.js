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

const SalesReturnsChart = enhance((props) => {
    const {
        tooltipTitle,
        primaryValues,
        secondaryValues,
        primaryText,
        secondaryText,
        height
    } = props

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
            categories: tooltipDate,
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
            headerFormat: '<b>{point.x}</b><br/>',
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
            data: primaryValues,
            color: '#12aaeb'

        },
        {
            marker: {
                enabled: false,
                symbol: 'circle'
            },
            name: secondaryText,
            data: secondaryValues,
            color: '#ff526d'

        }]
    }

    return (
        <ReactHighcharts config={config} neverReflow={true} isPureConfig={true}/>
    )
})

SalesReturnsChart.propTypes = {
    tooltipTitle: PropTypes.any.isRequired,
    primaryValues: PropTypes.array.isRequired,
    secondaryValues: PropTypes.array.isRequired,
    primaryText: PropTypes.string.isRequired,
    secondaryText: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired
}

export default SalesReturnsChart
