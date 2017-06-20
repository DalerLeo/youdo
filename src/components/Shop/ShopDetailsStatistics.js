import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import ReactHighcharts from 'react-highcharts'
import Dot from 'material-ui/svg-icons/av/fiber-manual-record'

const enhance = compose(
    injectSheet({
        content: {
            padding: '20px 0',
            display: 'flex',
            justifyContent: 'space-between'
        },
        dynamics: {
            flexBasis: '60%',
            maxWidth: '60%'
        },
        popular: {
            flexBasis: '38%',
            maxWidth: '38%'
        },
        chartTitle: {
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            '& a': {
                fontWeight: '600 !important'
            }
        },
        flex: {
            display: 'flex',
            alignItems: 'center'
        },
        pieCategory: {
            marginLeft: '20px',
            '& li': {
                margin: '10px 0',
                extend: 'flex',
                '& svg': {
                    width: '20px !important',
                    height: '20px !important',
                    marginRight: '8px'
                },
                '& span': {
                    display: 'block'
                },
                '& small': {
                    fontSize: '13px',
                    color: '#999'
                }
            }
        }
    })
)
const dynamics = {
    chart: {
        type: 'area',
        height: 245
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
        categories: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
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
        valueSuffix: ' UZS',
        backgroundColor: '#363636',
        style: {
            color: '#fff'
        },
        borderRadius: 2,
        borderWidth: 0,
        enabled: true,
        shadow: false,
        useHTML: true,
        crosshairs: true,
        pointFormat: '{series.name}: <b>{point.y}</b>'
    },
    series: [{
        marker: {
            enabled: false,
            symbol: 'circle'
        },
        name: 'Сумма',
        data: [322, 102, 132, 394, 983, 354, 453, 133, 321, 223, 233, 654],
        color: '#70b5df'

    }]
}
const popular = {
    chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        height: 200,
        width: 200,
        margin: 0
    },
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },

    plotOptions: {
        pie: {
            slicedOffset: 0,
            innerSize: '60%',
            size: '100%',
            dataLabels: {
                enabled: false
            },
            states: {
                hover: {
                    enabled: false
                }
            }
        }
    },
    tooltip: {
        enabled: true
    },
    title: {
        style: {
            display: 'none'
        }
    },

    series: [{
        data: [{
            data: 'Производство',
            y: 10,
            color: '#466d7c'
        }, {
            data: 'Производство',
            y: 15,
            color: '#8dbc2e'
        }, {
            data: 'Производство',
            y: 20,
            color: '#00bfdb'
        }, {
            data: 'Производство',
            y: 25,
            color: '#a16cb4'
        }, {
            data: 'Производство',
            y: 10,
            color: '#ff8500'
        }, {
            data: 'Производство',
            y: 20,
            color: '#ff6d65'
        }]
    }]
}

const ShopDetailsStatistics = enhance((props) => {
    const {classes} = props

    return (
        <div className={classes.content}>
            <div className={classes.dynamics}>
                <div className={classes.chartTitle}>
                    <span>Динамика продаж</span>
                    <div>Результат за <a>2016 г.</a></div>
                </div>
                <ReactHighcharts config={dynamics} />
            </div>
            <div className={classes.popular}>
                <div className={classes.chartTitle}>
                    <span>Популярные продукты</span>
                </div>
                <div className={classes.flex}>
                    <ReactHighcharts config={popular} />
                    <div className={classes.pieCategory}>
                        <li>
                            <Dot color="#ff6d65"/>
                            <div>
                                <span>Яблочный шампунь</span>
                                <small>10% всех продаж</small>
                            </div>
                        </li>
                        <li>
                            <Dot color="#ff8500"/>
                            <div>
                                <span>Яблочный шампунь</span>
                                <small>40% всех продаж</small>
                            </div>
                        </li><li>
                        <Dot color="#8dbc2e"/>
                        <div>
                            <span>Яблочный шампунь</span>
                            <small>50% всех продаж</small>
                        </div>
                    </li>
                    </div>
                </div>
            </div>
        </div>
    )
})
ShopDetailsStatistics.propTypes = {

}

export default ShopDetailsStatistics

