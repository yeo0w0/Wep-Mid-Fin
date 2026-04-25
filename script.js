//인터랙션, 스크롤 애니메이션 및 동적 제어

document.addEventListener('DOMContentLoaded', () => {
  /* -----------------------------------------
       1. 모바일 메뉴 (Hamburger) 제어
    ----------------------------------------- */
  const hamburgerBtn = document.getElementById('hamburger-btn')
  const closeBtn = document.getElementById('close-btn')
  const mobileMenu = document.getElementById('mobile-menu')

  if (hamburgerBtn && closeBtn && mobileMenu) {
    // 메뉴 열기
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      mobileMenu.classList.add('active')
    })

    // 메뉴 닫기
    closeBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('active')
    })

    // 메뉴 외부 영역 클릭 시 닫기
    document.addEventListener('click', (e) => {
      if (
        mobileMenu.classList.contains('active') &&
        !mobileMenu.contains(e.target) &&
        !hamburgerBtn.contains(e.target)
      ) {
        mobileMenu.classList.remove('active')
      }
    })

    // 모바일 링크 클릭 시 닫기
    document.querySelectorAll('.mobile-nav-links a').forEach((link) => {
      link.addEventListener('click', () =>
        mobileMenu.classList.remove('active'),
      )
    })
  }

  /* -----------------------------------------
       2. 스크롤 시 상단 헤더 동적 스타일링
    ----------------------------------------- */
  const header = document.querySelector('.main-header')

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.background = 'rgba(11, 13, 20, 0.95)'
      header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.8)'
      header.style.borderBottom = '1px solid rgba(0, 212, 255, 0.2)' // 스크롤 시 하단 선 색상 변경
    } else {
      header.style.background = 'rgba(11, 13, 20, 0.85)'
      header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)'
      header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.08)'
    }
  })

  /* -----------------------------------------
       3. Intersection Observer (스크롤 등장 애니메이션)
    ----------------------------------------- */
  // 화면에 나타날 때 애니메이션을 줄 요소들 선택
  const animatedElements = document.querySelectorAll(
    '.content-block, .grid-card, .profile-card, .tool-item, .memory-segment',
  )

  // 초기 상태 설정 (투명도 0, 아래로 살짝 내려간 상태)
  animatedElements.forEach((el) => {
    el.style.opacity = '0'
    el.style.transform = 'translateY(40px)'
    el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
  })

  // 화면에 15% 정도 보일 때 실행되도록 설정
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px',
  }

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // 화면에 나타나면 원래 위치와 투명도로 복구
        entry.target.style.opacity = '1'
        entry.target.style.transform = 'translateY(0)'
        // 한 번 애니메이션이 실행되면 더 이상 감시하지 않음
        scrollObserver.unobserve(entry.target)
      }
    })
  }, observerOptions)

  animatedElements.forEach((el) => scrollObserver.observe(el))

  /* -----------------------------------------
       4. 숫자 카운트업 애니메이션 (About 섹션 통계)
    ----------------------------------------- */
  const stats = document.querySelectorAll('.stat-num')
  const statsContainer = document.querySelector('.about-stats')
  let hasCounted = false // 중복 실행 방지용 플래그

  if (statsContainer && stats.length > 0) {
    const statObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasCounted) {
          stats.forEach((stat) => {
            const targetText = stat.innerText
            // % 문자가 있는지 확인
            const isPercentage = targetText.includes('%')
            // 숫자만 추출
            const targetNumber = parseInt(targetText.replace(/[^0-9]/g, ''))
            let currentCount = 0

            // 카운트 속도 및 프레임 설정
            const duration = 2000 // 2초 동안 진행
            const increment = targetNumber / (duration / 16)

            const updateCount = () => {
              currentCount += increment
              if (currentCount < targetNumber) {
                stat.innerText =
                  Math.ceil(currentCount) + (isPercentage ? '%' : '')
                requestAnimationFrame(updateCount)
              } else {
                stat.innerText = targetNumber + (isPercentage ? '%' : '')
              }
            }
            updateCount()
          })
          hasCounted = true
        }
      },
      { threshold: 0.5 },
    ) // 화면에 50% 이상 보일 때 실행

    statObserver.observe(statsContainer)
  }

  /* -----------------------------------------
       5. 현재 페이지 메뉴 자동 하이라이트
    ----------------------------------------- */
  // 현재 접속 중인 HTML 파일명 추출
  const currentPath = window.location.pathname.split('/').pop()
  const navLinks = document.querySelectorAll(
    '.desktop-nav a, .mobile-nav-links a',
  )

  navLinks.forEach((link) => {
    const linkPath = link.getAttribute('href')

    // 드롭다운 작동용 임시 링크(#none)와 앵커(#)는 건너뜀
    if (linkPath.startsWith('#')) return

    // 모든 링크에서 active 클래스 제거
    link.classList.remove('active')

    // 현재 경로와 링크 경로가 일치하거나, 루트 경로(/)일 때 index.html 하이라이트
    if (
      currentPath === linkPath ||
      (currentPath === '' && linkPath === 'index.html')
    ) {
      link.classList.add('active')

      // 서브 메뉴(Study 하위)인 경우 부모인 'Study' 메뉴에도 불을 밝힘
      const parentDropdown = link.closest('.dropdown')
      if (parentDropdown) {
        const parentLink = parentDropdown.querySelector('a')
        if (parentLink) parentLink.classList.add('active')
      }
    }
  })

  /* -----------------------------------------
       6. 부드러운 앵커 스크롤 (Smooth Scroll)
    ----------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href')

    if (targetId === '#none' || targetId === '#') return

    const targetElement = document.querySelector(targetId)
    if (targetElement) {
      e.preventDefault()
      window.scrollTo({
        top: targetElement.offsetTop - 85,
        behavior: 'smooth',
      })
    }
  })
})
