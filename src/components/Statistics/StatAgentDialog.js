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
        content: {
            width: '100%',
            display: 'block'
        },
        topBlock: {
            padding: '20px 30px 0px 30px',
            '&:last-child': {
                border: 'none'
            },
            '& .row': {
                lineHeight: '35px',
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
                lineHeight: '35px',
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
                borderTop: '1px #efefef solid'
            }
        },
        dottedList: {
            padding: '10px 0'
        },
        subTitle: {
            paddingBottom: '8px',
            fontStyle: 'italic',
            fontWeight: '400'
        }
    })),
    reduxForm({
        form: 'PriceCreateForm',
        enableReinitialize: true
    })
)

const StatAgentDialog = enhance((props) => {
    const {open, loading, onClose, classes} = props

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '400px'} : {width: '500px'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <div>
                Поставка <span style={{fontSize: '14px'}}> &#8470;</span>
                </div>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.content}>
                <div className={classes.topBlock}>
                    <Row>
                        <div>Товар</div>
                        <div>Миф морозная свежесть (жесткая упаковка)</div>
                    </Row>
                    <Row>
                        <div>Поставщик:</div>
                        <div>ООО "Эмомали Рахмон"</div>
                    </Row>
                    <Row className="dottedList" style={{paddingBottom: '10px'}}>
                        <div>Дата поставки:</div>
                        <div>22 апр, 2017</div>
                    </Row>
                </div>
                <div className={classes.downBlock}>
                    <div className={classes.subTitle}>Расчет себестоимости за еденицу товара:</div>
                        <Row>
                            <div>Стоимость товара</div>
                            <div>20 000</div>
                        </Row>
                        <Row>
                            <div>Стоимость товара</div>
                            <div>20 000</div>
                        </Row>
                        <Row>
                            <div>Стоимость товара</div>
                            <div>20 000</div>
                        </Row>

                    <Row>
                        <div>Себестоимость товара</div>
                        <div>29 000</div>
                    </Row>
                </div>
            </div>
        </Dialog>
    )
})

StatAgentDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool
}

export default StatAgentDialog
