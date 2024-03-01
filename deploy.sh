echo 'Compilando...'
ng build --configuration production
echo 'Compactando arquivos...'
cd dist/solar-monitor-web/browser
tar czf deploy.tgz *
cd ../../../certificate
echo 'Removendo versão anterior...'
ssh -i solar-monitor-api.pem ubuntu@ec2-54-68-63-227.us-west-2.compute.amazonaws.com "sudo rm -r /var/www/public/power.we-rtek.com/*"
echo 'Enviando arquivos...'
scp -i solar-monitor-api.pem ../dist/solar-monitor-web/browser/deploy.tgz ubuntu@ec2-54-68-63-227.us-west-2.compute.amazonaws.com:/var/www/public/power.we-rtek.com
echo 'Descompactando arquivos...'
ssh -i solar-monitor-api.pem ubuntu@ec2-54-68-63-227.us-west-2.compute.amazonaws.com "sudo tar -xzf /var/www/public/power.we-rtek.com/deploy.tgz -C /var/www/public/power.we-rtek.com/"
echo 'Removendo arquivos compactados...'
ssh -i solar-monitor-api.pem ubuntu@ec2-54-68-63-227.us-west-2.compute.amazonaws.com "sudo rm /var/www/public/power.we-rtek.com/deploy.tgz"
echo 'Deploy finalizado!'
cd ..
