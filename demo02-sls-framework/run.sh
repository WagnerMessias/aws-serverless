# install
npm i -g serverless

#serverless inicializar
sls

#sempre fazer o deploy para verificar se está tudo ok
sls deploy

#invocar na AWS
sls invoke -f hello

#invocar local
sls invoke local -f hello -l

#logs
sls logs -f hello -t ou --tail

#remover  
sls remove


