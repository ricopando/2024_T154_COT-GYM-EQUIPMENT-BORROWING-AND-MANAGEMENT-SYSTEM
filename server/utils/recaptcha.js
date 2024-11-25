import axios from 'axios';

export const verifyRecaptcha = async (recaptchaToken) => {
    try {
        const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
            params: {
                secret: process.env.RECAPTCHA_SECRET_KEY, // Secret key from your Google reCAPTCHA setup
                response: recaptchaToken,
            },
        });

        console.log('Google reCAPTCHA verification response:', response.data);
        return response.data.success;
    } catch (error) {
        console.error("reCAPTCHA verification failed", error);
        return false;
    }
};