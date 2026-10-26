# WhatsApp 2-Touch COD Order Verification & Prepayment Flow

## Message 1: Instant Post-Order Confirmation & UPI Flip
* **Trigger**: Immediately upon receiving a Cash-on-Delivery order.
* **Objective**: Confirm intent + flip to prepaid.

**Template Text**:  
Namaste {{1}}! 🙏  
Thank you for shopping with **VedicRoot Ayurveda**!

We have received your Cash-on-Delivery order **#{{2}}** for:  
📦 *{{3}}*  
💰 Amount to pay: *₹{{4}}*  
📍 Delivery Address: *{{5}}*

---
🔥 **SPECIAL PREPAYMENT OFFER (SAVE ₹50)**:  
Pay now securely via GooglePay/PhonePe/Paytm UPI and get:  
✅ **FLAT ₹50 Instant Cashback** (Pay only *₹{{6}}*)  
✅ **Priority Express Courier Dispatch** (1 day faster delivery)  
👉 **Click to Pay via UPI**: {{7}}

---
Or if you prefer Cash on Delivery, please confirm below so we can pack your order:  
🔘 **[Button: Confirm COD Order]**  
🔘 **[Button: Edit Delivery Address]**  
🔘 **[Button: Cancel Order]**

---

## Message 2: Cutoff Warning (4 Hours Later if Unconfirmed)
* **Trigger**: Sent if no button clicked after 4 hours.

**Template Text**:  
Hello {{1}}! Quick update regarding your VedicRoot order **#{{2}}**.

Our courier partner will pick up today's outgoing shipments in 2 hours. To ensure your parcel is dispatched today without delay, please confirm your delivery:

🔘 **[Button: Yes, Please Dispatch Today]**  
🔘 **[Button: Cancel Order]**

*(Unconfirmed orders will be held to prevent courier return delays).*
