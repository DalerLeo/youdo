import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {Col, Row} from 'react-flexbox-grid'
import {Field, reduxForm} from 'redux-form'
import {Marker} from 'react-google-maps'
import validate from '../../helpers/validate'
import {TextField} from '../ReduxForm'
import GoogleMap from '../GoogleMap'

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

        title: {
            width: '220px',
            margin: '0 auto',
            padding: '10px 0',
            textAlign: 'center',
            background: '#12aaeb',
            color: '#fff',
            position: 'relative',
            top: '-34px'
        },

        body: {
            marginTop: '10px',
            marginBottom: '-30px'
        },

        topMargin: {
            marginTop: '-15px !important'
        },

        map: {
            margin: '-35px -24px -35px 0',
            height: '500px'
        }
    }),
    reduxForm({
        form: 'ShopCreateForm'
    })
)

const ShopCreateDialog = enhance((props) => {
    const {open, handleSubmit, onClose, classes} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))

    const center = {
        lat: 41.3076492,
        lng: 69.2705497
    }

    return (
        <Dialog
            modal={false}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}>
            <div className={classes.body}>
                <form onSubmit={onSubmit}>
                    <Row>
                        <Col xs={5}>
                            <div>
                                <h4 className={classes.title}>Добавление магазина</h4>
                            </div>
                            <div>
                                <div>
                                    <Field
                                        name="name"
                                        component={TextField}
                                        label="Наименование"
                                        fullWidth={true}
                                        className={classes.topMargin}
                                    />

                                    <Field
                                        name="address"
                                        component={TextField}
                                        label="Адрес"
                                        fullWidth={true}
                                        className={classes.topMargin}
                                    />

                                    <Field
                                        name="guide"
                                        component={TextField}
                                        label="Ориентир"
                                        fullWidth={true}
                                        className={classes.topMargin}
                                    />

                                    <Field
                                        name="phone"
                                        component={TextField}
                                        label="Телефон"
                                        fullWidth={true}
                                        className={classes.topMargin}
                                    />

                                    <Field
                                        name="contactName"
                                        component={TextField}
                                        label="Контактное лицо"
                                        fullWidth={true}
                                        className={classes.topMargin}
                                    />
                                </div>

                                <div>
                                    <FlatButton
                                        label="Cancel"
                                        primary={true}
                                        onTouchTap={onClose}
                                    />

                                    <FlatButton
                                        label="Apply"
                                        primary={true}
                                        type="submit"
                                        keyboardFocused={true}
                                    />
                                </div>
                            </div>
                        </Col>
                        <Col xs={7}>
                            <div className={classes.map}>
                                <GoogleMap center={center}>
                                    <Marker position={center} />
                                </GoogleMap>
                            </div>
                        </Col>
                    </Row>
                </form>
            </div>
        </Dialog>
    )
})

ShopCreateDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired
}

export default ShopCreateDialog
