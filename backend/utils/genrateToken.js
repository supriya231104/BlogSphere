import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()


function genrateJwtToken(payload) {
   
   return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" })
}
function verifyJwtToken(token) {

  
   try {
      
      
      let obj= jwt.verify(token,process.env.JWT_SECRET )
   
      return obj
   } catch (error) {
      
     return null
   }
}
export { genrateJwtToken, verifyJwtToken }