import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Toast } from 'antd-mobile';
import { PAGES, APP_STATE } from '@tronlink/lib/constants';
import { app } from '@tronlink/popup/src/index';
import { PopupAPI } from '@tronlink/lib/api';
const logo = require('@tronlink/popup/src/assets/images/new/vminer/logo2.png');
const PageLink = props => {
    const {
        active = false,
        page,
        changePage
    } = props;

    const pageKey = `PAGES.${ page }`;
    const pageIndex = PAGES[ page ];

    return (
        <FormattedMessage
            id={ pageKey }
            children={ text => (
                <div
                    className={ `pageLink ${ active ? 'active' : '' }` }
                    onClick={ () => !active && changePage(pageIndex) }
                >
                    { text }
                </div>
            ) }
        />
    );
};

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.onNodeChange = this.onNodeChange.bind(this);
        this.state={
            nodeIndex:0,
            //showNodeList:false,
            refresh:false
        }
    }

    componentDidMount() {
        const {nodes} = this.props;
        const ns = Object.entries(nodes.nodes);
        const nodeIndex = ns.map(([nodeId,obj],i)=>{obj.index = i;return [nodeId,obj]}).filter(([nodeId,obj]) => nodeId === nodes.selected)[0][1].index;
        this.setState({nodeIndex});
    }

    onNodeChange(nodeId,index) {
        PopupAPI.selectNode(nodeId);
        app.getNodes();
        this.setState({nodeIndex:index,showNodeList:!this.state.showNodeList});
    }

    render() {
        const { refresh } = this.state;
        const {
            developmentMode
        } = this.props;
        const trxMarketUrl = developmentMode ? 'https://trx.market?from=tronlink' : 'https://trx.market?from=tronlink';
        return (
            <div className='header'>
                <div className='titleContainer'>
                    <div>
                        <img src={logo} alt=""/>
                    </div>
                    <div>
                        <div>
                            <div className="fun" onClick={ () => { PopupAPI.lockWallet(); } }></div>
                            <div className="fun" onClick={() => {
                                if(!refresh) {
                                    this.setState({ refresh: true }, async() => {
                                        Toast.loading();
                                        const r = await PopupAPI.refresh();
                                        if(r) {
                                            this.setState({ refresh: false });
                                            Toast.hide();
                                        }
                                    });
                                }

                            }}
                            ></div>
                            <div className="fun" onClick={ ()=>{ PopupAPI.changeState(APP_STATE.SETTING) } }></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Header;
