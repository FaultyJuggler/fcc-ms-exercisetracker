FROM node:12.16
EXPOSE 3000

# add TINI
ENV TINI_VERSION v0.18.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini

# SETUP
WORKDIR /app
COPY package*.json ./
RUN npm install && npm cache clean --force
COPY . .
ADD VERSION .

# debian entry for TINI
ENTRYPOINT ["/tini", "--"]
USER node
CMD ["node", "server.js"]