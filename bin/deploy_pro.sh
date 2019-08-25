#!/usr/bin/env bash

set -e

cd $(cd `dirname $0`; pwd)/..

if [[ $1 != '-q' ]]; then
  yarn build
fi

ssh q "rm -rf html/mzzb-ui; mkdir -p html/mzzb-ui;"

tar -czf - -C build . | ssh q "tar -xzpvf - -C html/mzzb-ui"
