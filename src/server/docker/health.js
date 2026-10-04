import docker from './client.js';

export async function checkDockerHealth() {
  try {
    const info = await docker.info();
    return { status: 'healthy', info };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}