# ENV Variabels

## Features
Here you can disable features of Heckerbot. If you want to disable a feature, set the value to `false`. If you want to enable a feature, set the value to `true`.

| Variable | Description |
| GAMES | Enables or disables the games feature. |
<br>
| INFO | Enables or disables the info feature. |
<br>
| AUDITLOG | Enables or disables the auditlog feature. |
<br>
| BACKUP | Enables or disables the backup feature.|
<br>
| COUNTING | Enables or disables the counting feature. |
<br>
| CUSTOMBOT | Enables or disables the custom bot feature.|
<br>
| PREMIUM | Enables or disables the premium feature.|
<br>
| WELCOME | Enables or disables the welcome feature.|
<br>
| TOOLS | Enables or disables the tools feature.|
<br>
| UTILS | Enables or disables the utils feature.|
<br>

## BOT Login
Here you can set the login data for the bot. You can find the token in the [Discord Developer Portal](https://discord.com/developers/applications).
<br>
You can find the client id in the [Discord Developer Portal](https://discord.com/developers/applications).
Then fill out the CLIENT_TOKEN and CLIENT_ID variables.

## Webhooks
Here we have 2 Webhooks
<br>
ERROR_WEBHOOK: This is the webhook for errors. If an error occurs, it will be sent to this webhook. This is Required.
<br>
LOG_WEBHOOK: This is the webhook for logs. It sends if the Bot starts, Errors in console etc. This is Optional.

## Database
To get your MONFO_URI, go to [MongoDB](https://www.mongodb.com/) and create a new Cluster. Then copy the URI and paste it into the .env file.
<br>
You can find the REDIS_URI in the [Upstash](https://upstash.com/) dashboard. Create a new database and copy the URI and paste it into the .env file.
<br>
REDIS_EXPIRE: This is the expire time for the redis cache. Default is 3600

## API Keys
Here you can set the API Keys for the features. If you don't want to use a feature, you need to disbale the TOOLS feature.

## Cloudflare R2
Our Backup Feature uses Cloudflare R2.
<br>
To get your Cloudflare ACCOUNT_ID, ACCOUNT_KEY_ID, SECRET_ACCESS_KEY
<br>
Watch this YouTube Video [Video](https://www.youtube.com/watch?v=Q6WTwZI9-Ko)
If you don't want to use the Backup Feature, you can disable it.

## Information
The SUPP_INVITE_URl is used to get the Discord Server of the Support Server.
<br>
PORT: This is the port for the Webserver. Default is 3000
<br>
STATS_CHANNEL_ID is the channel where the bot sends the stats every minute. If you don't want to use this feature, just dont fill it out.

WILL BE UPDATED SOON