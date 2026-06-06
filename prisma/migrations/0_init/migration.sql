-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "estado_contacto" AS ENUM ('nuevo', 'leido', 'respondido', 'archivado');

-- CreateEnum
CREATE TYPE "origen_evento" AS ENUM ('web_publica', 'admin', 'api');

-- CreateEnum
CREATE TYPE "rol_usuario" AS ENUM ('superadmin', 'admin', 'operador', 'solo_lectura');

-- CreateEnum
CREATE TYPE "tipo_codigo" AS ENUM ('barras', 'qr', 'interno', 'otro');

-- CreateEnum
CREATE TYPE "tipo_corriente" AS ENUM ('alambre', 'bateria', 'ninguna');

-- CreateEnum
CREATE TYPE "tipo_evento" AS ENUM ('vista', 'busqueda', 'descarga_pdf', 'contacto_whatsapp');

-- CreateEnum
CREATE TYPE "tipo_movimiento" AS ENUM ('entrada', 'salida', 'ajuste', 'devolucion', 'descontinuado');

-- CreateTable
CREATE TABLE "busquedas_log" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "termino" VARCHAR(300) NOT NULL,
    "resultados" INTEGER NOT NULL DEFAULT 0,
    "origen" "origen_evento" NOT NULL DEFAULT 'web_publica',
    "ip_hash" VARCHAR(64),
    "fecha" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "busquedas_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" VARCHAR(120) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "descripcion" TEXT,
    "categoria_padre_id" UUID,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "codigos_producto" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "producto_id" UUID NOT NULL,
    "codigo" VARCHAR(200) NOT NULL,
    "tipo" "tipo_codigo" NOT NULL DEFAULT 'barras',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "codigos_producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compatibilidades" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "producto_id" UUID NOT NULL,
    "compatible_con_id" UUID NOT NULL,
    "nota" TEXT,

    CONSTRAINT "compatibilidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contactos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" VARCHAR(120) NOT NULL,
    "email" VARCHAR(200),
    "telefono" VARCHAR(30),
    "mensaje" TEXT NOT NULL,
    "estado" "estado_contacto" NOT NULL DEFAULT 'nuevo',
    "ip_hash" VARCHAR(64),
    "fecha" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contactos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalle_ventas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "venta_id" UUID NOT NULL,
    "producto_id" UUID NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(12,2) NOT NULL,
    "subtotal" DECIMAL(14,2) DEFAULT ((cantidad)::numeric * precio_unitario),

    CONSTRAINT "detalle_ventas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diagramas_pdf" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "producto_id" UUID NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "nombre_archivo" VARCHAR(200) NOT NULL,
    "tamano_bytes" INTEGER,
    "subido_por" UUID,
    "subido_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "diagramas_pdf_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos_producto" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "producto_id" UUID NOT NULL,
    "tipo" "tipo_evento" NOT NULL,
    "origen" "origen_evento" NOT NULL DEFAULT 'web_publica',
    "ip_hash" VARCHAR(64),
    "sesion_id" VARCHAR(100),
    "fecha" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eventos_producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imagenes_producto" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "producto_id" UUID NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "alt_text" VARCHAR(200),
    "orden" SMALLINT NOT NULL DEFAULT 0,
    "es_principal" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "imagenes_producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marcas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "logo_url" VARCHAR(500),
    "descripcion" TEXT,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "marcas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimientos_inventario" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "producto_id" UUID NOT NULL,
    "usuario_id" UUID,
    "tipo" "tipo_movimiento" NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "stock_anterior" INTEGER NOT NULL,
    "stock_nuevo" INTEGER NOT NULL,
    "motivo" TEXT,
    "referencia_id" UUID,
    "fecha" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimientos_inventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "noticias" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "titulo" VARCHAR(200) NOT NULL,
    "contenido" TEXT NOT NULL,
    "imagen_url" VARCHAR(500),
    "publicada" BOOLEAN NOT NULL DEFAULT false,
    "usuario_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "noticias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" VARCHAR(200) NOT NULL,
    "modelo" VARCHAR(100),
    "descripcion" TEXT,
    "precio" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "existencia" INTEGER NOT NULL DEFAULT 0,
    "marca_id" UUID NOT NULL,
    "categoria_id" UUID NOT NULL,
    "ubicacion_id" UUID,
    "tipo_corriente" "tipo_corriente" NOT NULL DEFAULT 'ninguna',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "descontinuado" BOOLEAN NOT NULL DEFAULT false,
    "enlace_publico" VARCHAR(500),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promociones" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "titulo" VARCHAR(200) NOT NULL,
    "descripcion" TEXT,
    "imagen_url" VARCHAR(500),
    "fecha_inicio" DATE NOT NULL,
    "fecha_fin" DATE,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "usuario_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promociones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ubicaciones" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "pasillo" VARCHAR(20) NOT NULL,
    "estante" VARCHAR(20) NOT NULL,
    "charola" VARCHAR(20) NOT NULL,
    "cajon" VARCHAR(20) NOT NULL,
    "marca_id" UUID,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "notas" TEXT,

    CONSTRAINT "ubicaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" VARCHAR(120) NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "rol" "rol_usuario" NOT NULL DEFAULT 'operador',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "ultimo_acceso" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ventas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "usuario_id" UUID NOT NULL,
    "total" DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    "observaciones" TEXT,
    "fecha" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ventas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_busquedas_fecha" ON "busquedas_log"("fecha" DESC);

-- CreateIndex
CREATE INDEX "idx_busquedas_termino" ON "busquedas_log"("termino");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_slug_key" ON "categorias"("slug");

-- CreateIndex
CREATE INDEX "idx_categorias_padre" ON "categorias"("categoria_padre_id");

-- CreateIndex
CREATE INDEX "idx_categorias_slug" ON "categorias"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "codigos_producto_codigo_key" ON "codigos_producto"("codigo");

-- CreateIndex
CREATE INDEX "idx_codigos_codigo" ON "codigos_producto"("codigo");

-- CreateIndex
CREATE INDEX "idx_codigos_producto" ON "codigos_producto"("producto_id");

-- CreateIndex
CREATE INDEX "idx_compat_compatible" ON "compatibilidades"("compatible_con_id");

-- CreateIndex
CREATE INDEX "idx_compat_producto" ON "compatibilidades"("producto_id");

-- CreateIndex
CREATE UNIQUE INDEX "compatibilidades_producto_id_compatible_con_id_key" ON "compatibilidades"("producto_id", "compatible_con_id");

-- CreateIndex
CREATE INDEX "idx_contactos_estado" ON "contactos"("estado", "fecha" DESC);

-- CreateIndex
CREATE INDEX "idx_detalle_producto" ON "detalle_ventas"("producto_id");

-- CreateIndex
CREATE INDEX "idx_detalle_venta" ON "detalle_ventas"("venta_id");

-- CreateIndex
CREATE INDEX "idx_diagramas_producto" ON "diagramas_pdf"("producto_id");

-- CreateIndex
CREATE INDEX "idx_eventos_fecha" ON "eventos_producto"("fecha" DESC);

-- CreateIndex
CREATE INDEX "idx_eventos_producto" ON "eventos_producto"("producto_id");

-- CreateIndex
CREATE INDEX "idx_eventos_tipo" ON "eventos_producto"("tipo", "fecha" DESC);

-- CreateIndex
CREATE INDEX "idx_imagenes_producto" ON "imagenes_producto"("producto_id", "orden");

-- CreateIndex
CREATE UNIQUE INDEX "marcas_nombre_key" ON "marcas"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "marcas_slug_key" ON "marcas"("slug");

-- CreateIndex
CREATE INDEX "idx_marcas_slug" ON "marcas"("slug");

-- CreateIndex
CREATE INDEX "idx_mov_fecha" ON "movimientos_inventario"("fecha" DESC);

-- CreateIndex
CREATE INDEX "idx_mov_producto" ON "movimientos_inventario"("producto_id");

-- CreateIndex
CREATE INDEX "idx_noticias_publicada" ON "noticias"("publicada", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_productos_activo" ON "productos"("activo", "descontinuado");

-- CreateIndex
CREATE INDEX "idx_productos_categoria" ON "productos"("categoria_id");

-- CreateIndex
CREATE INDEX "idx_productos_marca" ON "productos"("marca_id");

-- CreateIndex
CREATE INDEX "idx_productos_ubicacion" ON "productos"("ubicacion_id");

-- CreateIndex
CREATE INDEX "idx_promociones_activa" ON "promociones"("activa", "fecha_inicio" DESC);

-- CreateIndex
CREATE INDEX "idx_ubicaciones_marca" ON "ubicaciones"("marca_id");

-- CreateIndex
CREATE UNIQUE INDEX "ubicaciones_pasillo_estante_charola_cajon_key" ON "ubicaciones"("pasillo", "estante", "charola", "cajon");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "idx_usuarios_email" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "idx_usuarios_rol" ON "usuarios"("rol");

-- CreateIndex
CREATE INDEX "idx_ventas_fecha" ON "ventas"("fecha" DESC);

-- CreateIndex
CREATE INDEX "idx_ventas_usuario" ON "ventas"("usuario_id");

-- AddForeignKey
ALTER TABLE "categorias" ADD CONSTRAINT "categorias_categoria_padre_id_fkey" FOREIGN KEY ("categoria_padre_id") REFERENCES "categorias"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "codigos_producto" ADD CONSTRAINT "codigos_producto_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "compatibilidades" ADD CONSTRAINT "compatibilidades_compatible_con_id_fkey" FOREIGN KEY ("compatible_con_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "compatibilidades" ADD CONSTRAINT "compatibilidades_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "detalle_ventas" ADD CONSTRAINT "detalle_ventas_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "detalle_ventas" ADD CONSTRAINT "detalle_ventas_venta_id_fkey" FOREIGN KEY ("venta_id") REFERENCES "ventas"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "diagramas_pdf" ADD CONSTRAINT "diagramas_pdf_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "diagramas_pdf" ADD CONSTRAINT "diagramas_pdf_subido_por_fkey" FOREIGN KEY ("subido_por") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventos_producto" ADD CONSTRAINT "eventos_producto_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "imagenes_producto" ADD CONSTRAINT "imagenes_producto_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "movimientos_inventario" ADD CONSTRAINT "movimientos_inventario_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "movimientos_inventario" ADD CONSTRAINT "movimientos_inventario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "noticias" ADD CONSTRAINT "noticias_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_marca_id_fkey" FOREIGN KEY ("marca_id") REFERENCES "marcas"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_ubicacion_id_fkey" FOREIGN KEY ("ubicacion_id") REFERENCES "ubicaciones"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "promociones" ADD CONSTRAINT "promociones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ubicaciones" ADD CONSTRAINT "ubicaciones_marca_id_fkey" FOREIGN KEY ("marca_id") REFERENCES "marcas"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

