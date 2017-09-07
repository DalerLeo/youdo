import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import Paper from 'material-ui/Paper'
import {Tabs, Tab} from 'material-ui/Tabs'
import ManufactureProduct from './Tab/ManufactureProduct'
import ManufacturePerson from './Tab/ManufacturePerson'
import ManufactureEquipment from './Tab/ManufactureEquipment'
import ManufactureShipment from './Tab/ManufactureShipment'
const enhance = compose(
    injectSheet({
        ManufactRightSide: {
            padding: '0px 28px',
            width: 'calc(100% - 280px)',
            zIndex: '2'
        },
        colorCat: {
            marginBottom: '0',
            width: '100%',
            '& > div': {
                paddingRight: 'calc(100% - 450px)',
                background: '#fff !important'
            },
            '& > div:first-child': {
                borderBottom: 'none !important'
            },
            '& > div:last-child': {
                width: '100% !important',
                padding: '0'
            },
            '& > div:nth-child(2) > div': {
                marginTop: '-3px !important',
                backgroundColor: '#12aaeb !important',
                height: '3px !important',
                zIndex: '3'
            },
            '& button': {
                color: '#333 !important',
                backgroundColor: '#fefefe !important',
                '& > div > div': {
                    height: '50px !important'
                }
            },
            '& button > span:first-line': {
                color: '#a6dff7'
            },
            '& button div div': {
                textTransform: 'initial'
            }
        }
    })
)

const ManufactureTab = enhance((props) => {
    const {classes,
        tabData,
        productFilterDialog,
        productData,
        personData,
        equipmentData,
        editMaterials,
        createMaterials,
        deleteMaterials,
        shipmentData,
        handleCloseDetail
    } = props
    const tab = _.get(tabData, 'tab')
    return (
        <div className={classes.ManufactRightSide}>

        </div>
    )
})
ManufactureTab.propTypes = {
    tabData: PropTypes.shape({
        tab: PropTypes.string.isRequired,
        handleTabChange: PropTypes.func.isRequired
    }),
    productData: PropTypes.object.isRequired,
    personData: PropTypes.object.isRequired,
    equipmentData: PropTypes.object.isRequired,
    shipmentData: PropTypes.object.isRequired
}

export default ManufactureTab
