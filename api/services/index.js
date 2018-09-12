import authentication from './authentication';
import custom from './custom';
import users from './users';
import messages from './messages';
import exercises from './exercises';
import aircraft from './aircraft';
import frequencies from './frequencies';

export default function services(app) {
  app.configure(authentication);
  app.configure(custom);
  app.configure(users);
  app.configure(messages);
  app.configure(exercises);
  app.configure(aircraft);
  app.configure(frequencies);
}
