import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SYSTEM_PERMISSIONS, SYSTEM_ROLES } from "../config/permissions";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Apex UAE Database Foundation Seeding...");

  // 1. Seed Permissions
  console.log("-> Seeding system permissions...");
  for (const perm of SYSTEM_PERMISSIONS) {
    await prisma.permission.upsert({
      where: { code: perm.code },
      update: {
        name: perm.name,
        description: perm.description,
        module: perm.module,
      },
      create: {
        code: perm.code,
        name: perm.name,
        description: perm.description,
        module: perm.module,
      },
    });
  }
  console.log(`✓ Seeded ${SYSTEM_PERMISSIONS.length} permissions.`);

  // 2. Seed System Roles & Link Permissions
  console.log("-> Seeding system roles & mapping permissions...");
  const dbPermissions = await prisma.permission.findMany();
  const permMap = new Map(dbPermissions.map((p) => [p.code, p.id]));

  for (const roleDef of SYSTEM_ROLES) {
    const role = await prisma.role.upsert({
      where: { id: `role_${roleDef.slug}` },
      update: {
        name: roleDef.name,
        slug: roleDef.slug,
        description: roleDef.description,
        isSystem: true,
      },
      create: {
        id: `role_${roleDef.slug}`,
        name: roleDef.name,
        slug: roleDef.slug,
        description: roleDef.description,
        isSystem: true,
      },
    });

    // Link Role Permissions
    for (const code of roleDef.permissions) {
      const permissionId = permMap.get(code);
      if (permissionId) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: role.id,
              permissionId,
            },
          },
          update: {},
          create: {
            roleId: role.id,
            permissionId,
          },
        });
      }
    }
  }
  console.log(`✓ Seeded ${SYSTEM_ROLES.length} system roles.`);

  // 3. Seed Organizations
  console.log("-> Seeding demo Dubai real estate organizations...");
  const emaar = await prisma.organization.upsert({
    where: { slug: "emaar" },
    update: {},
    create: {
      name: "Emaar Properties PJSC",
      slug: "emaar",
      currency: "AED",
      timezone: "Asia/Dubai",
      taxNumber: "100234567800003",
      phone: "+971 4 367 3333",
      address: "Emaar Square, Building 3, Downtown Dubai, UAE",
      isActive: true,
    },
  });

  const damac = await prisma.organization.upsert({
    where: { slug: "damac" },
    update: {},
    create: {
      name: "Damac Properties Sales",
      slug: "damac",
      currency: "AED",
      timezone: "Asia/Dubai",
      taxNumber: "100987654300003",
      phone: "+971 4 373 1000",
      address: "DAMAC Executive Heights, Barsha Heights, Dubai, UAE",
      isActive: true,
    },
  });
  console.log("✓ Seeded organizations: Emaar Properties PJSC & Damac Properties Sales.");

  // 4. Seed Users with pre-hashed passwords
  console.log("-> Seeding demo users...");
  const passwordHash = await bcrypt.hash("ApexDemo2026!", 10);

  // Tariq - Owner of Emaar, Admin in Damac
  const ownerUser = await prisma.user.upsert({
    where: { email: "owner@emaar.ae" },
    update: { passwordHash },
    create: {
      email: "owner@emaar.ae",
      passwordHash,
      firstName: "Tariq",
      lastName: "Al Hashimi",
      phone: "+971 50 112 3456",
      isActive: true,
    },
  });

  // Sarah - Sales Manager in Emaar
  const managerUser = await prisma.user.upsert({
    where: { email: "manager@emaar.ae" },
    update: { passwordHash },
    create: {
      email: "manager@emaar.ae",
      passwordHash,
      firstName: "Sarah",
      lastName: "Jenkins",
      phone: "+971 52 987 6543",
      isActive: true,
    },
  });

  // Omar - Broker / Agent in Emaar
  const agentUser = await prisma.user.upsert({
    where: { email: "agent@emaar.ae" },
    update: { passwordHash },
    create: {
      email: "agent@emaar.ae",
      passwordHash,
      firstName: "Omar",
      lastName: "Mansoor",
      phone: "+971 55 443 2211",
      isActive: true,
    },
  });

  // 5. Seed Memberships
  console.log("-> Linking organization memberships...");
  const ownerRoleId = `role_owner`;
  const adminRoleId = `role_admin`;
  const managerRoleId = `role_sales_manager`;
  const agentRoleId = `role_agent`;

  // Tariq in Emaar (Owner, Default)
  await prisma.organizationMembership.upsert({
    where: {
      organizationId_userId: {
        organizationId: emaar.id,
        userId: ownerUser.id,
      },
    },
    update: { roleId: ownerRoleId },
    create: {
      organizationId: emaar.id,
      userId: ownerUser.id,
      roleId: ownerRoleId,
      isDefault: true,
    },
  });

  // Tariq in Damac (Admin)
  await prisma.organizationMembership.upsert({
    where: {
      organizationId_userId: {
        organizationId: damac.id,
        userId: ownerUser.id,
      },
    },
    update: { roleId: adminRoleId },
    create: {
      organizationId: damac.id,
      userId: ownerUser.id,
      roleId: adminRoleId,
      isDefault: false,
    },
  });

  // Sarah in Emaar (Sales Manager, Default)
  await prisma.organizationMembership.upsert({
    where: {
      organizationId_userId: {
        organizationId: emaar.id,
        userId: managerUser.id,
      },
    },
    update: { roleId: managerRoleId },
    create: {
      organizationId: emaar.id,
      userId: managerUser.id,
      roleId: managerRoleId,
      isDefault: true,
    },
  });

  // Omar in Emaar (Agent, Default)
  await prisma.organizationMembership.upsert({
    where: {
      organizationId_userId: {
        organizationId: emaar.id,
        userId: agentUser.id,
      },
    },
    update: { roleId: agentRoleId },
    create: {
      organizationId: emaar.id,
      userId: agentUser.id,
      roleId: agentRoleId,
      isDefault: true,
    },
  });

  // 6. Seed Foundational Teams for Emaar (Phase 2 bridge)
  console.log("-> Seeding foundational sales teams...");
  await prisma.team.upsert({
    where: { id: "team_downtown" },
    update: {},
    create: {
      id: "team_downtown",
      organizationId: emaar.id,
      name: "Downtown Dubai Super Luxury Team",
      description: "Direct sales for Burj Crown, Opera Grand, and Boulevard Heights",
      leaderId: managerUser.id,
    },
  });

  await prisma.team.upsert({
    where: { id: "team_creek" },
    update: {},
    create: {
      id: "team_creek",
      organizationId: emaar.id,
      name: "Dubai Creek Harbour Off-Plan Division",
      description: "Waterfront developments and waterfront residences",
      leaderId: managerUser.id,
    },
  });

  console.log("✅ Apex UAE Database Foundation Seeding Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
