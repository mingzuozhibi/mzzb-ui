#!/usr/bin/env bash

# 项目根目录
cd `dirname $0`/..

# 准备发布新版本
git flow release start "v$1"

# 更新 package.json 版本号
npm version $1
git commit --amend -m "chore: set version to v$1"
git tag -d "v$1"

# 发布新版本
git flow release finish "v$1"
