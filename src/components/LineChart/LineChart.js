import _ from 'lodash'
import React from 'react'
import {Line} from 'react-chartjs-2'
import {Grid, Segment, Button, Form, Divider} from 'semantic-ui-react'
import {Field, reduxForm} from 'redux-form'
import moment from 'moment'
import WForm from '../Form'
import DatePickerField from '../DateRangePickerField'
import './LineChart.css'

const renderFromDatePickerField = (props) => {
    return (
        <DatePickerField
            placeholder="From date"
            isOutsideRange={(date) => moment().isBefore(date)}
            initialVisibleMonth={() => moment().subtract(1, 'months')}
            {...props}
        />
    )
}

const LineChart = (props) => {
    const {data, onSubmit} = props

    const P = _.filter(data, ['type', 'P'])
    const L = _.filter(data, ['type', 'L'])

    const profit = _.map(P, 'amount')
    const loss = _.map(L, 'amount')
    const date = _.map(P, 'date')

    const lineData = {
        labels: date,
        datasets: [
            {
                label: 'Profit',
                fill: false,
                lineTension: 0.1,
                backgroundColor: '#18c759',
                borderColor: '#27a355',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: '#18c759',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#18c759',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: profit

            },
            {
                label: 'Loss',
                fill: false,
                lineTension: 0.1,
                backgroundColor: '#FF6384',
                borderColor: '#fd4763',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: '#fd4763',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#fd4763',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: loss

            }
        ]
    }

    return (
        <Grid.Column width={7} textAlign="center">
            <Segment id="lineSegment">
                <WForm.Form onSubmit={onSubmit}>
                    <label className="lineLabel">Profit and loss by days</label>
                    <Divider inverted />
                    <Form.Group widths='equal'>
                        <Form.Field>
                            <Field
                                name="fromToDate"
                                component={renderFromDatePickerField}
                            />
                        </Form.Field>
                        <Form.Field id="lineButton">
                            <Button positive>Calculate</Button>
                        </Form.Field>
                    </Form.Group>
                </WForm.Form>
                {_.isEmpty(data) ? (<h2 className="noLineData">No data for showing</h2>) : (<Line data={lineData}/>)}
            </Segment>
        </Grid.Column>
    )
}

export default reduxForm({
    form: 'LineChartForm'
})(LineChart)
