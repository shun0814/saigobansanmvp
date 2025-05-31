// DOM要素の取得
const form = document.getElementById('restaurant-form');
const submitBtn = document.getElementById('submit-btn');
const btnText = submitBtn.querySelector('.btn-text');
const loadingSpinner = submitBtn.querySelector('.loading-spinner');
const commentTextarea = document.getElementById('comment');
const charCount = document.getElementById('char-count');

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
}

// イベントリスナーの設定
function setupEventListeners() {
    // フォーム送信
    form.addEventListener('submit', handleFormSubmit);
    
    // 文字数カウント
    commentTextarea.addEventListener('input', updateCharCount);
    
    // 初期文字数表示
    updateCharCount();
}

// 文字数カウントの更新
function updateCharCount() {
    const currentLength = commentTextarea.value.length;
    charCount.textContent = currentLength;
    
    // 文字数制限に近づいた時の色変更
    if (currentLength > 180) {
        charCount.style.color = '#e74c3c';
    } else if (currentLength > 150) {
        charCount.style.color = '#f39c12';
    } else {
        charCount.style.color = '#666';
    }
}

// フォーム送信処理
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(form);
    const restaurantData = {
        restaurant_name: formData.get('restaurant_name').trim(),
        comment: formData.get('comment').trim() || null,
        restaurant_url: formData.get('restaurant_url').trim() || null,
    };
    
    // バリデーション
    if (!restaurantData.restaurant_name) {
        showError('店名は必須です');
        return;
    }
    
    try {
        setLoadingState(true);
        await saveRestaurant(restaurantData);
        showSuccess('レストランが登録されました！');
        form.reset();
        updateCharCount();
        
        // 2秒後に一覧ページにリダイレクト
        setTimeout(() => {
            window.location.href = 'list.html';
        }, 2000);
        
    } catch (error) {
        console.error('エラー:', error);
        showError('登録に失敗しました。もう一度お試しください。');
    } finally {
        setLoadingState(false);
    }
}

// レストランデータの保存（Supabase API）
async function saveRestaurant(data) {
    try {
        console.log('保存データ:', data);
        
        const { data: result, error } = await supabase
            .from(SUPABASE_CONFIG.tableName)
            .insert([data])
            .select();
        
        if (error) {
            throw error;
        }
        
        console.log('保存完了:', result);
        return result;
        
    } catch (error) {
        console.error('Supabase保存エラー:', error);
        throw new Error('データベースへの保存に失敗しました');
    }
}

// ローディング状態の管理
function setLoadingState(loading) {
    submitBtn.disabled = loading;
    if (loading) {
        btnText.style.display = 'none';
        loadingSpinner.style.display = 'block';
    } else {
        btnText.style.display = 'block';
        loadingSpinner.style.display = 'none';
    }
}

// 成功/エラーメッセージの表示
function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'error');
}

function showNotification(message, type) {
    // シンプルな通知表示
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
        ${type === 'success' 
            ? 'background: linear-gradient(45deg, #27ae60, #2ecc71);' 
            : 'background: linear-gradient(45deg, #e74c3c, #c0392b);'
        }
    `;
    
    document.body.appendChild(notification);
    
    // 3秒後に自動削除
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// CSS アニメーションの追加
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style); 