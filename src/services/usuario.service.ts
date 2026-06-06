import { rol_usuario } from "../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"
import bcrypt from "bcrypt";

interface CreateUserInterface {
    nombre: string,
    email: string,
    password_hash: string,
    rol: rol_usuario,
}
async function buscarPorCorreo(correo: string) {
    const usuario = await prisma.usuarios.findFirst({ where: { email: correo } });
    return usuario;
}


export async function registrarUsuario(user: CreateUserInterface) {

    const data = {
        ...user,
        password_hash: await bcrypt.hash(user.password_hash, 12)
    }

    if (await buscarPorCorreo(user.email)) {
        const error = new Error("El correo ya existe");
        (error as any).statusCode = 409;
        (error as any).codigo = "EMAIL_EXISTE";

        throw error;
    }




    const result = await prisma.usuarios.create({
        data
    });
    return result;
}

interface LoginUserInterface {
    correo: string,
    password: string
}


export async function iniciarSesion(user: LoginUserInterface) {
    const data = await buscarPorCorreo(user.correo);

    if (!data) {
        const error = new Error("El correo no existe");
        (error as any).statusCode = 404;
        (error as any).codigo = "EMAIL_NO_EXISTE";
        throw error;
    }

    if (!await bcrypt.compare(user.password, data.password_hash)) {
        const error = new Error("Contraseña incorrecta");
        (error as any).statusCode = 401;
        (error as any).codigo = "CONTRASEÑA_INCORRECTA";
        throw error;
    }

    return {
        id: data.id,
        email: data.email,
        rol: data.rol
    }

}

export async function recuperarPassword(correo: string) {
    const data = await buscarPorCorreo(correo);

    if (!data) {
        const error = new Error("El correo no existe");
        (error as any).statusCode = 404;
        (error as any).codigo = "EMAIL_NO_EXISTE";
        throw error;
    }


    return data;

}




interface IUsuarioChangePassword{
    correo:string,
    password:string
}


export async function cambiarPassword(user: IUsuarioChangePassword){

    const data = await buscarPorCorreo(user.correo);

    if (!data) {
        const error = new Error("El correo no existe");
        (error as any).statusCode = 404;
        (error as any).codigo = "EMAIL_NO_EXISTE";
        throw error;
    }
    const result = await prisma.usuarios.update({
        where: {email:user.correo},
        data:{password_hash :await bcrypt.hash(user.password, 12) }
    })   
}