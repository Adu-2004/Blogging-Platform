/*import jwt from 'jsonwebtoken';

const auth = (roles = []) => {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Access denied' });
            }

            next();
        } catch (err) {
            res.status(401).json({ message: 'Token is not valid' });
        }
    };
};
export default auth; 
*/
////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// 
/*
const auth = (req,res,next) => {
   
    try {
       const token = req.headers.authorization;
        jwt.verify(token, process.env.JWT_SECRET)
        next();
    }catch(error) {
        res.json({success: false, message: "Invalid token"})
    }
   
}
export const checkAdmin = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, secretKey);
  if (!decoded.isAdmin) return res.status(403).json({ message: 'Access denied' });
  next();
};

export default auth;
*/

/*
import jwt from 'jsonwebtoken';
const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
  try {
    

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided, authorization denied' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();

  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

export default auth;
*/
/*
 const auth = async(req,res,next) => {
  try{
    const token = req.headers.authorization;
    if(!token){
      return res.status(401).json({message:"User not ", success: false})
    }
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  if(!decoded){
    return res.status(401).json({
      message:"Invalid token",success:false
    })
  }
  req.id = decoded.userId;
  next();
}catch(error){
  console.log(error);
}
}
export default auth;
*/


// Authentication middleware
/*
const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
    if (!token) {
      return res.status(401).json({ success: false, message: "Token missing" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// Admin check middleware
export const checkAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  if (!req.user.isAdmin) {
    return res.status(403).json({ success: false, message: "Access denied: not admin" });
  }
  next();
};

export default auth;
*/
///this is correct code so All it work correctly  //////////////////////////////////////////////////////////////////////////

import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
    if (!token) {
      return res.status(401).json({ success: false, message: "Token missing" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const checkAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: "Access denied: not admin" });
  }
  next();
};

export default auth;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

