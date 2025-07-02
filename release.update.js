/* eslint-disable no-console */
import fs from 'fs';
import { execSync } from 'child_process';

const space = 2;
const composerFile = './composer.json';
const packageFile = './package.json';

if (!process.env.RELEASE_VERSION) {
  console.error('RELEASE_VERSION environment variable is not set');
  process.exit(1);
}

// Update composer.json
if (fs.existsSync(composerFile)) {
  const composerJson = JSON.parse(fs.readFileSync(composerFile, 'utf8'));
  composerJson.version = process.env.RELEASE_VERSION;
  fs.writeFileSync(
    composerFile,
    JSON.stringify(composerJson, null, space) + '\n'
  );
  console.log(`Updated ${composerFile} to version ${composerJson.version}`);

  // Update composer.lock
  try {
    execSync('composer update --lock', { stdio: 'inherit' });
    console.log('Updated composer.lock');
  } catch (error) {
    console.error('Failed to update composer.lock', error);
  }
}

// Update package.json
if (fs.existsSync(packageFile)) {
  const packageJson = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
  packageJson.version = process.env.RELEASE_VERSION;
  fs.writeFileSync(
    packageFile,
    JSON.stringify(packageJson, null, space) + '\n'
  );
  console.log(`Updated ${packageFile} to version ${packageJson.version}`);

  // Update package-lock.json
  try {
    execSync('npm install --package-lock-only', { stdio: 'inherit' });
    console.log('Updated package-lock.json');
  } catch (error) {
    console.error('Failed to update package-lock.json', error);
  }
}
