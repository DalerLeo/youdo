import _ from 'lodash'
import React from 'react'
import {Pie} from 'react-chartjs-2'
import {Grid, Segment, Button, Form, Divider} from 'semantic-ui-react'
import {Field, reduxForm} from 'redux-form'
import moment from 'moment'
import WForm from '../Form'
import DatePickerField from '../DateRangePickerField'
import './PieChart.css'

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

const PieChart = (props) => {
    const {data, onSubmit} = props
    const profit = _.get(data, 'profit')
    const loss = _.get(data, 'loss')

    const pieData = {
        labels: ['profit', 'loss'],
        datasets: [
            {
                data: [profit, loss],
                backgroundColor: [
                    '#18c759',
                    '#FF6384'
                ],
                hoverBackgroundColor: [
                    '#18c759',
                    '#FF6384'
                ]
            }
        ]
    }

    return (
        <Grid.Column width={7} textAlign="center">
            <Segment id="pieSegment">
                <WForm.Form onSubmit={onSubmit}>
                    <label className="pieLabel">Summary of profit and loss</label>
                    <Divider inverted />
                    <Form.Group widths='equal'>
                        <Form.Field>
                            <Field
                                name="fromToDate"
                                component={renderFromDatePickerField}
                            />
                        </Form.Field>
                        <Form.Field id="pieButton">
                            <Button positive>Calculate</Button>
                        </Form.Field>
                    </Form.Group>
                </WForm.Form>
                {(profit || loss) ? (<Pie data={pieData}/>) : (<h2 className="noPieData">No data for showing</h2>)}
            </Segment>
        </Grid.Column>
    )
}

export default reduxForm({
    form: 'PieChartForm'
})(PieChart)
