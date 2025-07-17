# 📦 API Finance

API Finance is a RESTful API built using Express.js and Sequelize for managing finance-related data such as transactions and accounts.

## 🚀 Features

- User authentication using JWT
- CRUD operations for transactions and accounts
- Daily queue tracking (antrian)
- Integrated with [Finance Flutter App](https://github.com/achfairuz/finance)

## 📁 Folder Structure

```
api-finance/
├── config/
│   └── config.json
├── controllers/
├── middlewares/
├── migrations/
├── models/
├── routes/
├── seeders/
├── .env
├── .gitignore
├── package.json
└── server.js
```

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/achfairuz/api-finance.git
cd api-finance
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file in the root directory and add:

```env
JWT_SECRET="finance_api_secret14040725iyuz"
```

### 4. Setup config file

Create a `config/config.json` based on the following template:

```json
{
  "development": {
    "username": "your_db_user",
    "password": "your_db_password",
    "database": "finance_db",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

> Replace `your_db_user`, `your_db_password`, and `finance_db` with your actual MySQL credentials.

### 5. Run database migrations and seeders

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### 6. Start the server

```bash
npm start
```

Server will run on: `http://localhost:3000`

## 🔗 Related Projects

- 🌐 Flutter Frontend: [github.com/achfairuz/finance](https://github.com/achfairuz/finance)

## 👤 Author

- 💼 **Achmad Fairuz**  
  📧 [fairf717@gmail.com](mailto:fairf717@gmail.com)  
  🌐 GitHub: [github.com/achfairuz](https://github.com/achfairuz)  
  🔗 LinkedIn: [linkedin.com/in/achmad-fairuz-27521b24b](https://www.linkedin.com/in/achmad-fairuz-27521b24b/)

---

# 📊 API Finance

API Finance adalah backend RESTful API berbasis Node.js dan Express yang digunakan untuk mengelola keuangan pengguna, seperti transaksi pemasukan, pengeluaran, dan pengelolaan rekening bank.

---

## 🚀 Langkah Instalasi

```bash
# 1. Clone repository
git clone https://github.com/achfairuz/api-finance.git
cd api-finance

# 2. Install dependencies
npm install

# 3. Salin file konfigurasi
cp .env.example .env

# 4. Jalankan migrasi database (jika menggunakan Sequelize)
npx sequelize-cli db:migrate

# 5. Jalankan server
npm run dev
```

---

## 📦 Struktur API

### 🔐 Auth - `/api/auth`

- `POST /register` – Register user baru
- `POST /login` – Login user
- `GET /profile/user` – Mendapatkan data profil user
- `PUT /update/profile/user` – Update profil user
- `PUT /change-password/user` – Ganti password

### 🏦 Rekening - `/api/rekening`

- `POST /add-bank/rekening` – Tambah rekening
- `PUT /update-balance/rekening/:id` – Update saldo
- `GET /show-balance/rekening` – Lihat saldo semua rekening
- `GET /get-rekening/rekening` – Semua rekening
- `GET /get-rekening/:id` – Rekening berdasarkan ID
- `GET /get-rekening-income/rekening` – Filter rekening pemasukan
- `GET /get-rekening-expenditure/rekening` – Filter rekening pengeluaran

### 💸 Transaksi - `/api/transaction`

- `POST /transaction/expenditure` – Tambah pengeluaran
- `POST /transaction/income` – Tambah pemasukan
- `GET /get-all-transaction` – Semua transaksi
- `GET /get-all-transaction/expenditure` – Semua pengeluaran
- `GET /get-all-transaction/income` – Semua pemasukan
- `GET /get-transaction/:id` – Transaksi berdasarkan ID
- `GET /get-chart-income` – Grafik pemasukan
- `GET /get-chart-expenditure` – Grafik pengeluaran
- `PUT /update-transaction/:id` – Update transaksi
- `DELETE /delete-transaction/:id` – Hapus transaksi

---

## ⚙️ Konfigurasi .env

```env
JWT_SECRET=your_jwt_secret_key
```

---

## 👤 Developer

- 💼 **Achmad Fairuz**
- 📧 [fairf717@gmail.com](mailto:fairf717@gmail.com)
- 🌐 GitHub: [github.com/achfairuz](https://github.com/achfairuz)
- 🔗 LinkedIn: [linkedin.com/in/achmad-fairuz-27521b24b](https://www.linkedin.com/in/achmad-fairuz-27521b24b/)
