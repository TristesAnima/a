#!/usr/bin/env bash

yarn config set registry https://registry.npm.taobao.org

yarn config set ignore-engines true

yarn install --force

yarn run build
