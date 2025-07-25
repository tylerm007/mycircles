import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: 'http://mythreecircle.com:8080/', // Your Keycloak server URL
    realm: 'kcals',
    clientId: 'alsclient',
});

export default keycloak;