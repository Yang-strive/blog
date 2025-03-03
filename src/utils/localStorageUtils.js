
export function setToken(token){
  console.log("存储token...",token);
  return localStorage.setItem("token",token)
}

export function getToken(){
  console.log("获取token...");
  return localStorage.getItem("token")
}

export function removeToken(){
  return localStorage.removeItem("token")
}


export function setUser(user){
  return localStorage.setItem("user",JSON.stringify(user))
}

export function getUser(){
  let userJSONStr = localStorage.getItem("user");
  return userJSONStr ? JSON.parse(userJSONStr) : null;
}

export function removeUser(){
  return localStorage.removeItem("user")
}