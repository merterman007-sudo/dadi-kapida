import * as argon2 from "argon2";
import { PrismaClient, UserStatus } from "@prisma/client";

const prisma = new PrismaClient();

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const bootstrapAdminEmail = requiredEnv("DADI_KAPIDA_BOOTSTRAP_ADMIN_EMAIL");
const bootstrapAdminPassword = requiredEnv("DADI_KAPIDA_BOOTSTRAP_ADMIN_PASSWORD");

const rolePermissions: Record<string, string[]> = {
  Owner: [
    "applications.read",
    "applications.convert",
    "candidates.read",
    "candidates.create",
    "candidates.update",
    "candidates.delete",
    "families.read",
    "families.create",
    "families.update",
    "families.delete",
    "family_requests.read",
    "family_requests.create",
    "family_requests.update",
    "matching.run",
    "matching.read",
    "tasks.read",
    "tasks.manage",
    "meetings.read",
    "meetings.manage",
    "reports.read",
    "placements.read",
    "placements.create",
    "placements.update",
    "finance.read",
    "finance.update",
    "users.manage",
    "settings.manage"
  ],
  Admin: [
    "applications.read",
    "applications.convert",
    "candidates.read",
    "candidates.create",
    "candidates.update",
    "candidates.delete",
    "families.read",
    "families.create",
    "families.update",
    "families.delete",
    "family_requests.read",
    "family_requests.create",
    "family_requests.update",
    "matching.run",
    "matching.read",
    "tasks.read",
    "tasks.manage",
    "meetings.read",
    "meetings.manage",
    "reports.read",
    "placements.read",
    "placements.create",
    "placements.update",
    "finance.read",
    "finance.update",
    "users.manage"
  ],
  Staff: [
    "applications.read",
    "applications.convert",
    "candidates.read",
    "candidates.create",
    "candidates.update",
    "families.read",
    "families.create",
    "families.update",
    "family_requests.read",
    "family_requests.create",
    "family_requests.update",
    "matching.run",
    "matching.read",
    "tasks.read",
    "tasks.manage",
    "meetings.read",
    "meetings.manage",
    "reports.read",
    "placements.read",
    "placements.create",
    "placements.update"
  ],
  Finance: ["finance.read", "finance.update", "reports.read", "placements.read", "families.read"],
  ReadOnly: [
    "applications.read",
    "candidates.read",
    "families.read",
    "family_requests.read",
    "matching.read",
    "tasks.read",
    "meetings.read",
    "reports.read",
    "placements.read"
  ]
};

const skills = ["Yeni Dogan Bakimi", "Ilk Yardim", "Oyun ve Etkinlik", "Uyku Rutini", "Beslenme Takibi"];
const certifications = ["Ilk Yardim Sertifikasi", "Cocuk Gelisimi Sertifikasi"];
const languages = [
  { name: "Turkce", code: "tr" },
  { name: "Ingilizce", code: "en" }
];

async function main() {
  for (const permissionKey of [...new Set(Object.values(rolePermissions).flat())]) {
    await prisma.permission.upsert({
      where: { key: permissionKey },
      update: {},
      create: {
        key: permissionKey,
        description: permissionKey
      }
    });
  }

  for (const [roleName, permissionsForRole] of Object.entries(rolePermissions)) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: {
        name: roleName,
        description: `${roleName} role`
      }
    });

    for (const permissionKey of permissionsForRole) {
      const permission = await prisma.permission.findUniqueOrThrow({
        where: { key: permissionKey }
      });

      await prisma.rolePermission.upsert({
        where: {
          role_id_permission_id: {
            role_id: role.id,
            permission_id: permission.id
          }
        },
        update: {},
        create: {
          role_id: role.id,
          permission_id: permission.id
        }
      });
    }
  }

  const ownerPasswordHash = await argon2.hash(bootstrapAdminPassword);
  const owner = await prisma.user.upsert({
    where: { email: bootstrapAdminEmail },
    update: {
      password_hash: ownerPasswordHash,
      status: UserStatus.ACTIVE
    },
    create: {
      first_name: "System",
      last_name: "Admin",
      email: bootstrapAdminEmail,
      password_hash: ownerPasswordHash,
      status: UserStatus.ACTIVE
    }
  });

  const ownerRole = await prisma.role.findUniqueOrThrow({
    where: { name: "Owner" }
  });

  await prisma.userRole.upsert({
    where: {
      user_id_role_id: {
        user_id: owner.id,
        role_id: ownerRole.id
      }
    },
    update: {},
    create: {
      user_id: owner.id,
      role_id: ownerRole.id
    }
  });

  await prisma.serviceCategory.upsert({
    where: { name: "Dadi" },
    update: {},
    create: { name: "Dadi" }
  });

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill },
      update: {},
      create: { name: skill }
    });
  }

  for (const certification of certifications) {
    await prisma.certification.upsert({
      where: { name: certification },
      update: {},
      create: { name: certification }
    });
  }

  for (const language of languages) {
    await prisma.language.upsert({
      where: { code: language.code },
      update: {},
      create: language
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
