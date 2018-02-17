import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import Loader from '../Loader'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import numberFormat from '../../helpers/numberFormat'
import getConfig from '../../helpers/getConfig'
import {Row, Col} from 'react-flexbox-grid'
import t from '../../helpers/translate'
import NotFound from '../Images/not-found.png'

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
            display: ({loading}) => loading ? 'flex' : 'none'
        },
        popUp: {
            background: '#fff',
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
        inContent: {
            padding: '0 30px',
            color: '#333',
            height: '100%',
            '& .dottedList': {
                padding: '10px 0',
                minHeight: '50px',
                '&:first-child': {
                    fontWeight: '600'
                },
                '&:last-child:after': {
                    display: 'none'
                }
            }
        },
        bodyContent: {
            color: '#333',
            width: '100%'
        },
        form: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'space-between'
        },
        bottomButton: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '10px 14px 10px 30px',
            borderTop: '1px solid #efefef',
            background: '#fff',
            '& span': {
                fontSize: '13px !important',
                fontWeight: '600 !important',
                color: '#129fdd',
                verticalAlign: 'inherit !important'
            }
        },
        actionButton: {
            fontSize: '13px !important',
            margin: '0 !important'
        },
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center 20px',
            backgroundSize: '175px',
            padding: '140px 0 20px',
            textAlign: 'center',
            fontSize: '13px',
            color: '#666'
        },
        totalReturn: {
            background: '#f2f5f8',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            padding: '15px 30px',
            margin: '0 -30px'
        },
        totalSum: {
            fontWeight: '600 !important',
            marginRight: '5px',
            position: 'relative',
            '&:after': {
                content: '","'
            },
            '&:last-child:after': {
                display: 'none'
            }
        }
    })
)

const customContentStyle = {
    width: '600px',
    maxWidth: 'none'
}
const ReturnCreateDialog = enhance((props) => {
    const {
        open,
        onClose,
        classes,
        data,
        onSubmit
    } = props
    const byCurrency = _.groupBy(data, (item) => _.get(item, ['currency', 'name']))
    const totalReturn = _.map(byCurrency, (item, index) => {
        const currency = index
        const totalPrice = _.sumBy(item, (o) => {
            const amount = _.toNumber(_.get(o, 'amount'))
            const cost = _.toNumber(_.get(o, 'cost'))
            return amount * cost
        })
        return (
            <span className={classes.totalSum}>{numberFormat(totalPrice, currency)}</span>
        )
    })

    const list = _.map(data, (item, index) => {
        const measure = _.get(item, ['product', 'measurement', 'name'])
        const currency = _.get(item, ['currency', 'name'])
        const amount = _.toNumber(_.get(item, 'amount'))
        const order = _.get(item, 'order')
        const cost = _.toNumber(_.get(item, 'cost'))
        const productName = _.get(item, ['product', 'name'])
        return (
            <Row key={index} className="dottedList">
                <Col xs={5}>{productName}</Col>
                <Col xs={2}>{order}</Col>
                <Col xs={2}>{numberFormat(amount, measure)}</Col>
                <Col xs={3} style={{textAlign: 'right'}}>{numberFormat((cost * amount), currency)}</Col>
            </Row>
        )
    })

    return (
        <Dialog
            modal={true}
            contentStyle={customContentStyle}
            open={open}
            style={{zIndex: '1501'}}
            onRequestClose={onClose}
            bodyClassName={classes.popUp}
            autoScrollBodyContent={true}>
            <div className={classes.titleContent}>
                <span>{t('Подтверждение возврата')}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form scrolling="auto" className={classes.form}>
                    <div className={classes.loader}>
                        <Loader size={0.75}/>
                    </div>
                    <div className={classes.inContent}>
                        {_.isEmpty(list)
                            ? <div className={classes.emptyQuery}>
                                <div>{t('По вашему запросу ничего не найдено')}</div>
                            </div>
                            : <div>
                                <Row className="dottedList">
                                    <Col xs={5}>{t('Наименование')}</Col>
                                    <Col xs={2}>{t('Заказ')}</Col>
                                    <Col xs={2}>{t('Кол-во')}</Col>
                                    <Col xs={3} style={{textAlign: 'right'}}>{t('Сумма')}</Col>
                                 </Row>
                                {list}
                            </div>}
                        <div className={classes.totalReturn}>{t('Общая сумма возврата')}: {totalReturn}</div>
                    </div>
                    {!_.isEmpty(list) &&
                        <div className={classes.bottomButton}>
                            <FlatButton
                                label={t('Оформить возврат')}
                                className={classes.actionButton}
                                primary={true}
                                onTouchTap={() => onSubmit()}
                            />
                        </div>
                    }
                </form>
            </div>
        </Dialog>
    )
})
ReturnCreateDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}
export default ReturnCreateDialog
