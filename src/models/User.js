const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Определение схемы пользователя
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // Имя пользователя
    email: { type: String, required: true, unique: true }, // Электронная почта
    password: { type: String, required: true }, // Хранение хэшированного пароля
    isEmailVerified: { type: Boolean, default: false }, // Поле для подтверждения email
    mfaSecret: { type: String }, // Для хранения секретного ключа MFA
    isMfaEnabled: { type: Boolean, default: false }, // Для отслеживания, включена ли MFA
});

// Метод для хеширования пароля перед сохранением
UserSchema.pre('save', async function(next) {
    try {
        if (this.isModified('password')) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
        next();
    } catch (error) {
        next(error); // Передача ошибки в следующий middleware
    }
});

// Метод для сравнения пароля
UserSchema.methods.comparePassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error('Ошибка при сравнении паролей');
    }
};

// Метод для генерации токена
UserSchema.methods.generateAuthToken = async function() {
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
        throw new Error('Отсутствует секретный ключ для генерации токена');
    }
    const token = jwt.sign({ id: this._id }, secretKey, { expiresIn: '1h' });
    return token;
};

// Функция для регистрации пользователя
const registerUser  = async (username, email, password) => {
    const existingUser  = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser ) {
        throw new Error('Пользователь с таким именем или электронной почтой уже существует');
    }

    const newUser  = new User({ username, email, password });
    await newUser .save();
};

// Экспорт модели пользователя и функции регистрации
module.exports = {
    User: mongoose.model('User ', UserSchema),
    registerUser ,
};
