#!/usr/bin/env bash

cd `dirname $0`/..

tagtxt="v$1"
version="$1"
option2="$2"

CallRelease() {
    git flow release start $tagtxt

    npm version $version
    git commit --amend -m "chore: set version to $version"
    git tag -d $tagtxt

    git flow release finish $tagtxt
}

CallPushAll() {
  echo "开始推送分支 develop"
  git push origin develop

  echo "开始推送分支 master"
  git push origin master

  echo "开始推送标签 $tagtxt"
  git push origin $tagtxt
}

if [[ $option2 == "-a" ]]; then
  CallRelease
  CallPushAll
  exit 0
fi

if [[ $option2 == "-f" ]]; then
  CallPushAll
else
  CallRelease
fi
