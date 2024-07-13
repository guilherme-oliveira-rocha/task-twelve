const Imap = require('node-imap');
const { simpleParser } = require('mailparser');
const fs = require('fs');

const imap = new Imap({
  user: 'guilherme.dev12@gmail.com',
  password: 'ejuj hvbb ymlr cfor',
  host: "imap.gmail.com", // This may differ if you are using some other mail services like yahoo
  port: 993,
  tls: true,
});

let emailData = [];

function openInbox(cb) {
  imap.openBox('INBOX', true, cb);
}

imap.once('ready', function() {
  openInbox(function(err, box) {
    if (err) throw err;

    // Searching for emails from a specific sender
    imap.search(['ALL', ['FROM', 'ablak@usetwelve.com']], function(err, results) {
      if (err) throw err;

      if (results.length === 0) {
        console.log('No emails found.');
        imap.end();
        return;
      }

      const fetch = imap.fetch(results, { bodies: '' });

      fetch.on('message', function(msg, seqno) {
        let email = { seqno: seqno, body: { name: String, amount: Number, comment: String } };
        let buffer = '';

        msg.on('body', function(stream, info) {
          stream.on('data', function(chunk) {
            buffer += chunk.toString('utf8');
          });

          stream.once('end', async function() {
            console.log(`Message #${seqno} body collected: ${buffer.length} characters`);
          });
        });

        msg.once('attributes', function(attrs) {
          // email.attributes = attrs;
        });

        msg.once('end', async function() {
          try {
            console.log(`Processing message #${seqno}`);
            if (buffer.length > 0) {
              const parsed = (await simpleParser(buffer)).text;

              const arrHtmlBodyEmail = parsed.split(/\n/);
              const arrEspecificMsg = [];

              let comment = "";

              arrHtmlBodyEmail.forEach((info, index) => {
                if (info.includes('sent')) {
                  arrEspecificMsg.push(info);
                  comment = arrHtmlBodyEmail[index + 1];
                }
              });

              const getLastEspecificfMsg = arrEspecificMsg.at(-1);
              const arrGetLastEspecificMsg = getLastEspecificfMsg.split(/[\s$]+/);

              const name = arrGetLastEspecificMsg[0] + " " + arrGetLastEspecificMsg[1];
              const amount = parseFloat(arrGetLastEspecificMsg.at(-1));
              email.body = { name: name, amount: amount, comment: comment };

              emailData.push(email);
            } else {
              console.log(`Message #${seqno} buffer is empty`);
            }

            if (emailData.length === results.length) {
              exportEmailData(emailData);
            }
          } catch (err) {
            console.error('Error parsing email:', err);
          }
        });
      });

      fetch.once('error', function(err) {
        console.log('Search error: ' + err);
      });

      fetch.once('end', function() {
        console.log('End of search.');
        imap.end();
      });
    });
  });
});

imap.once('error', function(err) {
  console.log(err);
});

imap.once('end', function() {
  console.log('Connection closed.');
});

imap.connect();

function exportEmailData(data) {
  fs.writeFileSync('emailData.json', JSON.stringify(data, null, 2), 'utf8');
  console.log('Email data has been exported to emailData.json');
}

module.exports = {
  getEmailData: () => emailData
};
