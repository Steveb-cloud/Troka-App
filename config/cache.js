import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 60 * 5 }); // TTL: 5 minutos

export default cache;
