#!/usr/bin/env bash

set -e

cd $(cd `dirname $0`; pwd)/..

if [[ $1 != '-q' ]]; then
  yarn build
fi

ssh q "rm -rf nginx/www/mzzb-ui-dev; mkdir -p nginx/www/mzzb-ui-dev;"
tar -czf - -C build . | ssh q "tar -xzpvf - -C nginx/www/mzzb-ui-dev"

ssh q "rm -rf nginx/www/mzzb-ui-dev; mkdir -p nginx/www/mzzb-ui-pro;"
tar -czf - -C build . | ssh q "tar -xzpvf - -C nginx/www/mzzb-ui-pro"
