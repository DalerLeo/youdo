import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import IconButton from 'material-ui/IconButton'
import Loader from '../../Loader'
import ResumeDetails from '../Resume/ResumeDetails'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import {
    BORDER_STYLE, COLOR_DEFAULT,
    COLOR_GREY_LIGHTEN
} from '../../../constants/styleConstants'
import {hashHistory} from 'react-router'

const enhance = compose(
    injectSheet({
        dialog: {
            overflowY: 'auto',
            paddingTop: '0 !important'
        },
        loader: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: '#fff',
            top: '0',
            left: '0',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        popUp: {
            color: '#333 !important',
            overflowY: 'unset !important',
            overflowX: 'unset !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            height: '100%',
            maxHeight: 'none !important',
            marginBottom: '64px'
        },
        titleContent: {
            background: '#fff',
            color: COLOR_DEFAULT,
            fontWeight: 'bold',
            textTransform: 'uppercase',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: BORDER_STYLE,
            padding: '0 10px 0 30px',
            height: '60px',
            zIndex: '999'
        },
        wrapper: {
            display: 'flex'
        },
        details: {
            width: '700px',
            '& > div > div:first-child': {
                display: 'none'
            }
        },
        position: {
            color: COLOR_GREY_LIGHTEN,
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'none'
        },
        comments: {
            borderLeft: BORDER_STYLE,
            width: 'calc(100% - 700px)'
        }
    })
)

const ResumeDetailsDialog = enhance((props) => {
    const {
        open,
        filter,
        data,
        loading,
        classes
    } = props

    const fullName = _.get(data, 'fullName')
    const position = _.get(data, ['position', 'name'])

    return (
        <Dialog
            modal={true}
            open={open}
            className={classes.dialog}
            contentStyle={{width: '1000px', maxWidth: 'none'}}
            bodyClassName={classes.popUp}>

            <div className={classes.titleContent}>
                <span>{fullName} <span className={classes.position}>({position})</span></span>
                <IconButton onTouchTap={() => hashHistory.push(filter.createURL({resume: null}))}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>

            <div className={classes.bodyContent}>
                <div className={classes.inContent}>
                    {loading &&
                    <div className={classes.loader}>
                        <Loader size={0.75}/>
                    </div>}
                    <div className={classes.wrapper}>
                        <div className={classes.details}>
                            <ResumeDetails
                                data={data}
                                loading={loading}/>
                        </div>
                        <div className={classes.comments}>

                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    )
})

ResumeDetailsDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
    filter: PropTypes.object.isRequired
}

export default ResumeDetailsDialog
