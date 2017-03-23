import _ from 'lodash'
import React from 'react'
import moment from 'moment'
import {reduxForm, Field} from 'redux-form'
import {Modal, Button, Grid, Form} from 'semantic-ui-react'
import WForm from '../Form'
import SelectField from '../SelectField'
import AccountSearchField from '../AccountSearchField'
import ClientSearchField from '../ClientSearchField'
import BrokerSearchField from '../BrokerSearchField'
import FundManagerSearchField from '../FundManagerSearchField'

const months = [
    {
        text: 'January',
        value: 1
    },
    {
        text: 'February',
        value: 2
    },
    {
        text: 'March',
        value: 3
    },
    {
        text: 'April',
        value: 4
    },
    {
        text: 'May',
        value: 5
    },
    {
        text: 'June',
        value: 6
    },
    {
        text: 'July',
        value: 7
    },
    {
        text: 'August',
        value: 8
    },
    {
        text: 'September',
        value: 9
    },
    {
        text: 'October',
        value: 10
    },
    {
        text: 'November',
        value: 11
    },
    {
        text: 'December',
        value: 12
    }
]

const year = _.map(_.range(11), (item) => {
    const year = moment().year()

    return {
        text: year - item,
        value: year - item
    }
})

const renderMonthSelectField = props =>
    <SelectField
        placeholder="Month"
        options={months}
        {...props.input}
    />

const renderYearSelectField = props =>
    <SelectField
        placeholder="Year"
        options={year}
        {...props.input}
    />

const renderClientSearchField = props =>
    <ClientSearchField
        placeholder="Client"
        {...props.input}
    />

const renderAccountSearchField = props =>
    <AccountSearchField
        placeholder="Client"
        {...props.input}
    />

const renderBrokerSearchField = props =>
    <BrokerSearchField
        placeholder="Broker"
        {...props.input}
    />

const renderFundManagerSearchField = props =>
    <FundManagerSearchField
        placeholder="Fund manager"
        {...props.input}
    />

const DailyReportFilterForm = (props) => {
    const {open, onClose, onSubmit} = props

    return (
        <Modal size="small" open={open} onClose={onClose}>
            <Modal.Header>
                Filter
            </Modal.Header>
            <Modal.Content>
                <WForm.Form loading={false} onSubmit={onSubmit}>
                    <Grid>
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <Form.Field>
                                    <label>Year</label>
                                    <Field
                                        name="year"
                                        component={renderYearSelectField}
                                    />
                                </Form.Field>
                            </Grid.Column>

                            <Grid.Column>
                                <Form.Field>
                                    <label>Month</label>
                                    <Field
                                        name="month"
                                        component={renderMonthSelectField}
                                    />
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <Form.Field>
                                    <label>Client</label>
                                    <Field
                                        name="client"
                                        component={renderClientSearchField}
                                    />
                                </Form.Field>
                            </Grid.Column>

                            <Grid.Column>
                                <Form.Field>
                                    <label>Account</label>
                                    <Field
                                        name="account"
                                        component={renderAccountSearchField}
                                    />
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <Form.Field>
                                    <label>Fund manager</label>
                                    <Field
                                        name="fundManager"
                                        component={renderFundManagerSearchField}
                                    />
                                </Form.Field>
                            </Grid.Column>

                            <Grid.Column>
                                <Form.Field>
                                    <label>Broker</label>
                                    <Field
                                        name="broker"
                                        component={renderBrokerSearchField}
                                    />
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </WForm.Form>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    negative={true}
                    onClick={onClose}
                    content="Cancel"
                />

                <Button
                    positive={true}
                    icon="checkmark"
                    labelPosition="right"
                    content="Yes"
                    onClick={onSubmit}
                />
            </Modal.Actions>
        </Modal>
    )
}

DailyReportFilterForm.propTypes = {
    open: React.PropTypes.bool.isRequired,
    onSubmit: React.PropTypes.func.isRequired,
    onClose: React.PropTypes.func.isRequired
}

export default reduxForm({
    form: 'DailyReportFilterForm'
})(DailyReportFilterForm)
