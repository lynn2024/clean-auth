const CODE = new Map([
  [0, 'ok'],

  [10000, 'Generic Exception'],
  [10400, 'The request format is incorrect.'],
  [10401, 'The token is invalid or expired.'],
  [10403, 'You do not have permission to access.'],
  [10404, 'Unable to find the requested resource.'],
  [10409, 'The data already exists.'],
  [10500, 'Server Unknown Exception.'],

  [20000, 'User Module Generic Error'],
  [20001, 'The user does not exist or password is incorrect'],
  [20002, 'The system is busy or code is invalid, please try again later'],
  [20003, 'The user is not found'],
  [20004, 'The username already exist'],

  [20005, 'The role is not found'],
  [20006, 'The rolename already exist'],

  [20007, 'The request is failed'],
  [20008, 'Invalid user info'],
  [20009, 'Invalid user token'],

])

export default CODE
