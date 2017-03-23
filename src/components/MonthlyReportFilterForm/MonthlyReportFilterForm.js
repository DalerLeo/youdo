import React from 'react'
import {reduxForm, Field} from 'redux-form'
import {Modal, Button, Grid, Form} from 'semantic-ui-react'
import WForm from '../Form'
import AccountSearchField from '../AccountSearchField'
import ClientSearchField from '../ClientSearchField'
import BrokerSearchField from '../BrokerSearchField'
import FundManagerSearchField from '../FundManagerSearchField'
import YearSelectField from '../YearSelectField'
import MonthSelectField from '../MonthSelectField'

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

const MonthlyReportFilterForm = (props) => {
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
                                        component={YearSelectField}
                                    />
                                </Form.Field>
                            </Grid.Column>
                            <Grid.Column>
                                <Form.Field>
                                    <label>Month</label>
                                    <Field
                                        name="month"
                                        component={MonthSelectField}
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

MonthlyReportFilterForm.propTypes = {
    open: React.PropTypes.bool.isRequired,
    onSubmit: React.PropTypes.func.isRequired,
    onClose: React.PropTypes.func.isRequired
}

export default reduxForm({
    form: 'MonthlyReportFilterForm'
})(MonthlyReportFilterForm)

