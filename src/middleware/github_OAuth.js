'use strict';

const superagent = require('superagent');
const User = require('../../models/user');
const users = new User();
require('dotenv').config();

const tokenServerUrl = process.env.TOKEN_SERVER;
const remoteAPI = process.env.REMOTE_API;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const API_SERVER = process.env.API_SERVER;

/**
 * @parm request
 * @param response
 * @param next
 */
module.exports = async function authorize(request, response, next) {

  try {
    let code = request.query.code;
    console.log('(1) CODE:', code);

    let remoteToken = await exchangeCodeForToken(code);
    console.log('(2) ACCESS TOKEN:', remoteToken);

    let remoteUser = await getRemoteUserInfo(remoteToken);
    console.log('(3) GITHUB USER', remoteUser);

    let [user, token] = await getUser(remoteUser);
    request.user = user;
    request.token = token;
    console.log('(4) LOCAL USER', user);

    next();
  } catch (error) { next(`ERROR: ${error.message}`); }

};
/**
 * 
 * @param  code 
 * @return accessToken
 */
async function exchangeCodeForToken(code) {

  let tokenResponse = await superagent.post(tokenServerUrl).send({
    code: code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: API_SERVER,
    grant_type: 'authorization_code',
  });

  let access_token = tokenResponse.body.access_token;

  return access_token;

}
/**
 * 
 * @param token 
 * @return user
 */
async function getRemoteUserInfo(token) {

  let userResponse =
    await superagent.get(remoteAPI)
      .set('user-agent', 'express-app')
      .set('Authorization', `token ${token}`);

  let user = userResponse.body;

  return user;

}
/**
 * 
 * @param  remoteUser 
 * @return [user, token]
 */
async function getUser(remoteUser) {
  let userRecord = {
    username: remoteUser.login,
    password: 'oauthpassword',
  };

  console.log(userRecord);

  let user = await users.save(userRecord);
  let token = users.generateToken(user);

  return [user, token];
}
