import React from 'react'
import {Link} from 'react-router'
import {Grid, Table, Button, Form} from 'semantic-ui-react'
import {Field, reduxForm} from 'redux-form'
import WForm from '../Form'
import * as ROUTE from '../../constants/routes'
import AccountSearchField from '../AccountSearchField'
import YearSelectField from '../YearSelectField'
import MonthSelectField from '../MonthSelectField'
import ConfirmationModal from '../ConfirmationModal'

const renderAccountSearchField = (props) => {
    return (
        <AccountSearchField
            placeholder="Account"
            {...props.input}
        />
    )
}

const MonthlyReportForm = (props) => {
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
                                        <Table.HeaderCell colSpan='4'>{title}</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell colSpan='2'>
                                            <Form.Field>
                                                <label>Account</label>
                                                <Field
                                                    name="account"
                                                    component={renderAccountSearchField}
                                                />
                                            </Form.Field>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Form.Field>
                                                <label>Year</label>
                                                <Field
                                                    name="year"
                                                    component={YearSelectField}
                                                />
                                            </Form.Field>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Form.Field>
                                                <label>Month</label>
                                                <Field
                                                    name="month"
                                                    component={MonthSelectField}
                                                />
                                            </Form.Field>
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>
                                            <Form.Field>
                                                <label>Opening Balance</label>
                                                <Field
                                                    name="openingBalance"
                                                    component={WForm.InputField}
                                                    placeholder="Opening Balance"
                                                />
                                            </Form.Field>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Form.Field>
                                                <label>Gross Balance</label>
                                                <Field
                                                    name="grossBalance"
                                                    component={WForm.InputField}
                                                    placeholder="Gross Balance"
                                                />
                                            </Form.Field>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Form.Field>
                                                <label>Gross Profit</label>
                                                <Field
                                                    name="grossProfit"
                                                    component={WForm.InputField}
                                                    placeholder="Gross Profit"
                                                />
                                            </Form.Field>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Form.Field>
                                                <label>MTM</label>
                                                <Field
                                                    name="mtm"
                                                    component={WForm.InputField}
                                                    placeholder="MTM"
                                                />
                                            </Form.Field>
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>

                                <Table.Footer>
                                    <Table.Row>
                                        <Table.HeaderCell colSpan='4'>
                                            <Button.Group className="SaveButtonGroup">
                                                <Button positive onClick={onSubmit}>Save</Button>
                                                {deleteConfirmDialog && <Button.Or />}
                                                {deleteConfirmDialog && <Button
                                                    negative={true}
                                                    onClick={deleteConfirmDialog.handleOpen}>
                                                    Remove
                                                </Button>}
                                                <Button.Or />
                                                <Link to={ROUTE.MONTHLY_REPORT_LIST_URL}>
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

MonthlyReportForm.propTypes = {
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
    form: 'MonthlyReportForm',
    enableReinitialize: true
})(MonthlyReportForm)
