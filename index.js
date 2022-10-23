
const delay = (delayInms) => {
	return new Promise(resolve => setTimeout(resolve, delayInms));
}

const jid = '1234@s.whatsapp.net'

const {
	default: makeWASocket,
	useSingleFileAuthState,
	DisconnectReason,
	getContentType,
	jidDecode
} = require('@adiwajshing/baileys')
const fs = require('fs')
const P = require('pino')
const qrcode = require('qrcode-terminal')
const util = require('util')
const { state, saveState } = useSingleFileAuthState('./session.json')
const config = require('./config')
const prefix = '/'
const owner = ['94761327688']
const axios = require('axios')
const connectToWA = () => {
	const conn = makeWASocket({
		logger: P({ level: 'silent' }),
		printQRInTerminal: true,
		auth: state,
	})

	conn.ev.on('connection.update', (update) => {
		const { connection, lastDisconnect } = update
		if (connection === 'close') {
			if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
				connectToWA()
			}
		} else if (connection === 'open') {
			console.log('Bot Connected')
		}
	})

	conn.ev.on('creds.update', saveState)

	conn.ev.on('messages.upsert', async (mek) => {
		try {
			mek = mek.messages[0]
			if (!mek.message) return

			mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
			if (mek.key && mek.key.remoteJid === 'status@broadcast') return
			const type = getContentType(mek.message)
			const content = JSON.stringify(mek.message)
			const from = mek.key.remoteJid

			const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
			const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'listResponseMessage') && mek.message.listResponseMessage.singleSelectReply.selectedRowId ? mek.message.listResponseMessage.singleSelectReply.selectedRowId : (type == 'buttonsResponseMessage') && mek.message.buttonsResponseMessage.selectedButtonId ? mek.message.buttonsResponseMessage.selectedButtonId : (type == "templateButtonReplyMessage") && mek.message.templateButtonReplyMessage.selectedId ? mek.message.templateButtonReplyMessage.selectedId : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : ''


			const isCmd = body.startsWith(prefix)
			const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''

			const args = body.trim().split(/ +/).slice(1)
			const q = args.join(' ')
			const isGroup = from.endsWith('@g.us')
			const sender = mek.key.fromMe ? (conn.user.id.split(':')[0] + '@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
			const senderNumber = sender.split('@')[0]
			const botNumber = conn.user.id.split(':')[0]
			const pushname = mek.pushName || 'Sin Nombre'

			const isMe = botNumber.includes(senderNumber)
			const isowner = owner.includes(senderNumber) || isMe

			const reply = (teks) => {
				conn.sendMessage(from, { text: teks }, { quoted: mek })
			}



			if (body === '/ajkdhbvfvhjv') {

				let delayres = await delay(200);

			}

			switch (command) {

				//......................................................Commands..............................................................\\

				case 'start': case 'alive': {

					const startmsg = `🍁𝓦𝓮𝓵𝓬𝓸𝓶𝓮 𝓣𝓸 𝓝𝓪𝓭𝓲𝓽𝓱𝓟𝓻𝓸 🍁

𖣔 ඔබව අපගේ Automated සිස්ටම් එකට 😎 සාදරයෙන් පිළිගන්නව.

𖣔 NadithPro මගින් මාගේ පෞද්ගලික තොරතුරු ලබා ගැනීමේ හැකියාව ඇත.

𖣔 TV Zone මගින් ඔබට TV Zone හි සේවාවන් ලබා ගැනීමට හැකියාව ඇත.

𖣔 ඔබට අවශ්‍ය සෑම විටම *'/start'* මගින් මෙම මෙනුවට පිවිසීමට හැකියාව ඇත.

🍁 Thank You 🍁
`

					const templateButtons = [
						{ urlButton: { displayText: config.URL_WEBSITE, url: config.URL_WEBLINK } },
						{ urlButton: { displayText: config.URL_YOUTUBE, url: config.URL_YTLINK } },
						{ quickReplyButton: { displayText: 'NadithPro', id: prefix + 'nadithpro' } },
						{ quickReplyButton: { displayText: 'TV Zone', id: prefix + 'tvzone' } }
					]
					const buttonMessage = {
						caption: startmsg,
						footer: config.FOOTER,
						templateButtons: templateButtons,
						image: { url: config.WELCOME_LOGO }
					}
					await conn.sendMessage(from, buttonMessage)
				}
					break

				case 'away': {

					const awaymsg = `𖣔 Hiii, I'm Nadiith Dhanula @nadithpro. Thank You! for contacting Me.
			
𖣔 I'm unavailable right now, but will respond as soon as possible.

𖣔 If you wanna go through our automated system 😎, Use the *'Start'* down below.

< ඔබට අපගේ Automated සිස්ටම් එකට 😎 පිවිසීමට අවශ්‍ය නම්, පහළ *'Start'* භාවිත කරන්න. >

🍁 Thank You 🍁
`

					const templateButtons = [
						{ quickReplyButton: { displayText: 'Start', id: prefix + 'start' } }
					]
					const buttonMessage = {
						caption: awaymsg,
						footer: config.FOOTER,
						templateButtons: templateButtons,
						image: { url: config.MY_LOGO }
					}
					await conn.sendMessage(from, buttonMessage)
				}
					break

				//......................................................NadithPro..............................................................\\	

				case 'pro': case 'nadithpro': {

					const startmsg = `*🍁𝓦𝓮𝓵𝓬𝓸𝓶𝓮 𝓣𝓸 𝓝𝓪𝓭𝓲𝓽𝓱𝓟𝓻𝓸 𝓑𝓸𝓽 🍁*

🔰 NadithPro මෙනුව ලබා ගැනීමට *'Menu'* බටන් එක භාවිත කරන්න.

🔰 ප්‍රධාන මෙනුව ලබා ගැනීමට *'Start'* බටන් එක භාවිත කරන්න.
				
 𖣔 Thank You 𖣔
 ━━━━━━━━━━`

					const templateButtons = [
						{ urlButton: { displayText: config.URL_WEBSITE, url: config.URL_WEBLINK } },
						{ urlButton: { displayText: config.URL_YOUTUBE, url: config.URL_YTLINK } },
						{ quickReplyButton: { displayText: 'Start', id: prefix + 'start' } },
						{ quickReplyButton: { displayText: 'Menu', id: prefix + 'promenu' } }
					]
					const buttonMessage = {
						caption: startmsg,
						footer: config.FOOTER,
						templateButtons: templateButtons,
						image: { url: config.PRO_LOGO }
					}
					await conn.sendMessage(from, buttonMessage)
				}
					break

				case 'promenu': {

					const startmsg = `*🍁 𝙽𝚊𝚍𝚒𝚝𝚑𝙿𝚛𝚘 𝙱𝚘𝚝 𝙼𝚎𝚗𝚞 🍁*
	
🔰 Social Media සදහා *'Social Media'* බටන් එක භාවිත කරන්න.
`

					const templateButtons = [
						{ urlButton: { displayText: config.URL_WEBSITE, url: config.URL_WEBLINK } },
						{ quickReplyButton: { displayText: 'Back', id: prefix + 'nadithpro' } },
						{ quickReplyButton: { displayText: 'Social Media', id: prefix + 'socialmedia' } }
					]
					const buttonMessage = {
						caption: startmsg,
						footer: config.FOOTER,
						templateButtons: templateButtons,
						image: { url: config.PRO_LOGO }
					}
					await conn.sendMessage(from, buttonMessage)
				}
					break

				case 'socialmedia': {

					const startmsg = `*🍁 𝙽𝚊𝚍𝚒𝚝𝚑𝙿𝚛𝚘 𝚂𝚘𝚌𝚒𝚊𝚕 𝙼𝚎𝚍𝚒𝚊 🍁*

۞ 🄸🄽🅂🅃🄰🄶🅁🄰🄼  》
𓃰 https://insta.nadith.pro
												
۞ 🄵🄰🄲🄴🄱🄾🄾🄺  》
𓃰 https://fb.nadith.pro
												
۞ 🅃🄴🄻🄴🄶🅁🄰🄼  》
𓃰 https://tg.nadith.pro
												
۞ 🅆🄷🄰🅃🅂🄰🄿🄿  》
𓃰 https://wa.nadith.pro
												
۞ 🅂🄿🄾🅃🄸🄵🅈  》
𓃰 https://spotify.nadith.pro
`

					const templateButtons = [
						{ urlButton: { displayText: config.URL_GITHUB, url: config.URL_GITHUB } },
						{ urlButton: { displayText: config.URL_WEBSITE, url: config.URL_WEBLINK } },
						{ urlButton: { displayText: config.URL_YOUTUBE, url: config.URL_YTLINK } },
						{ quickReplyButton: { displayText: 'Back', id: prefix + 'promenu' } },
						{ quickReplyButton: { displayText: 'Home', id: prefix + 'nadithpro' } }
					]
					const buttonMessage = {
						caption: startmsg,
						footer: config.FOOTER,
						templateButtons: templateButtons,
						image: { url: config.MY_LOGO }
					}
					await conn.sendMessage(from, buttonMessage)
				}
					break

				//.......................................................TV Zone...............................................................\\

				case 'tvzone': {

					const startmsg = `🍁𝕎𝕖𝕝𝕔𝕠𝕞𝕖 𝕋𝕠 𝕋𝕍 ℤ𝕠𝕟𝕖 𝔹𝕠𝕥🍁

🔰 TV Zone මෙනුව ලබා ගැනීමට *'Menu'* බටන් එක භාවිත කරන්න.

🔰 ප්‍රධාන මෙනුව ලබා ගැනීමට *'Start'* බටන් එක භාවිත කරන්න.
				
 𖣔 Thank You 𖣔
 ━━━━━━━━━━`

					const templateButtons = [
						{ urlButton: { displayText: config.URL_WEBSITE, url: config.URL_WEBLINK } },
						{ urlButton: { displayText: config.URL_YOUTUBE, url: config.URL_YTLINK } },
						{ quickReplyButton: { displayText: 'Start', id: prefix + 'start' } },
						{ quickReplyButton: { displayText: 'Menu', id: prefix + 'tvmenu' } }
						
					]
					const buttonMessage = {
						caption: startmsg,
						footer: config.TVFOOTER,
						templateButtons: templateButtons,
						image: { url: config.TV_LOGO }
					}
					await conn.sendMessage(from, buttonMessage)
				}
					break

				case 'tvmenu': {

					const sections = [
						{
							title: "🍁 𝕋𝕍 ℤ𝕠𝕟𝕖 𝔹𝕠𝕥 𝕄𝕖𝕟𝕦 🍁",
							rows: [
								{ title: "TV Zone ගැන අදහසක් ගන්න", rowId: prefix + 'tvabout', description: config.TVFOOTER },
								{ title: "TV Zone සියලුම Group වල Links ලබා ගන්න", rowId: "tvlinks", description: config.TVFOOTER }
							]
						}
					]
					const listMessage = {
						text: "\n𖣔 TV Zone මෙනුව වෙත සාදරයෙන් පිළිගන්නව. \n\n𖣔 TV Zone මෙනුවට පිවිසීමට පහළ *'View Menu'* භාවිත කරන්න.\n",
						footer: config.TVFOOTER,
						title: "🍁 𝕋𝕍 ℤ𝕠𝕟𝕖 𝔹𝕠𝕥 𝕄𝕖𝕟𝕦 🍁",
						buttonText: "View Menu",
						sections
					}
					await conn.sendMessage(from, listMessage)
				}
					break

				case 'ggggtvabout': {

					const startmsg = `🍁𝕎𝕖𝕝𝕔𝕠𝕞𝕖 𝕋𝕠 𝕋𝕍 ℤ𝕠𝕟𝕖 𝔹𝕠𝕥🍁

about eka`

					const templateButtons = [
						{ urlButton: { displayText: config.URL_TVWEBSITE, url: config.URL_TVWEBLINK } },
						{ urlButton: { displayText: config.URL_YOUTUBE, url: config.URL_YTLINK } },
						{ quickReplyButton: { displayText: 'Menu', id: prefix + 'tvmenu' } },
						{ quickReplyButton: { displayText: 'NadithPro', id: prefix + 'nadithpro' } }
					]
					const buttonMessage = {
						caption: startmsg,
						footer: config.TVFOOTER,
						templateButtons: templateButtons,
						image: { url: config.TV_LOGO }
					}
					await conn.sendMessage(from, buttonMessage)
				}
					break


				default:

					if (isowner && body.startsWith('>')) {
						try {
							await reply(util.format(await eval(`(async () => {${body.slice(1)}})()`)))
						} catch (e) {
							await reply(util.format(e))
						}
					}

			}


		} catch (e) {
			const isError = String(e)

			console.log(isError)
		}
	})
}

connectToWA()
