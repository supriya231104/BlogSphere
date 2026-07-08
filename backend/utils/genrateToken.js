import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()


function genrateJwtToken(payload) {
   
   return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" })
}
function verifyJwtToken(token) {

  
   try {
      
      
      let obj= jwt.verify(token,process.env.JWT_SECRET )
      // console.log("hello ji",obj);
      return obj
   } catch (error) {
      // console.log("JWT VERIFY ERROR:", error.message)
     return null
   }
}
export { genrateJwtToken, verifyJwtToken }