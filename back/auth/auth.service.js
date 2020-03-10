config = require('config.json');
var db = require('_helpers/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var Users = db.Users;
const SECRET_KEY = config.secret;
module.exports = {

    createUser,
    loginUser,
    getById

};


async function createUser(datos) {
    const newUser = {
        name: datos.name,
        email: datos.email,
        password: bcrypt.hashSync(datos.password)
    }

    const user = new Users(newUser);
    let data = {};
    try {
        await user.save();
        const expiresIn = 24 * 60 * 60;
        const accessToken = jwt.sign({
                id: user.id
            },
            SECRET_KEY, {
                expiresIn: expiresIn
            });
        const dataUser = {
            name: user.name,
            email: user.email,
            accessToken: accessToken,
            expiresIn: expiresIn
        }
        // response 

        data = {
            ...dataUser
        };

        return data;

    } catch (err) {
        throw (err);
    }

    // await user.save((err, user) => {
    //     if (err) {
    //         if (err.code === 11000) throw ('este email ya existe ');
    //     }
    //     if (err) throw (err);
    //     const expiresIn = 24 * 60 * 60;
    //     const accessToken = jwt.sign({
    //             id: user.id
    //         },
    //         SECRET_KEY, {
    //             expiresIn: expiresIn
    //         });
    //     const dataUser = {
    //         name: user.name,
    //         email: user.email,
    //         accessToken: accessToken,
    //         expiresIn: expiresIn
    //     }
    //     // response 

    //     data = {
    //         ...dataUser
    //     };

    // })
    // return data;
}

async function loginUser(datos) {
    const userData = {
        email: datos.email,
        password: datos.password
    }

    let data = {};
    const user = await Users.findOne({
        email: userData.email
    });

    if (!user) {
        // email does not exist
        throw ('este email no existe');

    } else {
        const resultPassword = bcrypt.compareSync(userData.password, user.password);
        console.log(userData, resultPassword);
        if (resultPassword) {
            const expiresIn = 24 * 60 * 60;
            const accessToken = jwt.sign({
                id: user.id
            }, SECRET_KEY, {
                expiresIn: expiresIn
            });

            const dataUser = {
                name: user.name,
                email: user.email,
                accessToken: accessToken,
                expiresIn: expiresIn
            }
            data = {
                ...dataUser
            };

        } else {
            // password wrong
            throw ('contraseña es incorrecta');

        }

    }
    return data;
}

async function getById(userId) {
    return await Users.findOne({
        _id: userId
    });
}