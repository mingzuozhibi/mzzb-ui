# 项目根目录
basepath=$(cd `dirname $0`; pwd)/..

cd ${basepath}
# 构建文件
yarn build
# 打包文件
tar -czvf mzzb-ui.tar.gz build/
# 上传文件
scp mzzb-ui.tar.gz q:html
# 删除文件
rm mzzb-ui.tar.gz
# 远程部署
ssh q "mkdir -p html/mzzb-ui; cd html; tar -xzvf mzzb-ui.tar.gz; rm -rf mzzb-ui; mv build mzzb-ui"
