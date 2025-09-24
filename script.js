// 슬라이더 관련 변수
let currentSlideIndex = 0;
let totalSlides = 6;
let slideInterval;

// 언론보도자료 슬라이더 변수
let currentPressSlideIndex = 0;
let totalPressSlides = 3;
let pressSlideInterval;

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 모달 로드
    loadModals();
    
    // 스무스 스크롤링 설정
    setupSmoothScrolling();
    
    // 모바일 메뉴 토글 설정
    setupMobileMenu();
    
    // 폼 유효성 검사 설정
    setupFormValidation();
    
    // 애니메이션 효과 설정
    setupAnimations();
    
    // 슬라이더 초기화
    initializeSlider();
    
    // 언론보도자료 슬라이더 초기화
    initializePressSlider();
    
    // 수상 이미지 슬라이더 초기화
    initializeAwardSlider();
    
    // ABOUT 버튼 이벤트 설정
    setupAboutButton();
    
    // 드롭다운 메뉴 설정
    setupDropdownMenu();
    
    // 모바일 메뉴 설정
    setupMobileMenu();
    
    // 팝업 초기화
    initializePopups();
    
    // 팝업 버튼은 onclick으로 처리
    
    // 팝업 테스트를 위한 즉시 실행 (개발용)
    console.log('DOM 로드 완료, 팝업 초기화 시작');
});

// 스무스 스크롤링 설정
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 모바일 메뉴 토글 설정
function setupMobileMenu() {
    // 모바일에서 메뉴가 길어질 경우를 대비한 설정
    const nav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav a');
    
    // 화면 크기에 따른 메뉴 조정
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            nav.classList.add('mobile-nav');
        } else {
            nav.classList.remove('mobile-nav');
        }
    });
}

// 폼 유효성 검사 설정
function setupFormValidation() {
    const form = document.querySelector('.contact-form-content');
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// 필드 유효성 검사
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    
    // 기존 에러 메시지 제거
    clearFieldError(field);
    
    if (!value) {
        showFieldError(field, '필수 입력 항목입니다.');
        return false;
    }
    
    // 전화번호 형식 검사
    if (fieldName === 'phone') {
        const phoneRegex = /^[0-9-+\s()]+$/;
        if (!phoneRegex.test(value)) {
            showFieldError(field, '올바른 전화번호 형식이 아닙니다.');
            return false;
        }
    }
    
    return true;
}

// 필드 에러 표시
function showFieldError(field, message) {
    field.style.borderColor = '#e74c3c';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '14px';
    errorDiv.style.marginTop = '5px';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

// 필드 에러 제거
function clearFieldError(field) {
    field.style.borderColor = '#e9ecef';
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// 애니메이션 효과 설정
function setupAnimations() {
    // 스크롤 시 요소 나타나기 효과
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // 애니메이션 대상 요소들
    const animateElements = document.querySelectorAll('.stat-item, .service-description, .marketing-content');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}




// 모달 열기
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
    
    // 모달 내용의 스크롤 위치를 맨 위로 초기화
    const modalBody = modal.querySelector('.modal-body');
    if (modalBody) {
        modalBody.scrollTop = 0;
    }
}

// 모달 닫기
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // 배경 스크롤 복원
}

// 폼 제출 처리
function submitForm(event) {
    event.preventDefault();
    
    const form = event.target;
    
    // 모든 필드 유효성 검사
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    // 개인정보 동의 확인
    const privacyAgree = document.getElementById('privacy-agree');
    if (!privacyAgree.checked) {
        alert('개인정보 수집 및 이용에 동의해주세요.');
        return;
    }
    
    if (!isValid) {
        alert('입력 정보를 확인해주세요.');
        return;
    }
    
    // 폼 데이터 수집
    const formData = {
        name: document.getElementById('name').value,
        phone1: document.getElementById('phone1').value,
        phone2: document.getElementById('phone2').value,
        phone3: document.getElementById('phone3').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toLocaleString('ko-KR')
    };
    
    // 전화번호 합치기
    const phone = `${formData.phone1}-${formData.phone2}-${formData.phone3}`;
    
    // 구글 시트에 데이터 전송
    sendToGoogleSheets(formData, phone);
}

// 구글 시트에 데이터 전송
function sendToGoogleSheets(formData, phone) {
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    // 버튼 상태 변경
    submitBtn.textContent = '전송 중...';
    submitBtn.disabled = true;
    
    // 구글 시트 앱스크립트 URL (실제 URL로 교체 필요)
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
    
    const payload = {
        name: formData.name,
        phone: phone,
        message: formData.message,
        timestamp: formData.timestamp
    };
    
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    })
    .then(() => {
        // 성공 처리
        showSuccessModal();
        document.querySelector('.contact-form-content').reset();
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('문의 전송 중 오류가 발생했습니다. 다시 시도해주세요.');
    })
    .finally(() => {
        // 버튼 상태 복원
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

// 성공 모달 표시
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'block';
}


// 모달 외부 클릭 시 닫기
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // 배경 스크롤 복원
        }
    });
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto'; // 배경 스크롤 복원
            }
        });
    }
});

// 스크롤 시 헤더 스타일 변경
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// 숫자 카운트 애니메이션
function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const originalText = stat.textContent;
        const target = parseInt(originalText.replace(/[^\d]/g, ''));
        
        // 숫자가 포함된 경우에만 애니메이션 실행
        if (!isNaN(target) && target > 0) {
            const suffix = originalText.replace(/[\d]/g, '');
            let current = 0;
            const increment = target / 50;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current) + suffix;
            }, 30);
        }
        // 숫자가 없는 텍스트는 그대로 유지
    });
}

// 통계 섹션이 보일 때 숫자 애니메이션 실행
const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateNumbers();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// 슬라이더 초기화
function initializeSlider() {
    updateSliderPosition();
    startAutoSlide();
    
    // 터치 이벤트 지원
    setupTouchEvents();
}

// 슬라이더 위치 업데이트
function updateSliderPosition() {
    const sliderTrack = document.getElementById('sliderTrack');
    if (sliderTrack) {
        sliderTrack.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    }
    
    // 슬라이드 활성화 상태 업데이트
    updateSlideStates();
    
    // 도트 활성화 상태 업데이트
    updateDotStates();
}

// 슬라이드 상태 업데이트
function updateSlideStates() {
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlideIndex);
    });
}

// 도트 상태 업데이트
function updateDotStates() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlideIndex);
    });
}

// 슬라이드 변경
function changeSlide(direction) {
    currentSlideIndex += direction;
    
    // 무한 루프 처리
    if (currentSlideIndex >= totalSlides) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = totalSlides - 1;
    }
    
    updateSliderPosition();
    resetAutoSlide();
}

// 특정 슬라이드로 이동
function currentSlide(slideNumber) {
    currentSlideIndex = slideNumber - 1;
    updateSliderPosition();
    resetAutoSlide();
}

// 자동 슬라이드 시작
function startAutoSlide() {
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000); // 5초마다 자동 슬라이드
}

// 자동 슬라이드 리셋
function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
}

// 터치 이벤트 설정
function setupTouchEvents() {
    const sliderWrapper = document.querySelector('.slider-wrapper');
    if (!sliderWrapper) return;
    
    let startX = 0;
    let endX = 0;
    
    sliderWrapper.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    });
    
    sliderWrapper.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const threshold = 50; // 최소 스와이프 거리
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // 왼쪽으로 스와이프 - 다음 슬라이드
                changeSlide(1);
            } else {
                // 오른쪽으로 스와이프 - 이전 슬라이드
                changeSlide(-1);
            }
        }
    }
}

// 슬라이더 호버 시 자동 슬라이드 일시정지
function pauseAutoSlide() {
    clearInterval(slideInterval);
}

// 슬라이더 호버 해제 시 자동 슬라이드 재시작
function resumeAutoSlide() {
    startAutoSlide();
}

// 슬라이더 호버 이벤트 설정
document.addEventListener('DOMContentLoaded', function() {
    const sliderWrapper = document.querySelector('.slider-wrapper');
    if (sliderWrapper) {
        sliderWrapper.addEventListener('mouseenter', pauseAutoSlide);
        sliderWrapper.addEventListener('mouseleave', resumeAutoSlide);
    }
});

// ABOUT 버튼 설정
function setupAboutButton() {
    const aboutBtn = document.querySelector('.about-btn');
    if (aboutBtn) {
        aboutBtn.addEventListener('click', function() {
            window.location.href = 'company.html';
        });
    }
}

// 드롭다운 메뉴 설정
function setupDropdownMenu() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            const dropdown = this.closest('.dropdown');
            const isActive = dropdown.classList.contains('active');
            
            // 다른 드롭다운 닫기
            document.querySelectorAll('.dropdown').forEach(drop => {
                drop.classList.remove('active');
            });
            
            // 현재 드롭다운 토글
            if (!isActive) {
                dropdown.classList.add('active');
            }
        });
    });
    
    // 외부 클릭 시 드롭다운 닫기
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
    
    // 모바일에서 드롭다운 메뉴 아이템 클릭 시 닫기
    const dropdownItems = document.querySelectorAll('.dropdown-menu a');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        });
    });
}

// 슬라이드 수량 동적 업데이트 함수 (나중에 사용)
function updateSlideCount(newCount) {
    totalSlides = newCount;
    
    // 도트 업데이트
    const dotsContainer = document.querySelector('.slider-dots');
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            dot.className = `dot ${i === 0 ? 'active' : ''}`;
            dot.onclick = () => currentSlide(i + 1);
            dotsContainer.appendChild(dot);
        }
    }
    
    // 현재 슬라이드 인덱스 조정
    if (currentSlideIndex >= totalSlides) {
        currentSlideIndex = totalSlides - 1;
        updateSliderPosition();
    }
}

// 언론보도자료 슬라이더 초기화
function initializePressSlider() {
    updatePressSliderPosition();
    startAutoPressSlide();
}

// 언론보도자료 슬라이더 위치 업데이트
function updatePressSliderPosition() {
    try {
        const pressSlides = document.querySelectorAll('.press-slide');
        const pressDots = document.querySelectorAll('.press-release .dot');
        
        if (pressSlides.length > 0) {
            pressSlides.forEach((slide, index) => {
                slide.classList.toggle('active', index === currentPressSlideIndex);
            });
        }
        
        if (pressDots.length > 0) {
            pressDots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentPressSlideIndex);
            });
        }
    } catch (error) {
        console.log('Press slider update error:', error);
    }
}

// 언론보도자료 슬라이드 변경
function changePressSlide(direction) {
    currentPressSlideIndex += direction;
    
    // 무한 루프 처리
    if (currentPressSlideIndex >= totalPressSlides) {
        currentPressSlideIndex = 0;
    } else if (currentPressSlideIndex < 0) {
        currentPressSlideIndex = totalPressSlides - 1;
    }
    
    updatePressSliderPosition();
    resetAutoPressSlide();
}

// 특정 언론보도자료 슬라이드로 이동
function currentPressSlide(slideNumber) {
    currentPressSlideIndex = slideNumber - 1;
    updatePressSliderPosition();
    resetAutoPressSlide();
}

// 자동 언론보도자료 슬라이드 시작
function startAutoPressSlide() {
    pressSlideInterval = setInterval(() => {
        changePressSlide(1);
    }, 5000); // 5초마다 자동 슬라이드
}

// 자동 언론보도자료 슬라이드 리셋
function resetAutoPressSlide() {
    clearInterval(pressSlideInterval);
    startAutoPressSlide();
}

// 모달 로드 함수
async function loadModals() {
    try {
        const response = await fetch('modals.html');
        const modalHTML = await response.text();
        const modalsContainer = document.getElementById('modals-container');
        if (modalsContainer) {
            modalsContainer.innerHTML = modalHTML;
        }
    } catch (error) {
        console.error('모달 로드 실패:', error);
    }
}

// 부드러운 스크롤을 위한 CSS 클래스 추가
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .header.scrolled {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
    }
    
    .field-error {
        animation: shake 0.5s ease-in-out;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .slide {
        opacity: 0.7;
        transition: opacity 0.3s ease;
    }
    
    .slide.active {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// 모바일 메뉴 설정
function setupMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (!mobileMenuToggle || !mainNav) return;
    
    // 모바일 메뉴 오버레이 생성
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    document.body.appendChild(overlay);
    
    // 햄버거 메뉴 토글
    mobileMenuToggle.addEventListener('click', function() {
        const isOpen = mainNav.classList.contains('mobile-open');
        
        if (isOpen) {
            // 메뉴 닫기
            closeMobileMenu();
        } else {
            // 메뉴 열기
            openMobileMenu();
        }
    });
    
    // 오버레이 클릭 시 메뉴 닫기
    overlay.addEventListener('click', function() {
        closeMobileMenu();
    });
    
    // 메뉴 아이템 클릭 시 메뉴 닫기 (드롭다운 토글 제외)
    const menuItems = mainNav.querySelectorAll('a:not(.dropdown-toggle)');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });
    
    // 드롭다운 토글 기능
    const dropdownToggles = mainNav.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.parentElement;
            const isActive = dropdown.classList.contains('active');
            
            // 다른 드롭다운 닫기
            document.querySelectorAll('.dropdown').forEach(dd => {
                if (dd !== dropdown) {
                    dd.classList.remove('active');
                }
            });
            
            // 현재 드롭다운 토글
            if (isActive) {
                dropdown.classList.remove('active');
            } else {
                dropdown.classList.add('active');
            }
        });
    });
    
    // 화면 크기 변경 시 메뉴 상태 초기화
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });
    
    function openMobileMenu() {
        mainNav.classList.add('mobile-open');
        mainNav.classList.add('active');
        overlay.classList.add('active');
        mobileMenuToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMobileMenu() {
        mainNav.classList.remove('mobile-open', 'active');
        overlay.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// 수상 이미지 슬라이드 기능
// 전역 변수 중복 선언 방지 및 재사용을 위해 이미 선언된 경우 재선언하지 않음
if (typeof currentSlideIndex === 'undefined') {
    var currentSlideIndex = 0;
}
if (typeof totalSlides === 'undefined') {
    var totalSlides = 3;
}

function moveSlide(direction) {
    currentSlideIndex += direction;
    
    if (currentSlideIndex >= totalSlides) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = totalSlides - 1;
    }
    
    updateSlider();
}

function currentSlide(slideNumber) {
    currentSlideIndex = slideNumber - 1;
    updateSlider();
}

function updateSlider() {
    const sliderTrack = document.querySelector('.slider-track');
    const dots = document.querySelectorAll('.dot');
    
    if (sliderTrack) {
        // GPU 가속을 위한 transform3d 사용
        sliderTrack.style.transform = `translate3d(-${currentSlideIndex * 100}%, 0, 0)`;
    }
    
    // Update dots - 더 효율적인 방법
    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            if (index === currentSlideIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
}

// 자동 슬라이드 기능 (선택사항)
function startAutoSlide() {
    setInterval(() => {
        moveSlide(1);
    }, 5000); // 5초마다 자동 슬라이드
}

// 간단한 수상 이미지 슬라이드
let currentAward = 1;

function showAward(number) {
    // 모든 이미지에서 active 클래스 제거
    const images = document.querySelectorAll('.award-img');
    images.forEach(img => img.classList.remove('active'));
    
    // 선택된 이미지에 active 클래스 추가
    const targetImg = document.getElementById('award' + number);
    if (targetImg) {
        targetImg.classList.add('active');
        currentAward = number;
    }
}

function nextAward() {
    currentAward++;
    if (currentAward > 3) {
        currentAward = 1;
    }
    showAward(currentAward);
}

// 수상 이미지 슬라이드 함수들
let currentAwardSlideIndex = 0;
const totalAwardSlides = 3;

function changeAwardSlide(direction) {
    console.log('changeAwardSlide 호출됨:', direction);
    
    const slides = document.querySelectorAll('.awards-slider-container .award-slide');
    const dots = document.querySelectorAll('.awards-slider-container .dot');
    
    console.log('슬라이드 개수:', slides.length);
    console.log('도트 개수:', dots.length);
    console.log('현재 인덱스:', currentAwardSlideIndex);
    
    if (slides.length === 0 || dots.length === 0) {
        console.log('슬라이드 또는 도트를 찾을 수 없음');
        return;
    }
    
    // 현재 슬라이드 비활성화
    slides[currentAwardSlideIndex].style.display = 'none';
    dots[currentAwardSlideIndex].classList.remove('active');
    
    // 다음 슬라이드 인덱스 계산
    currentAwardSlideIndex += direction;
    
    if (currentAwardSlideIndex >= totalAwardSlides) {
        currentAwardSlideIndex = 0;
    } else if (currentAwardSlideIndex < 0) {
        currentAwardSlideIndex = totalAwardSlides - 1;
    }
    
    console.log('새 인덱스:', currentAwardSlideIndex);
    
    // 새 슬라이드 활성화
    slides[currentAwardSlideIndex].style.display = 'block';
    dots[currentAwardSlideIndex].classList.add('active');
    
    console.log('슬라이드 변경 완료');
}

function currentAwardSlide(slideNumber) {
    console.log('currentAwardSlide 호출됨:', slideNumber);
    
    const slides = document.querySelectorAll('.awards-slider-container .award-slide');
    const dots = document.querySelectorAll('.awards-slider-container .dot');
    
    if (slides.length === 0 || dots.length === 0) {
        console.log('슬라이드 또는 도트를 찾을 수 없음');
        return;
    }
    
    // 현재 슬라이드 비활성화
    slides[currentAwardSlideIndex].style.display = 'none';
    dots[currentAwardSlideIndex].classList.remove('active');
    
    // 새 슬라이드 인덱스 설정
    currentAwardSlideIndex = slideNumber - 1;
    
    // 새 슬라이드 활성화
    slides[currentAwardSlideIndex].style.display = 'block';
    dots[currentAwardSlideIndex].classList.add('active');
    
    console.log('도트 클릭으로 슬라이드 변경 완료');
}

// 수상 이미지 슬라이더 초기화 함수
function initializeAwardSlider() {
    try {
        console.log('수상 슬라이더 초기화 시작');
        
        // 슬라이더 요소들 확인
        const slides = document.querySelectorAll('.awards-slider-container .award-slide');
        const dots = document.querySelectorAll('.awards-slider-container .dot');
        
        console.log('슬라이드 개수:', slides.length);
        console.log('도트 개수:', dots.length);
        
        if (slides.length > 0 && dots.length > 0) {
            // 초기 위치 설정
            currentAwardSlideIndex = 0;
            
            // 첫 번째 슬라이드만 활성화
            slides.forEach((slide, index) => {
                if (index === 0) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });
            
            // 첫 번째 도트만 활성화
            dots.forEach((dot, index) => {
                if (index === 0) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
            
            console.log('수상 슬라이더 초기화 완료');
        } else {
            console.log('수상 슬라이더 요소를 찾을 수 없음');
        }
    } catch (error) {
        console.error('수상 슬라이더 초기화 오류:', error);
    }
}

// 페이지 로드 시 슬라이드 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing sliders...');
    
    // 기존 슬라이드 초기화
    setTimeout(() => {
        try {
            updateSlider();
            console.log('Main slider initialized');
        } catch (error) {
            console.log('Main slider error:', error);
        }
    }, 100);
    
    // 언론보도 슬라이드 초기화
    setTimeout(() => {
        try {
            updatePressSliderPosition();
            console.log('Press slider initialized');
        } catch (error) {
            console.log('Press slider error:', error);
        }
    }, 150);
    
    // 수상 슬라이드 초기화
    setTimeout(() => {
        try {
            updateAwardSlider();
            console.log('Award slider initialized');
        } catch (error) {
            console.log('Award slider error:', error);
        }
    }, 200);
});

// 팝업 관련 함수들
function initializePopups() {
    console.log('팝업 초기화 시작');
    
    // 즉시 팝업 표시
    showPopups();
    
    // 1초 후 재시도
    setTimeout(() => {
        console.log('1초 후 팝업 재시도');
        showPopups();
    }, 1000);
    
    // 3초 후 재시도
    setTimeout(() => {
        console.log('3초 후 팝업 재시도');
        showPopups();
    }, 3000);
    
    // 5초 후 재시도
    setTimeout(() => {
        console.log('5초 후 팝업 재시도');
        showPopups();
    }, 5000);
}

// 팝업 버튼은 onclick으로 처리하므로 별도 함수 불필요

function showPopups() {
    console.log('팝업 표시 함수 실행');
    
    // 팝업 오버레이 찾기
    const popupOverlay = document.getElementById('popupOverlay');
    if (!popupOverlay) {
        console.log('팝업 오버레이를 찾을 수 없습니다!');
        return;
    }
    
    console.log('팝업 오버레이 찾음, 강제 표시 중...');
    
    // 오버레이 강제 표시
    popupOverlay.style.display = 'flex';
    popupOverlay.style.visibility = 'visible';
    popupOverlay.style.opacity = '1';
    popupOverlay.style.zIndex = '99999';
    
    // 각 팝업 확인 및 표시
    for (let i = 1; i <= 4; i++) {
        const popup = document.getElementById(`popup${i}`);
        if (popup) {
            console.log(`팝업 ${i} 표시`);
            popup.style.display = 'block';
            popup.style.visibility = 'visible';
            popup.style.opacity = '1';
        } else {
            console.log(`팝업 ${i}를 찾을 수 없습니다!`);
        }
    }
    
    console.log('팝업 표시 완료');
}

function closePopup(popupNumber) {
    console.log(`팝업 ${popupNumber} 닫기 시도`);
    
    const popup = document.getElementById(`popup${popupNumber}`);
    if (popup) {
        console.log(`팝업 ${popupNumber} 찾음, 닫는 중...`);
        
        // 간단한 방법으로 팝업 숨김
        popup.style.display = 'none';
        popup.style.visibility = 'hidden';
        popup.style.opacity = '0';
        
        // 클래스 추가
        popup.classList.add('hidden');
        
        console.log(`팝업 ${popupNumber} 닫기 완료`);
        
        // 모든 팝업이 닫혔는지 확인
        checkAllPopupsClosed();
    } else {
        console.log(`팝업 ${popupNumber}를 찾을 수 없습니다!`);
    }
}

// "오늘 다시 보지 않기" 기능 제거됨

// "오늘 다시 보지 않기" 관련 함수들 제거됨

function checkAllPopupsClosed() {
    console.log('모든 팝업 닫힘 상태 확인 중...');
    
    const popupOverlay = document.getElementById('popupOverlay');
    if (!popupOverlay) {
        console.log('팝업 오버레이를 찾을 수 없습니다');
        return;
    }
    
    let visibleCount = 0;
    
    // 각 팝업의 상태를 직접 확인
    for (let i = 1; i <= 4; i++) {
        const popup = document.getElementById(`popup${i}`);
        if (popup) {
            const computedStyle = window.getComputedStyle(popup);
            const isVisible = computedStyle.display !== 'none' && 
                             computedStyle.visibility !== 'hidden' && 
                             computedStyle.opacity !== '0';
            
            if (isVisible) {
                visibleCount++;
                console.log(`팝업 ${i}는 여전히 보임 (display: ${computedStyle.display}, visibility: ${computedStyle.visibility}, opacity: ${computedStyle.opacity})`);
            } else {
                console.log(`팝업 ${i}는 닫힘`);
            }
        }
    }
    
    console.log(`보이는 팝업 개수: ${visibleCount}`);
    
    // 모든 팝업이 닫혔으면 오버레이도 숨기기
    if (visibleCount === 0) {
        console.log('모든 팝업이 닫혔으므로 오버레이 숨김');
        popupOverlay.style.setProperty('display', 'none', 'important');
        popupOverlay.style.setProperty('visibility', 'hidden', 'important');
        popupOverlay.style.setProperty('opacity', '0', 'important');
    } else {
        console.log(`${visibleCount}개의 팝업이 여전히 보임`);
    }
}

// 팝업 오버레이 클릭 시 닫기 (팝업 자체가 아닌 오버레이 클릭 시)
document.addEventListener('click', function(event) {
    const popupOverlay = document.getElementById('popupOverlay');
    if (popupOverlay && event.target === popupOverlay) {
        // 모든 팝업 닫기
        for (let i = 1; i <= 4; i++) {
            const popup = document.getElementById(`popup${i}`);
            if (popup) {
                popup.style.display = 'none';
            }
        }
        popupOverlay.style.display = 'none';
    }
});

// ESC 키로 팝업 닫기
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const popupOverlay = document.getElementById('popupOverlay');
        if (popupOverlay && popupOverlay.style.display === 'flex') {
            // 모든 팝업 닫기
            for (let i = 1; i <= 4; i++) {
                const popup = document.getElementById(`popup${i}`);
                if (popup) {
                    popup.style.display = 'none';
                }
            }
            popupOverlay.style.display = 'none';
        }
    }
});

// 팝업 강제 표시 함수 (테스트용)
function forceShowPopups() {
    console.log('팝업 강제 표시 시작');
    
    const popupOverlay = document.getElementById('popupOverlay');
    if (!popupOverlay) {
        console.log('팝업 오버레이를 찾을 수 없습니다!');
        alert('팝업 오버레이를 찾을 수 없습니다!');
        return;
    }
    
    console.log('팝업 오버레이 찾음, 강제 표시 중...');
    
    // 오버레이 강제 표시
    popupOverlay.style.display = 'flex';
    popupOverlay.style.visibility = 'visible';
    popupOverlay.style.opacity = '1';
    popupOverlay.style.zIndex = '99999';
    popupOverlay.style.position = 'fixed';
    popupOverlay.style.top = '0';
    popupOverlay.style.left = '0';
    popupOverlay.style.width = '100%';
    popupOverlay.style.height = '100%';
    
    // 모든 팝업 강제 표시
    for (let i = 1; i <= 4; i++) {
        const popup = document.getElementById(`popup${i}`);
        if (popup) {
            console.log(`팝업 ${i} 강제 표시`);
            popup.style.display = 'block';
            popup.style.visibility = 'visible';
            popup.style.opacity = '1';
            popup.style.zIndex = '100000';
            popup.style.position = 'relative';
        } else {
            console.log(`팝업 ${i}를 찾을 수 없습니다!`);
        }
    }
    
    console.log('팝업 강제 표시 완료');
    alert('팝업이 강제로 표시되었습니다!');
}

// 간단한 팝업 테스트 함수
function testPopups() {
    console.log('팝업 테스트 시작');
    const overlay = document.getElementById('popupOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        console.log('팝업이 표시되었습니다!');
    } else {
        console.log('팝업 오버레이를 찾을 수 없습니다!');
    }
}

// 즉시 팝업 표시 함수
function showPopupsNow() {
    console.log('즉시 팝업 표시');
    const overlay = document.getElementById('popupOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        overlay.style.visibility = 'visible';
        overlay.style.opacity = '1';
        console.log('팝업 오버레이 표시 완료');
    }
    
    for (let i = 1; i <= 4; i++) {
        const popup = document.getElementById(`popup${i}`);
        if (popup) {
            popup.style.display = 'block';
            popup.style.visibility = 'visible';
            popup.style.opacity = '1';
            console.log(`팝업 ${i} 표시 완료`);
        }
    }
}

// 간단한 팝업 닫기 테스트 함수
function testClosePopup(popupNumber) {
    console.log(`팝업 ${popupNumber} 닫기 테스트`);
    const popup = document.getElementById(`popup${popupNumber}`);
    if (popup) {
        popup.style.display = 'none';
        popup.style.visibility = 'hidden';
        popup.style.opacity = '0';
        console.log(`팝업 ${popupNumber} 닫기 테스트 완료!`);
    } else {
        console.log(`팝업 ${popupNumber}를 찾을 수 없습니다!`);
    }
}

// 전역에서 바로 사용할 수 있는 간단한 함수들
window.testClose1 = function() { testClosePopup(1); };
window.testClose2 = function() { testClosePopup(2); };
window.testClose3 = function() { testClosePopup(3); };
window.testClose4 = function() { testClosePopup(4); };

// 직접적인 팝업 닫기 함수들 - 즉시 실행
(function() {
    window.close1 = function() { 
        const popup = document.getElementById('popup1');
        if (popup) {
            popup.style.setProperty('display', 'none', 'important');
            console.log('팝업 1 닫기 완료');
        } else {
            console.log('팝업 1을 찾을 수 없습니다');
        }
    };
    
    window.close2 = function() { 
        const popup = document.getElementById('popup2');
        if (popup) {
            popup.style.setProperty('display', 'none', 'important');
            console.log('팝업 2 닫기 완료');
        } else {
            console.log('팝업 2를 찾을 수 없습니다');
        }
    };
    
    window.close3 = function() { 
        const popup = document.getElementById('popup3');
        if (popup) {
            popup.style.setProperty('display', 'none', 'important');
            console.log('팝업 3 닫기 완료');
        } else {
            console.log('팝업 3을 찾을 수 없습니다');
        }
    };
    
    window.close4 = function() { 
        const popup = document.getElementById('popup4');
        if (popup) {
            popup.style.setProperty('display', 'none', 'important');
            console.log('팝업 4 닫기 완료');
        } else {
            console.log('팝업 4를 찾을 수 없습니다');
        }
    };
    
    console.log('팝업 닫기 함수들이 등록되었습니다: close1(), close2(), close3(), close4()');
    
    // 더 간단한 함수들도 추가
    window.c1 = window.close1;
    window.c2 = window.close2;
    window.c3 = window.close3;
    window.c4 = window.close4;
    
    console.log('간단한 함수들도 등록되었습니다: c1(), c2(), c3(), c4()');
})();

// 모든 팝업 닫기 함수
function closeAllPopups() {
    console.log('모든 팝업 닫기 시도');
    
    for (let i = 1; i <= 4; i++) {
        const popup = document.getElementById(`popup${i}`);
        if (popup) {
            popup.style.setProperty('display', 'none', 'important');
            popup.style.setProperty('visibility', 'hidden', 'important');
            popup.style.setProperty('opacity', '0', 'important');
            popup.style.setProperty('z-index', '-1', 'important');
            console.log(`팝업 ${i} 닫기 완료`);
        }
    }
    
    const overlay = document.getElementById('popupOverlay');
    if (overlay) {
        overlay.style.setProperty('display', 'none', 'important');
        overlay.style.setProperty('visibility', 'hidden', 'important');
        overlay.style.setProperty('opacity', '0', 'important');
        console.log('팝업 오버레이 닫기 완료');
    }
    
    console.log('모든 팝업이 닫혔습니다!');
}

// 전역 함수로 등록
window.showPopups = showPopups;
window.showPopupsNow = showPopupsNow;
window.forceShowPopups = forceShowPopups;
window.closePopup = closePopup;
window.testPopups = testPopups;
window.testClosePopup = testClosePopup;
window.closeAllPopups = closeAllPopups;