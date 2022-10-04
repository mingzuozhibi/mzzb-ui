#!/usr/bin/env bash

set -e

# 环境准备
DirName=$(dirname "$0")
HomeDir=$(realpath "$DirName"/..)
cd "$HomeDir" || exit

# 构建部署
if [[ $1 != '-q' ]]; then
    yarn build
    git log --pretty=format:'%h %ad | %s [%an]' --date=short -7 >build/git_logs.txt
fi

echo "Copying files to remote directory www/pro"
target=mzzb-admin/nginx/www/pro
ssh q "rm -rf $target; mkdir -p $target;"
tar -czf - -C build . | ssh q "tar -xzpvf - -C $target"
