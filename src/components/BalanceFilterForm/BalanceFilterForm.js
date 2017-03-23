import React from 'react'
import {reduxForm, Field} from 'redux-form'
import {Modal, Button, Grid, Form} from 'semantic-ui-react'
import moment from 'moment'
import WForm from '../Form'
import ClientSearchField from '../ClientSearchField'
import DatePickerField from '../DateRangePickerField'

const renderFromDatePickerField = props => {
    return (
        <DatePickerField
            placeholder="From date"
            isOutsideRange={(date) => moment().isBefore(date)}
            initialVisibleMonth={() => moment().subtract(1, 'months')}
            {...props}
        />
    )
}
const renderClientSearchField = props =>
    <ClientSearchField
        placeholder="Client"
        {...props.input}
    />

const BalanceFilterForm = (props) => {
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
                                    <label>From - To date</label>
                                    <Field
                                        name="fromToDate"
                                        component={renderFromDatePickerField}
                                    />
                                </Form.Field>
                            </Grid.Column>

                            <Grid.Column>
                                <Form.Field>
                                    <label>Client</label>
                                    <Field
                                        name="client"
                                        component={renderClientSearchField}
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

BalanceFilterForm.propTypes = {
    open: React.PropTypes.bool.isRequired,
    onSubmit: React.PropTypes.func.isRequired
}

export default reduxForm({
    form: 'BalanceFilterForm'
})(BalanceFilterForm)
