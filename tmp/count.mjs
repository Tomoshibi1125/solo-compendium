import fs from 'fs';
import { pathToFileURL } from 'url';

async function count() {
    const jobsMod = await import(pathToFileURL('C:/Users/jjcal/Documents/solo-compendium/src/data/compendium/jobs.ts').href);
    const pathsMod = await import(pathToFileURL('C:/Users/jjcal/Documents/solo-compendium/src/data/compendium/paths.ts').href);

    const jobs = Object.values(jobsMod).find(v => Array.isArray(v));
    const paths = Object.values(pathsMod).find(v => Array.isArray(v));

    console.log('Jobs:', jobs?.length);
    console.log('Paths:', paths?.length);
    
    if (jobs) {
        // Count how many paths per job if possible
        const pathsPerJob = {};
        if (paths && paths[0].job_id) {
           for (const p of paths) {
               pathsPerJob[p.job_id] = (pathsPerJob[p.job_id] || 0) + 1;
           }
           console.log('Paths per job:', pathsPerJob);
        }
    }
}
count().catch(console.error);
