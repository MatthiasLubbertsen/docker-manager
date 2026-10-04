// DATA_DIR, port, password: all settings in one place

export const DATA_DIR = process.env.DATA_DIR || './data';
export const PORT = process.env.PORT || 3333;

export const PASSWORD = process.env.PASSWORD || 'password';

export const DOCKER_SOCKET = process.env.DOCKER_SOCKET || '/var/run/docker.sock';