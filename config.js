// Supabase 設定
const SUPABASE_CONFIG = {
    url: 'https://ersfpbqwolzqrqdnkrhc.supabase.co',
    // 本番環境では環境変数から、開発環境では直接指定
    anonKey: window.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyc2ZwYnF3b2x6cXJxZG5rcmhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2Njc3MDMsImV4cCI6MjA2NDI0MzcwM30.XQqtU5jJV4g1oXlovGMjVRyVolswHn1w5BhBAUqPHCk',
    tableName: 'restaurants'
};

// Supabase クライアントの初期化
const supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey); 