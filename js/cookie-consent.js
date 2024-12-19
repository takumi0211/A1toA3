// デバッグ用：LocalStorageをクリア
localStorage.removeItem('cookieConsent');

// Cookie同意バナーの表示
function showCookieConsent() {
    const consent = localStorage.getItem('cookieConsent');
    
    if (!consent) {
        const banner = document.getElementById('cookieConsent');
        if (banner) {
            banner.style.display = 'block';
        }
    }
}

// Cookieの同意
function acceptCookies() {
    localStorage.setItem('cookieConsent', 'accepted');
    const banner = document.getElementById('cookieConsent');
    if (banner) {
        banner.style.display = 'none';
    }
}

// Cookieの拒否
function rejectCookies() {
    localStorage.setItem('cookieConsent', 'rejected');
    const banner = document.getElementById('cookieConsent');
    if (banner) {
        banner.style.display = 'none';
    }
    deleteCookies();
}

// Cookieの削除
function deleteCookies() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }
}

// DOMの読み込み完了時にCookie同意バナーを表示
document.addEventListener('DOMContentLoaded', function() {
    showCookieConsent();
}); 
