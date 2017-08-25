#!/bin/sh

# Usage ./deploy_sm.sh {version from gcp}

INDEX_YAML="index.yaml"
CRON_YAML="cron.yaml"
QUEUE_YAML="queue.yaml"

rollback(){
	echo -e "\nRolling back.....\n"
	python APPCFG rollback --oauth2 $(dirname $0)
}

check_server_tests(){
	./run_tests.sh
	RESULT=$?
	if [ $RESULT -ne 0 ]; then
		echo -e "\nSERVER UNIT TESTS FAILED!\n"
		cancel_deploy
	fi
}

check_js_tests(){
	npm test
	RESULT=$?
	if [ $RESULT -ne 0 ]; then
		echo -e "\nJEST UNIT TESTS FAILED!\n"
		cancel_deploy
	fi
}

check_indexes(){
	indexes_diff=$(git diff index.yaml)
	if [[ -n $indexes_diff ]]; then
		echo
		echo "$indexes_diff"
		echo
		echo -e "\nUNCOMMITED INDEXES FOUND!\n"
		cancel_deploy
	fi
}

install_npm_dependencies(){
    echo "Updating npm dependencies according to the package.json..."
    npm install .
	RESULT=$?
	if [ $RESULT -ne 0 ]; then
		echo -e "\nUPDATING NPM DEPENDENCIES FAILED!\n"
		cancel_deploy
	fi
}

deploy(){
	install_npm_dependencies
	check_indexes
	check_server_tests
	# check_js_tests
	gulp production
	sudo gcloud config configurations activate mindgraph
	if [ "$env" == "staging" ]; then
		sudo gcloud app deploy $deploy_configs --version=$version --no-promote
	else
		sudo gcloud app deploy $deploy_configs --version=$version
	fi
}

cancel_deploy(){
	echo -e "\nExitted without updating $version!\n"
	exit 1
}


sudo echo "" # cover any sudos required downstream
version=$1
deploy_configs="${@:2}" # Remaining args
# first do a git pull to bring down tags
git pull
# production versions only contain digits, hf and - (dash)
production_version=false
# note: keep in sync with constants.PROD_VERSION_REGEX
if [[ $version =~ ^[0-9hf\-]+[a-z]?$ ]]; then
	production_version=true
	env="production"
	# if deploying to production, it is compulsory to deploy all services
	deploy_configs="app.yaml $INDEX_YAML $CRON_YAML $QUEUE_YAML"
else
	# cron/index/queue must be specified explicitly
	env="staging"
fi

s_length=$(echo $deploy_configs | wc -c)
if [ "$s_length" -gt 1 ]; then
   prom="Are you sure you want to deploy to $version with configs $deploy_configs? (y/n) "
else
   prom="Are you sure you want to deploy to $version? (y/n) "
fi

read -p "$prom" -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
	#production versions only contain digits, hf and - (dash)
	if [[ $version =~ ^[0-9hf\-]+$ ]]; then
		read -p "This looks like a production version ($version), Are you really sure? (y/n) " -n 1 -r
		echo
		if [[ $REPLY =~ ^[Yy]$ ]]; then
			# if no tag yet create it, then push tags
			git tag -a -m "New production version by $(whoami) on $(date)" "v$version"
			git push --tags
			# deploy production version
			deploy
			echo -e "\n\nDeploy to production Successful!\n"
		else
			cancel_deploy
		fi
	else
		#deploy non-production version
		deploy
	fi
else
	cancel_deploy
fi
