import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import {Col} from 'react-flexbox-grid'
import Dialog from 'material-ui/Dialog'
import CircularProgress from 'material-ui/CircularProgress'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import FlatButton from 'material-ui/FlatButton'
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from 'material-ui/Table'
import {reduxForm, SubmissionError} from 'redux-form'
import TextField from 'material-ui/TextField'
import DeleteIcon from '../DeleteIcon'
import CloseIcon2 from '../CloseIcon2'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import SupplySearchField from '../ReduxForm/SupplySearchField'
import StockSearchField from '../ReduxForm/StockSearchField'
import DateToDateField from '../ReduxForm/DateToDateField'
import PaymentTypeSearchField from '../ReduxForm/PaymentTypeSearchField'
import toCamelCase from '../../helpers/toCamelCase'

export const SUPPLY_CREATE_DIALOG_OPEN = 'openCreateDialog'
const validate = (data) => {
    const errors = toCamelCase(data)
    const nonFieldErrors = _.get(errors, 'nonFieldErrors')
    const latLng = (_.get(errors, 'lat') || _.get(errors, 'lon')) && 'Location is required.'
    throw new SubmissionError({
        ...errors,
        latLng,
        _error: nonFieldErrors
    })
}
const enhance = compose(
    injectSheet({
        dialog: {
            width: '1200px !important'
        },
        loader: {
            width: '120px',
            margin: '0 auto',
            padding: '15px',
            textAlign: 'center',
            display: ({loading}) => loading ? 'flex' : 'none',
            flexDirection: 'center'
        },
        fields: {
            display: ({loading}) => !loading ? 'flex' : 'none'
        },
        flex: {
            display: 'flex',
            '& > div:first-child': {
                padding: '0 !important',
                borderBottom: '1px solid #efefef'
            }
        },
        title: {
            paddingTop: '15px',
            fontWeight: 'bold',
            color: 'black !important'
        },
        titleContent: {
            display: 'flex',
            color: 'black',
            fontWeight: 'bold',
            position: 'relative',
            borderBottom: '1px solid #efefef',
            marginLeft: '-24px',
            marginRight: '-24px',
            padding: '0px 30px 20px 30px',
            '& button': {
                position: 'absolute !important',
                right: '20px',
                margin: '-15px -10px 0 0 !important'
            }
        },
        left: {
            padding: '0 20px 10px 0'
        },
        underLine: {
            borderBottom: '1px solid #efefef',
            display: 'flex',
            '& > div:last-child > div:first-child': {
                display: 'flex',
                position: 'relative',
                '& button': {
                    position: 'absolute !important',
                    right: '0 !important',
                    marginTop: '15px !important'
                }
            }
        },
        radioButton: {
            '& > div': {
                marginTop: '10px'
            }
        },
        selectContent: {
            '& > div': {
                marginTop: '-10px',
                width: '100% !important'
            }
        },
        background: {
            backgroundColor: '#f1f5f8',
            display: 'flex',
            padding: '10px',
            marginTop: '20px',
            '& > div': {
                marginTop: '-20px !important',
                marginRight: '20px'
            },
            '& > div:first-child': {
                width: '110% !important'
            },
            '& button': {
                marginTop: '10px !important'
            }
        },
        bottom: {
            '& > div:first-child': {
                position: 'relative',
                marginTop: '20px',
                '& > button': {
                    position: 'absolute !important',
                    right: '0'
                }
            }
        },
        total: {
            '& > div': {
                padding: '15px 0',
                display: 'flex',
                '& > div:first-child': {
                    width: '75%'
                }
            },
            '& > div:first-child': {
                borderBottom: '1px dotted #efefef'
            }
        },
        checkout: {
            borderTop: '1px solid #efefef',
            position: 'relative',
            marginLeft: '-24px',
            marginRight: '-24px',
            paddingBottom: '20px',
            paddingTop: '10px',
            '& > button': {
                position: 'absolute !important',
                right: '25px'
            }
        },
        table: {
            paddingTop: '20px'
        },
        tableTitle: {
            fontWeight: 'bold',
            color: 'black !important',
            textAlign: 'left'
        },
        tableRow: {
            borderBottom: '1px dashed #dadfe4 !important',
            height: '40px !important',
            '& td:first-child': {
                width: '250px'
            },
            '& td': {
                height: '40px !important',
                padding: '0 5px !important'
            },
            '& th:first-child': {
                width: '250px',
                textAlign: 'left !important',
                borderBottom: '1px dashed #dadfe4 !important',
                fontWeight: 'bold !important'
            },
            '& th': {
                textAlign: 'left !important',
                height: '40px !important',
                padding: '0 5px !important',
                borderBottom: '1px dashed #dadfe4 !important',
                fontWeight: 'bold !important'
            }
        },
        right: {
            borderLeft: '1px solid #efefef',
            padding: '0 0 10px 20px'
        }
    }),
    withState('state', 'setState', false),
    reduxForm({
        form: 'SupplyCreateForm',
        enableReinitialize: true
    })
)
const tableData = [
    {
        name: 'John Smith',
        status: 'Employed',
        selected: true,
    },
    {
        name: 'Randal White',
        status: 'Unemployed',
    },
    {
        name: 'Stephanie Sanders',
        status: 'Employed',
        selected: true,
    },
    {
        name: 'Steve Brown',
        status: 'Employed',
    },
    {
        name: 'Joyce Whitten',
        status: 'Employed',
    },
    {
        name: 'Samuel Roberts',
        status: 'Employed',
    },
    {
        name: 'Randal White',
        status: 'Unemployed',
    },
    {
        name: 'Stephanie Sanders',
        status: 'Employed',
        selected: true,
    },
    {
        name: 'Steve Brown',
        status: 'Employed',
    },
    {
        name: 'Joyce Whitten',
        status: 'Employed',
    },
    {
        name: 'Samuel Roberts',
        status: 'Employed',
    },
    {
        name: 'Randal White',
        status: 'Unemployed',
    },
    {
        name: 'Stephanie Sanders',
        status: 'Employed',
        selected: true,
    },
    {
        name: 'Steve Brown',
        status: 'Employed',
    },
    {
        name: 'Joyce Whitten',
        status: 'Employed',
    },
    {
        name: 'Samuel Roberts',
        status: 'Employed',
    },
    {
        name: 'Randal White',
        status: 'Unemployed',
    },
    {
        name: 'Stephanie Sanders',
        status: 'Employed',
        selected: true,
    },
    {
        name: 'Steve Brown',
        status: 'Employed',
    },
    {
        name: 'Joyce Whitten',
        status: 'Employed',
    },
    {
        name: 'Samuel Roberts',
        status: 'Employed',
    },
    {
        name: 'Randal White',
        status: 'Unemployed',
    },
    {
        name: 'Stephanie Sanders',
        status: 'Employed',
        selected: true,
    },
    {
        name: 'Steve Brown',
        status: 'Employed',
    },
    {
        name: 'Joyce Whitten',
        status: 'Employed',
    },
    {
        name: 'Samuel Roberts',
        status: 'Employed',
    },
    {
        name: 'Adam Moore',
        status: 'Employed',
    }
]
const customContentStyle = {
    width: '900px',
    maxWidth: 'none'
}
const SupplyCreateDialog = enhance((props) => {
    const {open, handleSubmit, state, setState, onClose, classes} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))
    return (
        <Dialog
            modal={true}
            contentStyle={customContentStyle}
            open={open}
            onRequestClose={onClose}
            autoScrollBodyContent={true}>
            <form onSubmit={onSubmit} scrolling="auto">
                <div className={classes.loader}>
                    <CircularProgress size={80} thickness={5}/>
                </div>
                <div className={classes.titleContent}>
                    <span>Add an order</span>
                    <IconButton>
                        <CloseIcon2 color="#666666"/>
                    </IconButton>
                </div>
                <div className={classes.underLine}>
                    <Col xs={4}>
                        <div className={classes.left}>
                            <div className={classes.title}>Choose supplier</div>
                            <div className={classes.selectContent}>
                                <Field
                                    name="deliveryComp"
                                    component={SupplySearchField}
                                    label="Поставщик"
                                    fullWidth={true}/>
                                <RadioButtonGroup name="delivery" defaultSelected="not_light"
                                                  className={classes.radioButton}>
                                    <RadioButton
                                        value="light"
                                        label="Tursunov Bohodir"
                                    />
                                    <RadioButton
                                        value="not_light"
                                        label="Ashurov Anvar"
                                    />
                                </RadioButtonGroup>
                                <Field
                                    name="nameStock"
                                    component={StockSearchField}
                                    label="Склад назначения"
                                    fullWidth={true}/>
                            </div>
                            <div className={classes.title}>Условия доставки</div>
                            <div className={classes.selectContent}>
                                <Field
                                    name="nameStock"
                                    component={StockSearchField}
                                    label="Склад назначения"
                                    fullWidth={true}/>
                                <Field
                                    name="toDate"
                                    component={DateToDateField}
                                    label="Дата поставки "
                                    fullWidth={true}/>
                                <Field
                                    name="paymentType"
                                    component={PaymentTypeSearchField}
                                    label="Валюта оплаты "
                                    fullWidth={true}/>
                            </div>
                        </div>
                    </Col>
                    <Col md={8} className={classes.right}>
                        <div>
                            <div className={classes.title}>List of production</div>
                            <FlatButton label="+ add product" style={{color: '#12aaeb'}} onClick={() => setState(!state)} />
                        </div>
                        {state && <div className={classes.background}>
                            <SelectField
                                floatingLabelText="Payment type"
                                value="No">
                                <MenuItem value={null} primaryText=""/>
                                <MenuItem value={false} primaryText="No"/>
                                <MenuItem value={true} primaryText="Yes"/>
                            </SelectField>
                            <TextField
                                hintText="Amount"
                                floatingLabelText="Amount"
                            />
                            <TextField
                                hintText="Total Cost"
                                floatingLabelText="Total Cost"
                            />
                            <FlatButton label="Apply" style={{color: '#12aaeb'}}/>
                        </div>}
                        <div className={classes.table}>
                            <Table
                                fixedHeader={true}
                                fixedFooter={false}
                                multiSelectable={false}>
                                <TableHeader
                                    displaySelectAll={false}
                                    adjustForCheckbox={false}
                                    enableSelectAll={false}
                                    className={classes.title}>
                                    <TableRow className={classes.tableRow}>
                                        <TableHeaderColumn className={classes.tableTitle}>Name</TableHeaderColumn>
                                        <TableHeaderColumn className={classes.tableTitle}>Status</TableHeaderColumn>
                                        <TableHeaderColumn className={classes.tableTitle}>Cost</TableHeaderColumn>
                                        <TableHeaderColumn className={classes.tableTitle}></TableHeaderColumn>
                                    </TableRow>
                                </TableHeader>
                                <TableBody
                                    displayRowCheckbox={false}
                                    deselectOnClickaway={false}
                                    showRowHover={false}
                                    stripedRows={false}>
                                    {tableData.map((row, index) => (
                                        <TableRow key={index} selected={row.selected} className={classes.tableRow}>
                                            <TableRowColumn>{row.name}</TableRowColumn>
                                            <TableRowColumn>{row.status}</TableRowColumn>
                                            <TableRowColumn>35 000</TableRowColumn>
                                            <TableRowColumn>
                                                <IconButton>
                                                    <DeleteIcon color="#666666"/>
                                                </IconButton>
                                            </TableRowColumn>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Col>
                </div>
                <div className={classes.bottom}>
                    <div>
                        <span className={classes.title}>Additional delivery costs</span>
                        <FlatButton label="+ Add expense" style={{color: '#12aaeb'}}></FlatButton>
                    </div>
                    <div className={classes.background}>
                        <TextField
                            hintText="Flow description"
                            floatingLabelText="Flow description"
                        />
                        <TextField
                            hintText="Total Cost"
                            floatingLabelText="Total Cost"
                        />
                        <SelectField
                            floatingLabelText="Currency"
                            value="USA">
                            <MenuItem value={null} primaryText=""/>
                            <MenuItem value={false} primaryText="UZS"/>
                            <MenuItem value={true} primaryText="USA"/>
                        </SelectField>
                        <FlatButton label="Apply" style={{color: '#12aaeb'}}/>
                    </div>
                    <div className={classes.total}>
                        <div>
                            <div className={classes.title}>Description</div>
                            <span className={classes.title}>Total Cost</span>
                        </div>
                        <div>
                            <div>asjdlakj lkjslj asdas das da asd</div>
                            <span>3 500 000</span>
                        </div>
                    </div>
                    <div className={classes.checkout}>
                        <FlatButton label="Checkout" style={{color: '#12aaeb'}}/>
                    </div>
                </div>
            </form>
        </Dialog>
    )
})
SupplyCreateDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}
export default SupplyCreateDialog
