#!/bin/bash
#!/usr/bin/expect


echo $NOME_CSA
echo $RESPONSAVEL_CSA
echo $EMAIL
echo $NOME_CSA_STRIPED


git checkout -b main
heroku login
expect "heroku: Press any key to open up the browser to login or q to exit:"
send "world"
send "worlasdasd"
heroku create "${NOME_CSA_STRIPED}-agromart"
heroku git:remote -a "${NOME_CSA_STRIPED}-agromart"
heroku addons:create heroku-postgresql:mini -a "${NOME_CSA_STRIPED}-agromart"
heroku config:set ADMIN_JWT_SECRET=ADMIN_JWT_SECRET
heroku config:set BUCKET_NAME=agromart-fga
heroku config:set EXPO_ACCESS_TOKEN=K1Y7cWKpo2Q6pugNGZLaNakDjT6QJUVfzgOds3WT
heroku config:set JWT_SECRET=2fab93bc23357e25de5cdb159d6353cd
heroku config:set SERVICE_ACCOUNT_KEY_URL='https://firebasestorage.googleapis.com/v0/b/agromart-fga.appspot.com/o/agromart-fga-firebase-adminsdk-85mwf-7287dc44b9.json?alt=media&token=f3b1682d-ecc4-484d-83c2-bd355bca6ed2'
heroku config:set STORAGE_BUCKET_URL=agromart-fga.appspot.com
git push heroku HEAD:main

curl --location --request POST 'https://api-dicionario.herokuapp.com/csa' \
--header 'Content-Type: application/json' \
--data-raw '{
    "urlBase":"'"https://${NOME_CSA_STRIPED}-agromart.herokuapp.com"'",
    "nomeCSA": "'"$NOME_CSA"'",
    "responsavelCSA":"'"$RESPONSAVEL_CSA"'",
    "emailCSA":"'"$EMAIL"'"
    }'