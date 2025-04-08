FROM node:21

# Corepack 활성화 (yarn 4 사용)
RUN corepack enable

WORKDIR /app

# 루트 설정 복사
COPY package.json yarn.lock .yarnrc.yml ./

# 전체 workspace 복사
COPY backend ./backend
COPY frontend ./frontend

# 의존성 설치
RUN yarn install

# frontend 빌드
RUN yarn workspace frontend build

# 포트는 런타임에 정의하므로 생략 가능
