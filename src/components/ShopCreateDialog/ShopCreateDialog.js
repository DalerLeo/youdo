import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {Col, Row} from 'react-flexbox-grid'
import {CheckBox, TextField} from '../ReduxForm'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import {Field, reduxForm} from 'redux-form'

const enhance = compose(
    injectSheet({
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
            marginTop: '10px'
        }
    }),
    reduxForm({
        form: 'ShopCreateDalog',
        validate: (values, form) => form.errors
    })
)

const ShopDetails = enhance(({title, open, onClose, onSubmit, classes}) => {
    const actions = [
        <FlatButton
            label="Cancel"
            primary={true}
            onTouchTap={onClose}
        />,
        <FlatButton
            label="Create"
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
            onRequestClose={onClose}>
            <div className={classes.dialogBody}>
              <Row>
                <Col className={classes.leftSide} xs={5}>
                  <div>
                    <h4 className={classes.dialogTitle}>Добавление магазина</h4>
                  </div>
                  <div>
                    <Field name="placeName" component={TextField} label="Наименование" fullWidth={true}  />
                    <Field name="placeType" component={SelectField} label="Тип заведения" fullWidth={true}>
                      <MenuItem value={'1'} />
                      <MenuItem value={'2'} />
                      <MenuItem value={'3'} />
                    </Field>
                    <Field name="placeAddress" component={TextField} label="Адрес" fullWidth={true} />
                    <Field name="placeOrient" component={TextField} label="Ориентир" fullWidth={true}/>
                    <Field name="placePhone" component={TextField} label="Телефон" fullWidth={true}/>
                    <Field name="placeContact" component={TextField} label="Контактное лицо" fullWidth={true}/>
                  </div>
                </Col>
                <Col className={classes.leftSide} xs={7}>
                  <div>
                    123
                  </div>
                </Col>
              </Row>
            </div>
        </Dialog>
    )
})

ShopDetails.propTypes = {
    title: React.PropTypes.string.isRequired,
    open: React.PropTypes.bool.isRequired,
    onClose: React.PropTypes.func.isRequired,
    onSubmit: React.PropTypes.func.isRequired,
    loading: React.PropTypes.bool.isRequired
}

export default ShopDetails
