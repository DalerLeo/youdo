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
        minHeight: '428px',
        maxHeight: 'calc(100vh - 200px) !important'
    },
    fieldsWrap: {
        display: ({loading}) => !loading ? 'flex' : 'none',
        width: '100%',
        fontSize: '13px',
        minHeight: '235px',
        color: '#333'
    },
    field: {
        width: '100%'
    },
    title: {
        paddingTop: '15px',
        fontWeight: 'bold',
        color: '#333'
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
    form: {
        padding: '0 30px',
        minHeight: '307px',
        maxHeight: '50vh',
        overflow: 'auto'
    },
    inputField: {
        fontSize: '13px !important'
    },
    bottomButton: {
        padding: '15px',
        zIndex: '999',
        borderTop: '1px solid #efefef',
        background: '#fff',
        textAlign: 'right',
        margin: '0 -30px',
        '& span': {
            fontSize: '13px !important',
            fontWeight: '600 !important',
            color: '#129fdd'
        }
    },
    actionButton: {
        fontSize: '13px !important',
        margin: '0 !important'
    }
    // GRID LIST

}

export default MainStyles
