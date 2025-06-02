// スクロールに応じてヘッダーを小さくする機能
window.addEventListener('scroll', function () {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('shrink');
    } else {
        header.classList.remove('shrink');
    }
});

//スライドショー
const videos = [
    "videos/Wakeup.mp4",
    "videos/Walking_Man.mp4",
    "videos/Zombie_Walking.mp4",
    "videos/Running.mp4"
];

let currentVideoIndex = 0;
let videoElement;
let overlayElement;

function showVideo(index) {
    if (!videoElement || !overlayElement) return;

    currentVideoIndex = (index + videos.length) % videos.length;
    videoElement.src = videos[currentVideoIndex];
    videoElement.load();

    videoElement.onloadedmetadata = () => {
        videoElement.play();

        // ① フェードイン（黒から明るく）
        overlayElement.style.opacity = "1"; // 真っ黒
        setTimeout(() => {
            overlayElement.style.opacity = "0"; // 明るく
        }, 50); // 微小遅延でアニメーション開始

        const duration = videoElement.duration;

        // ② フェードアウト（明るく→黒）を終了1秒前に開始
        setTimeout(() => {
            overlayElement.style.opacity = "1"; // 暗くする
        }, (duration - 1) * 1000);

        // ③ 次の動画へ（duration 秒後）
        setTimeout(() => {
            showVideo(currentVideoIndex + 1);
        }, duration * 1000);
    };
}

window.addEventListener('DOMContentLoaded', () => {
    videoElement = document.getElementById("slideshow-video");
    overlayElement = document.getElementById("video-overlay");
    showVideo(currentVideoIndex);

    currentVideoIndex = 0;
    showVideo(currentVideoIndex);
});

// スムーズスクロール
function smoothScroll(event) {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    const headerOffset = -25; // ← ここを調整（ヘッダーの高さ）
    const targetPosition = targetElement.offsetTop - headerOffset;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const duration = 1000;
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


// スムーズスクロール用のイベントリスナーを追加
const scrollLinks = document.querySelectorAll('a[href^="#"]');
scrollLinks.forEach(link => {
    link.addEventListener('click', smoothScroll);
});
