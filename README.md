# F-Secret AI Art Gallery

เว็บ Gallery สำหรับธุรกิจรับสร้างภาพ AI **F-Secret AI Art**

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **Image Storage:** Cloudinary
- **Auth:** NextAuth.js
- **Deploy:** Vercel

## หน้าหลัก

- `/` - หน้าแรก
- `/gallery` - หน้าแสดง Catalog ทั้งหมด
- `/gallery/[id]` - หน้าแสดงรูปใน Catalog
- `/contact` - หน้าติดต่อ
- `/admin/login` - หน้า Login สำหรับ Admin
- `/admin` - Admin Dashboard
- `/admin/catalogs` - จัดการ Catalog
- `/admin/images` - จัดการรูปภาพ
- `/admin/upload` - อัปโหลดรูป
- `/admin/settings` - ตั้งค่าเว็บ

## Environment Variables

สร้างไฟล์ `.env` แล้วใส่ค่าดังนี้:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_PASSWORD_HASH="$2b$10$..."
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### วิธีสร้าง Admin Password Hash

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-password', 10).then(h => console.log(h));"
```

## การติดตั้งในคอมพิวเตอร์

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

## การ Deploy

1. Push โค้ดขึ้น GitHub
2. เชื่อม Vercel เข้ากับ GitHub Repository
3. ใส่ Environment Variables ใน Vercel Dashboard
4. Deploy
