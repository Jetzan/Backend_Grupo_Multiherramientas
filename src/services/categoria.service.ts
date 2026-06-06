import { prisma } from "../../lib/prisma";
export async function obtenerCategorias() {
    const categoria = await prisma.categorias.findFirst({
  where: {
    slug: "herramientas-electricas"
  }
});

console.log(categoria?.nombre);
console.log(Buffer.from(categoria?.nombre || "", "utf8"));
console.log(Buffer.from(categoria?.nombre || "", "utf8").toString("hex"));
    return await prisma.categorias.findMany();
}




