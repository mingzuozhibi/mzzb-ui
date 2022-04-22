#!/usr/bin/env bash

set -e

# 环境准备
DirName=$(dirname "$0")
HomeDir=$(realpath "$DirName"/..)
cd "$HomeDir" || exit

# 构建部署
if [[ $1 != '-q' ]]; then
    yarn build
fi

ssh q "rm -rf nginx/www/mzzb-ui-dev; mkdir -p nginx/www/mzzb-ui-pro;"
tar -czf - -C build . | ssh q "tar -xzpvf - -C nginx/www/mzzb-ui-pro"
