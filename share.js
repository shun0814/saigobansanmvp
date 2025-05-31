// SNSシェア機能
const SITE_URL = 'https://harmonious-longma-8befab.netlify.app';
const SITE_TITLE = '最後の晩餐';
const SITE_DESCRIPTION = 'もし明日、世界が終わるとしたら...あなたが最後に選ぶ、たった一つの味は？';

// Twitter でシェア
function shareToTwitter() {
    const url = encodeURIComponent(SITE_URL);
    const text = encodeURIComponent(`${SITE_TITLE}\n${SITE_DESCRIPTION}`);
    const hashtags = encodeURIComponent('最後の晩餐,グルメ,レストラン');
    
    const twitterUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}&hashtags=${hashtags}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
}

// Facebook でシェア
function shareToFacebook() {
    const url = encodeURIComponent(SITE_URL);
    
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
}

// LINE でシェア
function shareToLine() {
    const url = encodeURIComponent(SITE_URL);
    const text = encodeURIComponent(`${SITE_TITLE}\n${SITE_DESCRIPTION}`);
    
    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${url}&text=${text}`;
    window.open(lineUrl, '_blank', 'width=600,height=400');
}

// URLをクリップボードにコピー
async function copyToClipboard() {
    try {
        await navigator.clipboard.writeText(SITE_URL);
        
        // ボタンの表示を変更
        const copyBtn = document.querySelector('.copy-btn');
        const originalText = copyBtn.innerHTML;
        
        copyBtn.innerHTML = '✅ コピー完了!';
        copyBtn.classList.add('copied');
        
        // 2秒後に元に戻す
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.classList.remove('copied');
        }, 2000);
        
    } catch (err) {
        // フォールバック: 古いブラウザ対応
        const textArea = document.createElement('textarea');
        textArea.value = SITE_URL;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        // ボタンの表示を変更
        const copyBtn = document.querySelector('.copy-btn');
        const originalText = copyBtn.innerHTML;
        
        copyBtn.innerHTML = '✅ コピー完了!';
        copyBtn.classList.add('copied');
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.classList.remove('copied');
        }, 2000);
    }
}

// Web Share API が利用可能な場合のネイティブシェア
function nativeShare() {
    if (navigator.share) {
        navigator.share({
            title: SITE_TITLE,
            text: SITE_DESCRIPTION,
            url: SITE_URL
        }).catch(err => console.log('Error sharing:', err));
    }
}

// モバイルデバイスでネイティブシェアボタンを表示
document.addEventListener('DOMContentLoaded', function() {
    if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
        // ネイティブシェアボタンを追加
        const shareButtons = document.querySelector('.share-buttons');
        if (shareButtons) {
            const nativeBtn = document.createElement('button');
            nativeBtn.className = 'share-btn native-btn';
            nativeBtn.innerHTML = '📱 シェア';
            nativeBtn.onclick = nativeShare;
            shareButtons.appendChild(nativeBtn);
        }
    }
}); 