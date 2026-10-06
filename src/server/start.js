import { dockerWrapper as docker } from './docker/wrapper.js';

// docker.health().then((healthStatus) => {
//     console.log('Docker health status:', healthStatus);
// });

console.log('Docker health status:', await docker.health());
