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

target=mzzb-admin/nginx/www/dev
ssh q "rm -rf $target; mkdir -p $target;"
tar -czf - -C build . | ssh q "tar -xzpvf - -C $target"

target=mzzb-admin/nginx/www/pro
ssh q "rm -rf $target; mkdir -p $target;"
tar -czf - -C build . | ssh q "tar -xzpvf - -C $target"
