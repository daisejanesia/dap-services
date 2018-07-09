const program = require('commander');
const jwt = require('jsonwebtoken');

program
  .version('0.0.1')
  .option(
    '-O, --organization [organization]',
    'Choose Organization',
    '02cc1aa2-de46-4a8d-8fe4-572e65528ba7'
  )
  .option('-I, --iss', 'issuer [issuer]', 'web-development')
  .option('-A, --actor [actor]', 'actor', 1)
  .option('-E, --email [email]', 'email', 'jane.doe@traxtech.com')
  .option('-N, --name [name]', 'name', 'Jane Doe')
  .option('-C, --context [context]', 'context', 'client-site')
  .parse(process.argv);

const payload = {
  iss: program.issuer,
  actor: program.actor,
  email: program.email,
  name: program.name,
  context: program.context,
  organization: program.organization
};

console.log(
  jwt.sign(payload, 'secret', {
    issuer: 'client_site',
    expiresIn: 60 * 60 * 24 * 5
  })
);
