import _ from 'lodash'
import React from 'react'
import {compose, withReducer, withHandlers} from 'recompose'
import injectSheet from 'react-jss'
import {Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from 'material-ui/Table'
import {Field} from 'redux-form'
import ImageCheck from '../Icons/check'
import DeleteIcon from '../DeleteIcon'

import ProductSearchField from './ProductSearchField'
import TextField from './TextField'

const enhance = compose(
    injectSheet({
        wrapper: {
            display: 'flex',
            flexDirection: 'column'
        },
        table: {
            marginTop: '20px',
            maxHeight: '300px',
            overflow: 'auto'
        },
        tableTitle: {
            fontWeight: '600',
            color: '#333 !important',
            textAlign: 'left'
        },
        tableRow: {
            height: '40px !important',
            border: 'none !important',
            '& td:first-child': {
                width: '250px'
            },
            '& tr': {
                border: 'none !important'
            },
            '& td': {
                height: '40px !important',
                padding: '0 5px !important'
            },
            '& th:first-child': {
                width: '250px',
                textAlign: 'left !important',
                fontWeight: '600 !important'
            },
            '& th': {
                textAlign: 'left !important',
                border: 'none !important',
                height: '40px !important',
                padding: '0 5px !important',
                fontWeight: '600 !important'
            }
        },
        title: {
            fontWeight: '600',
            border: 'none !important'
        },
        headers: {
            display: 'flex',
            alignItems: 'center',
            height: '40px',
            justifyContent: 'space-between',
            '& span': {
                textTransform: 'lowercase !important'
            }
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
                padding: '0 !important'
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
            const ingredient = _.get(props, ['ingredient', 'input', 'value'])
            const amount = _.get(props, ['amount', 'input'])

            const onChange = _.get(props, ['ingredients', 'input', 'onChange'])
            const ingredients = _.get(props, ['ingredients', 'input', 'value'])

            if (!_.isEmpty(ingredient) && amount) {
                onChange(_.union(ingredients, [{ingredient, amount}]))
            }
        },

        handleRemove: props => (listIndex) => {
            const onChange = _.get(props, ['ingredients', 'input', 'onChange'])
            const ingredients = _(props)
                .get(['ingredients', 'input', 'value'])
                .filter((item, index) => index !== listIndex)

            onChange(ingredients)
        }
    })
)

const ManufactureListMaterialField = ({classes, state, handleRemove, ...defaultProps}) => {
    const ingredients = _.get(defaultProps, ['ingredients', 'input', 'value']) || []

    return (
        <div className={classes.wrapper}>
            {openAddMaterials && <div className={classes.addMaterials}>
                <Fields
                    names={['products', 'ingredient', 'amount', 'measurement']}
                    component={ManufactureListMaterialField}
                />
            </div>}
            {state.open &&
            <div>
                <Col xs={8}>
                    <div>
                        <Field
                            name="name"
                            component={ProductSearchField}
                            className={classes.inputFieldMaterials}
                            label="Наименование"
                            fullWidth={true}/>
                    </div>

                </Col>
                <Col xs={2}>
                    <Field
                        name="amount"
                        component={TextField}
                        className={classes.inputFieldMaterials}
                        label="Кол-во"
                        fullWidth={true}/>
                </Col>
                <Col xs={1}>
                    <span>15</span>
                </Col>
                <Col xs={1}>
                    <IconButton>
                        <div>
                            <ImageCheck style={{color: '#129fdd'}}/>
                        </div>
                    </IconButton>
                </Col>
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
                            <TableHeaderColumn
                                className={classes.tableTitle}>Наименование</TableHeaderColumn>
                            <TableHeaderColumn className={classes.tableTitle}>Кол-во</TableHeaderColumn>
                            <TableHeaderColumn className={classes.tableTitle}>Ед</TableHeaderColumn>
                            <TableHeaderColumn></TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody
                        displayRowCheckbox={false}
                        deselectOnClickaway={false}
                        showRowHover={false}
                        stripedRows={false}>
                        {_.map(ingredients, (item, index) => (
                            <TableRow key={index} className={classes.tableRow}>
                                <TableRowColumn>{_.get(item, ['ingredient', 'text'])}</TableRowColumn>
                                <TableRowColumn>{_.get(item, 'amount')}</TableRowColumn>
                                <TableRowColumn>15</TableRowColumn>
                                <TableRowColumn style={{textAlign: 'right'}}>
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

export default enhance(ManufactureListMaterialField)
