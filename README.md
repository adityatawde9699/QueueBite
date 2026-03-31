<div align="center">
<img src="social-preview.png" alt="QueueBite Social Preview Banner">
<h1>QueueBite</h1>
<p><b>Order ahead, skip the line, and enjoy your meal! 🍔</b></p>
<p>
<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
<img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white" alt="Django">
<img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io">
<img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
<img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS">
<img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis">
<img src="https://img.shields.io/badge/WebSockets-004A7F?style=for-the-badge&logo=websocket&logoColor=white" alt="WebSockets">
</p>
---
</div>

## 🚀 Overview
QueueBite is a real-time, smart queue management system designed to eliminate long waits and streamline the canteen experience at colleges and corporate offices. It allows users to place food orders from their devices, receive a digital token, and get notified when their meal is ready for pickup.  
This system empowers canteen owners to manage incoming orders efficiently through a live dashboard, improving overall workflow and customer satisfaction.

---

## ✨ Key Features

### For Customers
- 📱 **Mobile-First Ordering:** Responsive UI to easily browse the menu and place orders.
- 🔄 **Real-Time Queue Updates:** See the live status of your order without refreshing the page.
- 🎟️ **Digital Tokens:** Receive a unique digital token for every order.
- 🔔 **Pickup Notifications:** Get notified the moment your order is marked as "Ready".
- 👤 **User Profiles:** Track order history and manage your profile.

### For Canteen Staff/Admin
- 🧑‍🍳 **Live Order Dashboard:** View and manage all incoming orders in a Kanban-style interface ("Pending", "In Progress", "Ready").
- 📊 **Dashboard Analytics:** Get insights into sales, peak hours, and most popular items.
- ⚙️ **Menu Management:** Easily add, update, or remove food items from the menu.
- 🔐 **Role-Based Access:** Secure login for staff members with specific permissions.

---

## 🛠️ Technology Stack

| Frontend | Backend | Real-Time |
|----------|---------|-----------|
| React.js | Django  | Socket.IO |
| TailwindCSS | Django REST Framework | Redis |
| Axios | PostgreSQL | WebSockets |

---

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### **Prerequisites**
- Python 3.10+
- Node.js v18+ & npm
- PostgreSQL (for production) or SQLite (for local development)
- Redis (optional, for WebSockets - not required for Vercel deployment)

---

### **Installation**

#### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/queuebite.git
cd queuebite
```

#### 2️⃣ Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Copy environment file and configure
cp .env.example .env
# Edit .env with your settings

python manage.py migrate
python manage.py runserver
```

#### 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your API URL

npm run dev
```

---

## 🚀 Deployment to Vercel

### Backend Deployment
1. **Set up PostgreSQL Database:**
   - Use Supabase, Neon, or Vercel Postgres
   - Get your `DATABASE_URL`

2. **Deploy Backend:**
   - Push code to GitHub
   - Connect repository to Vercel
   - Set environment variables in Vercel dashboard:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `DJANGO_SECRET_KEY`: A secure random key
     - `DJANGO_DEBUG`: `False`

3. **Run Migrations:**
   - After deployment, run migrations locally against production DB:
   ```bash
   export DATABASE_URL="your-production-db-url"
   python manage.py migrate
   python manage.py seed_menu  # If needed
   ```

### Frontend Deployment
1. **Deploy Frontend:**
   - Push code to GitHub
   - Connect repository to Vercel
   - Set environment variable:
     - `VITE_API_URL`: Your backend Vercel URL + `/api`

2. **Update CORS:**
   - After frontend deployment, update backend's CORS settings to allow your frontend URL
   - Or temporarily use `CORS_ALLOW_ALL_ORIGINS = True` for testing

### Important Notes
- **Database:** SQLite won't work on Vercel due to read-only filesystem. Must use PostgreSQL.
- **WebSockets:** Django Channels removed for Vercel compatibility. Real-time updates use polling instead.
- **Migrations:** Run locally against production database, not on Vercel.

---
🔄 System Flow
```bash
1. Customer logs in and places an order via the React frontend.
      │
      └─> API Request to Django (POST /api/orders/place/)
            │
            ├─> 2. Django saves the order to the PostgreSQL database.
            │
            └─> 3. Django emits a 'new_order' event via Socket.IO.
                  │
                  ├─> 4. Canteen Staff Dashboard instantly receives the event and displays the new order.
                  │
                  └─> 5. All connected Customers see the live queue update with the new token.

When staff updates the order status, steps 3–5 are repeated for the 'order_update' event.
```

📜 License
This project is licensed under the MIT License - see the LICENSE file for details.
