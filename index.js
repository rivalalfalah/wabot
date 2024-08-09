const {
  makeWASocket,
  useMultiFileAuthState,
} = require("@whiskeysockets/baileys");
const pino = require("pino");

async function ConnectToWhatsApp(params) {
  const authState = await useMultiFileAuthState("session");
  const socket = await makeWASocket({
    printQRInTerminal: true,
    browser: ["ubuntu", "firefox", "10"],
    auth: authState.state,
    logger: pino(),
  });

  socket.ev.on("creds.update", authState.saveCreds);
  socket.ev.on("connection.update", ({ connection, qr }) => {
    if (connection == "open") {
      console.log("koneksi aktif ...");
    } else if (connection == "close") {
      console.log("koneksi close ...");
      ConnectToWhatsApp();
    } else if (connection == "connecting") {
      console.log("whatsaap sedang menghubungkan ...");
    }
  });

  socket.ev.on("messages.upsert", async (m) => {
    console.log(JSON.stringify(m));

    console.log("replying to", m.messages[0].key.remoteJid);
    if (!m.messages[0].key.fromMe) {
      if (m.messages[0].message.conversation === "produk") {
        await socket.sendMessage(m.messages[0].key.remoteJid, {
          text: "ini adalah produk kita",
        });
      }
      else{
        await socket.sendMessage(m.messages[0].key.remoteJid, {
            text: "Hallo semua",
          });
      }
    }
  });
}

ConnectToWhatsApp();
