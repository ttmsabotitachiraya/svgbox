# README — Supabase setup for SVGBox

ไฟล์หลักสำหรับการติดตั้ง/อัปเดตฐานข้อมูลของโปรเจกต์:
- `supabase_setup.sql` (ไฟล์เดียวที่เป็นสคริปต์สมบูรณ์ที่สุด) — รันไฟล์นี้เพื่อสร้าง schema, triggers, functions, indexes และ RLS policies ทั้งหมด
- `schema.sql` — สำเนา schema (ใช้ดูโครงสร้างแยกต่างหากหากต้องการ)

วัตถุประสงค์ไฟล์นี้
- ใช้สำหรับการติดตั้งฐานข้อมูลใหม่แบบครบถ้วน
- หรือใช้เพื่ออัปเดต schema ที่มีอยู่ (migration ทั้งหมดถูกรวมไว้)
- ถูกออกแบบให้ใช้คำสั่งแบบ idempotent เท่าที่ทำได้ (ใช้ IF NOT EXISTS / DROP IF EXISTS / CREATE OR REPLACE) แต่มีการเปลี่ยนแปลงบางอย่างที่อาจเป็น destructive — อ่านก่อนรัน

ข้อควรระวัง (สำคัญ)
1. สำรองฐานข้อมูลก่อนเสมอก่อนรันบนระบบ production
2. รันสคริปต์ใน staging environment ก่อนเพื่อตรวจสอบผล
3. ถ้าต้องการอัปเดตเฉพาะส่วนเล็ก ๆ ให้พิจารณารัน migrations ย่อยแทนการรันไฟล์ทั้งหมด

การสำรอง (backup)
- ผ่าน Supabase UI: ใช้เมนู Backups (ถ้ามี)
- ผ่าน CLI / psql:
```/dev/null/backup.sh#L1-3
pg_dump -h <host> -p <port> -U <user> -d <db> -Fc -f svgbox_pre_migration.dump
# หรือใช้ connection string:
# PGPASSWORD=<pw> pg_dump "postgresql://user:pw@host:port/db" -Fc -f svgbox_pre_migration.dump
```

วิธีรัน (Supabase SQL Editor)
1. เปิดโปรเจกต์ใน Supabase → SQL Editor
2. เปิดไฟล์ `supabase_setup.sql` แล้วกด Run
3. ตรวจสอบ log ผลลัพธ์ว่ามีข้อผิดพลาดหรือไม่

วิธีรัน (psql / CLI)
- ตัวอย่างการรันผ่าน psql (แทนที่ค่า connection ให้ถูกต้อง):
```/dev/null/psql-example.sh#L1-3
PGPASSWORD='<your_password>' psql "postgresql://<user>:<password>@<host>:<port>/<database>" -f supabase_setup.sql
```

คำสั่งตรวจสอบหลังรัน (ตัวอย่าง)
- ตรวจสอบคอลัมน์ของตาราง `svgbox_profiles`:
```/dev/null/verify_profiles.sql#L1-4
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'svgbox_profiles'
ORDER BY ordinal_position;
```

- ตรวจสอบว่าฟังก์ชันสำคัญถูกสร้างแล้ว:
```/dev/null/verify_functions.sql#L1-4
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public' AND routine_name LIKE 'svgbox_%'
ORDER BY routine_name;
```

- ตรวจสอบนโยบาย RLS ของตาราง `svgbox_assets`:
```/dev/null/verify_rls.sql#L1-5
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'svgbox_assets';
```

การลบไฟล์ .sql ที่ไม่ได้ใช้งาน (คำแนะนำ)
- ก่อนลบ ควรตรวจสอบรายชื่อไฟล์ .sql ใน repository และยืนยันว่าไฟล์นั้นไม่จำเป็น
- ตัวอย่างคำสั่งเพื่อดูไฟล์ .sql ในไดเรกทอรีโปรเจกต์:
```/dev/null/list_sql.sh#L1-3
# แสดงไฟล์ SQL ทั้งหมดในโฟลเดอร์ปัจจุบันและ subfolders
find . -name "*.sql" -type f -print
```

- เมื่อตรวจสอบแล้ว ต้องการลบไฟล์ที่ไม่ต้องการ:
```/dev/null/remove_sql.sh#L1-3
# ตัวอย่าง: ลบไฟล์ที่ไม่จำเป็น (แทนที่ path/to/file.sql ด้วยไฟล์จริง)
rm path/to/unwanted_file.sql
```

(หมายเหตุ: ผม/ฉันไม่ได้ลบไฟล์ใด ๆ ให้คุณโดยอัตโนมัติในขั้นตอนนี้ — คำสั่งด้านบนเป็นตัวอย่างที่ให้คุณรันเองบนเครื่องหรือเซิร์ฟเวอร์)

Rollback (การย้อนคืน)
- ถ้าจำเป็นต้องย้อนคืน ให้ restore จาก backup ที่สร้างไว้:
```/dev/null/restore.sh#L1-3
pg_restore -h <host> -p <port> -U <user> -d <db> -c svgbox_pre_migration.dump
# หรือใช้ Supabase UI restore หากรองรับ
```
- การ rollback เป็นไปได้ง่ายที่สุดด้วยการ restore จาก snapshot / dump ที่ทำก่อนรันสคริปต์

Testing & verification (แนะนำ)
1. รันสคริปต์ในเครื่อง local หรือ staging ก่อน
2. รันชุด verification queries (ตัวอย่างข้างต้น)
3. ทดสอบ endpoints / RPC จาก frontend ว่าเรียกใช้งานได้ (เช่น `svgbox_admin_list_users`, `svgbox_update_last_seen`, `svgbox_increment_view_count`)
4. ตรวจสอบสิทธิ์ RLS ด้วยบัญชีผู้ใช้ปกติ (non-admin) และบัญชี admin

Notes & best practices
- ฟังก์ชัน RPC ที่ต้องการสิทธิพิเศษควรตั้ง `SECURITY DEFINER` และตรวจสอบเงื่อนไขภายในฟังก์ชันอย่างรัดกุม (สคริปต์นี้ตั้งไว้แล้วสำหรับฟังก์ชันบางตัว)
- รักษา secret/credentials ด้วยความระมัดระวังเมื่อใช้ CLI (อย่าเก็บรหัสผ่านในที่สาธารณะ)
- ทดสอบการทำงานของแอปหลังรันสคริปต์ โดยเฉพาะ feature ที่ขึ้นกับ RLS

ต้องการให้ช่วยอะไรต่อไหม?
- สร้างไฟล์ rollback สำหรับแต่ละ migration step
- สร้างสคริปต์ตรวจสอบ (health-check) ที่รันเป็นชุด
- ตรวจสอบความต่าง (diff) ระหว่าง schema ปัจจุบันบน DB กับไฟล์ `supabase_setup.sql` (ต้องให้ข้อมูลการเข้าถึง DB หรือให้ฉันคำสั่งที่รันที่ฝั่งคุณ)

ถ้าต้องการให้ฉันเพิ่มตัวอย่างขั้นตอนการรันแบบเต็ม (staging → production checklist) บอกได้เลยครับ/ค่ะ