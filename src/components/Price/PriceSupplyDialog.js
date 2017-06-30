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
            display: 'flex',
            width: '100%'
        },
        subBlock: {
            width: '100%',
            padding: '20px 30px',
            borderBottom: '1px #efefef solid',
            '&:last-child': {
                border: 'none'
            }
        },
        dataBox: {
            '& > ul': {
                width: '100%'
            },
            '& li': {
                display: 'flex',
                justifyContent: 'space-between',
                lineHeight: '25px',
                width: '100%',
                '& span:last-child': {
                    fontWeight: '600',
                    textAlign: 'right'
                }
            }
        }
    })),
    reduxForm({
        form: 'PriceCreateForm',
        enableReinitialize: true
    })
)

const PriceSupplyDialog = enhance((props) => {
    const {open, loading, onClose, classes} = props

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '400px'} : {}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <div>
                Поставка <span style={{fontSize: '14px'}}> &#8470;</span></div>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.content}>
                <div className={classes.subBlock}>
                    <div className={classes.dataBox}>
                        <ul>
                            <li>
                                <span>Товар</span>
                                <span>Миф</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
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
