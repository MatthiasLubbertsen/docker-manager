// dockerode wrapper
import Docker from 'dockerode';
import * as config from '../config.js';
const dockerode = new Docker();
// import { exec } from 'child_process';
// import { promises as fs } from 'fs';
// import path from 'path';
// import { DATA_DIR, STACKS_DIR } from '../config.js'

export const dockerWrapper = {
    health: async () => {
        try {
            const info = await dockerode.info();
            return { status: 'healthy', info };
        } catch (error) {
            return { status: 'unhealthy', error: error.message };
        }
    },
    containers: {
        list: async () => {
            try {
                const containers = await dockerode.listContainers({ all: true });
                return containers;
            } catch (error) {
                throw new Error(`Failed to list containers: ${error.message}`);
            }
        },
        getById: async (id) => {
            try {
                const container = dockerode.getContainer(id);
                const data = await container.inspect();
                return data;
            } catch (error) {
                throw new Error(`Failed to get container by ID: ${error.message}`);
            }
        },
        start: async (id) => {
            try {
                const container = dockerode.getContainer(id);
                await container.start();
                return { message: `Container ${id} started successfully.` };
            } catch (error) {
                throw new Error(`Failed to start container: ${error.message}`);
            }
        },
        stop: async (id) => {
            try {
                const container = dockerode.getContainer(id);
                await container.stop();
                return { message: `Container ${id} stopped successfully.` };
            } catch (error) {
                throw new Error(`Failed to stop container: ${error.message}`);
            }
        }
    },
    compose: {
        up: async (composeYaml, composeProjectName, build) => {
            try {
                const NAME_RE = /^[a-z0-9][a-z0-9_-]*$/; // compose rule
                if (!NAME_RE.test(composeProjectName)) throw new Error(`Invalid compose project name: ${composeProjectName}.`);
                
                const projectDir = path.join(config.STACKS_DIR, composeProjectName);
                const composePath = path.join(projectDir, 'docker-compose.yml');

                await fs.mkdir(projectDir, { recursive: true });
                await fs.writeFile(composePath, composeYaml, 'utf8');

                const args = ['compose', '-f', composePath, 'up', '-d'];
                //'-p', composeProjectName, 
                if (build) args.push('--build');

                const { stdout, stderr } = await execFileAsync('docker', args, {
                    cwd: projectDir,
                    maxBuffer: 10 * 1024 * 1024,
                });
                return { projectDir, stdout, stderr };
            } catch (error) {
                throw new Error(`Failed to bring up Compose stack: ${error}`);
            }
        },
        down: async (composeProjectName) => {
            try {
                const projectDir = path.join(config.STACKS_DIR, composeProjectName);
                const composePath = path.join(projectDir, 'docker-compose.yml');

                const args = ['compose', '-f', composePath, 'down'];

                const { stdout, stderr } = await execFileAsync('docker', args, {
                    cwd: projectDir,
                    maxBuffer: 10 * 1024 * 1024,
                });
                return { projectDir, stdout, stderr };
            } catch (error) {
                throw new Error(`Failed to bring down Compose stack: ${error}`);
            }
        }
    }
}