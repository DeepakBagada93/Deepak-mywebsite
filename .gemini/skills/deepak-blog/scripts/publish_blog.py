import json
import subprocess
import pymysql
import os

HOST = os.environ.get("DB_HOST", "193.203.184.64")
USER = os.environ.get("DB_USER", "u775719140_deeepak")
PASSWORD = os.environ.get("DB_PASSWORD", "Deeepak@3093")
DATABASE = os.environ.get("DB_NAME", "u775719140_deepak93")

def sync_posts():
    print("--- [deepak-blog] Syncing data/posts.php to Remote Hostinger MySQL ---")
    
    # Try Artisan PostSeeder first (Native Laravel / Eloquent)
    artisan_res = subprocess.run(["php", "artisan", "db:seed", "--class=PostSeeder", "--force"], capture_output=True, text=True)
    if artisan_res.returncode == 0:
        print("✓ Successfully synced posts via Laravel PostSeeder.")
        return True
    
    # Fallback to direct PyMySQL sync if artisan not available
    print("Artisan seeder fallback -> running direct MySQL sync...")
    php_code = 'echo json_encode(require "data/posts.php");'
    res = subprocess.run(["php", "-r", php_code], capture_output=True, text=True)
    if res.returncode != 0:
        print("PHP Syntax Error in data/posts.php:", res.stderr)
        return False

    posts_list = json.loads(res.stdout)

    try:
        conn = pymysql.connect(
            host=HOST,
            user=USER,
            password=PASSWORD,
            database=DATABASE,
            charset='utf8mb4',
            autocommit=True
        )
        cursor = conn.cursor()
        cursor.execute("TRUNCATE TABLE posts;")

        for idx, item in enumerate(posts_list):
            pid = item.get('id') or item.get('slug') or f"post-{idx+1}"
            cursor.execute(
                "INSERT INTO posts (id, title, slug, excerpt, content, author, date, category, read_time, image, tags) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                (
                    pid,
                    item.get('title'),
                    item.get('slug'),
                    item.get('excerpt'),
                    item.get('body') or item.get('content'),
                    item.get('author', 'Deepak Bagada'),
                    item.get('published_at') or item.get('date'),
                    item.get('tag') or item.get('category'),
                    item.get('read_time', '4 min read'),
                    item.get('image', ''),
                    json.dumps(item.get('tags', []))
                )
            )

        print(f"✓ Successfully synced {len(posts_list)} posts to remote Hostinger MySQL database.")
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Database connection error: {e}")
        return False

if __name__ == "__main__":
    sync_posts()
