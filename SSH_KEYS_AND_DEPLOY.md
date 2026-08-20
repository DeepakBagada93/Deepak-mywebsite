# SSH Public Key & Hostinger Deployment Guide

## 1. Your Exact SSH Public Key (Single Line - No Extra Spaces)

Copy the line below:

```text
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAeoPintRw8C7bnciaDvU8GjHgTU+b9jCfnKn3E1q2h/ deepak@hostinger
```

---

## 2. Steps in Hostinger hPanel

### Step A: Add SSH Key
1. In hPanel, go to **Advanced** → **SSH Access**.
2. Make sure SSH Access is **Enabled**.
3. Under **SSH Keys**, click **Add SSH Key**.
4. Name: `mac-book`
5. Paste the exact key from above.
6. Click **Add**.

### Step B: Enable `proc_open`
1. Go to **Websites** → `deepakbagada.in` → **PHP Configuration**.
2. Click **PHP Functions** tab.
3. Remove `proc_open` from **Disabled Functions**.
4. Click **Save**.

---

## 3. SSH Command to Run From Your Mac Terminal

```bash
ssh -i ~/.ssh/hostinger_deepak -p 65002 u775719140@86.38.243.124
```

---

## 4. Safe Setup on Server (Will NOT affect database or existing site)

Once logged into SSH:

```bash
cd ~/domains/deepakbagada.in/public_html
bash deploy/setup-server.sh
```
