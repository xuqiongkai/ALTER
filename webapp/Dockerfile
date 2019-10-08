FROM ubuntu:18.04

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Packages to
# --Acquire dependencies
ENV ACQUIRE_DEPENDENCIES "apt-transport-https ca-certificates curl gnupg git openssh-client"
# --Scripting dependencies
ENV SCRIPTING_DEPENDENCIES "jq"

RUN apt update \
  && apt install -y -q --no-install-recommends \
  ${ACQUIRE_DEPENDENCIES} \
  ${SCRIPTING_DEPENDENCIES}

# nvm environment variables
RUN mkdir -p /usr/local/nvm

ENV NVM_DIR /usr/local/nvm
# ENV NVM_VERSION 0.33.11
ENV NODE_VERSION 10.15.3

# install nvm
# https://github.com/creationix/nvm#install-script
RUN curl --silent -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

# install node and npm, set default alias
RUN source $NVM_DIR/nvm.sh \
  && nvm install $NODE_VERSION \
  && nvm alias default $NODE_VERSION \
  && nvm use default

# add node and npm to path so the commands are available
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

WORKDIR /app/webapp

# COPY package.json /app
RUN npm install
RUN npm install -g cross-env

EXPOSE 3000
