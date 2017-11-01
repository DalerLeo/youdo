import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import NotFound from '../Images/not-found.png'
import LinearProgress from '../LinearProgress'

const colorBlue = '#12aaeb !important'
const enhance = compose(
    injectSheet({
        wrapper: {
            color: '#333 !important',
            width: '100%',
            maxHeight: 'unset',
            position: 'relative',
            borderTop: '1px #efefef solid',
            display: 'flex',
            flexWrap: 'wrap',
            '& a': {
                color: colorBlue
            },
            '& .row': {
                alignItems: 'center'
            }
        },
        titleButtons: {
            display: 'flex',
            zIndex: '3',
            justifyContent: 'flex-end'
        },
        loader: {
            width: '100%',
            height: '100px',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        content: {
            width: '100%',
            overflow: 'hidden',
            display: 'flex',
            borderTop: 'solid 1px #efefef'
        },
        leftSide: {
            flexBasis: '100%',
            maxWidth: '100%',
            padding: '0 30px 5px',
            '& > .row': {
                padding: '15px 0',
                '&:first-child': {
                    fontWeight: '600'
                },
                '&:last-child:after': {
                    display: 'none'
                }
            }
        },
        semibold: {
            fontWeight: '600',
            cursor: 'pointer',
            position: 'relative'
        },
        header: {
            position: 'relative',
            padding: '0 30px',
            width: '100%',
            '& .row': {
                alignItems: 'center'
            }
        },
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center 25px',
            backgroundSize: '200px',
            padding: '170px 0 30px',
            textAlign: 'center',
            fontSize: '13px',
            color: '#999',
            width: '100%',
            '& svg': {
                width: '50px !important',
                height: '50px !important',
                color: '#999 !important'
            }
        },

        closeDetail: {
            position: 'absolute',
            left: '0',
            top: '0',
            right: '0',
            bottom: '0',
            cursor: 'pointer',
            zIndex: '1'
        }

    }),
    withState('openDetails', 'setOpenDetails', false)
)

const StockTransferDetails = enhance((props) => {
    const {
        classes,
        loading
    } = props

    if (loading) {
        return (
            <div className={classes.loader}>
                <LinearProgress/>
            </div>
        )
    }
    return (
        <div className={classes.wrapper}>
           asd
        </div>
    )
})

StockTransferDetails.propTypes = {
    detailData: PropTypes.object.isRequired
}

export default StockTransferDetails
