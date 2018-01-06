import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {compose, withReducer} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import Loader from '../Loader'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import numberFormat from '../../helpers/numberFormat'
import t from '../../helpers/translate'

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
            justifyContent: 'center',
            display: 'flex'
        },
        popUp: {
            color: '#333 !important',
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'hidden',
            height: '100%',
            maxHeight: 'none !important'
        },
        dialog: {
            '& > div:first-child > div:first-child': {
                transform: 'translate(0px, 0px) !important'
            }
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
            maxHeight: '86vh',
            minHeight: '184px',
            overflow: 'auto',
            padding: '0 30px',
            color: '#333'
        },
        bodyContent: {
            width: '100%'
        },
        list: {
            width: '100%',
            padding: '10px 0',
            '& .row': {
                padding: '0',
                height: '45px',
                alignItems: 'center',
                '&:after': {
                    left: '0.5rem',
                    right: '0.5rem'
                },
                '&:first-child': {
                    fontWeight: '600'
                },
                '&:last-child:after': {
                    display: 'none'
                },
                '& > div:last-child': {
                    textAlign: 'right'
                }
            }
        },
        noData: {
            textAlign: 'center',
            padding: '20px'
        }
    }),
    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {open: false}),
)

const TransactionCategoryPopop = enhance((props) => {
    const {
        open,
        loading,
        onClose,
        classes,
        data
    } = props

    return (
        <Dialog
            modal={true}
            contentStyle={{width: '550px', maxWidth: 'unset'}}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            bodyClassName={classes.popUp}
            autoScrollBodyContent={true}>
            <div className={classes.titleContent}>
                <span>{t('Расходы на сотрудников')}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                {loading && <div className={classes.loader}>
                    <Loader size={0.75}/>
                </div>}
                <div className={classes.inContent} style={{minHeight: 'initial'}}>
                    <div className={classes.list}>
                        <Row className="dottedList">
                            <Col xs={7}>{t('Сотрудник')}</Col>
                            <Col xs={5}>{t('Сумма')}</Col>
                        </Row>
                        {_.map(data, (item) => {
                            const clientName = _.get(item, ['staff', 'firstName']) + ' ' + _.get(item, ['staff', 'secondName'])
                            const amount = numberFormat(_.get(item, 'amount'), _.get(item, ['currency', 'name']))
                            return (
                                <Row key={_.get(item, 'id')} className='dottedList'>
                                    <Col xs={7}>{clientName}</Col>
                                    <Col xs={5}>{amount}</Col>
                                </Row>
                            )
                        })}
                        {_.isEmpty(data) &&
                        <div className={classes.noData}><h3>{t('Никакой платеж не произведен')}</h3></div>}
                    </div>
                </div>
            </div>
        </Dialog>
    )
})
TransactionCategoryPopop.propTyeps = {
    open: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    data: PropTypes.array
}
export default TransactionCategoryPopop
