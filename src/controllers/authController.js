const nodemailer = require('nodemailer');
const User = require('../models/User'); // Импортируйте модель User
const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');
require('dotenv').config(); // Импортируйте dotenv для работы с переменными окружения

// Настройки почтового сервиса
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL, // Используйте переменные окружения
        pass: process.env.PASSWORD, // Используйте переменные окружения
    },
});

// Отправка MFA кода
const sendMfaCode = async (user) => {
    const code = speakeasy.totp({
        secret: user.mfaSecret,
        encoding: 'base32'
    });

    const mailOptions = {
        from: process.env.EMAIL, // Используйте переменные окружения
        to: user.email,
        subject: 'Ваш код MFA',
        text: `Ваш код MFA: ${code}`
    };

    await transporter.sendMail(mailOptions);
};

// Функция для проверки, что email имеет допустимый домен
const isValidEmailDomain = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|mail\.ru)$/; // Проверка на домены gmail.com и mail.ru
    return regex.test(email);
};

// Регистрация пользователя
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    // Проверка на допустимость домена электронной почты
    if (!isValidEmailDomain(email)) {
        return res.status(400).json({ message: 'Электронная почта должна быть с доменами @gmail.com или @mail.ru' });
    }

    try {
        const emailCheck = await exports.checkEmail(req, res);
        if (emailCheck.statusCode !== 200) {
            return res.status(emailCheck.statusCode).json(emailCheck.data);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser  = new User({
            username,
            email,
            password: hashedPassword,
            mfaSecret: speakeasy.generateSecret().base32
        });
        await newUser .save();

        const confirmationLink = `http://your-frontend.com/confirm-email?token=${newUser ._id}`;
        
        const mailOptions = {
            from: process.env.EMAIL, // Используйте переменные окружения
            to: email,
            subject: 'Подтверждение регистрации',
            text: `Пожалуйста, подтвердите вашу регистрацию, перейдя по следующей ссылке: ${confirmationLink}`,
        };

        await transporter.sendMail(mailOptions);
        
        res.status(201).json({ message: 'Пользователь успешно зарегистрирован! Письмо для подтверждения отправлено.' });
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        res.status(500).json({ message: 'Неизвестная ошибка при регистрации' });
    }
};

// Проверка наличия email
exports.checkEmail = async (req, res) => {
    const { email } = req.body;

    // Проверка наличия email в запросе
    if (!email) {
        return res.status(400).json({ message: 'Email не указан.' });
    }

    try {
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: 'Электронная почта уже используется' });
        }
        return { statusCode: 200, data: { exists: false } };
    } catch (error) {
        console.error('Ошибка проверки email:', error);
        res.status(500).json({ message: 'Неизвестная ошибка при проверке email' });
    }
};

// Подтверждение email
exports.verifyEmail = async (req, res) => {
    const { token } = req.body;

    try {
        const user = await User.findById(token);
        if (!user) {
            return res.status(400).json({ message: 'Неверный токен' });
        }

        user.isEmailVerified = true;
        await user.save();

        res.send('Email успешно подтвержден');
    } catch (error) {
        console.error('Ошибка подтверждения email:', error);
        res.status(500).json({ message: 'Неизвестная ошибка при подтверждении email' });
    }
};

// Вход пользователя
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Пользователь не найден');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send('Неверный пароль');
        }

        await sendMfaCode(user); // Отправка кода MFA
        
        // Отправьте ответ с сообщением, что код был отправлен
        res.status(200).json({ message: 'Авторизация успешна. MFA код был отправлен на вашу почту.', userId: user._id });
    } catch (error) {
        console.error('Ошибка при входе:', error);
        res.status(500).json({ message: 'Неизвестная ошибка при входе' });
    }
};

// Верификация кода MFA
exports.verifyMfa = async (req, res) => {
    const { userId, userInputCode } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).send('Пользователь не найден');
        }

        const valid = speakeasy.totp.verify({
            secret: user.mfaSecret,
            encoding: 'base32',
            token: userInputCode,
            window: 1 // Допустимое количество временных окон
        });

        if (!valid) {
            return res.status(400).send('Неверный код MFA');
        }

        // Генерация JWT или выполнение других действий после успешной верификации
        const token = await user.generateAuthToken();
        res.status(200).json({ message: 'MFA код верный', token });
    } catch (error) {
        console.error('Ошибка верификации MFA:', error);
        res.status(500).json({ message: 'Неизвестная ошибка при верификации MFA' });
    }
};

