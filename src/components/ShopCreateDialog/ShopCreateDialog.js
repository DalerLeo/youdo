import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {Col, Row} from 'react-flexbox-grid'
import {TextField} from '../ReduxForm'
import {Field, reduxForm} from 'redux-form'
import ShopDetailsMap from '../ShopDetailsMap/ShopDetailsMap'

const enhance = compose(
    injectSheet({
        dialog: {
            '& div:last-child': {
                textAlign: 'left !important',
                '& button': {
                    marginLeft: '50px !important',
                    marginBottom: '5px !important',
                    color: '#12aaeb !important'
                }
            }
        },
        dialogTitle: {
            width: '220px',
            margin: '0 auto',
            padding: '10px 0',
            textAlign: 'center',
            background: '#12aaeb',
            color: '#fff',
            position: 'relative',
            top: '-34px'
        },
        dialogBody: {
            marginTop: '10px',
            marginBottom: '-30px'
        },
        topMargin: {
            marginTop: '-15px !important'
        },
        mapContent: {
            margin: '-35px -24px -35px 0',
            height: '500px'
        }
    }),
    reduxForm({
        form: 'ShopCreateDalog',
        validate: (values, form) => form.errors
    })
)

const ShopDetails = enhance(({open, onClose, onSubmit, classes}) => {
    const actions = [
        <FlatButton
            label="Cancel"
            primary={true}
            onTouchTap={onClose}
        />,
        <FlatButton
            label="Apply"
            primary={true}
            keyboardFocused={true}
            onTouchTap={onSubmit}
        />
    ]

    return (
        <Dialog
            actions={actions}
            modal={false}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}>
            <div className={classes.dialogBody}>
              <Row>
                <Col className={classes.leftSide} xs={5}>
                  <div>
                    <h4 className={classes.dialogTitle}>Добавление магазина</h4>
                  </div>
                  <div>
                    <Field name="placeName" component={TextField} label="Наименование" fullWidth={true} className={classes.topMargin}/>
                    <Field name="placeAddress" component={TextField} label="Адрес" fullWidth={true} className={classes.topMargin} />
                    <Field name="placeOrient" component={TextField} label="Ориентир" fullWidth={true} className={classes.topMargin} />
                    <Field name="placePhone" component={TextField} label="Телефон" fullWidth={true} className={classes.topMargin} />
                    <Field name="placeContact" component={TextField} label="Контактное лицо" fullWidth={true} className={classes.topMargin} />
                  </div>
                </Col>
                <Col className={classes.leftSide} xs={7}>
                  <div className={classes.mapContent} >
                    <ShopDetailsMap lat={12} lng={23} />
                  </div>
                </Col>
              </Row>
            </div>
        </Dialog>
    )
})

ShopDetails.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

export default ShopDetails
