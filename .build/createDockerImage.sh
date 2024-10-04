#!/bin/sh

# Build a new docker image.
docker build --force-rm -t nostratv-site .

# Check if build was completed successfully.
if [ $? -ne 0 ]
then
  echo '[!] Failed to build a new docker image.'
  exit 1
fi

# # Login at Docker registery.
# docker login -u rtorres -p $2 $1

# # Tag and push "latest".
# docker tag nostratv-site $1/nostratv/nostratv-site:latest
# docker push $1/nostratv/nostratv-site:latest
# echo '\n===> Pushed new image '$1'/nostratv/nostratv-site:latest\n'

# # Tag and push for current time.
# docker tag nostratv-site $1/nostratv/nostratv-site:$(date +'%Y%m%d%H%M')
# docker push $1/nostratv/nostratv-site:$(date +'%Y%m%d%H%M')
# echo '\n===> Pushed new image '$1'/nostratv/nostratv-site:'$(date +'%Y%m%d%H%M')'\n'

# # If an argument is passed a tag and push with that argument is made.
# if [ $3 ]
# then
#   docker tag nostratv-site $1/nostratv/nostratv-site:$3
#   docker push $1/nostratv/nostratv-site:$3
#   echo '\n===> Pushed new image '$1'/nostratv/nostratv-site:'$3'\n'
# fi

# docker rmi --force node:alpine nostratv-site