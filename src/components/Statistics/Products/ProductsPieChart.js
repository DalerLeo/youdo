import React from 'react'
import _ from 'lodash'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import ReactHighcharts from 'react-highcharts'
import getConfig from '../../../helpers/getConfig'
import t from '../../../helpers/translate'
import {getLanguage} from '../../../helpers/storage'
import moment from 'moment'

const dateFormat = (date, time, defaultText) => {
    const lan = getLanguage() === 'uz' ? 'ru' : 'en'
    const dateTime = moment(date).locale(lan).format('DD MMM YYYY')
    return (date && time) ? dateTime : (date) ? moment(date).locale(lan).format('D MMM') : defaultText
}

const enhance = compose(
    injectSheet({

    })
)

const ProductsPieChart = enhance((props) => {
    const {
        tooltipTitle,
        height
    } = props

    const tooltipDate = _.map(tooltipTitle, (item) => dateFormat(item))
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')

    const config = {
        chart: {
            type: 'pie',
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
            symbolWidth: 9,
            margin: 5
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
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                colors: ['#8dc572', '#4db6ac', '#e57373', '#12aaeb'],
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b><br>{point.percentage:.1f} %',
                    distance: -50,
                    filter: {
                        property: 'percentage',
                        operator: '>',
                        value: 4
                    }
                }
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
            crosshairs: true
        },
        series: [{
            name: t('Продажи'),
            colorByPoint: true,
            dataLabels: {
                color: '#fff',
                style: {
                    textOutline: false
                }
            },
            data: [{
                name: 'IE',
                y: 26654
            }, {
                name: 'Chrome',
                y: 805942
            }, {
                name: 'Firefox',
                y: 261485
            }, {
                name: 'Safari',
                y: 126548
            }, {
                name: 'Opera',
                y: 88954
            }, {
                name: 'Other',
                y: 15744
            }]
        }]
    }

    return (
        <ReactHighcharts config={config} neverReflow={true} isPureConfig={true}/>
    )
})

ProductsPieChart.propTypes = {

}

export default ProductsPieChart
