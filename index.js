const fs = require('fs');
const https = require('https');
const { URL } = require('url');

function loadEnv() {
  if (fs.existsSync('.env')) {
    const env = fs.readFileSync('.env', 'utf8');
    env.split(/\r?\n/).forEach(line => {
      const match = line.match(/^([^=#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const val = match[2].trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    });
  }
}

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const options = new URL(url);
    https.get(options, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve({ raw: data });
        }
      });
    }).on('error', reject);
  });
}

function postJSON(url, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const options = {
      method: 'POST',
      hostname: u.hostname,
      path: u.pathname + u.search,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, res => {
      res.on('data', () => {});
      res.on('end', resolve);
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function connectDiscord() {
  if (!process.env.DISCORD_TOKEN) return;
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'discord.com',
      path: '/api/users/@me',
      method: 'GET',
      headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` }
    };
    const req = https.request(options, res => {
      if (res.statusCode === 200) resolve();
      else reject(new Error(`Discord auth failed: ${res.statusCode}`));
    });
    req.on('error', reject);
    req.end();
  });
}

async function run() {
  loadEnv();

  const {
    DISCORD_TOKEN,
    DISCORD_WEBHOOK_URL,
    SERVER_API,
    INTERVAL_MINUTES
  } = process.env;

  if (!DISCORD_WEBHOOK_URL || !SERVER_API) {
    console.error('Configure DISCORD_WEBHOOK_URL e SERVER_API');
    return;
  }

  try {
    await connectDiscord();
    console.log('Conectado ao Discord');
  } catch (err) {
    console.error('Erro ao conectar ao Discord:', err.message);
  }

  const interval = (parseInt(INTERVAL_MINUTES, 10) || 5) * 60 * 1000;

  async function tick() {
    try {
      const status = await fetchJSON(SERVER_API);
      const content = `Status do servidor: ${JSON.stringify(status)}`;
      await postJSON(DISCORD_WEBHOOK_URL, JSON.stringify({ content }));
      console.log('Enviado:', content);
    } catch (err) {
      console.error('Erro ao enviar webhook:', err.message);
    }
  }

  tick();
  setInterval(tick, interval);
}

run();
