import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 60 * 5 });

export default cache;
