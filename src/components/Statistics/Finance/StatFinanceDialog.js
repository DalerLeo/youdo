import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import {Row, Col} from 'react-flexbox-grid'
import t from '../../../helpers/translate'

const enhance = compose(
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
            color: '#333 !important',
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'hidden',
            height: '100%',
            marginBottom: '64px'
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
        content: {
            width: '100%',
            display: 'block'
        },
        tableWrapper: {
            padding: '0 30px',
            '& .row': {
                padding: '15px 0',
                '& > div:last-child': {
                    textAlign: 'right'
                },
                '&:first-child': {
                    fontWeight: '600'
                },
                '&:last-child:after': {
                    display: 'none'
                }
            }
        },
        summary: {
            borderTop: '1px #efefef solid',
            padding: '15px 0',
            margin: '0 30px',
            textAlign: 'right',
            fontWeight: 'bold'
        }
    }),
)

const StatFinanceDialog = enhance((props) => {
    const {open, loading, onClose, classes} = props

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '400px'} : {width: '700px'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>{t('Заказ')} № 221</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.content}>
                <div className={classes.tableWrapper}>
                    <Row className="dottedList">
                        <Col xs={8}>{t('Товар')}</Col>
                        <Col xs={2}>{t('Кол-во')}</Col>
                        <Col xs={2}>{t('Сумма')}</Col>
                    </Row>
                    <Row className="dottedList">
                        <Col xs={8}>Миф морозная свежесть</Col>
                        <Col xs={2}>50 шт</Col>
                        <Col xs={2}>758 000 UZS</Col>
                    </Row>
                    <Row className="dottedList">
                        <Col xs={8}>Миф морозная свежесть</Col>
                        <Col xs={2}>50 шт</Col>
                        <Col xs={2}>758 000 UZS</Col>
                    </Row>
                </div>
                <div className={classes.summary}>3 000 000 UZS</div>
            </div>
        </Dialog>
    )
})

StatFinanceDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool
}

export default StatFinanceDialog
