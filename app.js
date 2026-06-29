/* ============================================
   GÖKYÜZÜ RÜYASI — APP.JS
   Digital Wedding Invitation Logic
   ============================================ */

(function () {
  'use strict';

  // ─── CONFIGURATION (Kolayca düzenlenebilir) ─────────────────
  const CONFIG = {
    // Düğün tarihi ve saati (yıl, ay-1, gün, saat, dakika)
    weddingDate: new Date(2026, 6, 19, 19, 0, 0), // 19 Temmuz 2026, 19:00

    // Google Calendar bilgileri
    calendar: {
      title: 'Fatma & Onur Düğün Töreni',
      startDate: '20260719T160000Z', // UTC 16:00 = TSİ 19:00
      endDate: '20260719T200000Z',   // UTC 20:00 = TSİ 23:00
      location: 'Delta Park Yaşam Tesisi, Bafra / Samsun',
      details: 'Fatma ve Onur\'un düğün törenine davetlisiniz! Düğün ve Nikah Töreni Saat: 19:00-23.00'
    },

    // Yıldız sayısı
    starCount: 120,
    shootingStarCount: 3
  };

  // ─── DOM ELEMENTS ──────────────────────────────────────────
  const cover = document.getElementById('cover');
  const envelopeContainer = document.getElementById('envelopeContainer');
  const envelopeVideo = document.getElementById('envelopeVideo');
  const tapToOpen = document.getElementById('tapToOpen');
  const glowOverlay = document.getElementById('glowOverlay');
  const mainContent = document.getElementById('main-content');
  const musicToggle = document.getElementById('musicToggle');
  const bgMusic = document.getElementById('bgMusic');
  const starfield = document.getElementById('starfield');
  const toast = document.getElementById('toast');
  const calendarBtn = document.getElementById('calendarBtn');

  // Countdown elements
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');

  // ─── STARFIELD GENERATOR ──────────────────────────────────
  function createStarfield() {
    // Small twinkling stars
    for (let i = 0; i < CONFIG.starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 2.5 + 0.5;
      star.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        --dur: ${Math.random() * 3 + 2}s;
        animation-delay: ${Math.random() * 5}s;
        opacity: ${Math.random() * 0.5 + 0.2};
      `;
      starfield.appendChild(star);
    }

    // Shooting stars
    for (let i = 0; i < CONFIG.shootingStarCount; i++) {
      const shoot = document.createElement('div');
      shoot.className = 'shooting-star';
      shoot.style.cssText = `
        top: ${Math.random() * 40}%;
        left: ${Math.random() * 60}%;
        animation-delay: ${Math.random() * 8 + i * 4}s;
        animation-duration: ${Math.random() * 2 + 2}s;
      `;
      starfield.appendChild(shoot);
    }
  }

  // ─── COVER OPEN ───────────────────────────────────────────
  function openCover() {
    document.body.classList.remove('no-scroll');
    // Re-enable touch scrolling after cover opens
    document.body.style.touchAction = '';
    cover.classList.add('opened');
    mainContent.classList.add('visible');
    musicToggle.classList.add('visible');

    // Try to play music
    if (bgMusic.src || bgMusic.querySelector('source')) {
      bgMusic.play().then(() => {
        musicToggle.classList.add('playing');
      }).catch(() => {
        // Autoplay blocked — that's fine
      });
    }

    // Start countdown
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Trigger scroll reveal for initially visible elements
    setTimeout(revealOnScroll, 300);

    // Remove cover from DOM after animation
    setTimeout(() => {
      cover.style.display = 'none';
    }, 1200);
  }

  // ─── MUSIC TOGGLE ─────────────────────────────────────────
  let musicPlaying = false;

  function toggleMusic() {
    if (!bgMusic.src && !bgMusic.querySelector('source')) {
      showToast('Müzik dosyası henüz eklenmedi');
      return;
    }

    if (musicPlaying) {
      bgMusic.pause();
      musicToggle.classList.remove('playing');
      musicPlaying = false;
    } else {
      bgMusic.play().then(() => {
        musicToggle.classList.add('playing');
        musicPlaying = true;
      }).catch(() => {
        showToast('Müzik çalınamadı');
      });
    }
  }

  // ─── COUNTDOWN TIMER ─────────────────────────────────────
  function updateCountdown() {
    const now = new Date();
    const diff = CONFIG.weddingDate - now;

    if (diff <= 0) {
      cdDays.textContent = '0';
      cdHours.textContent = '0';
      cdMinutes.textContent = '0';
      cdSeconds.textContent = '0';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    animateNumber(cdDays, days);
    animateNumber(cdHours, hours);
    animateNumber(cdMinutes, minutes);
    animateNumber(cdSeconds, seconds);
  }

  function animateNumber(el, newVal) {
    const current = el.textContent;
    const newStr = String(newVal);
    if (current !== newStr) {
      el.textContent = newStr;
      el.style.transform = 'scale(1.15)';
      setTimeout(() => {
        el.style.transform = 'scale(1)';
      }, 200);
    }
  }

  // ─── IBAN COPY ────────────────────────────────────────────
  window.copyIban = function (btn, iban) {
    const cleanIban = iban.replace(/\s/g, '');
    navigator.clipboard.writeText(cleanIban).then(() => {
      btn.textContent = 'Kopyalandı!';
      btn.classList.add('copied');
      showToast('IBAN kopyalandı ✓');
      setTimeout(() => {
        btn.textContent = 'Kopyala';
        btn.classList.remove('copied');
      }, 2500);
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = cleanIban;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        btn.textContent = 'Kopyalandı!';
        btn.classList.add('copied');
        showToast('IBAN kopyalandı ✓');
        setTimeout(() => {
          btn.textContent = 'Kopyala';
          btn.classList.remove('copied');
        }, 2500);
      } catch (e) {
        showToast('Kopyalama başarısız');
      }
      document.body.removeChild(textArea);
    });
  };

  // ─── LIGHTBOX ─────────────────────────────────────────────
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  window.openLightbox = function (el) {
    const img = el.querySelector('img');
    if (img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeLightbox = function () {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // ─── GUIDE MODAL ──────────────────────────────────────────
  const guideModal = document.getElementById('guideModal');

  window.openGuideModal = function () {
    if (guideModal) {
      guideModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeGuideModal = function () {
    if (guideModal) {
      guideModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && guideModal && guideModal.classList.contains('active')) {
      closeGuideModal();
    }
  });

  // ─── GOOGLE CALENDAR LINK ────────────────────────────────
  function buildCalendarLink() {
    const c = CONFIG.calendar;
    const url = new URL('https://calendar.google.com/calendar/render');
    url.searchParams.set('action', 'TEMPLATE');
    url.searchParams.set('text', c.title);
    url.searchParams.set('dates', `${c.startDate}/${c.endDate}`);
    url.searchParams.set('location', c.location);
    url.searchParams.set('details', c.details);
    return url.toString();
  }

  // ─── SCROLL REVEAL ────────────────────────────────────────
  function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;

    reveals.forEach((el) => {
      const top = el.getBoundingClientRect().top;
      if (top < windowHeight - 60) {
        el.classList.add('revealed');
      }
    });

    const scrollOverlay = document.getElementById('scrollOverlay');
    if (scrollOverlay && window.scrollY > 40) {
      scrollOverlay.style.opacity = '0';
      scrollOverlay.style.pointerEvents = 'none';
    }
  }

  // ─── TOAST NOTIFICATION ──────────────────────────────────
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  // ─── INIT ─────────────────────────────────────────────────
  function init() {
    createStarfield();

    // Event listeners (Video Envelope Opener with Glow Transition)
    if (envelopeContainer && envelopeVideo) {
      let transitionTriggered = false;

      const triggerTransition = (backupTimer) => {
        if (transitionTriggered) return;
        transitionTriggered = true;
        clearTimeout(backupTimer);

        if (glowOverlay) {
          // 1. Fade in the bright glow overlay
          glowOverlay.style.opacity = '1';

          // 2. Hide cover and show main content while screen is white
          setTimeout(() => {
            openCover();

            // 3. Fade out the glow overlay to reveal the website
            setTimeout(() => {
              glowOverlay.style.opacity = '0';
            }, 300);
          }, 500);
        } else {
          // Fallback if overlay element is missing
          openCover();
        }
      };

      envelopeContainer.addEventListener('click', () => {
        if (envelopeContainer.classList.contains('playing')) return;
        envelopeContainer.classList.add('playing');

        // Ensure body background video is playing
        const bodyBgVideo = document.getElementById('bodyBgVideo');
        if (bodyBgVideo) {
          bodyBgVideo.play().catch(e => console.log("Body bg video play failed:", e));
        }

        // Hide "Tap to Open" overlay
        if (tapToOpen) tapToOpen.style.opacity = '0';

        // 10-second backup timeout (in case the video file fails to play)
        let backupTimeout = setTimeout(() => {
          triggerTransition(backupTimeout);
        }, 10000);

        // Listen for time update to trigger transition 0.8s before video ends
        const onTimeUpdate = () => {
          const duration = envelopeVideo.duration;
          const currentTime = envelopeVideo.currentTime;

          if (duration && (duration - currentTime <= 0.8)) {
            triggerTransition(backupTimeout);
            envelopeVideo.removeEventListener('timeupdate', onTimeUpdate);
          }
        };

        envelopeVideo.addEventListener('timeupdate', onTimeUpdate);

        envelopeVideo.play()
          .then(() => {
            // Once metadata loads, align the backup timeout to the video length
            envelopeVideo.addEventListener('loadedmetadata', () => {
              clearTimeout(backupTimeout);
              backupTimeout = setTimeout(() => {
                triggerTransition(backupTimeout);
              }, (envelopeVideo.duration + 1) * 1000);
            });
          })
          .catch((err) => {
            console.warn("Video playback blocked or failed:", err);
            clearTimeout(backupTimeout);
            openCover(); // Fallback: open cover immediately
          });

        // Open when video ends naturally (backup)
        envelopeVideo.addEventListener('ended', () => {
          triggerTransition(backupTimeout);
        });
      });
    }
    musicToggle.addEventListener('click', toggleMusic);
    window.addEventListener('scroll', revealOnScroll, { passive: true });

    // Calendar button
    if (calendarBtn) {
      calendarBtn.href = buildCalendarLink();
    }
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
