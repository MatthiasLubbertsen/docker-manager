// dockerode wrapper
import Docker from 'dockerode';
import { config } from './config.js';
const docker = new Docker();

export function dockerWrapper() { }

dockerWrapper.containers.list = async () => {
    try {
        const containers = await docker.listContainers({ all: true });
        return containers;
    } catch (error) {
        throw new Error(`Failed to list containers: ${error.message}`);
    }
};

dockerWrapper.containers.getById = async (id) => {
    try {
        const container = docker.getContainer(id);
        const data = await container.inspect();
        return data;
    } catch (error) {
        throw new Error(`Failed to get container by ID: ${error.message}`);
    }
};

dockerWrapper.containers.start = async (id) => {
    try {
        try {
            const container = docker.getContainer(id);
        } catch (error) {
            throw new Error(`Container with ID ${id} not found.`);
        }
        await container.start();
        return { message: `Container ${id} started successfully.` };
    } catch (error) {
        throw new Error(`Failed to start container: ${error.message}`);
    }
};

dockerWrapper.containers.stop = async (id) => {
    try {
        try {
        const container = docker.getContainer(id);
        } catch (error) {
        return { message: `Container with ${id} not found.` };
        }
        await container.stop();
    } catch (error) {
        throw new Error(`Failed to stop container: ${error.message}`);
    }
};