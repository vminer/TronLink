import React from 'react';

import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { PopupAPI } from '@tronlink/lib/api';

import { APP_STATE } from '@tronlink/lib/constants';



import 'react-custom-scroll/dist/customScroll.css';
import 'assets/styles/global.scss';

class App extends React.Component {
    render() {

                return (
                    <div className='unsupportedState' onClick={ () => PopupAPI.resetState() }>
                        <FormattedMessage id='ERRORS.UNSUPPORTED_STATE' values={{ appState }} />
                    </div>
                );

    }
}

export default connect(state => ({
    appState: state.app.appState
}))(App);
