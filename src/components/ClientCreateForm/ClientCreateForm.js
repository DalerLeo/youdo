import React from 'react'
import {Form, Grid, Table, Button} from 'semantic-ui-react'
import {FieldArray, Field, reduxForm} from 'redux-form'
import {Link} from 'react-router'
import WForm from '../Form'
import BrokerSearchField from '../BrokerSearchField'
import FundManagerSearchField from '../FundManagerSearchField'
import ClientSearchField from '../ClientSearchField'
import * as ROUTES from '../../constants/routes'
import './ClientCreateForm.css'

const renderClientName = ({input}) => {
    return (
        <Form.Input
            {...input}
            placeholder="Name"
        />
    )
}

const renderInitialCapital = ({input}) => {
    return (
        <Form.Input
            {...input}
            type="number"
            placeholder="Initial capital"
        />
    )
}

const renderSearchReference = ({input}) => {
    return (
        <ClientSearchField
            placeholder="Reference"
            {...input}
        />
    )
}

const renderAccountNumber = ({input}) => {
    return (
        <Form.Input
            {...input}
            placeholder="Account Number"
        />
    )
}

const AccountsItem = ({field, remove, onClickAddAccount, onClickRemoveAccount}) => {
    const addOrRemoveButton = remove ? (<Button icon="plus" onClick={onClickAddAccount}/>) : (<Button icon="minus" onClick={onClickRemoveAccount}/>)

    return (
        <Grid.Row>
            <Grid.Column width={1}>
                <Form.Field>
                    <label>Action</label>
                    {addOrRemoveButton}
                </Form.Field>
            </Grid.Column>
            <Grid.Column width={5}>
                <Form.Field>
                    <label>Account Number</label>
                    <Form.Group widths="equal">
                        <Form.Field>
                            <Field
                                name={`${field}.account`}
                                component={renderAccountNumber}
                            />
                        </Form.Field>
                    </Form.Group>
                </Form.Field>
            </Grid.Column>

            <Grid.Column width={5}>
                <Form.Field>
                    <label>Fund Manager</label>
                    <Form.Group widths="equal">
                        <Field
                            name={`${field}.fundManager`}
                            component={({input}) => {
                                return (<FundManagerSearchField placeholder="Fund manager" {...input} />)
                            }}
                        />
                    </Form.Group>
                </Form.Field>
            </Grid.Column>

            <Grid.Column width={5}>
                <Form.Field>
                    <label>Broker</label>
                    <Form.Group widths="equal">
                        <Field
                            name={`${field}.broker`}
                            component={({input}) => {
                                return (<BrokerSearchField placeholder="Broker" {...input} />)
                            }}
                        />
                    </Form.Group>
                </Form.Field>
            </Grid.Column>
        </Grid.Row>
    )
}

const AccountsItems = ({fields}) => {
    !fields.length && fields.push({})

    if (!fields.length) {
        return null
    }

    const items = fields.map((field, index) => {
        const handleAddAccounts = (event) => {
            event.preventDefault()
            fields.push({})
        }

        const handleRemoveAccounts = (event) => {
            event.preventDefault()
            fields.remove(index)
        }

        return (<AccountsItem
            key={index}
            field={field}
            remove={fields.length - 1 === index}
            onClickAddAccount={handleAddAccounts}
            onClickRemoveAccount={handleRemoveAccounts}
        />)
    })

    return (
        <Grid className="AccountItems" divided="vertically">
            {items}
        </Grid>
    )
}

const ClientCreate = (props) => {
    const {loading, onSubmit} = props

    return (
        <Grid>
            <Grid.Row>
                <Grid.Column width={8}>
                    <WForm.Form loading={loading} onSubmit={onSubmit}>
                        <Table attached="bottom" celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell colSpan="4">CREATE CLIENT</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell colSpan="2">
                                        <Form.Field>
                                            <label>Name</label>
                                            <Field
                                                name="name"
                                                component={renderClientName}
                                            />
                                        </Form.Field>
                                    </Table.Cell>
                                    <Table.Cell colSpan="2">
                                        <Form.Field>
                                            <label>Reference</label>
                                            <Field
                                                name="reference"
                                                component={renderSearchReference}
                                            />
                                        </Form.Field>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell colSpan="2">
                                        <Form.Field>
                                            <label>Initial capital</label>
                                            <Field
                                                name="initialCapital"
                                                component={renderInitialCapital}
                                            />
                                        </Form.Field>
                                    </Table.Cell>
                                    <Table.Cell colSpan="2">
                                        <Form.Field>
                                            <label>Date of Initial Capital</label>
                                            <Field
                                                name="initialCapitalDate"
                                                component={WForm.DateTimeField}
                                                dateFormat="DD.MM.YYYY"
                                                placeholder="Date of Initial Capital"
                                            />
                                        </Form.Field>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell colSpan="4">
                                        <FieldArray name="accounts" component={AccountsItems} />
                                    </Table.Cell>
                                </Table.Row>

                            </Table.Body>

                            <Table.Footer>
                                <Table.Row>
                                    <Table.HeaderCell colSpan="4">
                                        <Button.Group className="SaveButtonGroup">
                                            <Button positive>Save</Button>
                                            <Button.Or />
                                            <Link to={ROUTES.CLIENT_LIST}>
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

ClientCreate.propTypes = {
    loading: React.PropTypes.bool,
    onSubmit: React.PropTypes.func.isRequired
}

export default reduxForm({
    form: 'ClientCreate'
})(ClientCreate)
