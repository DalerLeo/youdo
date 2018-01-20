import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {reduxForm} from 'redux-form'
import Dialog from 'material-ui/Dialog'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import Loader from '../../Loader'
import NotFound from '../../Images/not-found.png'
import TransactionsList from '../Finance/TransactionsList'

const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            height: '400px',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        dialog: {
            overflowY: 'auto'
        },
        popUp: {
            color: '#333 !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            height: '100%',
            maxHeight: 'unset !important',
            marginBottom: '64px'
        },
        content: {
            width: '100%',
            display: 'block'
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
            padding: '0 30px',
            height: '59px',
            zIndex: '999',
            '& button': {
                right: '13px',
                position: 'absolute !important'
            },
            '& div': {
                display: 'flex',
                alignItems: 'center'
            },
            '& .personImage': {
                borderRadius: '50%',
                overflow: 'hidden',
                flexBasis: '35px',
                height: '35px',
                minWidth: '30px',
                width: '35px',
                marginRight: '10px',
                '& img': {
                    display: 'flex',
                    height: '100%',
                    width: '100%'
                }
            }
        },
        tableWrapper: {
            padding: '0 30px',
            '& > div > div': {
                '&:first-child': {
                    borderTop: 'none'
                }
            }
        },
        emptyQuery: {
            marginBottom: '15px',
            background: 'url(' + NotFound + ') no-repeat center center',
            backgroundSize: '200px',
            padding: '200px 0 0',
            textAlign: 'center',
            fontSize: '13px',
            color: '#666',
            '& svg': {
                width: '50px !important',
                height: '50px !important',
                color: '#999 !important'
            }
        }
    }),
    reduxForm({
        form: 'BrandCreateForm',
        enableReinitialize: true
    })
)

const ExpenditureTransactionDialog = enhance((props) => {
    const {open, loading, onClose, classes, data, filterTransaction, userName} = props

    const listData = {
        data,
        listLoading: loading
    }

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '600px'} : {width: '900px', maxWidth: 'unset'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.popUp}>
            {loading
                ? <div className={classes.loader}>
                    <Loader size={0.75}/>
                  </div>
                : <div>
                    <div className={classes.titleContent}>
                        <div>
                            <div>{userName}</div>
                        </div>
                        <IconButton onTouchTap={onClose}>
                            <CloseIcon color="#666666"/>
                        </IconButton>
                    </div>
                    <div className={classes.content}>
                        <div className={classes.tableWrapper}>
                            <TransactionsList
                                handleSubmitFilterDialog={() => null}
                                filter={filterTransaction}
                                listData={listData}/>
                        </div>
                    </div>
                </div>}
        </Dialog>
    )
})

ExpenditureTransactionDialog.propTyeps = {
    isUpdate: PropTypes.bool,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

ExpenditureTransactionDialog.defaultProps = {
    isUpdate: false
}

export default ExpenditureTransactionDialog
