import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.scheduleConflict.deleteMany();
  await prisma.scheduleItem.deleteMany();
  await prisma.scheduleVersion.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.teachingLoad.deleteMany();
  await prisma.classAdvisor.deleteMany();
  await prisma.userPreference.deleteMany();
  await prisma.holiday.deleteMany();
  await prisma.timeSlot.deleteMany();
  await prisma.subjectConstraint.deleteMany();
  await prisma.constraint.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.user.deleteMany();
  await prisma.class.deleteMany();
  await prisma.rombel.deleteMany();
  await prisma.room.deleteMany();
  await prisma.roomType.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.semester.deleteMany();
  await prisma.academicYear.deleteMany();
  await prisma.major.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.auditLog.deleteMany();

  console.log('Seeding database...');

  // Create Users
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@jadwal.local',
      password: '$2b$10$Nz/C1K8F4q8q8q8q8q8q8q8q8q8q8q8q8', // bcrypt hash for "password123"
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      phone: '+6281234567890',
      address: 'Jl. Pendidikan No. 1',
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: 'kurikulum@jadwal.local',
      password: '$2b$10$Nz/C1K8F4q8q8q8q8q8q8q8q8q8q8q8q8',
      name: 'Admin Kurikulum',
      role: 'ADMIN',
      phone: '+6281234567891',
      address: 'Jl. Pendidikan No. 1',
    },
  });

  const kepalaSekolah = await prisma.user.create({
    data: {
      email: 'kepala@jadwal.local',
      password: '$2b$10$Nz/C1K8F4q8q8q8q8q8q8q8q8q8q8q8q8',
      name: 'Kepala Sekolah',
      role: 'KEPALA_SEKOLAH',
      phone: '+6281234567892',
      address: 'Jl. Pendidikan No. 1',
    },
  });

  // Create Teachers
  const teacher1 = await prisma.user.create({
    data: {
      email: 'guru1@jadwal.local',
      password: '$2b$10$Nz/C1K8F4q8q8q8q8q8q8q8q8q8q8q8q8',
      name: 'Budi Santoso',
      role: 'GURU',
      phone: '+6281234567893',
      address: 'Jl. Guru No. 1',
      teacher: {
        create: {
          nip: '1978050219750313001',
          specialization: 'Matematika',
          qualification: 'S1',
          status: 'Aktif',
        },
      },
    },
    include: { teacher: true },
  });

  const teacher2 = await prisma.user.create({
    data: {
      email: 'guru2@jadwal.local',
      password: '$2b$10$Nz/C1K8F4q8q8q8q8q8q8q8q8q8q8q8q8',
      name: 'Siti Nurhaliza',
      role: 'GURU',
      phone: '+6281234567894',
      address: 'Jl. Guru No. 2',
      teacher: {
        create: {
          nip: '1980061520050312002',
          specialization: 'Bahasa Indonesia',
          qualification: 'S1',
          status: 'Aktif',
        },
      },
    },
    include: { teacher: true },
  });

  // Create Grades
  const grade10 = await prisma.grade.create({
    data: {
      name: '10',
      level: 10,
      description: 'Grade 10 - SMA Kelas X',
    },
  });

  // Create Majors
  const majorIPA = await prisma.major.create({
    data: {
      name: 'IPA',
      code: 'IPA',
      description: 'Program Ilmu Pengetahuan Alam',
    },
  });

  // Create Rombel
  const rombel = await prisma.rombel.create({
    data: {
      gradeId: grade10.id,
      majorId: majorIPA.id,
      name: 'X-IPA-1',
      code: 'X-IPA-1',
      capacity: 35,
    },
  });

  // Create Classes
  const class1 = await prisma.class.create({
    data: {
      rombelId: rombel.id,
      name: 'X-IPA-1-A',
      capacity: 35,
    },
  });

  // Create Room Types
  const roomTypeKelas = await prisma.roomType.create({
    data: {
      name: 'Ruang Kelas',
      description: 'Ruang belajar standar',
    },
  });

  const roomTypeLab = await prisma.roomType.create({
    data: {
      name: 'Laboratorium',
      description: 'Lab untuk praktik',
    },
  });

  // Create Rooms
  const room101 = await prisma.room.create({
    data: {
      name: 'Ruang 101',
      code: '101',
      roomTypeId: roomTypeKelas.id,
      capacity: 35,
      floor: 1,
      building: 'Gedung A',
    },
  });

  const labFisika = await prisma.room.create({
    data: {
      name: 'Lab Fisika',
      code: 'LAB-F',
      roomTypeId: roomTypeLab.id,
      capacity: 30,
      floor: 2,
      building: 'Gedung A',
    },
  });

  // Create Subjects
  const matematika = await prisma.subject.create({
    data: {
      name: 'Matematika',
      code: 'MTK',
      jpPerWeek: 4,
      jpPerSemester: 72,
      category: 'Umum',
    },
  });

  const fisika = await prisma.subject.create({
    data: {
      name: 'Fisika',
      code: 'FIS',
      jpPerWeek: 3,
      jpPerSemester: 54,
      category: 'Praktik',
      requiresLab: true,
    },
  });

  // Create Academic Year
  const academicYear = await prisma.academicYear.create({
    data: {
      year: '2024/2025',
      startDate: new Date('2024-07-01'),
      endDate: new Date('2025-06-30'),
      active: true,
    },
  });

  // Create Semester
  const semester = await prisma.semester.create({
    data: {
      academicYearId: academicYear.id,
      name: 'Ganjil',
      startDate: new Date('2024-07-01'),
      endDate: new Date('2024-12-31'),
      active: true,
      effectiveDays: 90,
    },
  });

  // Create Time Slots
  const timeSlots = [];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const startTimes = [
    '07:00', '08:00', '09:00', '09:30', '10:30', '11:00', '12:00', '13:00', '14:00', '15:00',
  ];

  for (const day of days) {
    for (let i = 0; i < startTimes.length; i++) {
      const timeSlot = await prisma.timeSlot.create({
        data: {
          semesterId: semester.id,
          day,
          dayNumber: days.indexOf(day) + 1,
          slotNumber: i + 1,
          startTime: startTimes[i],
          endTime: new Date(`2024-01-01T${startTimes[i]}`).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }),
          duration: 45,
          isBreak: false,
          isUsable: true,
        },
      });
      timeSlots.push(timeSlot);
    }
  }

  // Create Teaching Loads
  await prisma.teachingLoad.create({
    data: {
      teacherId: teacher1.teacher!.id,
      classId: class1.id,
      subjectId: matematika.id,
      jpPerWeek: 4,
    },
  });

  await prisma.teachingLoad.create({
    data: {
      teacherId: teacher2.teacher!.id,
      classId: class1.id,
      subjectId: fisika.id,
      jpPerWeek: 3,
    },
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
