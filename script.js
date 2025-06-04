// スクロールに応じてヘッダーを小さくする機能
window.addEventListener('scroll', function () {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('shrink');
    } else {
        header.classList.remove('shrink');
    }
});

// スライドショー動画リスト
const videos = [
    "videos/Wakeup.mp4",
    "videos/Walking_Man.mp4",
    "videos/Zombie_Walking.mp4",
    "videos/Running.mp4"
];

let currentVideoIndex = 0;
let videoElement;
let overlayElement;

// 動画表示関数
function showVideo(index) {
    if (!videoElement || !overlayElement) return;

    currentVideoIndex = (index + videos.length) % videos.length;
    videoElement.src = videos[currentVideoIndex];
    videoElement.load();

    videoElement.onloadedmetadata = () => {
        videoElement.play();

        // フェードイン（黒→明るく）
        overlayElement.style.opacity = "1";
        setTimeout(() => {
            overlayElement.style.opacity = "0";
        }, 50);

        const duration = videoElement.duration;

        // フェードアウト（明るく→黒）を終了1秒前に開始
        setTimeout(() => {
            overlayElement.style.opacity = "1";
        }, (duration - 1) * 1000);

        // 次の動画へ切り替え
        setTimeout(() => {
            showVideo(currentVideoIndex + 1);
        }, duration * 1000);
    };
}

// DOM読み込み後の初期化
window.addEventListener('DOMContentLoaded', () => {
    videoElement = document.getElementById("slideshow-video");
    overlayElement = document.getElementById("video-overlay");
    showVideo(currentVideoIndex);

    // ハンバーガーメニュー関連
    const burger = document.getElementById('burger');
    const navLinks = document.querySelector('.nav-links');

    burger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        const expanded = burger.getAttribute('aria-expanded') === 'true';
        burger.setAttribute('aria-expanded', !expanded);
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            burger.setAttribute('aria-expanded', false);
        });
    });

    // スムーズスクロール用イベントリスナー追加
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
});

// スムーズスクロール関数
function smoothScroll(event) {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    const headerOffset = 60; // ヘッダーの高さに合わせて調整
    const targetPosition = targetElement.offsetTop - headerOffset;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let startTime = null;

    function animationScroll(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const scrollAmount = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, scrollAmount);
        if (timeElapsed < duration) requestAnimationFrame(animationScroll);
    }

    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animationScroll);
}
  