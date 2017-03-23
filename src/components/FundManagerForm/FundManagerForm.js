import React from 'react'
import {Link} from 'react-router'
import {Grid, Table, Button, Form} from 'semantic-ui-react'
import {Field, reduxForm} from 'redux-form'
import WForm from '../Form'
import * as ROUTE from '../../constants/routes'
import ConfirmationModal from '../ConfirmationModal'

const FundManagerForm = (props) => {
    const {title, loading, onSubmit, deleteConfirmDialog} = props
    return (
        <div>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={7}>
                        <WForm.Form loading={loading}>
                            <Table>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell colSpan='2'>{title}</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell>
                                            <Form.Field>
                                                <label>User Name</label>
                                                <Field
                                                    name="username"
                                                    component={WForm.InputField}
                                                    placeholder="User Name"
                                                />
                                            </Form.Field>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Form.Field>
                                                <label>Password</label>
                                                <Field
                                                    name="password"
                                                    component={WForm.InputField}
                                                    placeholder="Password"
                                                />
                                            </Form.Field>
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>
                                            <Form.Field>
                                                <label>First Name</label>
                                                <Field
                                                    name="firstName"
                                                    component={WForm.InputField}
                                                    placeholder="First Name"
                                                />
                                            </Form.Field>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Form.Field>
                                                <label>Second Name</label>
                                                <Field
                                                    name="secondName"
                                                    component={WForm.InputField}
                                                    placeholder="Second Name"
                                                />
                                            </Form.Field>
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>

                                <Table.Footer>
                                    <Table.Row>
                                        <Table.HeaderCell colSpan='2'>
                                            <Button.Group className="SaveButtonGroup">
                                                <Button positive onClick={onSubmit}>Save</Button>
                                                {deleteConfirmDialog && <Button.Or />}
                                                {deleteConfirmDialog && <Button
                                                    negative={true}
                                                    onClick={deleteConfirmDialog.handleOpen}>
                                                    Remove
                                                </Button>}
                                                <Button.Or />
                                                <Link to={ROUTE.FUND_MANAGER_LIST_URL}>
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

            {deleteConfirmDialog && <ConfirmationModal
                content="Remove"
                text="You want to sure?"
                open={deleteConfirmDialog.open}
                onClose={deleteConfirmDialog.handleClose}
                onConfirm={deleteConfirmDialog.handleDelete}
            />}
        </div>
    )
}

FundManagerForm.propTypes = {
    title: React.PropTypes.string,
    loading: React.PropTypes.bool,
    onSubmit: React.PropTypes.func.isRequired,
    deleteConfirmDialog: React.PropTypes.shape({
        open: React.PropTypes.bool.isRequired,
        handleOpen: React.PropTypes.func.isRequired,
        handleClose: React.PropTypes.func.isRequired,
        handleDelete: React.PropTypes.func.isRequired
    })
}

export default reduxForm({
    form: 'FundManagerForm',
    enableReinitialize: true
})(FundManagerForm)
