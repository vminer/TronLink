export default {
    currentAccount: false,

    init(duplex) {
        this.duplex = duplex;
    },

    setState(appState) {
        this.duplex.send('vminer_popup', 'setState', appState, false);
    },

    setAccount(account) {
        this.duplex.send('vminer_popup', 'setAccount', account, false);

        if(this.currentAccount === account)
            return;

        this.duplex.send('vminer_tab', 'vminer_tunnel', {
            action: 'setAccount',
            data: account.address
        }, false);

        this.currentAccount = account;
    },

    setNode(node) {
        this.duplex.send('vminer_tab', 'vminer_tunnel', {
            action: 'setNode',
            data: node
        }, false);
    },

    setAccounts(accounts) {
        this.duplex.send('vminer_popup', 'setAccounts', accounts, false);
    },

    setPriceList(priceList) {
        this.duplex.send('vminer_popup', 'setPriceList', priceList, false);
    },

    setConfirmations(confirmationList) {
        this.duplex.send('vminer_popup', 'setConfirmations', confirmationList, false);
    },

    setCurrency(currency) {
        this.duplex.send('vminer_popup', 'setCurrency', currency, false);
    },

    setSelectedToken(token) {
        this.duplex.send('vminer_popup', 'setSelectedToken', token, false);
    },

    setLanguage(language) {
        this.duplex.send('vminer_popup', 'setLanguage', language, false);
    },

    setSetting(setting) {
        this.duplex.send('vminer_popup', 'setSetting', setting, false);
    },
    setSelectedBankRecordId(id) {
        this.duplex.send('vminer_popup', 'setSelectedBankRecordId', id, false);
    },

    changeDealCurrencyPage(status) {
        this.duplex.send('vminer_popup', 'changeDealCurrencyPage', status, false);
    },

    setAirdropInfo(airdropInfo) {
        this.duplex.send('vminer_popup', 'setAirdropInfo', airdropInfo, false);
    },

    setDappList(dappList) {
        this.duplex.send('vminer_popup', 'setDappList',dappList ,false);
    }

};
