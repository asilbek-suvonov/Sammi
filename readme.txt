# EduCenter Project

## 1. Loyiha haqida

1. EduCenter — bu dasturlash kurslarini ko‘rish va boshqarish uchun yaratilgan platforma.
2. Loyihada 2 ta asosiy dashboard panel mavjud va landing page:
3. Landing Page (foydalanuvchi ko‘radigan sahifa)
4. User Dashboard (foydalanuvchi paneli)
5. Admin Panel (boshqaruv paneli)
6. user panellarga auth qilib utguncha kuchli xavfsizlik auth guard va role guard inputlarga esa zod ishlatilishi 

---

## 2. Landing Page

### 2.1 Navbar

1. Logo mavjud bo‘lishi kerak
2. 5 ta navigation link bo‘lishi kerak
3. Navigation link bosilganda smooth scroll ishlashi kerak
4. Dark/Light toggle bo‘lishi kerak
5. Profile dropdown bo‘lishi kerak
6. Agar foydalanuvchi login qilmagan bo‘lsa Login button chiqishi kerak 
7. Agar login qilgan bo‘lsa Dashboard va Logout dropdownda chiqishi kerak

### 2.2 Sections

1. Hero section
2. Courses section
3. Projects section
4. Code Sources section
5. Footer

### 2.3 Courses

1. Kurslar card ko‘rinishda chiqadi
2. Har bir card bosilganda Course Detail sahifasiga o‘tadi

### 2.4 Course Detail

1. Chap tomonda rasm joylashadi
2. Rasm ostida title va description bo‘ladi
3. O‘ng tomonda sticky card bo‘ladi
4. Sticky card ichida:
5. Kursni ko‘rish button
6. Bog‘lanish button
7. Kurs davomiyligi (soat va qismlar)
8. Kurs narxi

### 2.5 Video Preview

1. Kursni ko‘rish button bosilganda /video/preview/:id ga o‘tadi

---

## 3. User Dashboard

### 3.1 Umumiy

1. Dashboard barcha foydalanuvchilar uchun bir xil bo‘ladi

### 3.2 Navbar

1. Profile dropdown bo‘lishi kerak
2. Language dropdown bo‘lishi kerak
3. Dark/Light toggle bo‘lishi kerak

### 3.3 Sidebar

1. Boshqaruv panel
2. Kurslar
3. Loyihalar
4. Kod manbalar

### 3.4 Pages

1. Foydalanuvchi faqat ma’lumotlarni ko‘ra oladi
2. CRUD amallar mavjud emas

### 3.5 Video Player

1. Katta video player bo‘lishi kerak 
2. Video ustiga bosilganda ijro boshlanishi kerak
3. Video ostida:
4. Keyingi video button
5. Ko‘rilgan deb belgilash button

### 3.6 Course Content

1. Button bosilganda shadcn Sheet ochiladi
2. Sheet ichida accordion bo‘ladi
3. Accordion ichida kurs qismlari bo‘ladi
4. Accordion bosilganda video o‘zgaradi

### 3.7 Progress

1. Sheet pastida progress bar bo‘ladi
2. Har bir video ko‘rilganda progress oshadi

---

## 4. Admin Panel

### 4.1 Sidebar

1. User dashboard bilan bir xil ko‘rinishda bo‘ladi

### 4.2 Pages

1. Boshqaruv panel
2. Kurslar
3. Loyihalar
4. Kod manbalar

### 4.3 CRUD

1. Admin barcha sahifalarda:
2. Create (qo‘shish)
3. Read (ko‘rish)
4. Update (tahrirlash)
5. Delete (o‘chirish)

### 4.4 Ma’lumot qo‘shish

1. Barcha qo‘shish ishlari shadcn Sheet orqali amalga oshadi

### 4.5 barcha sahifalarda

1. Grid ko‘rinish
2. List ko‘rinish
3. Search funksiyasi
4. Filter funksiyasi
5. Agar ma’lumotlar 10 tadan oshsa pagination chiqadi

### 4.6 Sidebar xususiyati

1. Sidebar collapse bo‘lishi kerak
2. Collapse bo‘lganda faqat iconlar qoladi
3. Animatsiya silliq va tez bo‘lishi kerak

---

## 5. Dizayn talablari

1. Dizayn minimal, oddiy, toza va zamonaviy bo‘lishi kerak
2. Quyidagi ranglardan foydalanish kerak:
3. Faqat shadcn componentlardan foydalanish kerak
4. Textlar default bo‘lishi kerak
5. Dizayn shadcn stylesida bo'ladi oq va qora uslubda 

---

## 6. Texnologiyalar

1. React
2. Tailwind CSS
3. shadcn/ui
4. TanStack Query
5. React Router
6. Zustand 

---

## 7. Qo‘shimcha

1. Barcha animatsiyalar silliq bo‘lishi kerak
2. Responsive dizayn bo‘lishi kerak
3. Kod struktura aniq va toza bo‘lishi kerak
4. Men yaratgan file structura bo'yicha ishlash kerak 
5. har bir pagega alohida file yaratiladi 
6. Componentlar bilan judayam yaxshi ishla men yaratgan barchasiga logika bilan kod yoziladi
7. Front end taraflama auth-guard role-guard inputlar zod bilan ishlansin tokenlar xavfsizligiga kuchli e'tibor beriladi
8. Typelar bilan juda mukammal ishlaniladi 
9. Men component/ui/ - ichidagi barcha componentlarni ishlatiladi  

## 8. project route yo'llari qisqacha 

Landing page 
  1. / 
  2. course cardlar bosilganda => course/:id => Kursni ko'rish bosilganda - course/video/preview/:id
  
Login page
  /auth/login - Auth role xavfsizligi bo'ladi role guard ham 

Admin panel - bu pageda faqat CRUD amallari bajariladi 
  1.admin/dashboard/workbench
  2.admin/dashboard/course
  3.admin/dashboard/projects
  4.admin/dashboard/sources

User panel 
  1.user/dashboard/workbench - bu pageda course ni qancha foiz kurganligi haqida malumotlar bo'ladi 
  2.user/dashboard/course 
  3.user/dashboard/projects
  4.user/dashboard/sources

## 9. Projectni dark light uchun ranglar paletrasi
 1. Light 
    #f8f8f8
    #F5F5F5
    #b1b5c8
    #0059FF

 2. Dark
    #141414
    #1F1F1F
    #F5F5F5
    #0059FF