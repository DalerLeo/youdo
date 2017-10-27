import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../Styles/MainStyles'
import {Row, Col} from 'react-flexbox-grid'

export const STAT_MANUFACTURE_CREATE_DIALOG_OPEN = 'openCreateDialog'

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
        innerTitle: {
            fontWeight: 'bold'
        },
        transactions: {
            padding: '10px 0',
            '& .row': {
                padding: '15px 0',
                '&:after': {
                    left: '0.5rem',
                    right: '0.5rem'
                },
                '&:first-child': {
                    fontWeight: '600'
                },
                '&:last-child:after': {
                    position: 'static'
                },
                '& > div:nth-child(2)': {
                    textAlign: 'right'
                },
                '& > div:nth-child(3)': {
                    textAlign: 'right'
                }
            }
        }
    }))
)

const statManufactureCreateDialog = enhance((props) => {
    const {open, loading, onClose, classes} = props

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '300px'} : {width: '500px'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>Использованные материалы</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <div className={classes.inContent}>
                    <div className={classes.field}>
                        <div className={classes.innerTitle}>Сырье</div>
                        <div className={classes.transactions}>
                            <Row className="dottedList">
                                <Col xs={6}>Наименование</Col>
                                <Col xs={3}>Кол-во</Col>
                                <Col xs={3}>Норма</Col>
                            </Row>
                            <Row className="dottedList">
                                <Col xs={6}>Дистилированная вода</Col>
                                <Col xs={3}>76 л</Col>
                                <Col xs={3}>70 л</Col>
                            </Row>
                            <Row className="dottedList">
                                <Col xs={6}>Бура</Col>
                                <Col xs={3}>3 кг</Col>
                                <Col xs={3}>3 кг</Col>
                            </Row>
                            <Row className="dottedList">
                                <Col xs={6}>Каустик</Col>
                                <Col xs={3}>3 кг</Col>
                                <Col xs={3}>3 кг</Col>
                            </Row>
                            <Row className="dottedList">
                                <Col xs={6}>Гранит</Col>
                                <Col xs={3}>3 кг</Col>
                                <Col xs={3}>3 кг</Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    )
})

statManufactureCreateDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

statManufactureCreateDialog.defaultProps = {
    isUpdate: false
}

export default statManufactureCreateDialog
