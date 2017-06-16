import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import {connect} from 'react-redux'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import {Row, Col} from 'react-flexbox-grid'
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'
import toCamelCase from '../../helpers/toCamelCase'
import {TextField, ProductSearchField} from '../ReduxForm'

export const MANUFACTURE_EDIT_PRODUCT_DIALOG_OPEN = 'editMaterials'
const enhance = compose(
    connect((state) => {
        const measurementExp = _.get(state, ['product', 'measurement', 'data'])
        return {
            measurementExp
        }
    }),
    injectSheet({
        loader: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: '#fff',
            top: '0',
            left: '0',
            alignItems: 'center',
            zIndex: '999',
            textAlign: 'center',
            display: ({loading}) => loading ? 'flex' : 'none'
        },
        popUp: {
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'hidden',
            height: '100%'
        },
        titleContent: {
            background: '#fff',
            color: '#333',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #efefef',
            padding: '20px 30px',
            zIndex: '999',
            '& button': {
                right: '13px',
                padding: '0 !important',
                position: 'absolute !important'
            }
        },
        inContent: {
            display: 'flex',
            maxHeight: '50vh',
            minHeight: '220px',
            overflow: 'auto',
            padding: '0 30px',
            color: '#333'
        },
        bodyContent: {
            width: '100%'
        },
        form: {
            position: 'relative'
        },
        field: {
            width: '100%'
        },
        inputField: {
            fontSize: '13px !important',
            height: '50px !important',
            '& div': {
                fontSize: '13px !important'
            },
            '& label': {
                top: '20px !important'
            },
            '& input': {
                marginTop: '0 !important'
            }
        },
        bottomButton: {
            bottom: '0',
            left: '0',
            right: '0',
            padding: '10px',
            zIndex: '999',
            borderTop: '1px solid #efefef',
            background: '#fff',
            textAlign: 'right',
            '& span': {
                fontSize: '13px !important',
                fontWeight: '600 !important',
                color: '#129fdd',
                verticalAlign: 'inherit !important'
            }
        },
        actionButton: {
            fontSize: '13px !important',
            margin: '0 !important'
        },
        buttonSub: {
            textAlign: 'right',
            marginTop: '10px',
            '& span': {
                fontSize: '13px !important',
                fontWeight: '600 !important',
                paddingLeft: '10px',
                paddingRight: '10px'
            },
            '& button': {
                margin: '0 !important',
                fontSize: '13px !important',
                marginRight: '-20px !important'
            }
        },
        productAddForm: {
            padding: '5px 0 20px 0',
            borderBottom: '1px solid #efefef',
            width: '100%',
            '& input': {
                fontSize: '13px !important',
                marginTop: '5px !important'
            },
            '& label': {
                fontSize: '13px',
                top: '24px !important'
            },
            '& div': {
                height: '55px !important'
            },
            '& div div': {
                height: '0px !important'
            },
            '& div:first-child': {
                width: '70%'
            }
        },
        titleAdd: {
            margin: '20px 0 5px',
            '& h3': {
                display: 'inline-block',
                fontSize: '13px',
                fontWeight: '800',
                margin: '0'
            },
            '& a': {
                float: 'right'
            }
        },
        modalListTable: {
            '& li': {
                margin: '0',
                padding: '10px 0',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                '& div:first-child': {
                    paddingLeft: '0'
                },
                '& div:last-child': {
                    paddingRight: '0'
                }
            },
            '& .dottedList:last-child:after': {
                content: '""',
                backgroundImage: 'none'
            },
            '& .dottedList input': {
                fontSize: '13px !important'
            },
            '& .dottedList:last-child': {
                marginBottom: '20px'
            }
        },
        inputFieldCustom: {
            fontSize: '13px !important',
            height: '45px !important',
            marginTop: '7px',
            '& div': {
                fontSize: '13px !important'
            },
            '& label': {
                top: '20px !important',
                lineHeight: '5px !important'
            },
            '& input': {
                marginTop: '0 !important'
            }
        },
        addMaterials: {
            margin: '10px -30px',
            padding: '10px 23px',
            display: 'flex',
            '& input:disabled': {
                color: '#333 !important'
            }
        }
    }),
    withState('openAddMaterials', 'setOpenAddMaterials', false),
    reduxForm({
        form: 'IngredientCreateForm',
        enableReinitialize: true
    })
)
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
const ManufactureEditProductDialog = enhance((props) => {
    const {open, handleSubmit, loading, onClose, classes, isUpdate, measurement, measurementExp} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '135px'} : {width: '600px'}}
            bodyClassName={classes.popUp}>
            <form onSubmit={onSubmit} className={classes.form}>
                <div className={classes.titleContent}>
                    <span>Редактирование сырья</span>
                    <IconButton onTouchTap={onClose}>
                        <CloseIcon2 color="#666666"/>
                    </IconButton>
                </div>
                <div className={classes.bodyContent}>
                    <div className={classes.inContent} style={{minHeight: '115px'}}>
                        <div style={{width: '100%', paddingTop: '10px'}}>
                            <div className={classes.addMaterials}>
                                <Row className={classes.addRaw} style={{width: '100%'}}>
                                    <Col xs={8}>
                                        <Field
                                            label="Наименование товара"
                                            name="ingredient"
                                            component={ProductSearchField}
                                            className={classes.inputFieldCustom}
                                            fullWidth={true}
                                            disabled={isUpdate}
                                        />
                                    </Col>
                                    <Col xs={3}>
                                        <Field
                                            name="amount"
                                            style={{textAlign: 'right'}}
                                            label="Кол-во"
                                            component={TextField}
                                            className={classes.inputFieldCustom}
                                            fullWidth={true}
                                        />
                                    </Col>
                                    <Col xs={1}>
                                        <span style={{position: 'relative', top: '22px'}}>{!measurement ? measurementExp : measurement}</span>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <div className={classes.bottomButton}>
                        <FlatButton
                            label="Сохранить"
                            className={classes.actionButton}
                            primary={true}
                            type="submit"
                        />
                    </div>
                </div>
            </form>
        </Dialog>
    )
})

ManufactureEditProductDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    loading: PropTypes.bool
}

ManufactureEditProductDialog.defaultProps = {
    isUpdate: false
}

export default ManufactureEditProductDialog