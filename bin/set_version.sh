#!/usr/bin/env bash

# 环境准备
DirName=$(dirname "$0")
HomeDir=$(realpath "$DirName"/..)
ExecMvn="bash ./mvnw"
cd "$HomeDir" || exit

# 版本发布
git flow release start "v$1"
npm version $1
git commit --amend -m "chore: set version to v$1"
git tag -d "v$1"
git flow release finish "v$1"
