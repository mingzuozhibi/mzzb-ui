#!/usr/bin/env bash

#!/usr/bin/env bash

# 项目根目录
basepath=$(cd `dirname $0`; pwd)/..

# 准备发布新版本
cd ${basepath}
git flow release start "v$1"

# 更新 package.json 版本号
npm version $1
git commit --amend -m "chore: set version to v$1"

# 发布新版本
git flow release finish "v$1"
