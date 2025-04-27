# Task Management App

Task Management App คือระบบจัดการงานที่พัฒนาด้วย **Vite.js** บน Frontend และ **Nest.js** บน Backend พร้อมระบบ Authentication ผ่าน **JWT** และจัดเก็บข้อมูลด้วย **MySQL**  
Styling ทำด้วย **Tailwind CSS** และมีการเขียน Test ด้วย **Vitest**

## 🚀 คุณสมบัติหลัก

- สร้าง อ่าน แก้ไข และลบงาน (CRUD Tasks)
- ระบบสมาชิกและการยืนยันตัวตน (Authentication)


## 🛠 Technologies Used

- **Frontend:** Vite.js, React.js, Tailwind CSS
- **Backend:** Nest.js
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Token)
- **Testing:** Vitest

## 📂 โครงสร้างโปรเจกต์

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

## ⚙️ การติดตั้งและเริ่มต้นใช้งาน

### ความต้องการเบื้องต้น

- Node.js (v16.x หรือสูงกว่า)
- npm (v8.x หรือสูงกว่า)
- MySQL (v8.x หรือสูงกว่า)
- Git

### 1. Clone Repository

```bash
git clone https://github.com/Bobby9326/Task-Management-App.git
cd Task-Management-App
```

### 2. ตั้งค่า Environment Variables

#### สร้างไฟล์ `.env` ในโฟลเดอร์ `backend`

```
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=task_management
DATABASE_USERNAME=root
DATABASE_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
```

#### สร้างไฟล์ `.env` ในโฟลเดอร์ `frontend`

```
VITE_END_POINT=http://localhost:4000/
```

### 3. ติดตั้งและเริ่มต้น Backend

```bash
cd backend
npm install
# สร้างฐานข้อมูลก่อนรัน (ถ้าต้องการ)
npm run migration:run  # หากมีการตั้งค่า migrations
npm run start:dev
```

Backend จะทำงานที่ http://localhost:4000

### 4. ติดตั้งและเริ่มต้น Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend จะทำงานที่ http://localhost:5173 (ค่าเริ่มต้นของ Vite)

### 5. การใช้งานกับ Docker (ทางเลือก)

สร้างไฟล์ `.env` ในโฟลเดอร์หลักของโปรเจกต์:

```
DATABASE_HOST=db
DATABASE_PORT=3306
DATABASE_NAME=task_management
DATABASE_USERNAME=root
DATABASE_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
VITE_END_POINT=http://localhost:4000/
```

รันระบบด้วย Docker:

```bash
docker-compose up --build
```

## 🏛️ การออกแบบสถาปัตยกรรมหลัก

### 1. โครงสร้างแบบ Monorepo
- แยก Backend และ Frontend ไว้ภายใต้โปรเจกต์เดียวเพื่อความสะดวกในการพัฒนาและจัดการ Deployment
- ง่ายต่อการทำ CI/CD และการเชื่อมโยงระหว่าง Frontend และ Backend

### 2. Nest.js Modular Structure
- แบ่งแยกฟีเจอร์ต่าง ๆ เป็น Module ชัดเจน (auth, task, user) เพื่อรองรับการขยายโปรเจกต์ในอนาคตได้ง่าย
- ใช้ Dependency Injection ตามหลักการของ Nest.js เพื่อลด Coupling และเพิ่ม Testability
- แยก Layer ชัดเจนระหว่าง Controller, Service และ Repository ตามหลัก Clean Architecture

### 3. Vite.js + React + Tailwind
- ใช้ Vite เพื่อความเร็วในการ Build และ Hot Module Replacement (HMR)
- แบ่งแยก Component และ Page เพื่อการนำกลับมาใช้ใหม่ (Reusability)
- ใช้ Tailwind CSS เพื่อการเขียน UI ที่รวดเร็วและตอบสนองได้ดี โดยไม่ต้องเขียน CSS แยกไฟล์

### 4. ระบบ Authentication
- ใช้ JWT (JSON Web Token) เพื่อการยืนยันตัวตนที่ปลอดภัยและขยายตัวได้ (Scalable)
- Token จะถูกเก็บไว้ใน HttpOnly Cookie 
- มีการตรวจสอบสิทธิ์ผ่าน Guards ใน Nest.js

### 5. การเชื่อมต่อฐานข้อมูล
- ใช้ Sequelize เพื่อการจัดการฐานข้อมูล MySQL อย่างมีประสิทธิภาพ
- ระบบ Migration เพื่อการควบคุมเวอร์ชันของโครงสร้างฐานข้อมูล
- Entity Relationship ที่ชัดเจนระหว่าง User และ Task

### 6. การทดสอบ
- ใช้ Vitest สำหรับการทดสอบ Frontend ซึ่งทำงานได้เร็วและเข้ากันได้ดีกับ Vite

### 7. Docker Support
- รองรับการใช้งานผ่าน Docker และ docker-compose
- การตั้งค่าที่เหมาะสมสำหรับทั้ง Development และ Production

## 🔍 การทดสอบ


### รันการทดสอบ Frontend

```bash
cd frontend
npm run test
หรือ
npm run test:coverage
```

## 👏 เครดิต

- **Backend**: ปรับปรุงมาจาก [nodesnow-test-2025](https://github.com/AT74PH0L/AT74PH0L-nodesnow-test-2025) โดย [AT74PH0L](https://github.com/AT74PH0L)
- **Frontend**: พัฒนาโดย [Bobby9326](https://github.com/Bobby9326)

## 📄 License

โปรเจกต์นี้อยู่ภายใต้ MIT License - ดูรายละเอียดเพิ่มเติมได้ที่ไฟล์ License.md
