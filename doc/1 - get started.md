# --- Installing the NestJS CLI
# Detect what version of Node is installed
node --version

# Install NestJS CLI -globally
npm i -g @nestjs/cli

# Check your Nest version (once installed)
nest --version

# 💡TIP💡 Output all Nest commands
nest --help

# --- Using CLI to create project
# Create our ILUVCOFFEE Application
nest new iluvcoffee

# Start Nest application
cd iluvcoffee
npm run start

# Development mode (watch mode)
npm run start:dev

# 
# Project available at PORT 3000 
# http://localhost:3000
#

# ---
# main.ts is the "main" file


