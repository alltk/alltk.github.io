# GitHub Pages 배포 가이드

이 문서는 에이치애드 웹사이트를 GitHub Pages에 배포하는 방법을 설명합니다.

## 🚀 배포 단계

### 1. GitHub 저장소 생성

1. GitHub에 로그인
2. "New repository" 클릭
3. Repository name: `h-ad-website` (또는 원하는 이름)
4. Description: "에이치애드 공식 웹사이트"
5. Public으로 설정
6. "Create repository" 클릭

### 2. 파일 업로드

#### 방법 1: GitHub 웹 인터페이스 사용
1. 생성된 저장소에서 "uploading an existing file" 클릭
2. 모든 파일들을 드래그 앤 드롭으로 업로드
3. Commit message 작성 후 "Commit changes" 클릭

#### 방법 2: Git 명령어 사용
```bash
# 저장소 클론
git clone https://github.com/사용자명/h-ad-website.git
cd h-ad-website

# 파일들 복사
# (모든 프로젝트 파일들을 이 디렉토리에 복사)

# Git에 추가
git add .
git commit -m "Initial commit: 에이치애드 웹사이트"
git push origin main
```

### 3. GitHub Pages 활성화

1. 저장소 페이지에서 "Settings" 탭 클릭
2. 왼쪽 메뉴에서 "Pages" 클릭
3. Source를 "Deploy from a branch"로 설정
4. Branch를 "main"으로 선택
5. Folder를 "/ (root)"로 선택
6. "Save" 클릭

### 4. 도메인 설정 (선택사항)

만약 `h-ad.kr` 도메인을 사용하려면:

1. 도메인 제공업체에서 DNS 설정:
   ```
   Type: CNAME
   Name: www
   Value: 사용자명.github.io
   ```

2. 저장소에 `CNAME` 파일이 이미 포함되어 있음
3. GitHub Pages 설정에서 Custom domain에 `h-ad.kr` 입력

### 5. 배포 확인

- 배포 완료 후 `https://사용자명.github.io/저장소명` 또는 `https://h-ad.kr`에서 사이트 확인
- 배포에는 보통 5-10분 소요

## 🔧 추가 설정

### SSL 인증서
GitHub Pages는 자동으로 SSL 인증서를 제공합니다. Custom domain 사용 시 "Enforce HTTPS" 옵션을 활성화하세요.

### 성능 최적화
- 이미지 최적화
- CSS/JS 압축
- CDN 사용 고려

### SEO 최적화
- Google Search Console 등록
- sitemap.xml 생성
- meta 태그 최적화

## 🐛 문제 해결

### 배포가 안 될 때
1. 파일명과 경로 확인
2. `_config.yml` 문법 확인
3. GitHub Actions 로그 확인

### 도메인이 연결되지 않을 때
1. DNS 설정 확인 (24-48시간 소요)
2. CNAME 파일 확인
3. 도메인 설정에서 HTTPS 강제 사용 확인

## 📞 지원

배포 관련 문제가 있으면:
- 이메일: csk092020@gmail.com
- 전화: 1660-4823

---

**성공적인 배포를 위해 각 단계를 차근차근 따라해주세요!**
