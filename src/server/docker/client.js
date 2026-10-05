// dockerode wrapper
import Docker from 'dockerode';
import { config } from './config.js';
const dockerode = new Docker();

export function docker() { }

docker.containers.list = async () => {
    try {
        const containers = await dockerode.listContainers({ all: true });
        return containers;
    } catch (error) {
        throw new Error(`Failed to list containers: ${error.message}`);
    }
};

docker.containers.getById = async (id) => {
    try {
        const container = dockerode.getContainer(id);
        const data = await container.inspect();
        return data;
    } catch (error) {
        throw new Error(`Failed to get container by ID: ${error.message}`);
    }
};

docker.containers.start = async (id) => {
    try {
        try {
            const container = dockerode.getContainer(id);
        } catch (error) {
            throw new Error(`Container with ID ${id} not found.`);
        }
        await container.start();
        return { message: `Container ${id} started successfully.` };
    } catch (error) {
        throw new Error(`Failed to start container: ${error.message}`);
    }
};

docker.containers.stop = async (id) => {
    try {
        try {
        const container = dockerode.getContainer(id);
        } catch (error) {
        return { message: `Container with ${id} not found.` };
        }
        await container.stop();
    } catch (error) {
        throw new Error(`Failed to stop container: ${error.message}`);
    }
};