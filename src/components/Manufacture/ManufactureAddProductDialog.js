import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {Field, reduxForm, Fields} from 'redux-form'
import {ManufactureListMaterialField, ProductSearchField} from '../ReduxForm'
import CloseIcon2 from '../CloseIcon2'
import MainStyles from '../Styles/MainStyles'
import IconButton from 'material-ui/IconButton'

export const MANUFACTURE_ADD_PRODUCT_DIALOG_OPEN = 'addProduct'

const enhance = compose(
    injectSheet(_.merge(MainStyles, {
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
        addMaterials: {
            background: 'rgb(242, 245, 248)',
            margin: '10px -30px',
            padding: '10px 23px',
            display: 'flex',
            '& input': {
                fontSize: '13px !important',
                marginTop: '5px !important'
            },
            '& label': {
                fontSize: '13px !important',
                top: '20px !important'
            },
            '& div div:first-child': {
                height: '50px !important'
            }
        }
    })),
    withState('openAddMaterials', 'setOpenAddMaterials', false),
    reduxForm({
        form: 'ProviderCreateForm',
        enableReinitialize: true
    })
)

const ManufactureAddProductDialog = enhance((props) => {
    const {open, loading, onClose, classes} = props

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '135px'} : {width: '600px'}}
            bodyClassName={classes.popUp}>

            <div className={classes.titleContent}>
                <span>Добавление продукта</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <div className={classes.inContent}>
                    <div style={{width: '100%'}}>
                        <Field
                            name="product"
                            label="Наименование продукта"
                            component={ProductSearchField}
                            className={classes.inputFieldMaterials}
                            fullWidth={true}/>
                        <Fields
                            names={['ingredients', 'ingredient', 'amount', 'measurement']}
                            component={ManufactureListMaterialField}
                        />
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
        </Dialog>
    )
})

ManufactureAddProductDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    loading: PropTypes.bool
}

ManufactureAddProductDialog.defaultProps = {
    isUpdate: false
}

export default ManufactureAddProductDialog
