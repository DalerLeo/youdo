import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import {reduxForm} from 'redux-form'
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../Styles/MainStyles'
import {Row} from 'react-flexbox-grid'
import getConfig from '../../helpers/getConfig'
import numberFormat from '../../helpers/numberFormat'
import CircularProgress from 'material-ui/CircularProgress'

const ZERO = 0
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
        titleContent: {
            padding: '15px 30px'
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
    })),
    reduxForm({
        form: 'PriceCreateForm',
        enableReinitialize: true
    })
)
const PriceSupplyDialog = enhance((props) => {
    const {open, loading, onClose, classes, list} = props
    const dateDelivery = _.get(list, 'dateDelivery')
    const product = _.get(list, 'product')
    const provider = _.get(list, 'provider')
    let price = ZERO
    return (
        <Dialog
            modal={true}
            open={open > ZERO}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '500px'} : {width: '500px'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <div>
                    Поставка <span style={{fontSize: '14px', margin: '0 5px'}}> &#8470;</span>
                    {open} </div>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            {loading && <div className={classes.loader}>
                            <div>
                                <CircularProgress size={40} thickness={4}/>
                            </div>
                        </div>}
            {!loading &&
                <div className={classes.content}>
                    <div className={classes.topBlock}>
                        <Row>
                            <div>Товар</div>
                            <div>{product}</div>
                        </Row>
                        <Row>
                            <div>Поставщик:</div>
                            <div>{provider}</div>
                        </Row>
                        <Row className="dottedList" style={{paddingBottom: '10px'}}>
                            <div>Дата поставки:</div>
                            <div>{dateDelivery}</div>
                        </Row>
                    </div>
                    <div className={classes.downBlock}>
                        <div className={classes.subTitle}>Расчет себестоимости за еденицу товара:</div>
                        {_.map(_.get(list, 'expenses'), (item, index) => {
                            const interalCost = _.get(item, 'internalCost')
                            price = Number(price) + Number(interalCost)
                            const comment = _.get(item, 'comment')
                            return (
                                <Row key={index}>
                                    <div>{comment}</div>
                                    <div>{numberFormat(interalCost, getConfig('PRIMARY_CURRENCY'))}</div>
                                </Row>
                            )
                        })}
                        <Row>
                            <div>Себестоимость</div>
                            <div>{numberFormat(price, getConfig('PRIMARY_CURRENCY'))}</div>
                        </Row>
                    </div>
                </div>
            }
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
