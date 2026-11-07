# ⏱️ Hostinger Cron Jobs Setup Guide for deepakbagada.in

Copy and paste the exact values below into **Hostinger hPanel ➔ Websites ➔ deepakbagada.in ➔ Advanced ➔ Cron Jobs**.

---

## 🟢 Cron Job 1: Google Indexing Engine (Runs Daily at 08:15 AM)

Submits 80 rotating URLs per day into Google Search Console & Google Indexing API with anti-spam pacing and quota protection.

### 1. Timing Configuration

| Setting | Value |
| :--- | :--- |
| **Type** | Custom |
| **Minute** | `15` |
| **Hour** | `8` |
| **Day of Month** | `*` |
| **Month** | `*` |
| **Day of Week** | `*` |
| **Full Cron Expression** | `15 8 * * *` |

### 2. Command to Run (Single Line - Copy Exactly)

```bash
/usr/bin/php /home/u775719140/domains/deepakbagada.in/public_html/artisan google:index-compliant >> /home/u775719140/domains/deepakbagada.in/public_html/storage/logs/google_indexing_cron.log 2>&1
```

---

## 🟢 Cron Job 2: Blog Post Auto-Publisher (Runs Every 5 Minutes)

Publishes scheduled articles to the live database automatically 24/7 without needing your laptop turned on.

### 1. Timing Configuration

| Setting | Value |
| :--- | :--- |
| **Type** | Custom |
| **Minute** | `*/5` |
| **Hour** | `*` |
| **Day of Month** | `*` |
| **Month** | `*` |
| **Day of Week** | `*` |
| **Full Cron Expression** | `*/5 * * * *` |

### 2. Command to Run (Single Line - Copy Exactly)

```bash
/usr/bin/php /home/u775719140/domains/deepakbagada.in/public_html/.agent/skills/deepak-blog/scripts/process-scheduled-posts.php --quiet >> /home/u775719140/domains/deepakbagada.in/public_html/.agent/skills/deepak-blog/schedule/scheduler.log 2>&1
```

---

## 🔍 How to Check Live Logs on Hostinger

Whenever you want to verify that the jobs are executing properly:

### 1. View Google Indexing Log
```bash
tail -n 50 domains/deepakbagada.in/public_html/storage/logs/google_indexing_cron.log
```

### 2. View Scheduled Posts Log
```bash
tail -n 50 domains/deepakbagada.in/public_html/.agent/skills/deepak-blog/schedule/scheduler.log
```
