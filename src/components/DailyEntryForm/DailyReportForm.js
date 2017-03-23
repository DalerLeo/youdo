import React from 'react'
import {Link} from 'react-router'
import {Button, Form, Grid, Table} from 'semantic-ui-react'
import WForm from '../Form'
import AccountSearchField from '../AccountSearchField'
import {Field, reduxForm} from 'redux-form'
import * as ROUTE from '../../constants/routes'
import './DailyReportForm.css'

const renderMTM = ({input}) => {
    return (
        <Form.Input
            {...input}
            type="number"
            label="MTM/Floating P & L"
            placeholder="MTM/Floating P & L"
        />
    )
}

const renderAccountSearchField = props =>
    <AccountSearchField
        placeholder="Client"
        {...props.input}
    />

const DailyEntryForm = (props) => {
    const {loading, onSubmit} = props

    return (
        <Grid>
            <Grid.Row columns={2}>
                <Grid.Column>
                    <WForm.Form loading={loading} onSubmit={onSubmit}>
                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell colSpan="2">DAILY REPORT CREATE</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell collapsing>
                                        <Form.Field>
                                            <label>Date</label>
                                            <Field
                                                component={WForm.DateTimeField}
                                                dateFormat="DD.MM.YYYY"
                                                placeholder="Date"
                                                name="date"
                                            />
                                        </Form.Field>
                                    </Table.Cell>
                                    <Table.Cell collapsing>
                                        <Form.Field>
                                            <label>Account</label>
                                            <Field
                                                name="account"
                                                component={renderAccountSearchField}
                                            />
                                        </Form.Field>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell collapsing>
                                        <Field
                                            component={WForm.InputField}
                                            type="number"
                                            name="amount"
                                            label="Amount"
                                            placeholder="Amount"
                                        />
                                    </Table.Cell>

                                    <Table.Cell collapsing>
                                        <Field
                                            name="mtm"
                                            component={renderMTM}
                                        />
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell collapsing>
                                        <Field
                                            component={WForm.CheckboxField}
                                            name="noStatement"
                                            label="No statement"
                                            placeholder="No statement"
                                        />
                                    </Table.Cell>
                                    <Table.Cell collapsing>
                                        <Field
                                            component={WForm.CheckboxField}
                                            name="noTransaction"
                                            label="No Trading"
                                            placeholder="No Trading"
                                        />
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell collapsing colSpan="2">
                                        <Button.Group className="SaveButtonGroup">
                                            <Button positive>Save</Button>
                                            <Button.Or />
                                            <Link to={ROUTE.DAILY_ENTRY_LIST_URL}>
                                                <Button>Cancel</Button>
                                            </Link>
                                        </Button.Group>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </WForm.Form>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

DailyEntryForm.propTypes = {
    loading: React.PropTypes.bool,
    onSubmit: React.PropTypes.func.isRequired
}

export default reduxForm({
    form: 'DailyEntryForm'
})(DailyEntryForm)
