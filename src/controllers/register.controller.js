import speakeasy from 'speakeasy';
import bcrypt from 'bcrypt';
import User from '../models/User'; // Импорт модели User
import nodemailer from 'nodemailer';

// Настройки почтового сервиса
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ваш_email@gmail.com', // Замените на свой email
        pass: 'ваш_пароль', // Замените на свой пароль
    },
});

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
        await exports.checkEmail(req, res);
        if (res.statusCode !== 200) {
            return res.status(res.statusCode).json(res.data);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const secret = speakeasy.generateSecret({ length: 20 }); // Генерация секретного ключа
        const newUser  = new User({ username, email, password: hashedPassword, mfaSecret: secret.base32, isMfaEnabled: true });
        
        await newUser .save();

        const confirmationLink = `http://your-frontend.com/confirm-email?token=${newUser ._id}`;
        
        const mailOptions = {
            from: 'ваш_email@gmail.com',
            to: email,
            subject: 'Подтверждение регистрации',
            text: `Пожалуйста, подтвердите вашу регистрацию, перейдя по следующей ссылке: ${confirmationLink}`,
        };

        await transporter.sendMail(mailOptions);
        
        res.status(201).json({ message: 'Пользователь успешно зарегистрирован! Письмо для подтверждения отправлено.' });
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        res.status(500).send('Неизвестная ошибка');
    }
};

// Проверка наличия email
exports.checkEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: 'Электронная почта уже используется' });
        }
        res.json({ exists: false });
    } catch (error) {
        console.error('Ошибка проверки email:', error);
        res.status(500).send('Неизвестная ошибка');
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
        res.status(500).json({ message: error.message });
    }
};
