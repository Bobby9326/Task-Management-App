# Task Management App

Task Management App คือระบบจัดการงานที่พัฒนาด้วย **Vite.js** บน Frontend และ **Nest.js** บน Backend พร้อมระบบ Authentication ผ่าน **JWT** และจัดเก็บข้อมูลด้วย **MySQL**  
Styling ทำด้วย **Tailwind CSS** และมีการเขียน Test ด้วย **Vitest**.

## 🛠 Technologies Used
- **Frontend:** Vite.js, React.js, Tailwind CSS
- **Backend:** Nest.js
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Token)
- **Testing:** Vitest

---

## 📂 Project Structure
 ```
|- backend/
|   |- src/
|      |- auth/         # จัดการ Authentication (Login/Register)
|      |- database/     # เชื่อมต่อ Database
|      |- task/         # ฟีเจอร์เกี่ยวกับการจัดการ Task (CRUD)
|      |- user/         # จัดการข้อมูลผู้ใช้
|
|- frontend/
|   |- src/
|      |- component/    # UI Components เช่น Navbar, LoginBox, TaskBox ต่าง ๆ
|         |- loginbox/
|         |- navbar/
|         |- registerbox/
|         |- task/
|         |- taskcreatebox/
|         |- taskeditbox/
|      |- page/         # Page ของแต่ละ Route เช่น Login, Register, Task List, Task Create/Edit
|         |- login/
|         |- register/
|         |- task/
|         |- taskcreate/
|         |- taskedit/
|
|-.env                  # ไฟล์ Environment Variables สำหรับ Docker
|-docker-compose.yml    # ใช้สำหรับ setup ระบบด้วย Docker
 ```


yaml
คัดลอก
แก้ไข

---

## ⚙️ Environment Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/Bobby9326/Task-Management-App.git
   cd Task-Management-App
Environment Variables
สร้างไฟล์ .env ในโฟลเดอร์ backend และ frontend

สำหรับ backend/.env
 ```
DATABASE_HOST=
DATABASE_PORT=
DATABASE_NAME=
DATABASE_USERNAME=
DATABASE_PASSWORD=
JWT_SECRET=
 ```
สำหรับ frontend/.env
 ```
VITE_END_POINT=http://localhost:4000/
 ```

Setup Backend
 ```
cd backend
npm install
npm run start:dev
 ```
Setup Frontend
 ```
cd frontend
npm install
npm run dev
 ```
Docker (Otional)
.env
 ```
DATABASE_HOST=
DATABASE_PORT=
DATABASE_NAME=
DATABASE_USERNAME=
DATABASE_PASSWORD=
JWT_SECRET=
VITE_END_POINT=http://localhost:4000/
 ```
Run with Docker
 ```
docker-compose up --build
 ```

🏛️ Key Architectural Decisions
Monorepo Structure:
แยก Backend และ Frontend ไว้ภายใต้โปรเจกต์เดียวเพื่อความสะดวกในการพัฒนาและจัดการ Deployment

NestJS Modular Structure:
แบ่งแยกฟีเจอร์ต่าง ๆ เป็น Module ชัดเจน (auth, task, user) เพื่อรองรับการขยายโปรเจกต์ในอนาคตได้ง่าย

Vite.js + Tailwind:
ใช้ Vite เพื่อความเร็วในการ Build/Hot Reload Frontend และ Tailwind CSS เพื่อการเขียน UI ที่รวดเร็วและตอบสนองได้ดี

JWT Authentication:
เลือกใช้ JWT เพื่อการจัดการ Authentication ที่ปลอดภัยและสามารถ Scale ได้

Vitest for Testing:
ใช้ Vitest ซึ่งทำงานรวดเร็วและผสานเข้ากับ Vite ได้อย่างสมบูรณ์แบบ

Docker Support:
รองรับการใช้งานผ่าน Docker และ docker-compose เพื่อความสะดวกในการ Deploy ระบบในสภาพแวดล้อมต่าง ๆ
