import { prisma } from "./lib/prisma";

async function seed() {
  // Categorías raíz
  const electricas = await prisma.categorias.create({
    data: { nombre: "Herramientas Eléctricas", slug: "herramientas-electricas", activa: true }
  });
  await prisma.categorias.create({
    data: { nombre: "Accesorios", slug: "accesorios", activa: true }
  });
  await prisma.categorias.create({
    data: { nombre: "Refacciones", slug: "refacciones", activa: true }
  });

  // Subcategorías
  await prisma.categorias.create({
    data: { nombre: "Alámbricas", slug: "alámbricas", activa: true, categoria_padre_id: electricas.id }
  });
  await prisma.categorias.create({
    data: { nombre: "De Batería", slug: "de-bateria", activa: true, categoria_padre_id: electricas.id }
  });

  // Marcas
  await prisma.marcas.createMany({
    data: [
      { nombre: "Bosch",  slug: "bosch",  activa: true },
      { nombre: "Makita", slug: "makita", activa: true },
      { nombre: "Dremel", slug: "dremel", activa: true },
    ]
  });

  // Usuario admin
  await prisma.usuarios.create({
    data: {
      nombre: "Administrador",
      email: "admin@grupomultiherramientas.mx",
      password_hash: "$2b$12$CAMBIA_ESTE_HASH_POR_UNO_REAL",
      rol: "superadmin",
    }
  });

  console.log("Seed completado ✓");
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());