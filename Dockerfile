# Node.js 베이스 이미지 사용
FROM node:21

# 작업 디렉토리 설정
WORKDIR /app

# .yarnrc.yml 파일을 복사
COPY .yarnrc.yml ./

# package.json과 yarn.lock 파일을 복사
COPY package.json ./

# 의존성 설치
RUN yarn install

# 빌드
RUN yarn build

# 전체 소스 파일 복사
COPY . .

# 포트 노출 (Next.js 기본 포트 3000)
EXPOSE 3000

# 서버 실행 명령어
CMD ["yarn", "start"]
