import Host from './handlers/host';
import Child from './handlers/child';

const Tab = Child.bind(null, 'vminer_tab');
const Popup = Child.bind(null, 'vminer_popup');

export default {
    Host,
    Tab,
    Popup
};