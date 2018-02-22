import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import {reduxForm} from 'redux-form'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import {Row} from 'react-flexbox-grid'
import getConfig from '../../helpers/getConfig'
import dateFormat from '../../helpers/dateFormat'
import t from '../../helpers/translate'
import numberFormat from '../../helpers/numberFormat'
import Loader from '../Loader'

const ZERO = 0
const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            height: '300px',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
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
            padding: '0 10px 0 30px',
            height: '60px',
            zIndex: '999'
        },
        content: {
            width: '100%',
            display: 'block'
        },
        topBlock: {
            padding: '10px 30px 0px',
            '&:last-child': {
                border: 'none'
            },
            '& .row': {
                lineHeight: '30px',
                padding: '0 10px',
                '& > div:first-child': {
                    flexBasis: '25%',
                    maxWidth: '25%'
                },
                '& > div:last-child': {
                    fontWeight: '600',
                    flexBasis: '75%',
                    maxWidth: '75%'
                }
            }
        },
        downBlock: {
            padding: '20px 30px',
            '& .row': {
                lineHeight: '40px',
                padding: '0 10px',
                display: 'flex',
                justifyContent: 'space-between',
                '& > div:last-child': {
                    textAlign: 'right',
                    fontWeight: '600'
                }
            },
            '& .row:last-child': {
                fontWeight: '600',
                borderTop: '1px #efefef solid',
                lineHeight: 'normal',
                paddingTop: '8px'
            }
        },
        subTitle: {
            fontStyle: 'italic',
            fontWeight: '400'
        }
    }),
    reduxForm({
        form: 'PriceCreateForm',
        enableReinitialize: true
    })
)
const PriceSupplyDialog = enhance((props) => {
    const {open, loading, onClose, classes, list} = props
    const dateDelivery = dateFormat(_.get(list, 'dateDelivery'))
    const product = _.get(list, 'product')
    const provider = _.get(list, 'provider')
    const supplyId = _.get(list, 'supplyId')

    const price = _.sumBy(_.get(list, 'expenses'), (item) => {
        return _.toNumber(_.get(item, 'internalCost'))
    })
    return (
        <Dialog
            modal={true}
            open={open > ZERO}
            onRequestClose={onClose}
            contentStyle={loading ? {width: '300px'} : {width: '500px'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <div>{t('Поставка')} №{supplyId}</div>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            {loading ? <div className={classes.loader}>
                <div>
                    <Loader size={0.75}/>
                </div>
            </div>
                : <div className={classes.content}>
                    <div className={classes.topBlock}>
                        <Row>
                            <div>{t('Товар')}</div>
                            <div>{product}</div>
                        </Row>
                        <Row>
                            <div>{t('Поставщик')}:</div>
                            <div>{provider}</div>
                        </Row>
                        <Row className="dottedList" style={{paddingBottom: '10px'}}>
                            <div>{t('Дата поставки')}:</div>
                            <div>{dateDelivery}</div>
                        </Row>
                    </div>
                    <div className={classes.downBlock}>
                        <div className={classes.subTitle}>{t('Расчет себестоимости за еденицу товара')}:</div>
                        {_.map(_.get(list, 'expenses'), (item, index) => {
                            const interalCost = _.get(item, 'internalCost')
                            const comment = _.get(item, 'comment')
                            return (
                                <Row key={index}>
                                    <div>{comment}</div>
                                    <div>{numberFormat(interalCost, getConfig('PRIMARY_CURRENCY'))}</div>
                                </Row>
                            )
                        })}
                        <Row>
                            <div>{t('Себестоимость')}</div>
                            <div>{numberFormat(price, getConfig('PRIMARY_CURRENCY'))}</div>
                        </Row>
                    </div>
                </div>}
        </Dialog>
    )
})
PriceSupplyDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}
export default PriceSupplyDialog
