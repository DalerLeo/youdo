import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import Loader from '../Loader'
import {connect} from 'react-redux'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import numberFormat from '../../helpers/numberFormat'
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
            padding: '20px 30px',
            zIndex: '999',
            '& button': {
                right: '13px',
                padding: '0 !important',
                position: 'absolute !important'
            }
        },
        inContent: {
            padding: '20px 30px',
            color: '#333',
            height: '100%',
            '& .dottedList': {
                padding: '10px 0',
                minHeight: '50px'
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
            justifyContent: 'space-between',
            padding: '10px 14px 10px 30px',
            borderTop: '1px solid #efefef',
            background: '#fff',
            '& > div:first-child': {
                textTransform: 'uppercase'
            },
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
        }
    }),
    connect((state) => {
        const currency = _.get(state, ['form', 'ReturnCreateForm', 'values', 'currency', 'text'])
        return {
            currency
        }
    }),
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
        currency,
        onSubmit
    } = props
    const totalReturn = _.sumBy(data, (item) => {
        return _.toNumber(item.cost)
    })

    const list = _.map(data, (item) => {
        const measure = item.product.measurement.name
        const amount = numberFormat(item.amount, measure)
        const order = item.order
        const cost = numberFormat(item.cost, currency)
        const productName = item.product.name
        return (
            <Row key={productName} className="dottedList">
                <Col xs={5}>{productName}</Col>
                <Col xs={2}>{order}</Col>
                <Col xs={2}>{amount}</Col>
                <Col xs={3} style={{textAlign: 'right'}}>{cost}</Col>
            </Row>
        )
    })

    return (
        <Dialog
            modal={true}
            contentStyle={customContentStyle}
            open={open}
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
                    </div>
                    {!_.isEmpty(list) &&
                        <div className={classes.bottomButton}>
                            <div>
                                <div>
                                    {t('Общая сумма возврата')}: <strong>{numberFormat(totalReturn, currency)}</strong>
                                </div>
                            </div>
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
