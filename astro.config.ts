import { defineConfig } from 'astro/config';
import { resolverBase } from './src/lib/config.ts';

const { site, base } = resolverBase(process.env.GITHUB_REPOSITORY);

export default defineConfig({ site, base });
