FROM node:18-slim

# Install pnpm
RUN npm install -g pnpm

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to the working directory
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the code
COPY . .

# Run the application
CMD ["node", "src/index.js"]
