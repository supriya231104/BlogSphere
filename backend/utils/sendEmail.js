import transporter from "../config/nodemailerconfig.js"
import dotenv from 'dotenv'
dotenv.config()
export const sendVerificationMail = async(email,verificationToken)=> {

    try {
        await transporter.sendMail({
            from:process.env.NODEMAILER_USER,
            to:email,
            subject:'Please Verify Your Email - Welcome to Our Blog!',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eeeeee; border-radius: 10px; max-width: 600px; margin: auto;">
                    <h2>Welcome!</h2>
                    <p>Click the button below to verify your email:</p>
                    <a href="${process.env.FRONTEND_URL}/verify-email/${verificationToken}">Verify Email</a>
                    
                </div>
            `

        })
      

        
    } catch (error) {
       
        throw new Error(`Email sending failed with ${error.message}`);
        
    }




}