import React from 'react'
import {Link} from 'react-router'
import {Grid, Table, Button, Form} from 'semantic-ui-react'
import {Field, reduxForm} from 'redux-form'
import WForm from '../Form'
import * as ROUTE from '../../constants/routes'
import ConfirmationModal from '../ConfirmationModal'

const BrokerForm = (props) => {
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
                                        <Table.HeaderCell>{title}</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell>
                                            <Form.Field>
                                                <label>Broker</label>
                                                <Field
                                                    name="name"
                                                    component={WForm.InputField}
                                                    placeholder="Broker"
                                                />
                                            </Form.Field>
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>

                                <Table.Footer>
                                    <Table.Row>
                                        <Table.HeaderCell>
                                            <Button.Group className="SaveButtonGroup">
                                                <Button positive onClick={onSubmit}>Save</Button>
                                                {deleteConfirmDialog && <Button.Or />}
                                                {deleteConfirmDialog && <Button
                                                    negative={true}
                                                    onClick={deleteConfirmDialog.handleOpen}>
                                                    Remove
                                                </Button>}
                                                <Button.Or />
                                                <Link to={ROUTE.BROKER_LIST_URL}>
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

BrokerForm.propTypes = {
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
    form: 'BrokerForm',
    enableReinitialize: true
})(BrokerForm)
