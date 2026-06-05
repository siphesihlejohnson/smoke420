# Smoke420 — Staff User Manual

Plain English guide for everyday use of the POS system.

---

## Logging In

1. Open the app in your browser
2. **Click your name** from the list on screen
3. **Enter your 4-digit PIN** using the number pad (or your keyboard)
4. The app opens automatically if the PIN is correct

**Wrong PIN?**
- The dots will shake and clear — try again
- After 3 wrong attempts, your account locks for 5 minutes
- If you forgot your PIN, ask your admin to reset it

**Logging out:**
- Click the **LOGOUT** button in the top right corner at any time
- The app also logs you out automatically after 30 minutes of no activity

---

## Capturing a Sale

Press **F2** or click **CAPTURE SALE** in the top menu.

### Step by step:

1. **Enter the customer's phone number** in the "Customer Phone" field
   - Click **LOOKUP** (or press Enter) to check if they're already a customer
   - If they are: their name fills in automatically and you'll see their history
   - If they're new: the name field opens — type their name

2. **Select the product** from the dropdown
   - The unit type (each / gram) and price fill in automatically
   - The price is editable if needed for a discount or special

3. **Enter the quantity**
   - For "each" products: whole numbers (1, 2, 5...)
   - For gram products: decimals allowed (0.5, 2.5...)

4. **The total calculates automatically**

5. **Choose payment method**: tap **CASH** or **EFT**
   - CASH = cash in hand
   - EFT = card machine / bank transfer

6. Click **CONFIRM SALE** (or press Enter)
   - A confirmation message appears at the bottom right
   - The form clears, ready for the next sale
   - Stock is deducted automatically

7. Your recent sales appear below the form

**Made a mistake?** Click **CLEAR** to reset the form and start again.

---

## Looking Up a Customer

When capturing a sale, type the customer's phone number and click **LOOKUP**.

The system shows:
- Whether they're an existing or new customer
- How many times they've visited
- How much they've spent in total
- Their last visit date

You can also view the full customer list in the **CUSTOMERS** tab (admin only).

---

## Adding a New Customer

**Automatic** (recommended): When you look up an unknown phone number during a sale, the system creates the customer record automatically when you confirm the sale.

**Manual** (admin only): Go to **CUSTOMERS** tab → click **+ ADD CUSTOMER** → fill in name, phone, and optional notes.

---

## Viewing Your Sales History

Your own sales always appear below the sale form on the Capture Sale screen.

For a full log with filters, press **F3** or click **SALES LOG**.

You can filter by:
- Month
- Product
- Payment method (CASH / EFT)
- Customer name or phone (use the search box)

The total shows at the bottom of the filtered list.

---

## What to Do if the Sync Fails

The **bottom bar** shows the sync status:
- **● SYNCED** (green) — everything is saved to Google Sheets
- **● SYNCING** (flashing) — currently sending data
- **● OFFLINE** (grey) — not connected to Google Sheets

**If you see OFFLINE:**
- Don't panic — all your sales are saved locally on this device
- Keep working normally; the app saves everything
- When the internet comes back, it will sync automatically
- You can also force a sync: **Admin → Data Management → Manual Sync to Sheets**

**If you need to send data urgently:** tell your admin to check the setup and manually trigger a sync.

---

## Restocking (Admin Only)

Press **F4** or click **INVENTORY**.

### Quick restock a single product:
1. Find the product in the table
2. Click **RESTOCK** next to it
3. Enter the quantity received and supplier name
4. Click **CONFIRM RESTOCK**

### Bulk restock (multiple products at once):
1. Click the **RESTOCK** button at the top of the Inventory page
2. Enter quantities for each product you received
3. Enter the supplier name at the bottom
4. Click **APPLY RESTOCKS**

Stock levels update immediately. Every restock is logged with date, quantity, and supplier.

---

## Viewing Reports (Admin Only)

Press **F6** or click **REPORTS**.

Reports include:
- **Monthly revenue bar chart** — see which months performed best
- **Cash vs EFT split** — see payment method trends
- **Best selling products** — by units sold and by revenue
- **Staff performance** — sales count and revenue per staff member
- **New vs returning customers** — by month

Click **EXPORT FULL REPORT (CSV)** to download all report data as a spreadsheet file.

---

## Common Mistakes and How to Fix Them

### "I captured the wrong quantity"
Sales cannot be edited once confirmed (this is intentional for audit purposes). If you made an error, let your admin know — they can view the full audit log and correct inventory manually if needed.

### "I selected the wrong product"
Same as above — contact your admin. The sale record is permanent, but the admin can adjust inventory.

### "The customer already exists but I created a duplicate"
Go to **CUSTOMERS** → find the duplicate → click **EDIT** → update or use **DELETE** (admin only) to remove the extra entry.

### "The screen is frozen / not responding"
Refresh the page (F5 or Ctrl+R). You'll be asked to log in again. Your data is safe — nothing is lost.

### "I can't see the Customers / Inventory / Reports tabs"
These are admin-only tabs. If you need access, ask your admin to change your role.

### "The app says my account is locked"
After 3 wrong PINs, you're locked out for 5 minutes. Wait and try again, or ask an admin to reset your PIN.

---

## Quick Reference — Function Keys

| Key | What it does |
|-----|-------------|
| F1 | Dashboard — today's totals at a glance (admin) |
| F2 | Capture Sale — the main selling screen |
| F3 | Sales Log — browse and filter all sales |
| F4 | Inventory — stock levels and product management (admin) |
| F5 | Customers — full customer database (admin) |
| F6 | Reports — revenue charts and stats (admin) |
| F7 | Admin Panel — staff, settings, audit log (admin) |
| F8 | Setup — Google Sheets connection settings |

---

## Need Help?

Contact your store admin. Do not share your PIN with anyone.
