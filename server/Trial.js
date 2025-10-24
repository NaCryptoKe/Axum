const User = require('./models/userModel');

(async () => {
  try {
    const users = await User.createUser({
  username: 'nahomA',
  email: 'nAahom@example.com',
   display_name: 'NAHOM',
   password: 'supersecurepassword',
   avatar_url: '/avatars/nahom.png',
   bio: 'I make games.'
 });
    console.log(users);
  } catch (err) {
    console.error('Error fetching users:', err);
  }
  return;
})();
