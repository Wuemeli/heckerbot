# use the official Bun image
FROM oven/bun:latest as base
WORKDIR /app

# install dependencies into temp directory
FROM base AS install
COPY package.json ./
RUN bun install --frozen-lockfile

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM install AS prerelease
COPY --from=install /app/node_modules ./node_modules
COPY . .

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /app/node_modules ./node_modules
COPY --from=prerelease /app .

# run the app
USER bun
EXPOSE 3000/tcp
CMD [ "bun", "start" ]