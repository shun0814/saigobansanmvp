// DOM要素の取得
const restaurantsList = document.getElementById('restaurants-list');
const loadingElement = document.getElementById('loading');
const emptyState = document.getElementById('empty-state');

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    loadRestaurants();
});

// レストラン一覧の読み込み
async function loadRestaurants() {
    try {
        showLoadingState(true);
        const restaurants = await fetchRestaurants();
        displayRestaurants(restaurants);
    } catch (error) {
        console.error('読み込みエラー:', error);
        showError('データの読み込みに失敗しました');
    } finally {
        showLoadingState(false);
    }
}

// レストランデータの取得（Supabase API）
async function fetchRestaurants() {
    try {
        console.log('レストランデータを取得中...');
        
        const { data, error } = await supabase
            .from(SUPABASE_CONFIG.tableName)
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            throw error;
        }
        
        console.log('取得完了:', data);
        return data || [];
        
    } catch (error) {
        console.error('Supabase取得エラー:', error);
        throw new Error('データベースからの取得に失敗しました');
    }
}

// レストラン一覧の表示
function displayRestaurants(restaurants) {
    restaurantsList.innerHTML = '';
    
    if (restaurants.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    restaurants.forEach((restaurant, index) => {
        const card = createRestaurantCard(restaurant, index);
        restaurantsList.appendChild(card);
    });
}

// レストランカードの作成
function createRestaurantCard(restaurant, index) {
    const card = document.createElement('div');
    card.className = 'restaurant-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const formattedDate = formatDate(restaurant.created_at);
    const hasUrl = restaurant.restaurant_url && restaurant.restaurant_url.trim();
    
    card.innerHTML = `
        <div class="restaurant-header">
            <div class="restaurant-name">${escapeHtml(restaurant.restaurant_name)}</div>
            <div class="user-name">by ${escapeHtml(restaurant.user_name || '匿名')}</div>
        </div>
        ${restaurant.comment ? `<div class="restaurant-comment">${escapeHtml(restaurant.comment)}</div>` : ''}
        <div class="restaurant-meta">
            ${hasUrl ? `<a href="${escapeHtml(restaurant.restaurant_url)}" target="_blank" rel="noopener noreferrer" class="restaurant-url">🍴 レストランを見る</a>` : '<span></span>'}
            <span class="restaurant-date">${formattedDate}</span>
        </div>
    `;
    
    return card;
}

// 日付のフォーマット
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return 'たった今';
    if (diffMins < 60) return `${diffMins}分前`;
    if (diffHours < 24) return `${diffHours}時間前`;
    if (diffDays < 7) return `${diffDays}日前`;
    
    return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// HTMLエスケープ
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showLoadingState(loading) {
    if (loading) {
        loadingElement.style.display = 'block';
        restaurantsList.style.display = 'none';
        emptyState.style.display = 'none';
    } else {
        loadingElement.style.display = 'none';
        restaurantsList.style.display = 'block';
    }
}

// エラーメッセージの表示
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