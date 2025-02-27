const forgotPasswordTemplate=({name,otp})=>{
    return `
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f9f9f9; padding: 20px;">
        <tr>
            <td align="center">
                <table width="400px" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px; overflow: hidden;">
                    <tr>
                        <td style="padding: 20px; text-align: center; font-size: 18px; font-weight: bold; background-color: #007BFF; color: #ffffff;">
                            Your OTP Code
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px; text-align: center; font-size: 16px; color: #333333;">
                            <p>Hello,${name}</p>
                            <p>Your OTP for resetting your password is:</p>
                            <p style="font-size: 24px; font-weight: bold; color: #007BFF;">[${otp}]</p>
                            <p>Please use this code within 1 hour. If you did not request this, you can ignore this email.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 15px; text-align: center; font-size: 12px; color: #999999; background-color: #f9f9f9;">
                            <p>&copy; 2024 grocery.com</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
    `
}

export default forgotPasswordTemplate