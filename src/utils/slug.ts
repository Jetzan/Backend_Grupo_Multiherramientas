export default function generarSlug(nombre: string) {
  return nombre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
}