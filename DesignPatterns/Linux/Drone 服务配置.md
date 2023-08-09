Drone 服务配置

```javascript
docker run \
  --volume=/var/lib/front:/data \
	--env=DRONE_AGENTS_ENABLED=true \
  --env=DRONE_GITHUB_SERVER=https://github.com \
  --env=DRONE_GITHUB_CLIENT_ID=9f280329d52cf9e06013 \
  --env=DRONE_GITHUB_CLIENT_SECRET=53203c592e37b9815f299c24e7f8ca64bcb05ebc \
  --env=DRONE_RPC_SECRET=12345678 \
  --env=DRONE_SERVER_HOST=47.114.3.107:8000 \
	--env=DRONE_RUNNER_CAPACITY=2 \
  --env=DRONE_SERVER_PROTO=http \
  --publish=8000:80 \
	--publish=3001:443 \
  --restart=always \
  --detach=true \
  --name=front \
  drone/drone:1
```

```
-A INPUT -m state –state NEW -m tcp -p tcp –dport 8088 -j ACCEPT
```

```
docker run -d \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -e DRONE_RPC_PROTO=http \
  -e DRONE_RPC_HOST= \
  -e DRONE_RPC_SECRET=12345678 \
  -e DRONE_RUNNER_CAPACITY=2 \
  -e DRONE_RUNNER_NAME=${HOSTNAME} \
  -p 3000:3000 \
  --restart always \
  --name runner \
  drone/drone-runner-docker:1
```

Github 设置  `Authorization callback URL` 时 需要设置 返回的端口号和固定的 */login 链接

runner 配置

```
docker run -d \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -e DRONE_RPC_PROTO=http \
  -e DRONE_RPC_HOST=47.114.3.107:8000 \
  -e DRONE_RPC_SECRET=12345678 \
  -e DRONE_RUNNER_CAPACITY=2 \
  -e DRONE_RUNNER_NAME=frontAgent \
  -p 3000:3000 \
  --restart always \
  --name frontAgent \
  drone/drone-runner-docker:1
```

```yml
---
    kind: pipeline
    type: docker
    name: front
# 安装 并设置淘宝镜像
    steps:
    - name: npm install
      image: node:lts-alpine3.9
      commands:
      - npm i --registry=https://registry.npm.taobao.org/
#build 命令
    - name: npm build
      image: node:lts-alpine3.9
      commands:
      - npm run build
#设置秘钥 设置部署环境
#添加了环境之后就需要使用 drone build remote 命令发布到不同的环境
    - name: rsync production
      image: drillster/drone-rsync
      environment:
        RSYNC_KEY:
          from_secret: rsync_key
      settings:
        hosts:
          - 47.114.3.107:8000
        source: ./dist
        target: /root/front
        secrets: [ rsync_key ]
      trigger:
        target:
        - production
        event:
          promote

    - name: rsync staging
      image: drillster/drone-rsync
      environment:
        RSYNC_KEY:
          from_secret: rsync_key
      settings:
        hosts:
          - 47.114.3.107:8000
        source: ./dist
        target: /root/front
        secrets: [ rsync_key ]
      trigger:
        target:
        - staging
        event:
          promote
# 通知设置 钉钉机器人api drone trigger 事件，何时触发事件
     - name: notify
      image: curlimages/curl:latest
      commands:
        - |
          curl ''
      trigger:
        status:
        - success
        - failure
```

## 安装 drone-cli

- macOS:  brew install drone-cli
- 在 drone server 的用户头像中拿到设置信息

```javascript
  export DRONE_SERVER=http://47.114.3.107:8000
  export DRONE_TOKEN=tP31YuXLXvi2b4p2Re8NYmsieP9GcGaV
  drone info
```

## 发布环境命令行 drone build promote [command options] <repo/name> <build> <environment>

```javascript
  <repo/name>: 项目名称  KtGim/front
  <build>： 构建id
  <environment>: 构建环境，根据以上配置 会有 staging 和 production 两个环境
```

## jsonnet 来做 json 的分摊
