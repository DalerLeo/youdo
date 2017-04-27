import _ from 'lodash'
import React from 'react'
import {compose, withReducer, withHandlers} from 'recompose'
import injectSheet from 'react-jss'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from 'material-ui/Table'
import DeleteIcon from '../DeleteIcon'

import ProductSearchField from './ProductSearchField'
import TextField from './TextField'

const enhance = compose(
    injectSheet({
        wrapper: {
            marginTop: '20px',
            display: 'flex',
            flexDirection: 'column'
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
        title: {
            paddingTop: '15px',
            fontWeight: 'bold',
            color: 'black !important'
        },
        headers: {
            display: 'flex'
        },
        background: {
            backgroundColor: '#f1f5f8',
            display: 'flex',
            padding: '10px',
            marginTop: '20px',
            '& > div': {
                marginTop: '-20px !important',
                marginRight: '20px',
                height: '72px !important',
                '& input': {
                    height: '75px !important'
                }
            },
            '& > button > div > span': {
                padding: '0 !important',
                textTransform: 'inherit !important',
                fontSize: '16px'
            },
            '& > div:last-child': {
                width: '100% !important'
            },
            '& button': {
                marginTop: '10px !important'
            }
        }
    }),
    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {open: false}),

    withHandlers({
        handleAdd: props => () => {
            const contactName = _.get(props, ['contactName', 'input', 'value'])
            const email = _.get(props, ['email', 'input', 'value'])
            const phoneNumber = _.get(props, ['phoneNumber', 'input', 'value'])

            const onChange = _.get(props, ['contacts', 'input', 'onChange'])
            const contacts = _.get(props, ['contacts', 'input', 'value'])

            if (!_.isEmpty(contactName) && email && phoneNumber) {
                onChange(_.union(contacts, [{contactName, email, phoneNumber}]))
            }
        },

        handleRemove: props => (listIndex) => {
            const onChange = _.get(props, ['contacts', 'input', 'onChange'])
            const contacts = _(props)
                .get(['contacts', 'input', 'value'])
                .filter((item, index) => index !== listIndex)

            onChange(contacts)
        }
    })
)

const ProviderContactsListField = ({classes, state, dispatch, handleAdd, handleRemove, ...defaultProps}) => {
    const contacts = _.get(defaultProps, ['contacts', 'input', 'value']) || []

    return (
        <div className={classes.wrapper}>
            <div>
                <div className={classes.headers}>
                    <IconButton onTouchTap={() => dispatch({open: !state.open})}>
                        <ContentAdd />
                    </IconButton>
                </div>
                {state.open && <div className={classes.background}>
                    <TextField
                        label="Контактное лицо"
                        {..._.get(defaultProps, 'contactName')}
                    />
                    <TextField
                        name="email"
                        {..._.get(defaultProps, 'email')}
                    />
                    <TextField
                        name="phoneNumber"
                        {..._.get(defaultProps, 'phoneNumber')}
                    />
                    <FlatButton label="Применить" onTouchTap={handleAdd} style={{color: '#12aaeb'}}/>
                </div>}
            </div>
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
                            <TableHeaderColumn
                                className={classes.tableTitle}>Наименование</TableHeaderColumn>
                            <TableHeaderColumn className={classes.tableTitle}>Кол-во</TableHeaderColumn>
                            <TableHeaderColumn className={classes.tableTitle}>Сумма</TableHeaderColumn>
                            <TableHeaderColumn className={classes.tableTitle}>Действися</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody
                        displayRowCheckbox={false}
                        deselectOnClickaway={false}
                        showRowHover={false}
                        stripedRows={false}>
                        {_.map(contacts, (item, index) => (
                            <TableRow key={index} className={classes.tableRow}>
                                <TableRowColumn>{_.get(item, ['contactName', 'text'])}</TableRowColumn>
                                <TableRowColumn>{_.get(item, 'email')}</TableRowColumn>
                                <TableRowColumn>{_.get(item, 'phoneNumber')}</TableRowColumn>
                                <TableRowColumn>
                                    <IconButton onTouchTap={() => handleRemove(index)}>
                                        <DeleteIcon color="#666666"/>
                                    </IconButton>
                                </TableRowColumn>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default enhance(ProviderContactsListField)
