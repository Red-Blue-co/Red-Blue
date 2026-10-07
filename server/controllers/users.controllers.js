const { ApplicationError, ApplicationSuccess, MySQLDB_Helper, logMessage, NE_EmailHelper } = require('sv-nex');
const { generateOTP, generateOtpValues } = require('../helper/everywherefunction')

const login_Controller = async (req, res, next) => {
    try {
        const { userName, pass } = req.body;
        if (!userName || !pass) {
            throw new ApplicationError("Please enter your username and password.")
        }else{
        const sql = `   SELECT userId, userMail, userName, isActive, isDelete, createdAt
                        FROM users 
                        WHERE userName = ? 
                        AND pass = ?`;
        const result = await MySQLDB_Helper.executeQuery(sql, [userName, pass]);
        if (result.length === 0) {
            throw new ApplicationError("That username and password don't match. Please try again.")
        } else if (result[0].isActive === 1) {
            res.json(ApplicationSuccess.getSuccessObject(result, "Welcome back!"));
        } else if (result[0].isDelete === 1) {
            throw new ApplicationError("This account has been switched off. Please contact us to turn it back on.")
        } else {
            throw new ApplicationError("Your account isn't verified yet. Enter the code we emailed you to finish signing up.")

        }}
    }
    catch (err) {
        throw err
    }
};


const createUser_controller = async (req, res, next) => {
    try {
        let { userName, userMail, pass } = req.body;
        if (!userName || !userMail || !pass) {
            throw new ApplicationError("Please fill in your username, email and password.")
        }else{
        let otp, sql, result;

        otp = generateOTP({ type: 'numeric', length: 4, allowRepetition: false })

        const checkSql = `  SELECT userId, userMail, userName, isActive 
                            FROM users 
                            WHERE userMail = ? `
        let mail = await MySQLDB_Helper.executeQuery(checkSql, [userMail])

        if (mail.length === 0) {
            mail.push({ userMail: "", isActive: null })
        }
        if (mail[0].userMail === userMail && mail[0].isActive === 1) {
            throw new ApplicationError("There's already an account with this email. Try signing in instead.")
        } else if (mail[0].isActive === 0) {
            sql = ` UPDATE users 
                    SET otp = ? 
                    WHERE userId = ?`
            result = await MySQLDB_Helper.executeQuery(sql, [otp, mail[0].userId])
            result.insertId = mail[0].userId
        } else {

            sql = ` INSERT INTO users (userName, userMail, pass, otp) 
                    VALUES (?,?,?,?) `
            result = await MySQLDB_Helper.executeQuery(sql, [userName, userMail, pass, otp])
        }
        if (!result) {
            throw new ApplicationError("We couldn't create your account just now. Please try again.");
        } else {
            const valuesObject = generateOtpValues(otp)
            const obj = {
                [userMail]: {
                    userName
                }
            }
            const success = () => {
                const userId = mail[0].userId ?? result.insertId;
                logMessage({level:"INFO", message:` OTP for user ${userId} will expire in 5 minutes.`});

                // This will run only ONCE after a 5-minute delay.
                setTimeout(async () => {
                    try {
                        console.log(`[${new Date().toLocaleTimeString()}] Expiring OTP for user ${userId}.`);
                        const updateSql = `UPDATE users SET otp = NULL WHERE userId = ?`;
                        await MySQLDB_Helper.executeQuery(updateSql, [userId]);
                    } catch (error) {
                        console.error("Failed to expire OTP:", error);
                    }
                }, 300000); // 5 minutes
                res.json(
                    ApplicationSuccess.getSuccessObject(result, "Account created! We've emailed you a 4-digit code.")

                )
            }
            const error = (err) => {
                throw new ApplicationError("We couldn't send the email with your code. Please try again in a moment.", err)
            }


            // No SMTP configured (demo): skip the mail and reply straight away
            const sender = NE_EmailHelper.getEmailSender("test");
            if (!sender) {
                logMessage({ level: "WARNING", message: "Email is not configured, so the OTP mail was not sent." });
                return success();
            }
            await sender.sendEmailToIndividualUsers(
                "login",
                valuesObject,
                obj,
                ["vsherin4@gmail.com"],
                success,
                error
            )
        }}
    } catch (err) {

        throw err
    }

}
const verifyOtp_controller = async (req, res, next) => {
    try {
        const { otp, userId } = req.body
        if (!otp || !userId) {
            throw new ApplicationError("Please enter the 4-digit code from your email.")
        }else{
        const sql = `   SELECT otp 
                        FROM users 
                        WHERE userId = ?`
        const result = await MySQLDB_Helper.executeQuery(sql, [userId])
        if (result[0].otp === otp) {
            const updateSql = ` UPDATE users 
                                SET isActive =? 
                                WHERE userId = ?`;
            await MySQLDB_Helper.executeQuery(updateSql, [true, userId])
            const user = await MySQLDB_Helper.executeQuery(
                `SELECT userId, userMail, userName, createdAt FROM users WHERE userId = ?`, [userId])
            res.json(ApplicationSuccess.getSuccessObject(user, "You're verified. Welcome to Two Tone!"))
        } else {
            throw new ApplicationError("That code isn't right. Check your email and try again.")
        }}
    } catch (err) {
        throw err
    }
}

const forgetPassword_controller = async (req, res, next) => {

    try {
        const { userName } = req.query;
        if (!userName) {
            throw new ApplicationError("Enter your username first, then tap Forgot password.")
        }else{
    
        const sql = `   SELECT pass 
                        FROM users 
                        WHERE userName = ?`;
        const result = await MySQLDB_Helper.executeQuery(sql, [userName]);
        if (result.length === 0) {
            throw new ApplicationError("We couldn't find an account with that username. Want to create one?")

        } else {
            res.json(ApplicationSuccess.getSuccessObject(result[0], "Here's your password."))
        }}
    
    } catch (err) {
        throw err
    }
}

const reSendOtp_controller = async (req, res, next) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            throw new ApplicationError("We couldn't send a new code. Please sign up again.")
        } else {

            const otp = generateOTP({ type: 'numeric', length: 4, allowRepetition: false })
            const sql = `   UPDATE users
                            SET otp = ?
                            WHERE userId = ?`;
            await MySQLDB_Helper.executeQuery(sql, [otp, userId]);
            setTimeout(async () => {
                const updateSql = ` UPDATE users 
                                    SET otp = ? 
                                    WHERE userId = ?`
                await MySQLDB_Helper.executeQuery(updateSql, [0, userId])
                return;
            }, 300000);
            res.json(ApplicationSuccess.getSuccessObject(otp, "Here's your new code. It works for 5 minutes."))
        }
    } catch (err) {
        throw err
    }
}
// Edit profile: change username, email and/or password. Needs the current password.
const updateProfile_controller = async (req, res, next) => {
    const userId = Number(req.body.userId);
    const { currentPass } = req.body;
    const userName = String(req.body.userName || '').trim();
    const userMail = String(req.body.userMail || '').trim();
    const newPass = String(req.body.newPass || '');
    if (!userId || !currentPass) {
        throw new ApplicationError("Enter your current password to save changes.")
    }
    if (!userName || !userMail) {
        throw new ApplicationError("Your username and email can't be empty.")
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userMail)) {
        throw new ApplicationError("That email doesn't look right.")
    }
    if (newPass && newPass.length < 6) {
        throw new ApplicationError("Your new password needs at least 6 characters.")
    }
    const me = await MySQLDB_Helper.executeQuery(`SELECT pass FROM users WHERE userId = ?`, [userId]);
    if (!me.length || me[0].pass !== currentPass) {
        throw new ApplicationError("Your current password isn't right.")
    }
    const taken = await MySQLDB_Helper.executeQuery(
        `SELECT userName, userMail FROM users WHERE userId <> ? AND (userName = ? OR userMail = ?)`, [userId, userName, userMail]);
    if (taken.some((t) => t.userName === userName)) {
        throw new ApplicationError("That username is already taken. Try another one.")
    }
    if (taken.some((t) => t.userMail === userMail)) {
        throw new ApplicationError("There's already an account with that email.")
    }
    await MySQLDB_Helper.executeQuery(
        `UPDATE users SET userName = ?, userMail = ?, pass = ? WHERE userId = ?`,
        [userName, userMail, newPass || currentPass, userId]);
    const user = await MySQLDB_Helper.executeQuery(
        `SELECT userId, userMail, userName, createdAt FROM users WHERE userId = ?`, [userId]);
    res.json(ApplicationSuccess.getSuccessObject(user, newPass ? "Profile and password updated." : "Profile updated."))
}

module.exports = {
    updateProfile_controller,
    login_Controller,
    createUser_controller,
    verifyOtp_controller,
    forgetPassword_controller,
    reSendOtp_controller
}