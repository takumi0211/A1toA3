function createCookieConsentBanner() {
    if (localStorage.getItem('cookieConsent')) {
        return;
    }

    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.95);
        padding: 1rem;
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
        backdrop-filter: blur(10px);
        border-top: 1px solid rgba(0, 0, 0, 0.1);
    `;

    const message = document.createElement('p');
    message.style.cssText = `
        margin: 0;
        padding: 0;
        font-size: 0.9rem;
        color: #1e1b4b;
    `;
    message.textContent = '当サイトではCookieを使用してユーザー体験を向上させています。';

    const acceptButton = document.createElement('button');
    acceptButton.style.cssText = `
        background: #4f46e5;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background 0.3s ease;
    `;
    acceptButton.textContent = '同意する';
    acceptButton.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'true');
        banner.remove();
    });

    const rejectButton = document.createElement('button');
    rejectButton.style.cssText = `
        background: transparent;
        color: #4f46e5;
        border: 1px solid #4f46e5;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.3s ease;
    `;
    rejectButton.textContent = '拒否する';
    rejectButton.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'false');
        banner.remove();
        // Google AdSenseを無効化
        window['ga-disable-' + 'ca-pub-2935851985522990'] = true;
        // 必要に応じて他のCookieを削除
        document.cookie.split(";").forEach(function(c) { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
    });

    const policyLink = document.createElement('a');
    policyLink.href = '../privacy.html';
    policyLink.style.cssText = `
        color: #4f46e5;
        text-decoration: none;
        font-size: 0.9rem;
    `;
    policyLink.textContent = 'プライバシーポリシー';

    banner.appendChild(message);
    banner.appendChild(acceptButton);
    banner.appendChild(rejectButton);
    banner.appendChild(policyLink);

    document.body.appendChild(banner);
}

// ページ読み込み時にバナーを表示
document.addEventListener('DOMContentLoaded', () => {
    // クッキー同意状態をチェック
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'false') {
        // 拒否されている場合はAdSenseを無効化
        window['ga-disable-' + 'ca-pub-2935851985522990'] = true;
        // AdSense広告を非表示
        const ads = document.querySelectorAll('ins.adsbygoogle');
        ads.forEach(ad => ad.style.display = 'none');
    } else if (!consent) {
        // 同意状態が未設定の場合はバナーを表示
        createCookieConsentBanner();
    }
}); 