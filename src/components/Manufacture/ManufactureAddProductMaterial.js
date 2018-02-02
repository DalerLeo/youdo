import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {Field, reduxForm} from 'redux-form'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import t from '../../helpers/translate'
import numberFormat from '../../helpers/numberFormat'
import {TYPE_RAW} from '../Manufacture'
import {connect} from 'react-redux'
import {Row, Col} from 'react-flexbox-grid'
import Groceries from '../Images/groceries.svg'
import {EquipmentSearchField, ShiftSearchField, DateField} from '../ReduxForm'

const enhance = compose(
    injectSheet({
        loader: {
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            background: '#fff'
        },
        wrapper: {
            position: 'relative',
            padding: '0 30px',
            marginBottom: '5px',
            '& .row': {
                alignItems: 'center',
                '& div': {
                    lineHeight: '55px'
                }
            }
        },
        title: {
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
        dialog: {
            overflowY: 'auto',
            padding: '0 !important'
        },
        dialogBody: {
            display: 'flex',
            minHeight: '400px',
            '& tbody:last-child': {
                borderBottom: '1px #efefef solid'

            }
        },
        noPadding: {
            padding: '0 !important',
            maxHeight: 'none !important',
            marginBottom: '50px',
            fontSize: 'unset !important',
            color: '#333 !important'
        },
        subTitle: {
            fontWeight: '600'
        },
        inputFieldCustom: {
            fontSize: '13px !important',
            height: '45px !important',
            marginTop: '7px',
            width: '100% !important',
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
        inputDateCustom: {
            height: '45px !important',
            '& input': {
                marginTop: '0 !important'
            },
            '& label': {
                top: '20px !important',
                lineHeight: '5px !important'
            },
            '& div': {
                fontSize: '13px !important',
                height: '45px !important',
                width: '100% !important'
            }
        },
        bottomButton: {
            position: 'relative',
            padding: '10px',
            borderTop: '1px solid #efefef',
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
            margin: '0 !important',
            position: 'absolute'
        },
        comment: {
            display: 'flex',
            alignItems: 'center',
            padding: '10px 30px'
        },
        commentText: {
            fontSize: '14px',
            fontWeight: '600'
        },
        commentField: {
            maxHeight: '70px',
            '& > div:first-child': {
                padding: '3px 7px',
                top: '12px',
                bottom: 'auto !important'
            },
            '& hr': {
                opacity: '0'
            },
            '& textarea': {
                border: 'solid 1px #999999 !important',
                margin: 'auto',
                padding: '3px 7px !important'
            }
        },
        leftSide: {
            flexBasis: '25%',
            maxWidth: '25%',
            borderRight: '1px #efefef solid',
            padding: '20px 30px',
            '&  > div > div:first-child': {
                width: '100% !important'
            }

        },
        rightSide: {
            flexBasis: '75%',
            maxWidth: '75%'
        },
        addButtons: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 30px'
        },
        productsList: {
            padding: '0 30px',
            '& .row': {
                margin: '0',
                padding: '15px 0',
                '&:first-child': {fontWeight: '600'},
                '&:last-child:after': {display: 'none'},
                '& > div': {
                    '&:first-child': {paddingLeft: '0'},
                    '&:last-child': {paddingRight: '0'}
                }
            }
        },
        alignRight: {
            textAlign: 'right'
        },
        imagePlaceholder: {
            padding: '50px 0',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            '& > div': {
                textAlign: 'center',
                color: '#adadad'
            },
            '& img': {
                width: '70px',
                marginBottom: '20px',
                marginTop: '25px'
            }
        }
    }),
    connect((state) => {
        const products = _.get(state, ['form', 'ManufactureProductMaterialForm', 'values', 'products'])
        return {
            products
        }
    }),
    reduxForm({
        form: 'ManufactureProductMaterialForm',
        enableReinitialize: true
    })
)

const ManufactureAddProductMaterial = enhance((props) => {
    const {type, open, handleSubmit, onClose, classes, handleOpenAddProduct, products, manufacture} = props
    const onSubmit = handleSubmit(() => props.onSubmit())

    const iconStyle = {
        icon: {
            color: '#666',
            width: 25,
            height: 25
        },
        button: {
            width: 40,
            height: 40,
            padding: '0'
        }
    }

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={{maxWidth: 'none', width: '1000px'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.noPadding}>
            <div className={classes.title}>
                <span>{type === TYPE_RAW ? t('Добавление сырья') : t('Добавление продукта')}</span>
                <IconButton
                    iconStyle={iconStyle.icon}
                    style={iconStyle.button}
                    touch={true}
                    onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <form onSubmit={onSubmit} className={classes.form} style={{minHeight: 'auto'}}>
                <div className={classes.dialogBody}>
                    <div className={classes.leftSide}>
                        <Field
                            name={'date'}
                            label={t('Дата изготовления')}
                            component={DateField}
                            className={classes.inputDateCustom}/>
                        <Field
                            name={'shift'}
                            label={t('Смена')}
                            component={ShiftSearchField}
                            className={classes.inputFieldCustom}/>
                        <Field
                            name={'equipment'}
                            label={t('Оборудование')}
                            component={EquipmentSearchField}
                            data-manufacture={manufacture}
                            className={classes.inputFieldCustom}/>
                    </div>
                    <div className={classes.rightSide}>
                        <div className={classes.addButtons}>
                            <strong>{t('Список товаров')}</strong>
                            <FlatButton
                                label={t('добавить товары')}
                                style={{color: '#12aaeb'}}
                                labelStyle={{fontSize: '13px', textTransform: 'unset'}}
                                className={classes.span}
                                onTouchTap={() => { handleOpenAddProduct() }}/>
                        </div>

                        <div className={classes.productsList}>
                            {products &&
                            <Row className="dottedList">
                                <Col xs={4}>{t('Наименование')}</Col>
                                <Col xs={4}>{t('Тип')}</Col>
                                <Col xs={2} className={classes.alignRight}>ОК</Col>
                                <Col xs={2} className={classes.alignRight}>{t('Брак')}</Col>
                            </Row>}
                            {_.map(products, (item) => {
                                const id = _.get(item, ['product', 'value', 'id'])
                                const name = _.get(item, ['product', 'value', 'name'])
                                const productType = _.get(item, ['product', 'value', 'type'])
                                const measurement = _.get(item, ['product', 'value', 'measurement', 'name'])
                                const amount = numberFormat(_.get(item, 'amount'), measurement)
                                const defect = numberFormat(_.get(item, 'defect'), measurement)
                                return (
                                    <Row key={id} className="dottedList">
                                        <Col xs={4}>{name}</Col>
                                        <Col xs={4}>{productType}</Col>
                                        <Col xs={2} className={classes.alignRight}>{amount}</Col>
                                        <Col xs={2} className={classes.alignRight}>{defect}</Col>
                                    </Row>
                                )
                            })}
                            {(_.isEmpty(products) || !products) &&
                            <div className={classes.imagePlaceholder}>
                                <div>
                                    <img src={Groceries} alt=""/>
                                    <div>{t('Вы еще не выбрали ни одного товара')}...<br/>
                                        <a onClick={() => { handleOpenAddProduct() }}>{t('добавить товары')}?</a>
                                    </div>
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>
                <div className={classes.bottomButton}>
                    <FlatButton
                        label={t('Сохранить')}
                        className={classes.actionButton}
                        primary={true}
                        type="submit"
                    />
                </div>
            </form>
        </Dialog>
    )
})

ManufactureAddProductMaterial.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
}

export default ManufactureAddProductMaterial
