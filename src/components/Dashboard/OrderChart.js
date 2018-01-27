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

const OrderChart = enhance((props) => {
    const {
        tooltipTitle,
        cashValues,
        bankValues,
        cashText,
        bankText,
        height
    } = props

    const tooltipDate = _.map(tooltipTitle, (item) => dateFormat(item))
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const config = {
        chart: {
            type: 'area',
            height: height
        },
        title: {
            text: '',
            style: {
                display: 'none'
            }
        },
        legend: {
            enabled: true,
            itemStyle: {
                fontWeight: 600,
                fontFamily: 'Open Sans',
                fontSize: 11
            },
            symbolHeight: 9,
            symbolWidth: 9
        },
        credits: {
            enabled: false
        },
        xAxis: {
            categories: tooltipDate,
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
            area: {
                stacking: 'normal'
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
            headerFormat: '<b>{point.x}</b><br/>'
        },
        series: [
            {
                marker: {
                    enabled: false
                },
                name: cashText,
                data: cashValues,
                color: '#12aaeb'
            },
            {
                marker: {
                    enabled: false
                },
                name: bankText,
                data: bankValues,
                color: '#5d6474'
            }]
    }

    return (
        <ReactHighcharts config={config} neverReflow={true} isPureConfig={true}/>
    )
})

OrderChart.propTypes = {
    tooltipTitle: PropTypes.any.isRequired,
    cashValues: PropTypes.array.isRequired,
    bankValues: PropTypes.array.isRequired,
    cashText: PropTypes.string.isRequired,
    bankText: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired
}

export default OrderChart
