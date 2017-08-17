const MainStyles = {
    test: {
        padding: '10px'
    },
    dashedLink: {
        borderBottom: '1px dashed'
    },
    lightBlueBg: {
        background: '#f1f5f8',
        color: '#333'
    },
    dottedList: {

    },
    // MODAL
    body: {
        overflowY: 'hidden !important',
        fontSize: '13px !important',
        position: 'relative',
        padding: '0 !important',
        overflowX: 'hidden',
        minHeight: '317px !important'
    },
    popUp: {
        color: '#333 !important',
        overflowY: 'hidden !important',
        fontSize: '13px !important',
        position: 'relative',
        padding: '0 !important',
        overflowX: 'hidden',
        height: '100%',
        maxHeight: 'none !important',
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
        display: 'flex',
        maxHeight: '50vh',
        minHeight: '184px',
        overflow: 'auto',
        padding: '0 30px',
        color: '#333'
    },
    bodyContent: {
        width: '100%'
    },
    form: {
        position: 'relative'
    },
    field: {
        width: '100%'
    },
    inputField: {
        fontSize: '13px !important',
        height: '45px !important',
        marginTop: '7px',
        '& div': {
            fontSize: '13px !important'
        },
        '& label': {
            top: '20px !important',
            lineHeight: '5px !important'
        },
        '& input': {
            marginTop: '0 !important'
        }
    },
    bottomButton: {
        bottom: '0',
        left: '0',
        right: '0',
        padding: '10px',
        zIndex: '999',
        borderTop: '1px solid #efefef',
        background: '#fff',
        textAlign: 'right',
        '& span': {
            fontSize: '13px !important',
            fontWeight: '600 !important',
            color: '#129fdd',
            verticalAlign: 'inherit !important'
        }
    },
    inputFieldCustom: {
        fontSize: '13px !important',
        height: '45px !important',
        marginTop: '7px',
        '& div': {
            fontSize: '13px !important'
        },
        '& label': {
            top: '20px !important',
            lineHeight: '5px !important'
        },
        '& input': {
            marginTop: '0 !important'
        }
    },
    inputDateCustom: {
        fontSize: '13px !important',
        height: '45px !important',
        marginTop: '7px',
        '& div': {
            fontSize: '13px !important'
        },
        '& label': {
            top: '20px !important',
            lineHeight: '5px !important'
        },
        '& input': {
            marginTop: '0 !important'
        },
        '& div:first-child': {
            height: '45px !important'
        }
    },
    actionButton: {
        fontSize: '13px !important',
        margin: '0 !important'
    }
    // GRID LIST

}

export default MainStyles
