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
    
    // ABOUT 버튼 이벤트 설정
    setupAboutButton();
    
    // 드롭다운 메뉴 설정
    setupDropdownMenu();
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
    const pressSlides = document.querySelectorAll('.press-slide');
    const pressDots = document.querySelectorAll('.press-release .dot');
    
    pressSlides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentPressSlideIndex);
    });
    
    pressDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentPressSlideIndex);
    });
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
