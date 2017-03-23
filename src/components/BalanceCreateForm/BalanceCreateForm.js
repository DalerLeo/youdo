import React from 'react'
import {Link} from 'react-router'
import {Grid, Table, Button, Form} from 'semantic-ui-react'
import {Field, reduxForm} from 'redux-form'
import WForm from '../Form'
import * as ROUTE from '../../constants/routes'
import ClientSearchField from '../ClientSearchField'

const renderClientSearchField = (props) => {
    return (
        <ClientSearchField
            placeholder="Client"
            {...props.input}
        />
    )
}

const BalanceCreateForm = (props) => {
    const {loading, onSubmit} = props
    return (
        <Grid>
            <Grid.Row>
                <Grid.Column width={7}>
                    <WForm.Form loading={loading} onSubmit={onSubmit}>
                        <Table attached="bottom" celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell colSpan="2">ADD TRANSACTION</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>
                                        <Form.Field>
                                            <label>Client</label>
                                            <Field
                                                name="client"
                                                component={renderClientSearchField}
                                            />
                                        </Form.Field>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <Form.Field>
                                            <label>Amount</label>
                                            <Field
                                                name="amount"
                                                component={WForm.InputField}
                                                placeholder="Amount"
                                            />
                                        </Form.Field>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>

                            <Table.Footer>
                                <Table.Row>
                                    <Table.HeaderCell colSpan="2">
                                        <Button.Group className="SaveButtonGroup">
                                            <Button positive>Save</Button>
                                            <Button.Or />
                                            <Link to={ROUTE.BALANCE_LIST_URL}>
                                                <Button >Cancel</Button>
                                            </Link>
                                        </Button.Group>
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Footer>
                        </Table>
                    </WForm.Form>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

BalanceCreateForm.propTypes = {
    loading: React.PropTypes.bool,
    onSubmit: React.PropTypes.func.isRequired
}

export default reduxForm({
    form: 'BalanceCreateForm'
})(BalanceCreateForm)
