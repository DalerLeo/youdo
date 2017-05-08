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
        overflowY: 'hidden !important',
        fontSize: '13px !important',
        position: 'relative',
        padding: '0 !important',
        overflowX: 'hidden',
        height: '100%',
        minHeight: '300px !important'
    },
    titleContent: {
        background: '#fff',
        color: '#333',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        top: '0',
        left: '0',
        right: '0',
        borderBottom: '1px solid #efefef',
        padding: '20px 30px',
        zIndex: '999',
        '& button': {
            marginTop: '-17px !important',
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
    field: {
        width: '100%'
    },
    title: {
        paddingTop: '15px',
        fontWeight: 'bold',
        color: '#333'
    },
    inputField: {
        fontSize: '13px !important'
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
    actionButton: {
        fontSize: '13px !important',
        margin: '0 !important'
    }
    // GRID LIST

}

export default MainStyles
