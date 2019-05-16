import EventChannel from '@tronlink/lib/EventChannel';
import Logger from '@tronlink/lib/logger';
import TronWeb from 'tronweb';
import Utils from '@tronlink/lib/utils';
import RequestHandler from './handlers/RequestHandler';
import ProxiedProvider from './handlers/ProxiedProvider';

const logger = new Logger('pageHook');

const pageHook = {
    proxiedMethods: {
        setAddress: false,
        sign: false
    },

    init() {
        this._bindvminer();
        this._bindEventChannel();
        this._bindEvents();

        this.request('init').then(({ address, node }) => {
            if(address)
                this.setAddress(address);

            if(node.fullNode)
                this.setNode(node);

            logger.info('VminerExtension initiated');
        }).catch(err => {
            logger.info('Failed to initialise vminer', err);
        });
    },

    _bindvminer() {
        if(window.vminer !== undefined)
            logger.warn('vminer is already initiated. VminerExtension will overwrite the current instance');

        const vminer = new TronWeb(
            new ProxiedProvider(),
            new ProxiedProvider(),
            new ProxiedProvider()
        );

        this.proxiedMethods = {
            setAddress: vminer.setAddress.bind(vminer),
            sign: vminer.trx.sign.bind(vminer)
        };

        [ 'setPrivateKey', 'setAddress', 'setFullNode', 'setSolidityNode', 'setEventServer' ].forEach(method => (
            vminer[ method ] = () => new Error('TronLink has disabled this method')
        ));

        vminer.trx.sign = (...args) => (
            this.sign(...args)
        );

        window.vminer = vminer;
    },

    _bindEventChannel() {
        this.eventChannel = new EventChannel('pageHook');
        this.request = RequestHandler.init(this.eventChannel);
    },

    _bindEvents() {
        this.eventChannel.on('setAccount', address => (
            this.setAddress(address)
        ));

        this.eventChannel.on('setNode', node => (
            this.setNode(node)
        ));
    },

    setAddress(address) {
        // logger.info('TronLink: New address configured');

        this.proxiedMethods.setAddress(address);
        vminer.ready = true;
    },

    setNode(node) {
        // logger.info('TronLink: New node configured');

        vminer.fullNode.configure(node.fullNode);
        vminer.solidityNode.configure(node.solidityNode);
        vminer.eventServer.configure(node.eventServer);
    },

    sign(transaction, privateKey = false, useTronHeader = true, callback = false) {
        if(Utils.isFunction(privateKey)) {
            callback = privateKey;
            privateKey = false;
        }

        if(Utils.isFunction(useTronHeader)) {
            callback = useTronHeader;
            useTronHeader = true;
        }

        if(!callback)
            return Utils.injectPromise(this.sign.bind(this), transaction, privateKey, useTronHeader);

        if(privateKey)
            return this.proxiedMethods.sign(transaction, privateKey, useTronHeader, callback);

        if(!transaction)
            return callback('Invalid transaction provided');

        if(!vminer.ready)
            return callback('User has not unlocked wallet');

        this.request('sign', {
            transaction,
            useTronHeader,
            input: (
                typeof transaction === 'string' ?
                    transaction :
                    transaction.__payload__ ||
                    transaction.raw_data.contract[ 0 ].parameter.value
            )
        }).then(transaction => (
            callback(null, transaction)
        )).catch(err => {
            logger.warn('Failed to sign transaction:', err);
            callback(err);
        });
    }
};

pageHook.init();
